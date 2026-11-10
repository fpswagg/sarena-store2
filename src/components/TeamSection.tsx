'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { TeamMember } from '@/lib/types'
import { memberTitle } from '@/lib/site'
import { useI18n } from '@/lib/i18n/context'
import { SectionHeader } from './SectionHeader'
import { TeamMemberDialog } from './TeamMemberDialog'

/** The managers of Sarena (the list is filtered to owner/manager in lib/sss.ts). */
export function TeamSection({ members }: { members: TeamMember[] }) {
  const { t, locale } = useI18n()
  const [selected, setSelected] = useState<TeamMember | null>(null)

  if (members.length === 0) return null

  return (
    <section id="equipe" className="border-t border-line bg-base-200">
      <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
        <SectionHeader badge={t.team.badge} title={t.team.title} subtitle={t.team.subtitle} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-line border border-line">
          {members.map(member => (
            <button
              key={member.id}
              type="button"
              onClick={() => setSelected(member)}
              className="group bg-base-200 p-4 text-left hover:bg-base-300 transition-colors"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-base-300 border border-line">
                <Image
                  src={member.photo || '/default-avatar.svg'}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
              </div>
              <h3 className="mt-3 font-heading font-semibold text-sm group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              {memberTitle(member, locale) && (
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-faint truncate">
                  {memberTitle(member, locale)}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      <TeamMemberDialog isOpen={selected !== null} onClose={() => setSelected(null)} member={selected} />
    </section>
  )
}
