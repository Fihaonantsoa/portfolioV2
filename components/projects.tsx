'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, ChevronLeft, ChevronRight, Smartphone, Monitor } from 'lucide-react'
import { useLanguage } from '@/utils/language-context'
import SectionTitle from '@/components/SectionTitle'
import Image from 'next/image'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProjectMedia {
  type: 'image' | 'slides' | 'mobile'
  sources: string[]
  poster?: string
}

interface Project {
  id: number
  title: string
  title_en: string
  description: string
  description_en: string
  tags: string[]
  media: ProjectMedia
  github?: string
  live?: string
  status_fr: string
  status_en: string
}

// ─── Données projets ──────────────────────────────────────────────────────────
const projects: Project[] = [
  {
    id: 1,
    title: 'Gestion de paiement eau & électricité',
    title_en: 'Water & Electricity Payment Management',
    description:
      "Application web de gestion et de suivi des paiements d'eau et d'électricité. Développée en PHP / Laravel avec une interface moderne TailwindCSS.",
    description_en:
      'Web application for managing and tracking water and electricity payments. Built with PHP / Laravel and a modern TailwindCSS interface.',
    tags: ['PHP', 'Laravel', 'TailwindCSS', 'MySQL'],
    media: {
      type: 'slides',
      sources: ['/images/java.png', '/images/php.png', '/images/vuejs.png'],
    },
    github: 'https://github.com/FIhaonantsoa',
    status_fr: 'Projet académique',
    status_en: 'Academic project',
  },
  {
    id: 2,
    title: "Gestion des notes d'examen",
    title_en: 'Exam Grade Management',
    description:
      "Application desktop de gestion et de suivi des notes d'examen des étudiants. Interface intuitive avec calcul automatique des moyennes.",
    description_en:
      'Desktop application for managing and tracking student exam grades. Intuitive interface with automatic average calculation.',
    tags: ['Java', 'MySQL', 'JavaFX'],
    media: {
      type: 'slides',
      sources: ['/images/java.png', '/images/php.png', '/images/vuejs.png'],
    },
    github: 'https://github.com/FIhaonantsoa',
    status_fr: 'Projet académique',
    status_en: 'Academic project',
  },
  {
    id: 3,
    title: 'App Mobile Suivi Santé',
    title_en: 'Health Tracker Mobile App',
    description:
      'Application mobile React Native pour le suivi de la santé quotidienne. Notifications intelligentes, graphiques de progression et synchronisation cloud.',
    description_en:
      'React Native mobile app for daily health tracking. Smart notifications, progress charts and cloud sync.',
    tags: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
    media: {
      type: 'mobile',
      sources: ['/images/java.png', '/images/php.png', '/images/vuejs.png'],
    },
    github: 'https://github.com/FIhaonantsoa',
    status_fr: 'Application mobile',
    status_en: 'Mobile application',
  },
  {
    id: 4,
    title: "Gestion des notes d'examen",
    title_en: 'Exam Grade Management',
    description:
      "Application desktop de gestion et de suivi des notes d'examen des étudiants. Interface intuitive avec calcul automatique des moyennes.",
    description_en:
      'Desktop application for managing and tracking student exam grades. Intuitive interface with automatic average calculation.',
    tags: ['Java', 'MySQL', 'JavaFX'],
    media: {
      type: 'slides',
      sources: ['/images/java.png', '/images/php.png', '/images/vuejs.png'],
    },
    github: 'https://github.com/FIhaonantsoa',
    status_fr: 'Projet académique',
    status_en: 'Academic project',
  },
  {
    id: 5,
    title: 'App Mobile E-Commerce',
    title_en: 'E-Commerce Mobile App',
    description:
      'Application mobile de shopping avec panier, paiement intégré et suivi de commandes en temps réel. UX soignée et animations fluides.',
    description_en:
      'Shopping mobile app with cart, integrated payment and real-time order tracking. Polished UX and smooth animations.',
    tags: ['Flutter', 'Dart', 'Stripe', 'Node.js'],
    media: {
      type: 'mobile',
      sources: ['/images/java.png', '/images/php.png', '/images/vuejs.png'],
    },
    github: 'https://github.com/FIhaonantsoa',
    live: 'https://example.com',
    status_fr: 'Application mobile',
    status_en: 'Mobile application',
  },
  {
    id: 6,
    title: "Gestion des notes d'examen",
    title_en: 'Exam Grade Management',
    description:
      "Application desktop de gestion et de suivi des notes d'examen des étudiants. Interface intuitive avec calcul automatique des moyennes.",
    description_en:
      'Desktop application for managing and tracking student exam grades. Intuitive interface with automatic average calculation.',
    tags: ['Java', 'MySQL', 'JavaFX'],
    media: {
      type: 'slides',
      sources: ['/images/java.png', '/images/php.png', '/images/vuejs.png'],
    },
    github: 'https://github.com/FIhaonantsoa',
    status_fr: 'Projet académique',
    status_en: 'Academic project',
  },
]

// ─── Browser Mockup (fallback web/desktop) ────────────────────────────────────
function BrowserMockupFallback({ initial }: { initial: string }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    }}>
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/8"
        style={{ background: 'rgba(255,255,255,0.04)' }}>
        <span className="w-2 h-2 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-2 h-2 rounded-full" style={{ background: '#febc2e' }} />
        <span className="w-2 h-2 rounded-full" style={{ background: '#28c840' }} />
        <div className="flex-1 h-3.5 rounded mx-2" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>
      {/* Fake screen content */}
      <div className="flex-1 p-3 flex flex-col gap-2">
        <div className="h-2 rounded" style={{ width: '65%', background: 'rgba(255,255,255,0.07)' }} />
        <div className="flex gap-2 flex-1">
          <div className="flex-1 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
            <div className="p-2 flex flex-col gap-1.5">
              <div className="h-1.5 rounded" style={{ width: '80%', background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-1.5 rounded" style={{ width: '55%', background: 'rgba(255,255,255,0.05)' }} />
              <div className="h-1.5 rounded" style={{ width: '70%', background: 'rgba(255,255,255,0.05)' }} />
            </div>
          </div>
        </div>
        <div className="h-2 rounded" style={{ width: '45%', background: 'rgba(255,255,255,0.05)' }} />
      </div>
      {/* Centered initial as subtle watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span style={{ fontSize: '72px', fontWeight: 900, color: 'rgba(255,255,255,0.03)', userSelect: 'none' }}>
          {initial}
        </span>
      </div>
    </div>
  )
}

// ─── Phone Screen (BUG FIX: gradient UNDER image) ─────────────────────────────
function PhoneScreen({ src, title, index }: { src: string; title: string; index: number }) {
  return (
    <div className="relative w-full h-full">
      {/* 1. Gradient fallback — EN DESSOUS (z-0) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(160deg,
            oklch(0.35 0.18 ${260 + index * 35}) 0%,
            oklch(0.22 0.10 ${290 + index * 20}) 100%)`,
        }}
      />
      {/* Fake UI lines on fallback */}
      <div className="absolute inset-0 z-[1] p-2 flex flex-col gap-1.5 pointer-events-none">
        <div className="h-1.5 rounded-sm" style={{ width: '80%', background: 'rgba(255,255,255,0.15)' }} />
        <div className="h-1.5 rounded-sm" style={{ width: '60%', background: 'rgba(255,255,255,0.10)' }} />
        <div className="h-1.5 rounded-sm" style={{ width: '45%', background: 'rgba(255,255,255,0.08)' }} />
      </div>
      {/* 2. Initial fallback letter — z-[1] */}
      <span className="absolute inset-0 flex items-center justify-center z-[1] select-none pointer-events-none"
        style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(255,255,255,0.12)' }}>
        {title.charAt(0)}
      </span>
      {/* 3. Image — PAR-DESSUS (z-[2]) ← FIX DU BUG */}
      <Image
        src={src}
        alt={`${title} - screen ${index + 1}`}
        fill
        className="object-cover z-[2]"
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}

// ─── Phone Shell ──────────────────────────────────────────────────────────────
function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex flex-col"
      style={{
        width: '64px',
        height: '128px',
        borderRadius: '16px',
        background: 'linear-gradient(160deg, #2a2a3a, #1a1a28)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        padding: '8px 4px 6px',
        boxShadow:
          '0 16px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)',
      }}
    >
      {/* Notch */}
      <div
        className="absolute"
        style={{
          top: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '16px',
          height: '3px',
          borderRadius: '2px',
          background: 'rgba(255,255,255,0.12)',
          zIndex: 5,
        }}
      />
      {/* Screen area */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ borderRadius: '9px', background: '#080812' }}
      >
        {children}
      </div>
      {/* Home bar */}
      <div
        className="absolute"
        style={{
          bottom: '3px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '2px',
          borderRadius: '1px',
          background: 'rgba(255,255,255,0.18)',
        }}
      />
    </div>
  )
}

// ─── Slides Viewer (web/desktop) ──────────────────────────────────────────────
function SlidesViewer({ sources, title }: { sources: string[]; title: string }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const isMulti = sources.length > 1

  const prev = () => setCurrentSlide((i) => (i - 1 + sources.length) % sources.length)
  const next = () => setCurrentSlide((i) => (i + 1) % sources.length)

  return (
    <div className="relative w-full h-52 rounded-t-xl overflow-hidden group">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* Fallback browser mockup */}
          <BrowserMockupFallback initial={title.charAt(0)} />
          {/* Real image on top */}
          <Image
            src={sources[currentSlide]}
            alt={`${title} - slide ${currentSlide + 1}`}
            fill
            className="object-cover z-10"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Platform badge */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full z-20"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
        <Monitor size={9} className="text-white/60" />
        <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3px' }}>
          Web / Desktop
        </span>
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-16 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }} />

      {isMulti && (
        <>
          <button onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
              flex items-center justify-center text-white
              opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-30"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <ChevronLeft size={14} />
          </button>
          <button onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
              flex items-center justify-center text-white
              opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-30"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <ChevronRight size={14} />
          </button>
          {/* Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {sources.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentSlide ? '16px' : '6px',
                  height: '6px',
                  background: i === currentSlide ? 'rgb(var(--accent))' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full z-30"
            style={{
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.6)',
            }}>
            {currentSlide + 1} / {sources.length}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Mobile Viewer ────────────────────────────────────────────────────────────
function MobileViewer({ sources, title }: { sources: string[]; title: string }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const isMulti = sources.length > 1

  const prev = () => setCurrentSlide((i) => (i - 1 + sources.length) % sources.length)
  const next = () => setCurrentSlide((i) => (i + 1) % sources.length)

  return (
    <div
      className="relative w-full h-52 rounded-t-xl overflow-hidden group flex items-center justify-center"
      style={{
        background: 'linear-gradient(145deg, #0d0d1a 0%, #150f30 50%, #0a0a1f 100%)',
      }}
    >
      {/* Decorative orbs */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)' }} />

      {/* Platform badge */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full z-20"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
        <Smartphone size={9} className="text-white/60" />
        <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3px' }}>
          Mobile
        </span>
      </div>

      {/* Phones */}
      <div className="relative flex items-center justify-center h-full py-3">
        {/* Back phone (depth effect) */}
        {isMulti && currentSlide < sources.length - 1 && (
          <div
            className="absolute"
            style={{ transform: 'translateX(20px) translateY(6px) scale(0.88)', zIndex: 1 }}
          >
            <PhoneShell>
              <PhoneScreen src={sources[currentSlide + 1]} title={title} index={currentSlide + 1} />
            </PhoneShell>
          </div>
        )}

        {/* Main phone */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.93, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <PhoneShell>
            <PhoneScreen src={sources[currentSlide]} title={title} index={currentSlide} />
          </PhoneShell>
        </motion.div>
      </div>

      {/* Navigation */}
      {isMulti && (
        <>
          <button onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
              flex items-center justify-center text-white
              opacity-0 group-hover:opacity-100 transition-opacity z-30"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <ChevronLeft size={14} />
          </button>
          <button onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
              flex items-center justify-center text-white
              opacity-0 group-hover:opacity-100 transition-opacity z-30"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {sources.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentSlide ? '16px' : '6px',
                  height: '6px',
                  background: i === currentSlide ? '#a78bfa' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full z-30"
            style={{
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.6)',
            }}>
            {currentSlide + 1} / {sources.length}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Media Viewer ─────────────────────────────────────────────────────────────
function MediaViewer({ media, title }: { media: ProjectMedia; title: string }) {
  if (media.type === 'mobile') {
    return <MobileViewer sources={media.sources} title={title} />
  }
  return <SlidesViewer sources={media.sources} title={title} />
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  lang,
  inView,
  delay,
}: {
  project: Project
  lang: string
  inView: boolean
  delay: number
}) {
  const title = lang === 'fr' ? project.title : project.title_en
  const description = lang === 'fr' ? project.description : project.description_en
  const status = lang === 'fr' ? project.status_fr : project.status_en
  const isMobile = project.media.type === 'mobile'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'var(--color-card, white)',
        border: '0.5px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        transform: 'translateZ(0)',
      }}
      whileHover={{
        y: -3,
        boxShadow: isMobile
          ? '0 8px 32px rgba(139,92,246,0.12), 0 2px 8px rgba(0,0,0,0.08)'
          : '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        borderColor: isMobile ? 'rgba(139,92,246,0.25)' : 'rgba(0,0,0,0.14)',
      }}
    >
      {/* ── Media zone ── */}
      <MediaViewer media={project.media} title={title} />

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3.5">

        {/* Status badge + title */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            {/* Glowing dot */}
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: isMobile ? '#a78bfa' : '#34d399',
                boxShadow: isMobile
                  ? '0 0 0 2px rgba(167,139,250,0.2), 0 0 8px rgba(167,139,250,0.4)'
                  : '0 0 0 2px rgba(52,211,153,0.2), 0 0 8px rgba(52,211,153,0.4)',
              }}
            />
            <span
              className="uppercase tracking-widest"
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: isMobile ? '#7c3aed' : '#059669',
              }}
            >
              {status}
            </span>
          </div>

          <h3
            className="font-medium leading-snug transition-colors duration-200"
            style={{ fontSize: '14px', color: 'var(--color-foreground, #111)' }}
          >
            {title}
          </h3>
        </div>

        {/* Description */}
        <p
          className="flex-1 leading-relaxed text-gray-600 transition-colors duration-150 dark:text-gray-400"
          style={{ fontSize: '12.5px', lineHeight: 1.6 }}
        >
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full font-medium"
              style={{
                fontSize: '10.5px',
                background: isMobile
                  ? 'rgba(124,58,237,0.07)'
                  : 'rgba(5,150,105,0.07)',
                color: isMobile ? '#6d28d9' : '#047857',
                border: `0.5px solid ${isMobile ? 'rgba(124,58,237,0.15)' : 'rgba(5,150,105,0.15)'}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer links */}
        <div
          className="flex items-center gap-3 pt-3"
          style={{ borderTop: '0.5px solid rgba(0,0,0,0.07)' }}
        >
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 transition-colors duration-150"
              style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
            >
              <Github size={13} />
              <span>Code</span>
            </motion.a>
          )}
          {project.live && (
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 transition-colors duration-150"
              style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
            >
              <ExternalLink size={13} />
              <span>Live</span>
            </motion.a>
          )}

          {/* Arrow button */}
          <motion.div
            className="ml-auto flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              width: '28px',
              height: '28px',
              border: '0.5px solid rgba(0,0,0,0.10)',
              color: '#d1d5db',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            whileHover={{
              rotate: 45,
              borderColor: isMobile ? 'rgba(124,58,237,0.4)' : 'rgba(5,150,105,0.4)',
              color: isMobile ? '#7c3aed' : '#059669',
            }}
          >
            ↗
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section Projects ─────────────────────────────────────────────────────────
export default function Projects() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  let t: (key: string) => string = (key) => key
  let lang = 'fr'
  try {
    const ctx = useLanguage()
    t = ctx.t
    lang = (ctx as any).language ?? 'fr'
  } catch {}

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle title={t('projects.title')} align="left" />

      <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            lang={lang}
            inView={inView}
            delay={i * 0.1}
          />
        ))}
      </div>
    </section>
  )
}