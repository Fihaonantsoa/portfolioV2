'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, ChevronLeft, ChevronRight, ArrowUpRight, Smartphone, Monitor } from 'lucide-react'
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
      'Application web de gestion et de suivi des paiements d\'eau et d\'électricité. Développée en PHP / Laravel avec une interface moderne TailwindCSS.',
    description_en:
      'Web application for managing and tracking water and electricity payments. Built with PHP / Laravel and a modern TailwindCSS interface.',
    tags: ['PHP', 'Laravel', 'TailwindCSS', 'MySQL'],
    media: {
      type: 'slides',
      sources: [
        '/images/java.png',
        '/images/php.png',
        '/images/vuejs.png',
      ],
    },
    github: 'https://github.com/FIhaonantsoa',
    status_fr: 'Projet académique',
    status_en: 'Academic project',
  },
  {
    id: 2,
    title: 'Gestion des notes d\'examen',
    title_en: 'Exam Grade Management',
    description:
      'Application desktop de gestion et de suivi des notes d\'examen des étudiants. Interface intuitive avec calcul automatique des moyennes.',
    description_en:
      'Desktop application for managing and tracking student exam grades. Intuitive interface with automatic average calculation.',
    tags: ['Java', 'MySQL', 'JavaFX'],
    media: {
      type: 'slides',
      sources: [
        '/images/java.png',
        '/images/php.png',
        '/images/vuejs.png',
      ],
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
      sources: [
        '/images/java.png',
        '/images/php.png',
        '/images/vuejs.png',
      ],
    },
    github: 'https://github.com/FIhaonantsoa',
    status_fr: 'Application mobile',
    status_en: 'Mobile application',
  },
  {
    id: 4,
    title: 'Gestion des notes d\'examen',
    title_en: 'Exam Grade Management',
    description:
      'Application desktop de gestion et de suivi des notes d\'examen des étudiants. Interface intuitive avec calcul automatique des moyennes.',
    description_en:
      'Desktop application for managing and tracking student exam grades. Intuitive interface with automatic average calculation.',
    tags: ['Java', 'MySQL', 'JavaFX'],
    media: {
      type: 'slides',
      sources: [
        '/images/java.png',
        '/images/php.png',
        '/images/vuejs.png',
      ],
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
      sources: [
        '/images/java.png',
        '/images/php.png',
        '/images/vuejs.png',
      ],
    },
    github: 'https://github.com/FIhaonantsoa',
    live: 'https://example.com',
    status_fr: 'Application mobile',
    status_en: 'Mobile application',
  },
  {
    id: 6,
    title: 'Gestion des notes d\'examen',
    title_en: 'Exam Grade Management',
    description:
      'Application desktop de gestion et de suivi des notes d\'examen des étudiants. Interface intuitive avec calcul automatique des moyennes.',
    description_en:
      'Desktop application for managing and tracking student exam grades. Intuitive interface with automatic average calculation.',
    tags: ['Java', 'MySQL', 'JavaFX'],
    media: {
      type: 'slides',
      sources: [
        '/images/java.png',
        '/images/php.png',
        '/images/vuejs.png',
      ],
    },
    github: 'https://github.com/FIhaonantsoa',
    status_fr: 'Projet académique',
    status_en: 'Academic project',
  },
]

// ─── Slides Viewer (web/desktop) ──────────────────────────────────────────────
function SlidesViewer({ sources, title }: { sources: string[]; title: string }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const isMulti = sources.length > 1

  const prev = () => setCurrentSlide((i) => (i - 1 + sources.length) % sources.length)
  const next = () => setCurrentSlide((i) => (i + 1) % sources.length)

  return (
    <div className="relative w-full h-52 rounded-t-xl overflow-hidden bg-foreground/5 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg,
                oklch(0.55 0.22 142 / 0.15) 0%,
                oklch(0.72 0.18 155 / 0.08) 50%,
                oklch(0.82 0.13 185 / 0.12) 100%)`,
            }}
          >
            <Image
              src={sources[currentSlide]}
              alt={`${title} - slide ${currentSlide + 1}`}
              fill
              className="object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            <span className="text-accent/20 text-6xl font-black select-none pointer-events-none z-0">
              {title.charAt(0)}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Desktop badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-sm text-white/70 text-[10px] z-10">
        <Monitor size={10} />
        <span>Web / Desktop</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      {isMulti && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
              bg-black/40 backdrop-blur-sm text-white flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
              bg-black/40 backdrop-blur-sm text-white flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10"
          >
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {sources.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? 'w-4 h-1.5 bg-accent'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] z-10">
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
        background: `linear-gradient(145deg,
          oklch(0.18 0.04 260) 0%,
          oklch(0.22 0.06 280) 50%,
          oklch(0.16 0.05 250) 100%)`,
      }}
    >
      {/* Fond décoratif avec cercles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent/5" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-accent/8" />
      </div>

      {/* Badge mobile */}
      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-sm text-white/70 text-[10px] z-10">
        <Smartphone size={10} />
        <span>Mobile</span>
      </div>

      {/* Mockup téléphone */}
      <div className="relative z-10 flex items-center justify-center h-full py-3">
        {/* Téléphones empilés si plusieurs slides */}
        {isMulti && currentSlide < sources.length - 1 && (
          <div
            className="absolute"
            style={{ transform: 'translateX(22px) translateY(6px) scale(0.88)', zIndex: 1 }}
          >
            <PhoneShell>
              <PhoneScreen src={sources[currentSlide + 1]} title={title} index={currentSlide + 1} />
            </PhoneShell>
          </div>
        )}

        {/* Téléphone principal */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.92, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
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
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
              bg-black/40 backdrop-blur-sm text-white flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-20"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
              bg-black/40 backdrop-blur-sm text-white flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-20"
          >
            <ChevronRight size={14} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {sources.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? 'w-4 h-1.5 bg-accent'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] z-10">
            {currentSlide + 1} / {sources.length}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Composants utilitaires Mobile ────────────────────────────────────────────
function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        width: '72px',
        height: '140px',
        borderRadius: '16px',
        background: 'linear-gradient(145deg, oklch(0.32 0.04 260), oklch(0.22 0.03 250))',
        border: '2px solid oklch(0.42 0.06 260)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 oklch(0.5 0.05 260 / 0.4)',
        padding: '6px 4px',
      }}
    >
      {/* Encoche */}
      <div
        className="absolute top-1.5 left-1/2 -translate-x-1/2"
        style={{
          width: '20px',
          height: '4px',
          borderRadius: '2px',
          background: 'oklch(0.18 0.03 260)',
          zIndex: 5,
        }}
      />
      {/* Écran */}
      <div
        className="relative w-full h-full rounded-xl overflow-hidden"
        style={{ background: '#0a0a0f', marginTop: '2px' }}
      >
        {children}
      </div>
      {/* Bouton home */}
      <div
        className="absolute -bottom-1"
        style={{
          width: '18px',
          height: '3px',
          borderRadius: '2px',
          background: 'oklch(0.38 0.05 260)',
        }}
      />
    </div>
  )
}

function PhoneScreen({ src, title, index }: { src: string; title: string; index: number }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Image
        src={src}
        alt={`${title} - screen ${index + 1}`}
        fill
        className="object-cover"
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
      {/* Fallback gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg,
            oklch(0.35 0.12 ${260 + index * 30}) 0%,
            oklch(0.25 0.08 ${280 + index * 20}) 100%)`,
        }}
      />
      <span className="relative z-10 text-white/20 text-2xl font-black select-none">
        {title.charAt(0)}
      </span>
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

// ─── Carte projet ─────────────────────────────────────────────────────────────
function ProjectCard({ project, lang, inView, delay }: {
  project: Project; lang: string; inView: boolean; delay: number
}) {
  const title = lang === 'fr' ? project.title : project.title_en
  const description = lang === 'fr' ? project.description : project.description_en
  const status = lang === 'fr' ? project.status_fr : project.status_en
  const isMobile = project.media.type === 'mobile'

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className="group flex flex-col rounded-xl overflow-hidden
        bg-white/65 dark:bg-card
        border border-accent/20
        shadow-md hover:shadow-xl hover:shadow-accent/10
        hover:border-accent/50
        backdrop-blur-sm
        transition-all duration-300"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* ── Media ── */}
      <MediaViewer media={project.media} title={title} />

      {/* ── Contenu ── */}
      <div className="flex flex-col flex-1 p-5 gap-4">

        {/* Badge statut + titre */}
        <div className="flex flex-col gap-1.5">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest ${
            isMobile ? 'text-violet-400' : 'text-accent'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              isMobile ? 'bg-violet-400' : 'bg-accent'
            }`} />
            {isMobile && <Smartphone size={10} />}
            {status}
          </span>
          <h3 className="text-base font-bold text-foreground/90 leading-snug group-hover:text-accent transition-colors duration-200">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/55 leading-relaxed flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                isMobile
                  ? 'bg-violet-500/8 dark:bg-violet-500/10 text-violet-400/80 border-violet-500/15'
                  : 'bg-accent/8 dark:bg-accent/10 text-accent/80 border-accent/15'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Liens */}
        <div className="flex items-center gap-3 pt-3 border-t border-border/40">
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-accent transition-colors"
            >
              <Github size={14} />
              <span>Code</span>
            </motion.a>
          )}
          {project.live && (
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-accent transition-colors"
            >
              <ExternalLink size={14} />
              <span>Live</span>
            </motion.a>
          )}
          <motion.div
            className="ml-auto w-7 h-7 rounded-full border border-border/50
              flex items-center justify-center
              text-foreground/30 group-hover:text-accent group-hover:border-accent/50
              transition-all duration-300"
            whileHover={{ rotate: 45 }}
          >
            <ArrowUpRight size={13} />
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

      <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            lang={lang}
            inView={inView}
            delay={i * 0.12}
          />
        ))}
      </div>
    </section>
  )
}