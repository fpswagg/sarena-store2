'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiMenu, FiLogOut, FiSun, FiMoon } from 'react-icons/fi'
import { Role } from '@prisma/client'
import { ThemeToggle } from './ThemeToggle'

interface DashboardHeaderProps {
  user: {
    id: string
    fullName: string | null
    email: string | null
    avatar: string | null
    role: Role
  }
  onMenuClick?: () => void
}

export function DashboardHeader({ user, onMenuClick }: DashboardHeaderProps) {
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      const response = await fetch('/auth/logout', { method: 'POST' })
      if (response.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur'
      case 'SUPPLIER':
        return 'Fournisseur'
      default:
        return 'Utilisateur'
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-base-100/80 backdrop-blur-md border-b border-base-200">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left: Menu button + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="btn btn-ghost btn-sm lg:hidden"
            aria-label="Toggle menu"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-heading font-bold gradient-text">
              Dashboard Sarena
            </h1>
          </Link>
        </div>

        {/* Right: Theme toggle + User menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-200 transition-colors"
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.fullName || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-semibold">
                  {getInitials(user.fullName)}
                </div>
              )}
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-base-100 rounded-xl shadow-lg border border-base-200 z-20">
                  <div className="p-4 border-b border-base-200">
                    <p className="font-semibold text-sm">{user.fullName || 'Utilisateur'}</p>
                    <p className="text-xs text-base-content/60 mt-1">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors text-sm"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


