'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { FiArrowLeft, FiLoader, FiUpload, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { uploadPhoto } from '@/app/dashboard/actions'

/** Upload area from the old dashboard: photos now go to the business's SSS storage. */
export function ImagesField({
  label,
  value,
  max,
  onChange,
}: {
  label: string
  value: string[]
  max: number
  onChange: (urls: string[]) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    let urls = value
    for (const file of Array.from(files).slice(0, max - value.length)) {
      const form = new FormData()
      form.append('file', file)
      const result = await uploadPhoto(form).catch(() => null)
      if (result?.ok) {
        urls = [...urls, result.data.url]
        onChange(urls)
      } else {
        toast.error(result?.error ?? "L'image n'a pas pu être envoyée.")
      }
    }
    setUploading(false)
    if (input.current) input.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="label">
        <span className="label-text">{label}</span>
        {value.length > 0 && (
          <span className="label-text-alt">
            {value.length}/{max}
          </span>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={url} className="relative">
              <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-base-200 border border-base-300">
                <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" sizes="200px" />
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 badge badge-primary badge-xs border-0">
                    Principale
                  </span>
                )}
              </div>
              <div className="absolute top-1 right-1 flex gap-1">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange([url, ...value.filter(item => item !== url)])}
                    className="btn btn-circle btn-xs"
                    title="Mettre en premier"
                    aria-label="Mettre en premier"
                  >
                    <FiArrowLeft className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange(value.filter(item => item !== url))}
                  className="btn btn-circle btn-xs btn-error"
                  title="Retirer"
                  aria-label="Retirer"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length < max && (
        <button
          type="button"
          disabled={uploading}
          onClick={() => input.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            void upload(e.dataTransfer.files)
          }}
          className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            uploading ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'
          }`}
        >
          {uploading ? (
            <span className="flex flex-col items-center gap-2">
              <FiLoader className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm text-base-content/70">Envoi en cours…</span>
            </span>
          ) : (
            <span className="flex flex-col items-center gap-2">
              <FiUpload className="w-6 h-6 text-base-content/50" />
              <span className="text-sm font-medium">Ajouter une image</span>
              <span className="text-xs text-base-content/50">JPEG, PNG, WebP, GIF · 6 Mo au plus</span>
            </span>
          )}
        </button>
      )}
      <input
        ref={input}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={e => void upload(e.target.files)}
        className="hidden"
      />
    </div>
  )
}
