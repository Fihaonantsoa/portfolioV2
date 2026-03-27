'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '@/utils/language-context'
import { Calendar, Tag } from 'lucide-react'
import SectionTitle from '@/components/SectionTitle'

interface BlogPost {
  id: number
  title: string
  titleFr: string
  excerpt: string
  excerptFr: string
  date: string
  category: string
  categoryFr: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Building Scalable React Applications',
    titleFr: 'Construire des applications React évolutives',
    excerpt: 'Learn best practices for structuring large React applications with proper state management and component architecture.',
    excerptFr: 'Découvrez les meilleures pratiques pour structurer les grandes applications React avec une gestion d\'état appropriée et une architecture de composants.',
    date: '2024-03-15',
    category: 'React',
    categoryFr: 'React',
    slug: 'building-scalable-react',
  },
  {
    id: 2,
    title: 'Web Performance Optimization Tips',
    titleFr: 'Conseils d\'optimisation des performances Web',
    excerpt: 'Practical techniques to improve your web application\'s performance and user experience.',
    excerptFr: 'Techniques pratiques pour améliorer les performances et l\'expérience utilisateur de votre application web.',
    date: '2024-03-10',
    category: 'Performance',
    categoryFr: 'Performance',
    slug: 'web-performance-tips',
  },
  {
    id: 3,
    title: 'Getting Started with TypeScript',
    titleFr: 'Débuter avec TypeScript',
    excerpt: 'A comprehensive guide to TypeScript for JavaScript developers looking to add type safety to their projects.',
    excerptFr: 'Un guide complet de TypeScript pour les développeurs JavaScript cherchant à ajouter la sécurité des types à leurs projets.',
    date: '2024-03-05',
    category: 'TypeScript',
    categoryFr: 'TypeScript',
    slug: 'getting-started-typescript',
  },
  {
    id: 4,
    title: 'Next.js 14: What\'s New',
    titleFr: 'Next.js 14: Quoi de neuf',
    excerpt: 'Explore the latest features and improvements in Next.js 14 that make building modern web apps easier.',
    excerptFr: 'Explorez les dernières fonctionnalités et améliorations de Next.js 14 qui facilitent la création d\'applications web modernes.',
    date: '2024-02-28',
    category: 'Next.js',
    categoryFr: 'Next.js',
    slug: 'nextjs-14-whats-new',
  },
  {
    id: 5,
    title: 'API Design Best Practices',
    titleFr: 'Meilleures pratiques de conception d\'API',
    excerpt: 'Guidelines for designing robust, maintainable, and user-friendly REST APIs.',
    excerptFr: 'Directives pour concevoir des API REST robustes, maintenables et conviviales.',
    date: '2024-02-20',
    category: 'API',
    categoryFr: 'API',
    slug: 'api-design-best-practices',
  },
  {
    id: 6,
    title: 'Database Optimization Strategies',
    titleFr: 'Stratégies d\'optimisation des bases de données',
    excerpt: 'Learn how to optimize database queries and improve application performance.',
    excerptFr: 'Découvrez comment optimiser les requêtes de base de données et améliorer les performances de l\'application.',
    date: '2024-02-15',
    category: 'Database',
    categoryFr: 'Base de données',
    slug: 'database-optimization',
  },
]

export default function Blog() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  
  let language, t;
  try {
    const context = useLanguage();
    language = context.language;
    t = context.t;
  } catch {
    language = 'en';
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        'blog.title': 'Blog',
      };
      return fallbacks[key] || key;
    };
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <SectionTitle 
            title={t('blog.title')}
            align="center"
          />

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on web development
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.map((post) => {
            const title = language === 'fr' ? post.titleFr : post.title
            const excerpt = language === 'fr' ? post.excerptFr : post.excerpt
            const category = language === 'fr' ? post.categoryFr : post.category

            return (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="group relative"
              >
                <motion.a
                  href={`/blog/${post.slug}`}
                  className="h-full p-6 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors flex flex-col cursor-pointer"
                  whileHover={{
                    y: -8,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      {category}
                    </motion.div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors text-gray-600 dark:text-white">
                    {title}
                  </h3>

                  <p className="text-muted-foreground mb-6 flex-grow line-clamp-3">
                    {excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                    <span className="text-accent font-semibold group-hover:translate-x-1 transition-transform">
                      {t('blog.read_more')}
                    </span>
                  </div>
                </motion.a>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
