'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '@/utils/language-context'
import { Calendar, MapPin, BookOpen } from 'lucide-react'
import SectionTitle from '@/components/SectionTitle'

// Education entries driven entirely by translation keys
const educationKeys = [
  { key: 'edu1', isCurrent: true },
  { key: 'edu2', isCurrent: false },
  { key: 'edu3', isCurrent: false },
  { key: 'edu4', isCurrent: false },
  { key: 'edu5', isCurrent: false },
]

export default function Education() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  let t: (key: string) => string
  try {
    const context = useLanguage()
    t = context.t
  } catch {
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        'education.title': 'Education',
        'education.current': 'In Progress',
      }
      return fallbacks[key] ?? key
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-16">
          <SectionTitle title={t('education.title')} align="left" />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 via-accent to-accent/50 transform md:-translate-x-1/2" />

          <motion.div variants={containerVariants} className="space-y-12">
            {educationKeys.map(({ key, isCurrent }, index) => {
              const title = t(`education.${key}_title`)
              const institution = t(`education.${key}_institution`)
              const period = t(`education.${key}_period`)
              const focus = t(`education.${key}_focus`)
              const location = t(`education.${key}_location`)
              const desc = t(`education.${key}_desc`)

              return (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  className={`relative flex ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 top-6 transform -translate-x-1/2 z-10">
                    <motion.div
                      className={`w-4 h-4 rounded-full border-4 border-background ${
                        isCurrent ? 'bg-green-500' : 'bg-accent'
                      }`}
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Pulsing ring for current */}
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
                    )}
                  </div>

                  {/* Content card */}
                  <motion.div
                    className={`w-full md:w-1/2 ${
                      index % 2 === 0
                        ? 'md:pr-[10px] md:mr-auto'
                        : 'md:pl-[10px] md:ml-auto'
                    }`}
                  >
                    <div className="ml-12 md:ml-0 p-6 bg-background rounded-lg border border-border hover:border-accent/50 transition-colors">
                      {/* "In Progress" badge */}
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                          {t('education.current')}
                        </span>
                      )}

                      <h3 className="text-xl font-bold text-gray-600 dark:text-white mb-2">
                        {title}
                      </h3>

                      {institution && (
                        <div className="text-accent font-semibold mb-4">
                          {institution}
                        </div>
                      )}

                      <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>{period}</span>
                        </div>
                        {location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span>{location}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        {focus && (
                          <p className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-white mb-2">
                            <BookOpen className="w-4 h-4 shrink-0 text-accent" />
                            {focus}
                          </p>
                        )}
                        <p className="text-muted-foreground text-sm">{desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}