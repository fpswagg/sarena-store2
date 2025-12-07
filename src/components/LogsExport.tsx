'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiDownload, FiFilter, FiCalendar, FiUser, FiActivity } from 'react-icons/fi'
import { LogExport } from '@/types'
import clsx from 'clsx'

interface LogsExportProps {
  logs: LogExport[]
  onExport: (format: 'json' | 'csv') => void
  isLoading?: boolean
}

const actionColors: Record<string, string> = {
  VIEW: 'badge-info',
  CLICK: 'badge-primary',
  RATE: 'badge-success',
  COMPLAINT: 'badge-error',
  LOGIN: 'badge-secondary',
}

export function LogsExport({ logs, onExport, isLoading = false }: LogsExportProps) {
  const [filter, setFilter] = useState<string>('all')

  const filteredLogs =
    filter === 'all' ? logs : logs.filter(log => log.action.toUpperCase() === filter.toUpperCase())

  const actionTypes = ['all', ...new Set(logs.map(log => log.action.toUpperCase()))]

  return (
    <section id="logs" className="section-padding bg-base-100">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
              <FiActivity className="text-primary" />
              Logs d&apos;activité
            </h2>
            <p className="text-base-content/60 mt-1">
              {filteredLogs.length} entrées • Non supprimables
            </p>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => onExport('json')}
              className="btn btn-outline btn-sm gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <FiDownload className="w-4 h-4" />
              JSON
            </motion.button>
            <motion.button
              onClick={() => onExport('csv')}
              className="btn btn-outline btn-sm gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <FiDownload className="w-4 h-4" />
              CSV
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <FiFilter className="w-4 h-4" />
            Filtrer :
          </div>
          {actionTypes.map(action => (
            <button
              key={action}
              onClick={() => setFilter(action)}
              className={clsx('btn btn-sm', filter === action ? 'btn-primary' : 'btn-ghost')}
            >
              {action === 'all' ? 'Tous' : action}
            </button>
          ))}
        </motion.div>

        {/* Logs Table */}
        <div className="overflow-x-auto rounded-xl border border-base-200">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200">
                <th className="font-display">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    Date
                  </div>
                </th>
                <th className="font-display">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Utilisateur
                  </div>
                </th>
                <th className="font-display">Action</th>
                <th className="font-display">Cible</th>
                <th className="font-display">IP</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-base-content/60">
                      Aucun log à afficher
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <td className="text-sm">
                        {new Date(log.createdAt).toLocaleString('fr-FR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td>
                        <div>
                          <span className="font-medium">{log.userName || 'Anonyme'}</span>
                          <span
                            className={clsx(
                              'badge badge-xs ml-2',
                              log.userRole === 'ADMIN' && 'badge-secondary',
                              log.userRole === 'SUPPLIER' && 'badge-primary',
                              log.userRole === 'USER' && 'badge-ghost'
                            )}
                          >
                            {log.userRole}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={clsx(
                            'badge',
                            actionColors[log.action.toUpperCase()] || 'badge-ghost'
                          )}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="text-sm">
                        <span className="text-base-content/80">{log.target}</span>
                        {log.targetId && (
                          <span className="text-xs text-base-content/50 block">
                            ID: {log.targetId.slice(0, 8)}...
                          </span>
                        )}
                      </td>
                      <td className="text-xs text-base-content/60 font-mono">{log.ip || '-'}</td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-base-content/50 mt-4 flex items-center gap-2"
        >
          <span className="text-warning">⚠️</span>
          Les logs sont permanents et ne peuvent pas être supprimés pour des raisons de traçabilité.
        </motion.p>
      </div>
    </section>
  )
}

// Utility to convert logs to CSV
export function logsToCSV(logs: LogExport[]): string {
  const headers = ['ID', 'Date', 'Utilisateur', 'Rôle', 'Action', 'Cible', 'ID Cible', 'IP']
  const rows = logs.map(log => [
    log.id,
    new Date(log.createdAt).toISOString(),
    log.userName || 'Anonyme',
    log.userRole,
    log.action,
    log.target,
    log.targetId || '',
    log.ip || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  return csvContent
}

// Utility to download file
export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
