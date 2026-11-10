'use client'

import { useRef, useState } from 'react'
import { FiFile, FiUpload, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatBytes } from '@/lib/site'

/** What a product keeps in metadata.digital (read by SSS for the sale and the downloads). */
export type DigitalValue = {
  key: string
  name: string
  sizeBytes: number | null
  contentType: string | null
  downloadDays?: number
  maxDownloads?: number
}

const MAX_BYTES = 100 * 1024 * 1024

/** Upload with progress: XHR, since fetch has no upload progress. */
function send(file: File, onProgress: (ratio: number) => void): Promise<DigitalValue> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/dashboard/file?name=${encodeURIComponent(file.name)}`)
    xhr.setRequestHeader('content-type', file.type || 'application/octet-stream')
    xhr.upload.onprogress = e => e.lengthComputable && onProgress(e.loaded / e.total)
    xhr.onerror = () => reject(new Error('Envoi interrompu. Vérifiez la connexion.'))
    xhr.onload = () => {
      const body = JSON.parse(xhr.responseText || 'null') as {
        data?: { key: string; sizeBytes: number; contentType: string }
        error?: string
      } | null
      if (xhr.status >= 300 || !body?.data) return reject(new Error(body?.error || `Erreur ${xhr.status}`))
      resolve({ key: body.data.key, name: file.name, sizeBytes: body.data.sizeBytes, contentType: body.data.contentType })
    }
    xhr.send(file)
  })
}

/**
 * "File to sell": stored privately in SSS. Buyers pay by Mobile Money on the site, then get
 * download links that expire (SSS signs them; the file never has a public address).
 */
export function DigitalFileField({
  value,
  onChange,
}: {
  value: DigitalValue | null
  onChange: (value: DigitalValue | null) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)

  const pick = async (file: File | undefined) => {
    if (!file) return
    if (file.size > MAX_BYTES) {
      toast.error('Fichier trop lourd (100 Mo au plus).')
      return
    }
    setProgress(0)
    try {
      const uploaded = await send(file, setProgress)
      onChange({ ...uploaded, downloadDays: value?.downloadDays, maxDownloads: value?.maxDownloads })
      toast.success('Fichier envoyé. Enregistrez le produit.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Envoi impossible.')
    } finally {
      setProgress(null)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <fieldset className="border border-base-300 p-4 space-y-3">
      <legend className="px-1 text-sm font-semibold">Fichier à vendre (logiciel, PDF, archive…)</legend>
      <p className="text-xs text-base-content/60">
        Le fichier reste privé dans SSS. Le client paie par Mobile Money sur le site, puis reçoit un lien de
        téléchargement temporaire. 100 Mo au plus.
      </p>

      {value ? (
        <div className="flex items-center gap-3 border border-base-300 bg-base-100 px-3 py-2">
          <FiFile className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="flex-1 truncate text-sm">{value.name}</span>
          <span className="font-mono text-xs text-base-content/50">{formatBytes(value.sizeBytes, 'fr')}</span>
          <button type="button" onClick={() => onChange(null)} className="btn btn-ghost btn-xs btn-square" aria-label="Retirer le fichier">
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={progress !== null}
          onClick={() => input.current?.click()}
          className="btn btn-sm btn-outline gap-2"
        >
          <FiUpload className="w-4 h-4" />
          {value ? 'Remplacer le fichier' : 'Choisir un fichier'}
        </button>
        {progress !== null && (
          <span className="font-mono text-xs text-base-content/60">Envoi… {Math.round(progress * 100)} %</span>
        )}
        <input ref={input} type="file" className="hidden" onChange={e => pick(e.target.files?.[0])} />
      </div>

      {value && (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-base-content/60">Jours pour télécharger</span>
            <input
              type="number"
              min={1}
              max={90}
              className="input input-bordered input-sm w-full mt-1"
              value={value.downloadDays ?? 7}
              onChange={e => onChange({ ...value, downloadDays: Math.max(1, Math.min(90, Number(e.target.value) || 7)) })}
            />
          </label>
          <label className="block">
            <span className="text-xs text-base-content/60">Téléchargements max</span>
            <input
              type="number"
              min={1}
              max={100}
              className="input input-bordered input-sm w-full mt-1"
              value={value.maxDownloads ?? 10}
              onChange={e => onChange({ ...value, maxDownloads: Math.max(1, Math.min(100, Number(e.target.value) || 10)) })}
            />
          </label>
        </div>
      )}
    </fieldset>
  )
}
