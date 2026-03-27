'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useInView as useInViewObserver } from 'react-intersection-observer'
import {
  ScanFaceIcon, CodeIcon, BookOpenIcon, RocketIcon,
  MailIcon, PhoneIcon, MapPinIcon, GithubIcon, GlobeIcon,
} from 'lucide-react'
import { useLanguage } from '@/utils/language-context'
import SectionTitle from '@/components/SectionTitle'

// ─── Âge dynamique ────────────────────────────────────────────────────────────
const BIRTH_YEAR = 2008
function getAge(): number {
  return new Date().getFullYear() - BIRTH_YEAR
}

// ─── TypewriterIntro ──────────────────────────────────────────────────────────
function TypewriterIntro({ t, lang }: { t: (key: string) => string; lang: string }) {
  const age = getAge()
  const introText = lang === 'fr' ? ' Chargement du profil...' : ' Loading profile...'

  const finalText = [
    {
      icon: <ScanFaceIcon size={15} className="shrink-0 text-accent mt-0.5" />,
      label: t('about.card_profile_label'),
      content: t('about.card_profile_content'),
    },
    {
      icon: <CodeIcon size={15} className="shrink-0 text-accent mt-0.5" />,
      label: t('about.card_skills_label'),
      content: t('about.card_skills_content'),
    },
    {
      icon: <RocketIcon size={15} className="shrink-0 text-accent mt-0.5" />,
      label: t('about.card_portfolio_label'),
      content: t('about.card_portfolio_content'),
    },
    {
      icon: <BookOpenIcon size={15} className="shrink-0 text-accent mt-0.5" />,
      label: t('about.card_about_label'),
      content: `${t('about.card_about_content_pre')} ${age} ${t('about.card_about_content_post')}`,
    },
  ]

  const [displayed, setDisplayed] = useState('')
  const [showFinal, setShowFinal] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    setDisplayed('')
    setShowFinal(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < introText.length - 1) {
        setDisplayed((prev) => prev + introText[i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setShowFinal(true), 800)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [lang])

  return (
    <div
      ref={ref}
      className="h-full space-y-3 px-4 py-5
        bg-white/70 dark:bg-card
        text-foreground rounded-xl shadow-md
        text-start border border-accent/20
        backdrop-blur-sm"
    >
      {/* Phase typewriter */}
      {!showFinal && (
        <div className="pl-4 border-l-4 border-accent bg-accent/8 dark:bg-accent/10 p-4 rounded-lg">
          <p className="text-[10px] text-accent font-semibold mb-1 uppercase tracking-widest">Intro</p>
          <p className="text-base font-light text-foreground/80">
            {displayed}
            <span className="animate-pulse text-accent">|</span>
          </p>
        </div>
      )}

      {/* Cards finales */}
      {showFinal && isInView && (
        <motion.div
          className="space-y-2.5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {finalText.map((item, index) => (
            <motion.div
              key={index}
              className="pl-3 border-l-[3px] border-accent
                bg-white/80 dark:bg-card/80
                text-foreground p-3.5 rounded-lg
                shadow-sm hover:shadow-md
                hover:bg-accent/5 dark:hover:bg-accent/10
                hover:border-accent
                transition-all duration-200 cursor-default mb-7"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
            >
              <p className="text-[10px] text-accent font-semibold mb-1.5 uppercase tracking-widest">
                {item.label}
              </p>
              <div className="flex items-start gap-2">
                {item.icon}
                <p className="leading-relaxed text-foreground/80">
                  {item.content}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

// ─── Section About ────────────────────────────────────────────────────────────
export default function About() {
  const { ref, inView } = useInViewObserver({ triggerOnce: true, threshold: 0.1 })

  let t: (key: string) => string = (key) => key
  let lang = 'fr'

  try {
    const ctx = useLanguage()
    t = ctx.t
    lang = (ctx as any).language ?? 'fr'
  } catch {}

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const stats = [
    { labelKey: 'about.stats_projects',     valueKey: 'about.stats_projects_value'     },
    { labelKey: 'about.stats_technologies', valueKey: 'about.stats_technologies_value' },
    { labelKey: 'about.stats_languages',    valueKey: 'about.stats_languages_value'    },
    { labelKey: 'about.stats_year',         valueKey: 'about.stats_year_value'         },
  ]

  const contacts = [
    { icon: <MailIcon size={14} className="shrink-0 text-accent" />,   value: t('personal.email'),    href: `mailto:${t('personal.email')}` },
    { icon: <PhoneIcon size={14} className="shrink-0 text-accent" />,  value: t('personal.phone'),    href: `tel:${t('personal.phone')}` },
    { icon: <MapPinIcon size={14} className="shrink-0 text-accent" />, value: t('personal.location'), href: null },
    { icon: <GithubIcon size={14} className="shrink-0 text-accent" />, value: 'GitHub',               href: t('personal.github') },
    { icon: <GlobeIcon size={14} className="shrink-0 text-accent" />,  value: t('personal.site'),     href: `https://${t('personal.site')}` },
  ]

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <SectionTitle title={t('about.title')} align="left" />

        <div className="grid md:grid-cols-2 gap-8 items-stretch">

          {/* ── Colonne gauche : TypewriterIntro ── */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <TypewriterIntro t={t} lang={lang} />
          </motion.div>

          {/* ── Colonne droite : Stats + description + contacts ── */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">

            {/* Bloc Stats */}
            <motion.div
              className="bg-white/70 dark:bg-card rounded-xl p-6
                border border-accent/20 shadow-md
                hover:shadow-lg hover:border-accent/40
                backdrop-blur-sm transition-all duration-300"
              whileHover={{ translateY: -2 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-5">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.labelKey}
                    initial={{ opacity: 0, x: -16 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col gap-0.5 p-3 rounded-lg bg-accent/5 dark:bg-accent/10 border border-accent/10"
                  >
                    <p className="text-2xl font-bold text-accent">
                      {t(stat.valueKey)}
                    </p>
                    <p className="text-sm font-medium text-foreground/60 leading-tight">
                      {t(stat.labelKey)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bloc Description */}
            <motion.div
              className="bg-white/70 dark:bg-card rounded-xl px-6 py-5
                border border-accent/20 shadow-md backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <p className="text-[10px] text-accent font-semibold mb-2 uppercase tracking-widest">
                {lang === 'fr' ? 'Profil' : 'Profile'}
              </p>
              <p className="text-foreground/70 leading-relaxed">
                {t('about.description')}
              </p>
            </motion.div>

            {/* Bloc Coordonnées */}
            <motion.div
              className="bg-white/70 dark:bg-card rounded-xl px-6 py-5
                border border-accent/20 shadow-md backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.65 }}
            >
              <p className="text-[10px] text-accent font-semibold mb-3 uppercase tracking-widest">
                {lang === 'fr' ? 'Coordonnées' : 'Contact Info'}
              </p>
              <div className="space-y-2">
                {contacts.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {item.icon}
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-xs text-foreground/70 hover:text-accent transition-colors truncate"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-xs text-foreground/70 truncate">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}