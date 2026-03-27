'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Github, Facebook, Phone, MapPin, Globe, Linkedin } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/utils/language-context'
import SectionTitle from '@/components/SectionTitle'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  let t: (key: string) => string
  try {
    ({ t } = useLanguage())
  } catch {
    t = (key: string) => key
  }

  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formState.name,
          from_email: formState.email,
          message: formState.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      setStatus('success')
      setFormState({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error('EmailJS error:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  }

  const contactInfo = [
    { icon: Mail,    label: t('contact.my_email'),    href: `mailto:${t('contact.my_email')}` },
    { icon: Phone,   label: t('contact.my_phone'),    href: `tel:${t('contact.my_phone')}` },
    { icon: Globe,   label: t('contact.my_site'),     href: `https://${t('contact.my_site')}` },
    { icon: MapPin,  label: t('contact.my_location'), href: undefined },
  ]

  const socialLinks = [
    { icon: Github,   label: 'GitHub',   href: 'https://github.com/Fihaonantsoa' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/ainamirindra.rafanomanana' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/ainamirindrafihaonantsoarafanomanana' },
  ]

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Titre */}
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-balance"
          variants={itemVariants}
        >
          <SectionTitle title={t('contact.title')} align="left" />
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* ── Colonne gauche : infos + réseaux ── */}
          <motion.div className="space-y-6" variants={itemVariants}>

            <div className="p-8 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground mb-6 text-sm">
                {t('contact.description')}
              </p>

              {/* Infos de contact */}
              <div className="space-y-3">
                {contactInfo.map(({ icon: Icon, label, href }) => (
                  <div key={label}>
                    {href ? (
                      <motion.a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group"
                        whileHover={{ x: 4 }}
                      >
                        <span className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-accent" />
                        </span>
                        <span className="text-sm text-muted-foreground group-hover:text-accent transition-colors break-all">
                          {label}
                        </span>
                      </motion.a>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-accent" />
                        </span>
                        <span className="text-sm text-muted-foreground">{label}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="p-8 bg-card rounded-lg border border-border">
              <h3 className="text-base font-bold text-gray-600 dark:text-white mb-4">
                {t('contact.other_contact')}
              </h3>
              <div className="space-y-3">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/50 transition-colors group"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-sm text-gray-600 dark:text-white">{label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Colonne droite : formulaire ── */}
          <motion.div
            className="p-8 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors"
            variants={itemVariants}
            whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-600 dark:text-white mb-6">
              {t('contact.box_title')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t('contact.name_label')}
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors text-sm"
                  placeholder={t('contact.name_placeholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t('contact.email_label')}
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors text-sm"
                  placeholder={t('contact.email_placeholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t('contact.message_label')}
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors resize-none text-sm"
                  placeholder={t('contact.message_placeholder')}
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className="w-full px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold text-sm
                  hover:shadow-lg transition-shadow disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'sending'
                  ? t('contact.sending')
                  : status === 'success'
                  ? t('contact.success')
                  : t('contact.send')}
              </motion.button>

              {status === 'error' && (
                <p className="text-xs text-destructive text-center">{t('contact.error')}</p>
              )}
            </form>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}