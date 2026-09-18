'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Download, Github, Code2, Monitor,
  Terminal, Globe, Sparkles, ArrowRight,
} from 'lucide-react'
import { useLanguage } from '@/utils/language-context'
import { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

// ─── Tooltip Component ────────────────────────────────────────────────────────
function SkillTooltip({
  skill,
  language,
}: {
  skill: { icon: React.ElementType; label: string; details: { fr: string[]; en: string[] } }
  language: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const details = language === 'fr' ? skill.details.fr : skill.details.en

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {/* Skill card */}
      <motion.div
        onClick={() => setOpen((v) => !v)}
        className="relative flex flex-col items-center p-3 rounded-2xl cursor-pointer group overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '0.5px solid rgba(255,255,255,0.08)',
        }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label={skill.label}
      >
        {/* Glow au survol */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
        />

        <skill.icon className="w-6 h-6 mb-1.5 text-accent/70 group-hover:text-accent transition-colors duration-300" />
        <span className="text-[11px] font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-300 text-center leading-tight">
          {skill.label}
        </span>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-44 rounded-2xl p-3.5 pointer-events-none"
            style={{
              background: 'rgba(15,15,25,0.92)',
              backdropFilter: 'blur(16px)',
              border: '0.5px solid rgba(139,92,246,0.25)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.06)',
            }}
          >
            {/* Flèche */}
            <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
              style={{
                background: 'rgba(15,15,25,0.92)',
                borderRight: '0.5px solid rgba(139,92,246,0.25)',
                borderBottom: '0.5px solid rgba(139,92,246,0.25)',
              }}
            />

            <p className="text-[9px] uppercase tracking-[0.15em] text-accent/60 font-semibold mb-2 text-center">
              {language === 'fr' ? 'Expertise' : 'Expertise'}
            </p>

            <ul className="space-y-1.5">
              {details.map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-[11px] text-foreground/80">
                  <span className="text-accent/50 text-[7px]">◆</span>
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center justify-center gap-1.5 pt-2 border-t border-white/5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              <span className="text-[9px] uppercase tracking-wider text-accent/70">
                {language === 'fr' ? 'En ligne' : 'Online'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  let t: (key: string) => string, language: string
  try {
    const context = useLanguage()
    t = context.t
    language = context.language
  } catch {
    language = 'en'
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        'hero.title': "Hi, I'm",
        'hero.subname': 'Fihaonantsoa',
        'hero.subtitle': 'Full-Stack Developer',
        'hero.description': 'I build beautiful and functional web applications',
        'hero.cta_projects': 'View Projects',
        'hero.cta_contact': 'Contact Me',
        'hero.cta_cv': 'Download CV',
        'hero.scroll': 'Scroll to discover',
      }
      return fallbacks[key] || key
    }
  }

  // ── Variants ────────────────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }
  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.03, duration: 0.5, ease: 'easeOut' },
    }),
  }
  const photoVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 } },
  }

  // ── Skills data ─────────────────────────────────────────────────────────────
  const skills = [
    {
      icon: Code2,
      label: language === 'fr' ? 'Développement Web' : 'Web Development',
      details: {
        fr: ['React/Next.js', 'TypeScript', 'TailwindCSS', 'Node.js'],
        en: ['React/Next.js', 'TypeScript', 'TailwindCSS', 'Node.js'],
      },
    },
    {
      icon: Monitor,
      label: language === 'fr' ? 'Applications Desktop' : 'Desktop Apps',
      details: {
        fr: ['Python', 'Java', 'C#', 'C++'],
        en: ['Python', 'Java', 'C#', 'C++'],
      },
    },
    {
      icon: Terminal,
      label: language === 'fr' ? 'Algorithmique' : 'Algorithms',
      details: {
        fr: ['Structures de données', 'Complexité', 'Design Patterns', 'Optimisation'],
        en: ['Data Structures', 'Complexity', 'Design Patterns', 'Optimization'],
      },
    },
    {
      icon: Globe,
      label: language === 'fr' ? 'Systèmes Unix' : 'Unix Systems',
      details: {
        fr: ['Linux/Unix', 'Bash', 'Docker', 'Git'],
        en: ['Linux/Unix', 'Bash', 'Docker', 'Git'],
      },
    },
  ]

  // ── Typewriter ──────────────────────────────────────────────────────────────
  const titles = [
    t('hero.subtitle'),
    language === 'fr' ? 'Développeur Web' : 'Web Developer',
    language === 'fr' ? 'Programmeur' : 'Programmer',
    language === 'fr' ? 'Passionné de Tech' : 'Tech Enthusiast',
  ]

  useEffect(() => {
    const currentTitle = titles[currentIndex]
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentTitle.length) {
          setDisplayText(currentTitle.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2500)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentTitle.slice(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % titles.length)
        }
      }
    }, isDeleting ? 40 : 70)
    return () => clearTimeout(timer)
  }, [displayText, currentIndex, isDeleting, titles])

  useEffect(() => { setMounted(true) }, [])

  const scrollToSection = (sectionId: string) => {
    document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!mounted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-4 overflow-hidden bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-16 bg-accent/20 rounded-lg animate-pulse w-64" />
            <div className="h-8 bg-accent/20 rounded-lg animate-pulse w-96" />
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-40 h-12 bg-accent/20 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="w-80 h-80 mx-auto bg-accent/20 rounded-full animate-pulse" />
        </div>
      </section>
    )
  }

  const titleLetters = t('hero.title').split('')
  const firstNameLetters = t('hero.subname').split('')

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 lg:pt-4 overflow-hidden relative bg-background dark:bg-transparent"
    >
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Orbe 1 */}
        <div
          className="absolute top-[15%] left-[5%] w-80 h-80 rounded-full blur-[100px] opacity-30 animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)', animationDuration: '8s' }}
        />
        {/* Orbe 2 */}
        <div
          className="absolute bottom-[15%] right-[5%] w-96 h-96 rounded-full blur-[120px] opacity-25 animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', animationDuration: '10s' }}
        />
        {/* Grille subtile */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        {/* ── Gauche ── */}
        <div className="lg:text-left order-2 lg:order-1 text-center">

          {/* Badge de disponibilité */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{
              background: 'rgba(139,92,246,0.08)',
              border: '0.5px solid rgba(139,92,246,0.2)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-xs font-medium text-foreground/70">
              {language === 'fr' ? 'Disponible pour missions' : 'Available for work'}
            </span>
          </motion.div>

          {/* Titre lettre par lettre */}
          <motion.h1 variants={itemVariants} className="font-bold text-balance mb-4 text-foreground">
            <div className="text-2xl sm:text-4xl lg:text-5xl flex flex-wrap gap-1 justify-center lg:justify-start mb-3 lg:mb-2">
              {titleLetters.map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  className="inline-block hover:text-accent transition-colors duration-300 text-gray-600 cursor-pointer dark:text-white"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
            <div className="flex flex-wrap gap-0.5 justify-center lg:justify-start mb-3">
              {firstNameLetters.map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  className="inline-block text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-accent via-purple-400 to-accent bg-clip-text text-transparent cursor-pointer"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>

            {/* Typewriter */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mt-4 h-[1.5em]">
              <Sparkles size={18} className="text-accent/60 flex-shrink-0" />
              <span className="text-lg sm:text-xl text-accent font-medium">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block w-0.5 h-[0.9em] bg-accent/70 ml-1 align-middle"
                />
              </span>
            </div>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base text-muted-foreground mb-7 lg:max-w-xl leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>

          {/* Boutons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
            <motion.a
              href="#projects"
              onClick={(e) => { e.preventDefault(); scrollToSection('#projects') }}
              className="group px-5 py-2.5 bg-accent text-accent-foreground rounded-full font-semibold transition-all flex items-center gap-2 text-sm relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ boxShadow: '0 4px 20px rgba(139,92,246,0.25)' }}
            >
              <Code2 size={16} />
              {t('hero.cta_projects')}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </motion.a>

            <motion.a
              href="https://github.com/FIhaonantsoa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 text-sm"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                color: 'var(--foreground)',
              }}
              whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.06)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Github size={16} />
              GitHub
            </motion.a>

            <motion.a
              href="/CV_Fihaonantsoa_Ainamirindra_RAFANOMANANA.pdf"
              download
              className="px-5 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 text-sm"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                color: 'var(--foreground)',
              }}
              whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.06)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={16} />
              {t('hero.cta_cv')}
            </motion.a>
          </motion.div>

          {/* Skills avec tooltips */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
            {skills.map((skill, i) => (
              <SkillTooltip key={i} skill={skill} language={language} />
            ))}
          </motion.div>
        </div>

        {/* ── Droite — Photo ── */}
        <motion.div
          variants={photoVariants}
          className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
            {/* Halo animé */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
                animationDuration: '4s',
              }}
            />

            {/* Anneaux décoratifs */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px dashed rgba(139,92,246,0.25)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            <div
              className="absolute inset-3 rounded-full"
              style={{ border: '0.5px solid rgba(139,92,246,0.15)' }}
            />

            {/* Photo */}
            <div className="absolute inset-5 rounded-full overflow-hidden"
              style={{
                border: '3px solid var(--background)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(139,92,246,0.15)',
              }}
            >
              <Image src="me.png" alt="Profile" fill className="object-cover" priority />
            </div>

            {/* Badge disponible */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-2 right-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              {language === 'fr' ? 'Disponible' : 'Available'}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Indicateur de scroll */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer"
        onClick={() => scrollToSection('#skills')}
      >
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
          {t('hero.scroll')}
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-accent/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}