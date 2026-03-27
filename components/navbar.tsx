'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/utils/language-context'
import LogoF from './LogoF'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  let language, setLanguage, t;
  try {
    const langContext = useLanguage();
    language = langContext.language;
    setLanguage = langContext.setLanguage;
    t = langContext.t;
  } catch {
    language = 'en';
    setLanguage = () => {};
    t = (key: string) => key;
  }

  useEffect(() => {
    setMounted(true)

    // Observer pour détecter la section active
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: '-40% 0px -60% 0px' }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href')
    if (href?.startsWith('#')) {
      setIsOpen(false)
      setActiveSection(href)
      // Délai pour laisser l'animation du menu se terminer avant le scroll
      setTimeout(() => {
        const element = document.querySelector(href)
        element?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  const navItems = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.skills'), href: '#skills' },
    { label: t('nav.projects'), href: '#projects' },
    { label: t('nav.experience'), href: '#experience' },
    { label: t('nav.education'), href: '#education' },
    // { label: t('nav.blog'), href: '#blog' },
    { label: t('nav.contact'), href: '#contact' },
  ]

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <LogoF animated
              size={40} 
              strokeColor="#00c50a" 
              letterColor="#00c50a"
              backgroundColor="#002609"/>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <motion.nav
      className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 bg-gray-00 dark:bg-transparent"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0 font-bold text-xl text-accent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <LogoF
              size={40} 
              strokeColor="#00c50a" 
              letterColor="#00c50a"
              backgroundColor="#002609"/>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={handleNavClick}
                    className={`
                      relative px-3 py-2 rounded-md text-sm font-medium
                      transition-colors duration-200 group
                      ${isActive
                        ? 'text-accent font-semibold'
                        : 'text-foreground/70 hover:text-accent'
                      }
                    `}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    {item.label}

                    {/* Border-bottom : actif (toujours visible) */}
                    {isActive && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full"
                        layoutId="activeUnderline"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Border-bottom : hover (slide left → right), uniquement si non actif */}
                    {!isActive && (
                      <span
                        className="
                          absolute bottom-0 left-0 h-[2px] bg-accent/50 rounded-full
                          w-0 group-hover:w-full
                          transition-[width] duration-300 ease-out
                        "
                      />
                    )}
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Theme Toggle, Language Switcher, and Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <motion.button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="p-2 rounded-md hover:bg-card transition-colors flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Change language"
              >
                <Globe className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold text-accent hidden sm:inline">
                  {language.toUpperCase()}
                </span>
              </motion.button>

              <motion.div
                initial={false}
                animate={{
                  opacity: isLanguageOpen ? 1 : 0,
                  y: isLanguageOpen ? 0 : -10,
                  pointerEvents: isLanguageOpen ? 'auto' : 'none',
                }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg z-50"
              >
                <button
                  onClick={() => { setLanguage('en'); setIsLanguageOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    language === 'en'
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-foreground hover:bg-card/50'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => { setLanguage('fr'); setIsLanguageOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors border-t border-border ${
                    language === 'fr'
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-foreground hover:bg-card/50'
                  }`}
                >
                  Français
                </button>
              </motion.div>
            </div>

            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md hover:bg-card transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-accent" />
                )}
              </motion.button>
            )}

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md hover:bg-card transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`
                    block px-3 py-2 rounded-md text-base font-medium transition-colors
                    border-l-2
                    ${isActive
                      ? 'text-accent font-semibold border-accent bg-accent/5'
                      : 'text-foreground hover:text-accent hover:bg-card border-transparent'
                    }
                  `}
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}