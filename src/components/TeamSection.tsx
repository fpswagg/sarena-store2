'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { TeamMember } from '@/types'
import { useI18n } from '@/lib/i18n/context'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { TeamMemberDialog } from './TeamMemberDialog'

interface TeamSectionProps {
  members: TeamMember[]
}

export function TeamSection({ members }: TeamSectionProps) {
  const { t } = useI18n()
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedMember(null)
  }

  return (
    <section id="equipe" className="py-16 sm:py-20 bg-base-200/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-badge font-medium mb-4"
          >
            {t.team.badge}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-3">{t.team.title}</h2>
          <p className="text-base-content/60 max-w-md mx-auto">{t.team.subtitle}</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="text-center group cursor-pointer"
              onClick={() => handleMemberClick(member)}
            >
              <motion.div whileHover={{ scale: 1.05 }} className="relative w-24 h-24 mx-auto mb-4">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative w-full h-full rounded-2xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300 shadow-lg">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="96px"
                  />
                </div>

                {/* Role badge */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-base-100 border border-base-200 text-[10px] font-badge font-medium text-primary shadow-sm whitespace-nowrap"
                >
                  {member.role}
                </motion.span>
              </motion.div>

              <h3 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">
                {member.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Team Member Dialog */}
      <TeamMemberDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        member={selectedMember}
      />
    </section>
  )
}

export const defaultTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Paul Nguema',
    role: 'CEO',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    socialMedia: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/paul-nguema' },
      { platform: 'twitter', url: 'https://twitter.com/paulnguema' },
      { platform: 'email', url: 'mailto:paul@sarenastore.cm' },
    ],
  },
  {
    id: '2',
    name: 'Marie Ngo',
    role: 'Produits',
    avatar:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face',
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/mariengo' },
      { platform: 'facebook', url: 'https://facebook.com/mariengo' },
    ],
  },
  {
    id: '3',
    name: 'Jean Mvondo',
    role: 'Support',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    socialMedia: [
      { platform: 'whatsapp', url: 'https://wa.me/237690000000' },
      { platform: 'email', url: 'mailto:jean@sarenastore.cm' },
    ],
  },
  {
    id: '4',
    name: 'Aïcha Bello',
    role: 'Livraison',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    // No social media - will show message in dialog
  },
]
