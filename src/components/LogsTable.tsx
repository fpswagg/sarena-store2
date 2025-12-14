'use client'

import { LogExport } from '@/types'
import { FiDownload } from 'react-icons/fi'
import { exportLogs } from '@/app/actions/logs'

interface LogsTableProps {
  logs: LogExport[]
  showDownload?: boolean
}

export function LogsTable({ logs, showDownload = false }: LogsTableProps) {
  const handleDownload = async () => {
    const result = await exportLogs('csv')
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'badge-success',
      UPDATE: 'badge-warning',
      DELETE: 'badge-error',
      COMPLAINT: 'badge-info',
      RATE: 'badge-secondary',
    }
    return colors[action] || 'badge-neutral'
  }

  return (
    <div>
      {showDownload && (
        <div className="mb-4 flex justify-end">
          <button onClick={handleDownload} className="btn btn-primary btn-sm gap-2">
            <FiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Télécharger CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      )}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="table w-full text-sm sm:text-base">
          <thead>
            <tr>
              <th>Date</th>
              <th>Utilisateur</th>
              <th className="hidden sm:table-cell">Rôle</th>
              <th>Action</th>
              <th className="hidden md:table-cell">Cible</th>
              <th className="hidden lg:table-cell">ID Cible</th>
              <th className="hidden lg:table-cell">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td className="whitespace-nowrap">{new Date(log.createdAt).toLocaleString('fr-FR')}</td>
                <td className="text-sm sm:text-base">{log.userName || 'Anonyme'}</td>
                <td className="hidden sm:table-cell">
                  <span className="badge badge-xs sm:badge-sm">{log.userRole}</span>
                </td>
                <td>
                  <span className={`badge badge-xs sm:badge-sm ${getActionBadge(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="hidden md:table-cell">{log.target}</td>
                <td className="hidden lg:table-cell font-mono text-xs">{log.targetId || '-'}</td>
                <td className="hidden lg:table-cell font-mono text-xs">{log.ip || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="text-center py-12 text-base-content/60">Aucun log</div>
        )}
      </div>
    </div>
  )
}



