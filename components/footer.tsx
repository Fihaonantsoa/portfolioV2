'use client'

import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '@/utils/language-context'

export default function Footer() {
  
  let t;
  try {
    ({ t } = useLanguage());
  } catch {
    t = (key: string) => key;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-background bg-gray-00 dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground text-center text-xs md:text-sm lg:text-md md:text-left">
              {t('footer.made_with')} RAFANOMANANA Ainamirindra Fihaonantsoa
            </p>
          </motion.div>

          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-6 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg text-accent transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span>{t('footer.back_to_top')}</span>
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
