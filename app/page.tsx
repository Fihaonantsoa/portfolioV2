'use client'

import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import About from '@/components/about'
import Skills from '@/components/skills'
import Projects from '@/components/projects'
import Experience from '@/components/experience'
import Education from '@/components/education'
import Blog from '@/components/blog'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
import ChatBot from '@/components/ChatBot'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-gray-00 dark:bg-transparent">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      {/* <Blog /> */}
      <Contact />
      <Footer />
      <ChatBot /> 
    </div>
  )
}
