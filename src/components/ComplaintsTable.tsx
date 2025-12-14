'use client'

import { useState } from 'react'
import { FiEdit, FiTrash2, FiMessageSquare } from 'react-icons/fi'
import { updateComplaintStatus, reassignComplaint, deleteComplaint, updateComplaintMessage } from '@/app/actions/complaints'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getTranslated } from '@/lib/i18n/context'

type Complaint = {
  id: string
  message: string
  status: 'RECEIVED' | 'IN_PROGRESS' | 'RESOLVED'
  createdAt: Date
  user: {
    id: string
    fullName: string | null
    email: string | null
    avatar: string | null
  } | null
  product: {
    id: string
    name: Record<string, string> | string
    thumbnail: string
  } | null
  assignedAdmin: {
    id: string
    fullName: string | null
  }
}

interface ComplaintsTableProps {
  complaints: Complaint[]
  admins: Array<{ id: string; fullName: string | null; avatar: string | null }>
}

export function ComplaintsTable({ complaints, admins }: ComplaintsTableProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editMessage, setEditMessage] = useState<string>('')

  const handleStatusChange = async (id: string, status: 'RECEIVED' | 'IN_PROGRESS' | 'RESOLVED') => {
    setUpdatingId(id)
    const result = await updateComplaintStatus(id, status)
    setUpdatingId(null)

    if (result.success) {
      toast.success('Statut mis à jour')
      router.refresh()
    } else {
      toast.error(result.error || 'Erreur')
    }
  }

  const handleReassign = async (id: string, adminId: string) => {
    const result = await reassignComplaint(id, adminId)
    if (result.success) {
      toast.success('Plainte réassignée')
      router.refresh()
    } else {
      toast.error(result.error || 'Erreur')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette plainte ?')) return

    setDeletingId(id)
    const result = await deleteComplaint(id)
    setDeletingId(null)

    if (result.success) {
      toast.success('Plainte supprimée')
      router.refresh()
    } else {
      toast.error(result.error || 'Erreur')
    }
  }

  const handleEditMessage = async (id: string) => {
    const complaint = complaints.find(c => c.id === id)
    if (!complaint) return

    setEditingId(id)
    setEditMessage(complaint.message)
  }

  const handleSaveMessage = async (id: string) => {
    if (!editMessage.trim() || editMessage.trim().length < 10) {
      toast.error('Le message doit contenir au moins 10 caractères')
      return
    }

    const result = await updateComplaintMessage(id, editMessage)
    if (result.success) {
      toast.success('Message mis à jour')
      setEditingId(null)
      setEditMessage('')
      router.refresh()
    } else {
      toast.error(result.error || 'Erreur')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditMessage('')
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      RECEIVED: 'badge-warning',
      IN_PROGRESS: 'badge-info',
      RESOLVED: 'badge-success',
    }
    return badges[status as keyof typeof badges] || 'badge-neutral'
  }

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <table className="table w-full text-sm sm:text-base">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th className="hidden md:table-cell">Message</th>
            <th className="hidden lg:table-cell">Produit</th>
            <th>Statut</th>
            <th className="hidden sm:table-cell">Admin assigné</th>
            <th className="hidden md:table-cell">Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id}>
              <td>
                <div>
                  <div className="font-semibold text-sm sm:text-base">
                    {complaint.user?.fullName || complaint.user?.email || 'Anonyme'}
                  </div>
                  {complaint.user?.email && (
                    <div className="text-xs sm:text-sm text-base-content/60 hidden sm:block">{complaint.user.email}</div>
                  )}
                </div>
              </td>
              <td className="hidden md:table-cell">
                {editingId === complaint.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="textarea textarea-bordered textarea-sm w-full"
                      value={editMessage}
                      onChange={e => setEditMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveMessage(complaint.id)}
                        className="btn btn-primary btn-xs"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-ghost btn-xs"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md truncate">{complaint.message}</div>
                )}
              </td>
              <td className="hidden lg:table-cell">
                {complaint.product ? (
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      {typeof complaint.product.name === 'string'
                        ? complaint.product.name
                        : getTranslated(complaint.product.name, 'fr')}
                    </div>
                  </div>
                ) : (
                  <span className="text-base-content/60">Général</span>
                )}
              </td>
              <td>
                <select
                  value={complaint.status}
                  onChange={e =>
                    handleStatusChange(
                      complaint.id,
                      e.target.value as 'RECEIVED' | 'IN_PROGRESS' | 'RESOLVED'
                    )
                  }
                  className={`select select-xs sm:select-sm ${getStatusBadge(complaint.status)}`}
                  disabled={updatingId === complaint.id}
                >
                  <option value="RECEIVED">Reçue</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="RESOLVED">Résolue</option>
                </select>
              </td>
              <td className="hidden sm:table-cell">
                <select
                  value={complaint.assignedAdmin.id}
                  onChange={e => handleReassign(complaint.id, e.target.value)}
                  className="select select-xs sm:select-sm"
                >
                  {admins.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.fullName || 'Admin'}
                    </option>
                  ))}
                </select>
              </td>
              <td className="hidden md:table-cell">{new Date(complaint.createdAt).toLocaleDateString('fr-FR')}</td>
              <td>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handleEditMessage(complaint.id)}
                    className="btn btn-ghost btn-xs sm:btn-sm"
                    title="Éditer le message"
                    disabled={editingId === complaint.id || deletingId === complaint.id}
                  >
                    <FiMessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(complaint.id)}
                    className="btn btn-ghost btn-xs sm:btn-sm text-error"
                    title="Supprimer"
                    disabled={editingId === complaint.id || deletingId === complaint.id}
                  >
                    <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {complaints.length === 0 && (
        <div className="text-center py-12 text-base-content/60">Aucune plainte</div>
      )}
    </div>
  )
}

