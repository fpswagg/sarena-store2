'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiArrowDown, FiShield, FiRefreshCw, FiMessageCircle } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useI18n } from '@/lib/i18n/context'
import { floatingElement, whatsappPulse } from '@/lib/motion'

interface HeroSectionProps {
  whatsappNumber: string
}

export function HeroSection({ whatsappNumber }: HeroSectionProps) {
  const { t } = useI18n()
  const containerRef = useRef<HTMLElement>(null)

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative py-16 sm:py-24 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] blob bg-gradient-to-br from-yellow-400/25 via-amber-400/20 to-orange-400/15"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute -bottom-40 -left-20 w-[400px] h-[400px] blob bg-gradient-to-tr from-pink-400/15 via-yellow-300/10 to-amber-400/20"
        />
        {/* Floating decorative elements */}
        <motion.div
          variants={floatingElement}
          animate="animate"
          className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-primary/40"
        />
        <motion.div
          variants={floatingElement}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-secondary/40"
        />
        <motion.div
          variants={floatingElement}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-accent/50"
        />
      </div>

      <motion.div style={{ opacity }} className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-yellow mb-6"
          >
            <FiShield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t.hero.badge}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 tracking-tight leading-[1.1]"
          >
            {t.hero.title}{' '}
            <span className="text-gradient relative">
              {t.hero.titleHighlight}
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-base-content/60 mb-8 max-w-lg mx-auto leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <motion.a
              href="/#produits"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 font-heading w-full sm:w-auto"
            >
              {t.hero.cta}
              <FiArrowDown className="w-5 h-5" />
            </motion.a>

            <motion.a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              variants={whatsappPulse}
              animate="animate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-outline btn-lg gap-2 font-heading w-full sm:w-auto"
            >
              <FaWhatsapp className="w-5 h-5" />
              {t.hero.whatsapp}
            </motion.a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto"
          >
            {[
              { icon: FiShield, text: t.hero.trust1 },
              { icon: FiRefreshCw, text: t.hero.trust2 },
              { icon: FiMessageCircle, text: t.hero.trust3 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-base-200/30"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-[10px] sm:text-xs text-base-content/60 text-center leading-tight">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
