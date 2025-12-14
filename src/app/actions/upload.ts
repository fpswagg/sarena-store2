'use server'

import { createSupabaseAdmin } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const BUCKET_NAME = 'products'

/**
 * Upload a file to Supabase Storage
 * @param formData - FormData containing the file
 * @param folder - Optional folder path in the bucket (e.g., 'thumbnails', 'images')
 * @returns Object with success status and file URL or error message
 */
export async function uploadFile(
  formData: FormData,
  folder: string = 'images'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Check authentication
    const { user } = await getSession()
    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    // Check permissions (only ADMIN and SUPPLIER can upload)
    if (user.role !== 'ADMIN' && user.role !== 'SUPPLIER') {
      return { success: false, error: 'Non autorisé' }
    }

    const file = formData.get('file') as File | null
    if (!file) {
      return { success: false, error: 'Aucun fichier fourni' }
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Type de fichier non autorisé. Types acceptés: ${ALLOWED_TYPES.join(', ')}`,
      }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `Fichier trop volumineux. Taille maximale: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${timestamp}-${randomString}.${fileExtension}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase Storage using admin client (bypasses RLS)
    // Supabase accepts File/Blob directly
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      contentType: file.type,
      upsert: false, // Don't overwrite existing files
    })

    if (error) {
      console.error('Supabase upload error:', error)
      return { success: false, error: `Erreur lors de l'upload: ${error.message}` }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    if (!publicUrl) {
      return { success: false, error: "Impossible d'obtenir l'URL publique" }
    }

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload',
    }
  }
}

/**
 * Delete a file from Supabase Storage
 * @param fileUrl - The public URL of the file to delete
 * @returns Object with success status or error message
 */
export async function deleteFile(
  fileUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authentication
    const { user } = await getSession()
    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    // Check permissions (only ADMIN and SUPPLIER can delete)
    if (user.role !== 'ADMIN' && user.role !== 'SUPPLIER') {
      return { success: false, error: 'Non autorisé' }
    }

    // Extract file path from URL
    const url = new URL(fileUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === BUCKET_NAME)
    
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      return { success: false, error: 'URL de fichier invalide' }
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    // Delete from Supabase Storage
    const supabase = createSupabaseAdmin()
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) {
      console.error('Supabase delete error:', error)
      return { success: false, error: `Erreur lors de la suppression: ${error.message}` }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de la suppression',
    }
  }
}
