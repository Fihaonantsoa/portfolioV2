'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '@/utils/language-context'
import SectionTitle from '@/components/SectionTitle'
import { CodeIcon, GlobeIcon, DatabaseIcon, WrenchIcon } from 'lucide-react'

const categories = [
  {
    key: 'languages',
    label_fr: 'Langages de programmation',
    label_en: 'Programming Languages',
    icon: CodeIcon,
    skills: [
      { name: 'Python',  percent: 80,  showBar: true  },
      { name: 'PHP',     percent: 80,  showBar: true  },
      { name: 'Java',    percent: 75,  showBar: true  },
      { name: 'Kotlin',  percent: 60,  showBar: false },
    ],
  },
  {
    key: 'web',
    label_fr: 'Technologies Web & Mobile',
    label_en: 'Web & Mobile Technologies',
    icon: GlobeIcon,
    skills: [
      { name: 'TailwindCSS',  percent: 90, showBar: true  },
      { name: 'React',        percent: 75, showBar: true  },
      { name: 'Laravel',      percent: 75, showBar: true  },
      { name: 'Next.js',      percent: 70, showBar: false },
      { name: 'React Native', percent: 65, showBar: false },
      { name: 'Bootstrap',    percent: 70, showBar: false },
      { name: 'Vue.js',       percent: 60, showBar: false },
    ],
  },
  {
    key: 'data',
    label_fr: 'Bases de données',
    label_en: 'Databases',
    icon: DatabaseIcon,
    skills: [
      { name: 'MySQL',      percent: 80, showBar: true  },
      { name: 'PostgreSQL', percent: 75, showBar: true  },
    ],
  },
  {
    key: 'tools',
    label_fr: 'Outils & Environnement',
    label_en: 'Tools & Environment',
    icon: WrenchIcon,
    skills: [
      { name: 'Microsoft Office',        percent: 85, showBar: true  },
      { name: 'Git & GitHub',            percent: 80, showBar: true  },
      { name: 'Linux (Terminal)',         percent: 70, showBar: false },
      { name: 'Adobe Photoshop / Canva', percent: 65, showBar: false },
    ],
  },
]

// ─── Barre de progression ─────────────────────────────────────────────────────
function SkillBar({
  name, percent, inView, delay,
}: {
  name: string; percent: number; inView: boolean; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-muted-foreground group-hover:text-accent transition-colors">
          {name}
        </span>
        <span className="text-xs text-muted-foreground">{percent}%</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-accent/10 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.1, delay: delay + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </motion.div>
  )
}

// ─── Card catégorie ───────────────────────────────────────────────────────────
function CategoryCard({
  category, inView, baseDelay, lang,
}: {
  category: typeof categories[0]; inView: boolean; baseDelay: number; lang: string
}) {
  const Icon = category.icon
  const label = lang === 'fr' ? category.label_fr : category.label_en

  const barSkills = category.skills.filter((s) => s.showBar)
  const tagSkills = category.skills.filter((s) => !s.showBar)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: baseDelay }}
      className="p-8 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors"
      whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      {/* En-tête catégorie */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-accent" />
        </div>
        <h3 className="text-base font-bold text-foreground text-gray-600 dark:text-white">
          {label}
        </h3>
      </div>

      {/* Barres — skills principaux */}
      {barSkills.length > 0 && (
        <div className="flex flex-col gap-4 mb-5">
          {barSkills.map((skill, i) => (
            <SkillBar
              key={skill.name}
              name={skill.name}
              percent={skill.percent}
              inView={inView}
              delay={baseDelay + i * 0.08}
            />
          ))}
        </div>
      )}

      {/* Séparateur si les deux sections coexistent */}
      {barSkills.length > 0 && tagSkills.length > 0 && (
        <div className="h-px bg-border mb-5" />
      )}

      {/* Tags — autres skills */}
      {tagSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tagSkills.map((skill, i) => (
            <motion.span
              key={`${category.key}-tag-${skill.name}-${i}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: baseDelay + i * 0.06 }}
              className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
            >
              {skill.name}
            </motion.span>
          ))}
        </div>
      )}
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