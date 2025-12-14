'use client'

import { useState, useRef, useCallback } from 'react'
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi'
import Image from 'next/image'
import { uploadFile, deleteFile } from '@/app/actions/upload'
import toast from 'react-hot-toast'

interface MultiImageUploadProps {
  value: string[] // Array of image URLs
  onChange: (urls: string[]) => void
  label?: string
  folder?: string
  accept?: string
  maxSize?: number // in MB
  maxImages?: number
  allowUrlInput?: boolean
}

export function MultiImageUpload({
  value = [],
  onChange,
  label = 'Images supplémentaires',
  folder = 'images',
  accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  maxSize = 5,
  maxImages = 10,
  allowUrlInput = true,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (file: File | null) => {
      if (!file) return

      // Check max images limit
      if (value.length >= maxImages) {
        toast.error(`Nombre maximum d'images atteint (${maxImages})`)
        return
      }

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
          onChange([...value, result.url])
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
    [folder, maxSize, accept, value, maxImages, onChange]
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

  const handleDelete = async (index: number, url: string) => {
    setDeletingIndex(index)

    // If it's a Supabase URL, try to delete it
    const isSupabaseUrl = url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    
    if (isSupabaseUrl) {
      try {
        const result = await deleteFile(url)
        if (!result.success) {
          toast.error(result.error || 'Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Delete error:', error)
        toast.error('Erreur lors de la suppression')
      }
    }

    // Remove from array regardless of delete result
    const newUrls = value.filter((_, i) => i !== index)
    onChange(newUrls)
    setDeletingIndex(null)
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim() && value.length < maxImages) {
      onChange([...value, urlInput.trim()])
      setUrlInput('')
      setShowUrlInput(false)
      toast.success('URL ajoutée')
    } else if (value.length >= maxImages) {
      toast.error(`Nombre maximum d'images atteint (${maxImages})`)
    }
  }

  return (
    <div className="space-y-2">
      <label className="label">
        <span className="label-text">{label}</span>
        {value.length > 0 && (
          <span className="label-text-alt">{value.length}/{maxImages}</span>
        )}
      </label>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-base-200 border border-base-300">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    toast.error(`Erreur lors du chargement de l'image ${index + 1}`)
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleDelete(index, url)}
                className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={deletingIndex === index}
                title="Supprimer"
              >
                {deletingIndex === index ? (
                  <FiLoader className="w-3 h-3 animate-spin" />
                ) : (
                  <FiX className="w-3 h-3" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            border-2 border-dashed rounded-lg p-4 text-center
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
              <FiLoader className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-base-content/70">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FiUpload className="w-6 h-6 text-base-content/50" />
              <p className="text-sm font-medium">Ajouter une image</p>
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
                  className="btn btn-ghost btn-xs mt-1"
                >
                  Ou entrez une URL
                </button>
              )}
            </div>
          )}
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
            disabled={!urlInput.trim() || value.length >= maxImages}
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
