'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import clsx from 'clsx'

interface HeroSlide {
  id: string
  image: string
  title: string
  subtitle: string
  cta?: {
    label: string
    href: string
  }
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoPlayInterval?: number
}

export function HeroCarousel({ slides, autoPlayInterval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex(prev => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Auto-play
  useEffect(() => {
    if (autoPlayInterval <= 0) return

    const interval = setInterval(nextSlide, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlayInterval, nextSlide])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.5 },
    },
    exit: { opacity: 0, y: -30 },
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-base-200">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob w-96 h-96 bg-primary/30 -top-20 -left-20 animate-blob" />
        <div className="blob w-80 h-80 bg-secondary/30 bottom-10 right-10 animate-blob animation-delay-2000" />
      </div>

      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-base-100/90 via-base-100/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container-wide flex items-center">
            <motion.div
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-xl"
            >
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {slides[currentIndex].title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-base-content/80 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {slides[currentIndex].subtitle}
              </motion.p>
              {slides[currentIndex].cta && (
                <motion.a
                  href={slides[currentIndex].cta!.href}
                  className="btn btn-primary btn-lg gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slides[currentIndex].cta!.label}
                </motion.a>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost glass hover:bg-primary/20"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost glass hover:bg-primary/20"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={clsx(
              'w-3 h-3 rounded-full transition-all duration-300',
              index === currentIndex
                ? 'bg-primary scale-125'
                : 'bg-base-content/30 hover:bg-base-content/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

// Default hero slides
export const defaultHeroSlides: HeroSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80',
    title: 'Bienvenue chez Sarena Store',
    subtitle: 'Découvrez notre collection exclusive de produits premium pour tous vos besoins.',
    cta: {
      label: 'Explorer',
      href: '#produits',
    },
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80',
    title: 'Qualité Premium',
    subtitle: 'Des produits sélectionnés avec soin pour garantir votre satisfaction.',
    cta: {
      label: 'Découvrir',
      href: '#produits',
    },
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
    title: 'Service Personnalisé',
    subtitle: 'Une équipe dédiée pour répondre à toutes vos questions sur WhatsApp.',
    cta: {
      label: 'Nous Contacter',
      href: '#contact',
    },
  },
]
