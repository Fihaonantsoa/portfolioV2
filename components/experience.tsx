'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '@/utils/language-context'
import SectionTitle from '@/components/SectionTitle'

export default function Experience() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  let t;
  try {
    ({ t } = useLanguage());
  } catch {
    t = (key: string) => key;
  }

  const experiences = [
    {
      id: 1,
      role: t('experience.exp1_role'),
      company: t('experience.exp1_company'),
      period: t('experience.exp1_period'),
      description: t('experience.exp1_desc'),
      highlights: ['Laravel', 'React', 'REST API', 'MySQL', 'Merise', 'PDF/Image'],
    },
    // {
    //   id: 2,
    //   role: t('experience.exp2_role'),
    //   company: t('experience.exp2_company'),
    //   period: t('experience.exp2_period'),
    //   description: t('experience.exp2_desc'),
    //   highlights: ['...', '...', '...'],
    // },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-balance"
          variants={itemVariants}
        >
          <SectionTitle
            title={t('experience.title')}
            align="left"
          />
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-accent/30 rounded-full"></div>

          <div className="md:ml-12 space-y-12">
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className="relative group"
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-0 top-0 -translate-x-1/2 translate-y-6">
                  <motion.div
                    className="w-4 h-4 bg-accent rounded-full border-4 border-background"
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 1.2 }}
                  ></motion.div>
                </div>

                {/* Experience Card */}
                <motion.div
                  className="p-8 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors"
                  whileHover={{
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1 text-gray-600 dark:text-white">{exp.role}</h3>
                      <p className="text-accent font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-muted-foreground text-sm mt-2 md:mt-0">{exp.period}</span>
                  </div>

                  <p className="text-muted-foreground mb-6">{exp.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {exp.highlights.map((skill, index) => (
                      <span
                        key={`${exp.id}-${skill}-${index}`}
                        className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}