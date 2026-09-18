'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '@/utils/language-context'
import SectionTitle from '@/components/SectionTitle'
import {
  SiPython, SiPhp, SiKotlin,
  SiTailwindcss, SiReact, SiLaravel, SiNextdotjs,
  SiBootstrap, SiVuedotjs,
  SiMysql, SiPostgresql,
  SiGit, SiGithub, SiLinux,
  SiJavascript, SiTypescript, SiCss, SiHtml5,
} from 'react-icons/si'
import { FaJava, FaMicrosoft, FaPaintBrush } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import {
  CodeIcon, GlobeIcon, DatabaseIcon, WrenchIcon, Palette,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Skill {
  name: string
  icon: IconType | React.ElementType
  color: string
}

interface Category {
  key: string
  label_fr: string
  label_en: string
  icon: React.ElementType
  skills: Skill[]
}

// ─── Données ──────────────────────────────────────────────────────────────────
const categories: Category[] = [
  {
    key: 'languages',
    label_fr: 'Langages de programmation',
    label_en: 'Programming Languages',
    icon: CodeIcon,
    skills: [
      { name: 'Python',     icon: SiPython,     color: '#3776AB' },
      { name: 'PHP',        icon: SiPhp,        color: '#777BB4' },
      { name: 'Java',       icon: FaJava,       color: '#007396' },
      { name: 'Kotlin',     icon: SiKotlin,     color: '#7F52FF' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    ],
  },
  {
    key: 'web',
    label_fr: 'Technologies Web & Mobile',
    label_en: 'Web & Mobile Technologies',
    icon: GlobeIcon,
    skills: [
      { name: 'TailwindCSS',  icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'React',        icon: SiReact,       color: '#61DAFB' },
      { name: 'Laravel',      icon: SiLaravel,     color: '#FF2D20' },
      { name: 'Next.js',      icon: SiNextdotjs,   color: '#000000' },
      { name: 'React Native', icon: SiReact,       color: '#61DAFB' },
      { name: 'Bootstrap',    icon: SiBootstrap,   color: '#7952B3' },
      { name: 'Vue.js',       icon: SiVuedotjs,    color: '#4FC08D' },
      { name: 'HTML5',        icon: SiHtml5,       color: '#E34F26' },
      { name: 'CSS3',         icon: SiCss,         color: '#1572B6' },
    ],
  },
  {
    key: 'data',
    label_fr: 'Bases de données',
    label_en: 'Databases',
    icon: DatabaseIcon,
    skills: [
      { name: 'MySQL',      icon: SiMysql,      color: '#4479A1' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    ],
  },
  {
    key: 'tools',
    label_fr: 'Outils & Environnement',
    label_en: 'Tools & Environment',
    icon: WrenchIcon,
    skills: [
      { name: 'Microsoft Office', icon: FaMicrosoft,  color: '#D83B01' },
      { name: 'Git',              icon: SiGit,        color: '#F05032' },
      { name: 'GitHub',           icon: SiGithub,     color: '#181717' },
      { name: 'Linux',            icon: SiLinux,      color: '#FCC624' },
      { name: 'Photoshop',        icon: FaPaintBrush, color: '#31A8FF' },
      { name: 'Canva',            icon: Palette,      color: '#00C4CC' },
    ],
  },
]

// ─── Skill Item (icône + nom) ─────────────────────────────────────────────────
function SkillItem({
  skill, inView, delay,
}: {
  skill: Skill; inView: boolean; delay: number
}) {
  const Icon = skill.icon as IconType
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -3, scale: 1.03 }}
      className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl cursor-default transition-colors"
      style={{
        background: 'rgba(0,0,0,0.02)',
        border: '0.5px solid rgba(0,0,0,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${skill.color}10`
        e.currentTarget.style.borderColor = `${skill.color}30`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
      }}
    >
      <Icon
        size={28}
        style={{ color: skill.color }}
        className="transition-transform duration-300 group-hover:scale-110"
      />
      <span
        className="text-[11px] font-medium text-center leading-tight text-gray-600 dark:text-gray-400"
        style={{ letterSpacing: '0.01em' }}
      >
        {skill.name}
      </span>
    </motion.div>
  )
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({
  category, inView, baseDelay, lang,
}: {
  category: Category; inView: boolean; baseDelay: number; lang: string
}) {
  const Icon = category.icon
  const label = lang === 'fr' ? category.label_fr : category.label_en

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: baseDelay }}
      className="p-6 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors"
      whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      {/* En-tête catégorie */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-accent" />
        </div>
        <h3 className="text-base font-bold text-foreground text-gray-600 dark:text-white">
          {label}
        </h3>
        <span className="ml-auto text-xs text-gray-400 font-medium">
          {category.skills.length}
        </span>
      </div>

      {/* Grille d'icônes */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {category.skills.map((skill, i) => (
          <SkillItem
            key={`${category.key}-${skill.name}-${i}`}
            skill={skill}
            inView={inView}
            delay={baseDelay + i * 0.05}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Section Skills ───────────────────────────────────────────────────────────
export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  let t: (key: string) => string = (key) => key
  let lang = 'fr'
  try {
    const ctx = useLanguage()
    t = ctx.t
    lang = (ctx as any).language ?? 'fr'
  } catch {}

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-balance"
          variants={titleVariants}
        >
          <SectionTitle title={t('skills.title')} align="left" />
        </motion.h2>

        <div ref={ref} className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat.key}
              category={cat}
              inView={inView}
              baseDelay={i * 0.1}
              lang={lang}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}