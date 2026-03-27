'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface SectionTitleProps {
  title: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

export default function SectionTitle({ 
  title, 
  align = 'center',
  className = ''
}: SectionTitleProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={`mb-8 ${alignClasses[align]} ${className}`}
    >
      <h2 className="text-2xl lg:text-3xl md:text-4xl font-bold text-foreground text-gray-600 dark:text-white">
        {title}
      </h2>
    </motion.div>
  )
}