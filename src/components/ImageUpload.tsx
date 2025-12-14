'use client'

import { useState, useRef, useCallback } from 'react'
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi'
import Image from 'next/image'
import { uploadFile, deleteFile } from '@/app/actions/upload'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  required?: boolean
  folder?: string
  accept?: string
  maxSize?: number // in MB
  previewSize?: 'sm' | 'md' | 'lg'
  allowUrlInput?: boolean // Allow manual URL input as fallback
}

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
  required = false,
  folder = 'images',
  accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  maxSize = 5,
  previewSize = 'md',
  allowUrlInput = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const previewSizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }

  const handleFileSelect = useCallback(
    async (file: File | null) => {
      if (!file) return

      // Validate file type
      const allowedTypes = accept.split(',').map(t => t.trim())
      if (!allowedTypes.some(type => file.type.match(type.replace('*', '')))) {
        toast.error(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`)
        return
      }

      // Validate file size
      const maxSizeBytes = maxSize * 1024 * 1024
      if (file.size > maxSizeBytes) {
        toast.error(`Fichier trop volumineux. Taille maximale: ${maxSize}MB`)
        return
      }

      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const result = await uploadFile(formData, folder)

        if (result.success && result.url) {
          onChange(result.url)
          toast.success('Image uploadée avec succès')
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        } else {
          toast.error(result.error || 'Erreur lors de l\'upload')
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Erreur lors de l\'upload de l\'image')
      } finally {
        setIsUploading(false)
      }
    },
    [folder, maxSize, accept, onChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileSelect(file)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      const file = e.dataTransfer.files?.[0] || null
      handleFileSelect(file)
    },
    [handleFileSelect]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDelete = async () => {
    if (!value) return

    // If it's a Supabase URL, try to delete it
    const isSupabaseUrl = value.includes(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    
    if (isSupabaseUrl) {
      setIsDeleting(true)
      try {
        const result = await deleteFile(value)
        if (result.success) {
          onChange('')
          toast.success('Image supprimée')
        } else {
          // Even if delete fails, clear the value
          onChange('')
          toast.error(result.error || 'Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Delete error:', error)
        onChange('')
        toast.error('Erreur lors de la suppression')
      } finally {
        setIsDeleting(false)
      }
    } else {
      // Just clear the value if it's not a Supabase URL
      onChange('')
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setShowUrlInput(false)
      toast.success('URL ajoutée')
    }
  }

  return (
    <div className="space-y-2">
      <label className="label">
        <span className="label-text">
          {label} {required && '*'}
        </span>
      </label>

      {/* Upload Area */}
      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center
            transition-colors cursor-pointer
            ${isUploading ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'}
          `}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <FiLoader className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-base-content/70">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FiUpload className="w-8 h-8 text-base-content/50" />
              <p className="text-sm font-medium">Cliquez ou glissez-déposez une image</p>
              <p className="text-xs text-base-content/50">
                Formats: JPEG, PNG, WebP, GIF • Max: {maxSize}MB
              </p>
              {allowUrlInput && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUrlInput(true)
                  }}
                  className="btn btn-ghost btn-xs mt-2"
                >
                  Ou entrez une URL
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className={`${previewSizes[previewSize]} relative rounded-lg overflow-hidden bg-base-200 border border-base-300`}>
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="192px"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                toast.error('Erreur lors du chargement de l\'image')
              }}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-sm btn-ghost"
              disabled={isUploading || isDeleting}
            >
              <FiImage className="w-4 h-4" />
              Remplacer
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-sm btn-ghost text-error"
              disabled={isUploading || isDeleting}
            >
              {isDeleting ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiX className="w-4 h-4" />
              )}
              Supprimer
            </button>
            {allowUrlInput && (
              <button
                type="button"
                onClick={() => {
                  setUrlInput(value)
                  setShowUrlInput(true)
                }}
                className="btn btn-sm btn-ghost"
              >
                Modifier l'URL
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      )}

      {/* URL Input Fallback */}
      {showUrlInput && allowUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            className="input input-bordered flex-1"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleUrlSubmit()
              }
              if (e.key === 'Escape') {
                setShowUrlInput(false)
                setUrlInput('')
              }
            }}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="btn btn-primary"
            disabled={!urlInput.trim()}
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={() => {
              setShowUrlInput(false)
              setUrlInput('')
            }}
            className="btn btn-ghost"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
