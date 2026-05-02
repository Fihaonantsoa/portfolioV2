'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2, WifiOff } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ─── Configuration OpenRouter ─────────────────────────────────────────────────
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// openrouter/free en tête : router officiel qui choisit parmi tous les modèles gratuits
// disponibles — ne donne jamais de 404. Les suivants sont des fallbacks spécifiques vérifiés.
const FREE_MODELS = [
  'openrouter/free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1:free',
  'google/gemma-3-12b-it:free',
  'qwen/qwen3-8b:free',
]

const SYSTEM_PROMPT = `Tu es l'assistant personnel de Fihaonantsoa (RAFANOMANANA Ainamirindra Fihaonantsoa), 
un développeur web passionné basé à Madagascar.

Voici ce que tu sais sur lui :
- Compétences principales : React/Next.js, TypeScript, Node.js, TailwindCSS (web), C++, C#, Python, Java (desktop), Linux/Unix, Bash, Docker, CI/CD (systèmes), algorithmique et structures de données
- Profil GitHub : github.com/FIhaonantsoa
- Actuellement disponible pour des missions, projets ou collaborations
- Étudiant en informatique passionné par le développement web et les nouvelles technologies
- Etudiant en Génie Logiciel et bases de données à l'École Nationale d'Informatique à Fianarantsoa

Comportement attendu :
- Réponds de façon professionnelle, chaleureuse et concise
- Réponds en français par défaut, adapte-toi si le visiteur parle une autre langue
- Pour toute question sur un projet précis, un tarif ou un délai, oriente poliment vers le formulaire de contact
- Ne jamais inventer d'informations non listées ci-dessus
- N'utilise pas de réponses en gras ou en italique, reste simple et direct
- Si tu ne connais pas la réponse, dis-le clairement et propose de contacter Ainamirindra pour plus d'informations`

// ─── Réponses locales de secours (UNIQUEMENT en cas d'erreur API) ─────────────
const LOCAL_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['bonjour', 'salut', 'hello', 'hi', 'bonsoir'],
    response: "Bonjour ! Je suis l'assistant d'Ainamirindra. Que souhaitez-vous savoir ?",
  },
  {
    keywords: ['compétence', 'competence', 'skill', 'technologie', 'tech', 'stack'],
    response:
      "Ainamirindra maîtrise :\nFrontend — React, Next.js, TailwindCSS\nBackend — Node.js, Python\nBases de données — MySQL, PostgreSQL\nOutils — Git, Docker, Linux\n\nConsultez la section Compétences pour plus de détails.",
  },
  {
    keywords: ['projet', 'project', 'réalisation', 'travaux'],
    response:
      "Projets d'Ainamirindra :\n• Gestion eau & électricité — Application web de suivi des paiements\n• Gestion des notes — Application desktop pour les notes d'examen\n• Stage INSTAT — Plateforme de gestion hiérarchique des fichiers d'enquête (Laravel + React)\n\nConsultez la section Projets pour plus de détails.",
  },
  {
    keywords: ['expérience', 'experience', 'stage', 'instat', 'travail'],
    response:
      "Ainamirindra a effectué un stage à l'INSTAT Madagascar (DSIC) du 1er septembre au 30 novembre 2025. Il a développé une application web de gestion hiérarchique des fichiers d'enquête avec Laravel (API REST) et React, intégrant un système de permissions aligné sur la hiérarchie administrative nationale.",
  },
  {
    keywords: ['formation', 'étude', 'etude', 'education', 'eni', 'diplôme', 'diplome'],
    response:
      "Ainamirindra est en 3ème année de Licence Professionnelle en Informatique à l'ENI de Fianarantsoa. Il a obtenu son Baccalauréat Série S (mention Assez-Bien) au Lycée Nanisana en 2023, et possède un diplôme de français niveau B1.",
  },
  {
    keywords: ['contact', 'email', 'mail', 'joindre', 'contacter', 'message'],
    response:
      "Vous pouvez contacter Ainamirindra via :\nEmail : fihaonantsoacgm@gmail.com\nTél : +261 38 39 325 56\nSite : www.fihaonantsoa.vercel.app\n\nOu utilisez le formulaire de contact en bas de cette page.",
  },
  {
    keywords: ['disponible', 'disponibilité', 'libre', 'recrutement', 'embauche', 'freelance'],
    response:
      "Ainamirindra est disponible pour des opportunités de stage, de collaboration ou de freelance. Contactez-le à fihaonantsoacgm@gmail.com ou via le formulaire de contact.",
  },
  {
    keywords: ['github', 'code', 'repository', 'repo'],
    response: "Retrouvez les projets d'Ainamirindra sur GitHub :\nhttps://github.com/FIhaonantsoa",
  },
  {
    keywords: ['madagascar', 'localisation', 'location', 'où', 'ou', 'pays'],
    response:
      "Ainamirindra est basé à Fianarantsoa, Madagascar. Il est originaire d'Antananarivo.",
  },
  {
    keywords: ['âge', 'age', 'né', 'naissance', 'ans'],
    response: "Ainamirindra est né le 5 mars 2008, il a 18 ans.",
  },
  {
    keywords: ['merci', 'thank', 'thanks', 'parfait', 'super', 'génial', 'cool'],
    response: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions.",
  },
  {
    keywords: ['qui', 'présente', 'présentation', 'profil', 'about', 'à propos'],
    response:
      "Ainamirindra RAFANOMANANA est un étudiant en 3ème année de Licence en Informatique à l'ENI Fianarantsoa, Madagascar. Passionné par le développement web fullstack, il maîtrise React, Next.js, Node.js et plusieurs autres technologies modernes.",
  },
  {
    keywords: ['langue', 'language', 'parle', 'malagasy', 'français', 'anglais'],
    response:
      "Ainamirindra parle 3 langues :\nMalagasy (langue maternelle)\nFrançais (courant, niveau B1 certifié)\nAnglais (notions)",
  },
  {
    keywords: ['cv', 'curriculum', 'vitae', 'télécharger', 'download'],
    response:
      "Vous pouvez télécharger le CV d'Ainamirindra directement depuis la section Hero du portfolio (bouton 'Télécharger le CV').",
  },
  {
    keywords: ['prix', 'tarif', 'coût', 'cout', 'combien', 'devis'],
    response:
      "Pour connaître les tarifs ou obtenir un devis, contactez Ainamirindra directement :\nEmail : fihaonantsoacgm@gmail.com\nTél : +261 38 39 325 56",
  },
]

function getLocalResponse(input: string): string {
  const lower = input.toLowerCase().trim()

  for (const item of LOCAL_RESPONSES) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.response
    }
  }

  if (lower.length < 4) {
    return 'Pourriez-vous préciser votre question ? Je ferai de mon mieux pour vous répondre.'
  }

  if (lower.includes('?')) {
    return `Je n'ai pas la réponse à cette question en mode hors-ligne.\n\nPour une réponse précise, contactez Ainamirindra :\nEmail : fihaonantsoacgm@gmail.com\nTél : +261 38 39 325 56\n\nOu utilisez le formulaire de contact.`
  }

  return "Je ne peux pas répondre précisément à cela.\n\nVoici ce que je peux vous dire :\n• Compétences — React, Next.js, Node.js, TypeScript...\n• Stage — INSTAT Madagascar (2025)\n• Contact — fihaonantsoacgm@gmail.com\n\nPosez-moi une question sur ces sujets !"
}

// ─── Appel OpenRouter avec rotation de modèles et fallback local ──────────────
async function tryModel(
  model: string,
  conversationMessages: { role: string; content: string }[],
  apiKey: string
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      'X-Title': 'Portfolio Ainamirindra',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationMessages,
      ],
      max_tokens: 512,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errMsg = errorData?.error?.message || response.statusText
    throw new Error(`${response.status}:${errMsg}`)
  }

  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('empty_response')
  return text
}

async function callOpenRouter(messages: Message[]): Promise<{ text: string; isLocal: boolean }> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY

  if (!apiKey) {
    console.warn('Clé API OpenRouter manquante, passage en mode hors-ligne.')
    const lastUserMsg = messages[messages.length - 1]?.content || ''
    return { text: getLocalResponse(lastUserMsg), isLocal: true }
  }

  const conversationMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))

  // Essayer chaque modèle dans l'ordre — passer au suivant si 429 ou erreur
  for (let i = 0; i < FREE_MODELS.length; i++) {
    const model = FREE_MODELS[i]
    try {
      const text = await tryModel(model, conversationMessages, apiKey)
      return { text, isLocal: false }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      // Passer au modèle suivant si : 429 (quota), 404 (modèle retiré), ou erreur provider
      const is429 = msg.startsWith('429') || msg.includes('rate') || msg.includes('quota')
      const is404 = msg.startsWith('404') || msg.includes('No endpoints')
      const shouldRetry = is429 || is404
      const isLast = i === FREE_MODELS.length - 1

      if (shouldRetry && !isLast) {
        console.warn(`Modèle saturé (429): ${model}, passage au suivant...`)
        continue
      }
      // Dernière tentative échouée ou erreur non-429 → fallback local
      console.error(`Erreur modèle ${model}:`, msg)
      break
    }
  }

  const lastUserMsg = messages[messages.length - 1]?.content || ''
  return { text: getLocalResponse(lastUserMsg), isLocal: true }
}

// ─── Composant Message ────────────────────────────────────────────────────────
function ChatMessage({ message, isLocal }: { message: Message; isLocal?: boolean }) {
  const isUser = message.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow
          ${isUser ? 'bg-accent text-white' : 'bg-card border border-border text-accent'}`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      <div className={`flex flex-col gap-0.5 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line
            ${
              isUser
                ? 'bg-accent text-white rounded-tr-sm'
                : 'bg-card text-foreground border border-border rounded-tl-sm'
            }`}
        >
          {message.content}
        </div>
        {isLocal && !isUser && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <WifiOff className="w-2.5 h-2.5" />
            Mode hors-ligne
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ─── Composant principal ChatBot ──────────────────────────────────────────────
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Bonjour ! Je suis l'assistant d'Ainamirindra. Comment puis-je vous aider ?",
      timestamp: new Date(),
    },
  ])
  const [localFlags, setLocalFlags] = useState<Record<string, boolean>>({})
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const { text: reply, isLocal } = await callOpenRouter(updatedMessages)
      const aiId = `ai-${Date.now()}`

      setMessages((prev) => [
        ...prev,
        { id: aiId, role: 'assistant', content: reply, timestamp: new Date() },
      ])

      if (isLocal) {
        setLocalFlags((prev) => ({ ...prev, [aiId]: true }))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasOfflineMessage = Object.values(localFlags).some(Boolean)

  return (
    <>
      {/* ── Bouton flottant ── */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl
          bg-accent flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        aria-label={isOpen ? 'Fermer le chatbot' : 'Ouvrir le chatbot'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
        )}
      </motion.button>

      {/* ── Fenêtre du chat ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatwindow"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px]
              flex flex-col rounded-lg shadow-2xl overflow-hidden border border-border bg-background"
          >
            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-5 py-4 bg-card border-b border-border flex-shrink-0">
              <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-600 dark:text-white leading-none">
                  Assistant IA
                </p>
                {hasOfflineMessage && (
                  <p className="text-[10px] text-amber-500 mt-0.5 flex items-center gap-1">
                    <WifiOff className="w-2.5 h-2.5" />
                    Mode hors-ligne actif
                  </p>
                )}
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileTap={{ scale: 0.9 }}
                className="w-7 h-7 rounded-md flex items-center justify-center
                  text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} isLocal={localFlags[msg.id]} />
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1.5">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-accent/50"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2 border border-destructive/20"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-border bg-card">
              <div
                className="flex items-center gap-2 bg-background rounded-lg px-3 py-2
                border border-border focus-within:border-accent/50 transition-colors"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question…"
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
                  maxLength={500}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  whileTap={{ scale: 0.88 }}
                  className="w-7 h-7 rounded-md bg-accent flex items-center justify-center text-white
                    disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  aria-label="Envoyer"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </motion.button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                Entrée pour envoyer
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}