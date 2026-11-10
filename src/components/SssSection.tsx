'use client'

import { motion } from 'framer-motion'
import { FiArrowUpRight, FiCheck, FiZap } from 'react-icons/fi'
import { useI18n } from '@/lib/i18n/context'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { SSS_URL } from '@/lib/site'
import { SectionHeader } from './SectionHeader'

/** Sarena's own product: Sarena Shooting Star, with links to sss.fpswagg.site. */
export function SssSection() {
  const { t } = useI18n()
  return (
    <section id="sss" className="relative py-16 sm:py-20 bg-base-200/30 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4">
        <SectionHeader badge={t.sss.badge} title={t.sss.title} subtitle={t.sss.subtitle} />
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
        >
          {t.sss.points.map(point => (
            <motion.li
              key={point}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="flex items-start gap-3 p-5 rounded-2xl bg-base-100 border border-base-300 hover:border-primary/30 card-depth hover:card-depth-hover transition-colors"
            >
              <span className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <FiCheck className="w-5 h-5 text-primary" />
              </span>
              <span className="text-sm text-base-content/80 pt-2">{point}</span>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.a
            href={SSS_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="btn btn-primary gap-2 font-heading glow-sm w-full sm:w-auto"
          >
            <FiZap className="w-4 h-4" />
            {t.sss.cta}
          </motion.a>
          <motion.a
            href={`${SSS_URL}/sign-in`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="btn btn-outline gap-2 font-heading w-full sm:w-auto"
          >
            {t.sss.start}
            <FiArrowUpRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </section>
  )
}
