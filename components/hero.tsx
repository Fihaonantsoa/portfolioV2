'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Download, Github, Code2, Monitor, Terminal, Globe } from 'lucide-react'
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

  // Fermer au clic extérieur (mobile)
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
        className="flex flex-col items-center p-3 bg-card/50 rounded-xl border border-border/50 hover:border-accent/30 transition-all cursor-pointer group"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label={skill.label}
      >
        <skill.icon className="w-6 h-6 mb-1 text-accent/80 group-hover:text-accent transition-colors duration-300" />
        <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300 text-center">
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
            className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50
              w-44 rounded-xl p-3
              bg-background/90 backdrop-blur-md
              border border-accent/20 shadow-lg shadow-black/10
              pointer-events-none
            "
          >
            {/* Flèche */}
            <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-background/90 border-r border-b border-accent/20" />

            {/* Titre */}
            <p className="text-[10px] uppercase tracking-widest text-accent/60 font-medium mb-2 text-center">
              {language === 'fr' ? 'expertise' : 'expertise'}
            </p>

            {/* Liste */}
            <ul className="space-y-1">
              {details.map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-xs text-foreground/80">
                  <span className="text-accent/50 text-[8px]">◆</span>
                  {tech}
                </li>
              ))}
            </ul>

            {/* Indicateur en ligne */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              <span className="text-[9px] uppercase tracking-wider text-accent/70">
                {language === 'fr' ? 'en ligne' : 'online'}
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
      details: { fr: ['React/Next.js', 'TypeScript', 'Node.js', 'TailwindCSS'], en: ['React/Next.js', 'TypeScript', 'Node.js', 'TailwindCSS'] },
    },
    {
      icon: Monitor,
      label: language === 'fr' ? 'Applications Desktop' : 'Desktop Apps',
      details: { fr: ['C++', 'C#', 'Python', 'Java'], en: ['C++', 'C#', 'Python', 'Java'] },
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
      details: { fr: ['Linux/Unix', 'Bash'], en: ['Linux/Unix', 'Bash'] },
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
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
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

          {/* Titre lettre par lettre */}
          <motion.h1 variants={itemVariants} className="font-bold text-balance mb-4 text-foreground">
            <div className="text-2xl sm:text-4xl lg:text-5xl flex flex-wrap gap-1 justify-center lg:justify-start mb-5 lg:mb-0">
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
            <div className="flex flex-wrap gap-0.5 justify-center lg:justify-start mb-5 lg:mb-0 text-md sm:text-2xl lg:text-3xl">
              {firstNameLetters.map((char, i) => (
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
            {/* Typewriter */}
            <span className="block mt-2 h-[1.2em] text-lg sm:text-xl text-accent">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block w-0.5 h-[0.8em] bg-accent/70 ml-1 align-middle"
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-base text-muted-foreground mb-6 lg:max-w-xl">
            {t('hero.description')}
          </motion.p>

          {/* Boutons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
            <motion.a
              href="#projects"
              onClick={(e) => { e.preventDefault(); scrollToSection('#projects') }}
              className="px-5 py-2.5 bg-accent text-accent-foreground rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Code2 size={16} />
              {t('hero.cta_projects')}
            </motion.a>

            <motion.a
              href="https://github.com/FIhaonantsoa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-muted text-foreground rounded-full font-semibold hover:bg-muted/80 transition-all flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github size={16} />
              GitHub
            </motion.a>
          </motion.div>

          {/* Skills avec tooltips */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
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
            <div className="absolute inset-0 rounded-full bg-accent/10 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-accent/30" />
            <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-background shadow-xl">
              <Image src="me.png" alt="Profile" fill className="object-cover" priority />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
            >
              {language === 'fr' ? 'Disponible' : 'Available'}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}