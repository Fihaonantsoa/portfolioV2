import React from 'react'
import { motion } from 'framer-motion'

interface LogoFProps {
  size?: number
  animated?: boolean
  strokeColor?: string
  fillColor?: string
  letterColor?: string
  backgroundColor?: string
  strokeWidth?: number
  className?: string
  onClick?: () => void
}

const LogoF: React.FC<LogoFProps> = ({ 
  size = 100,
  animated = false,
  strokeColor = "#38bdf8",
  fillColor = "#38bdf8",
  letterColor = "#38bdf8",
  backgroundColor = "#0f172e",
  strokeWidth = 4,
  className = "",
  onClick
}) => {
  
  const octogonPoints = "30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30"
  
  const SvgContent = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Octogone de fond */}
      <polygon
        points={octogonPoints}
        fill={backgroundColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      
      {/* Lettre F stylisée */}
      <path
        d="M35 25H65V32H43V45H62V52H43V75H35V25Z"
        fill={letterColor}
      />
    </svg>
  )

  // Version animée avec Framer Motion
  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ 
          duration: 1.5, 
          ease: "easeOut",
          scale: { type: "spring", damping: 15 }
        }}
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <SvgContent />
      </motion.div>
    )
  }

  // Version statique
  return <SvgContent />
}

// Version avec contour animé (pour l'effet spécial)
export const AnimatedLogoF: React.FC<LogoFProps> = (props) => {
  const { 
    size = 100,
    strokeColor = "#38bdf8",
    backgroundColor = "#0f172e",
    letterColor = "#38bdf8",
    strokeWidth = 4,
    ...rest 
  } = props

  const octogonPoints = "30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30"

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Octogone animé (contour seulement) */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="absolute top-0 left-0"
        {...rest}
      >
        <motion.polygon
          points={octogonPoints}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Logo statique avec fond transparent pour laisser voir le contour */}
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center"
        style={{ width: size, height: size }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fond transparent */}
          <polygon
            points={octogonPoints}
            fill="transparent"
            stroke="none"
          />
          {/* Lettre F */}
          <path
            d="M35 25H65V32H43V45H62V52H43V75H35V25Z"
            fill={letterColor}
          />
        </svg>
      </motion.div>
    </div>
  )
}

// Version avec effet de brillance
export const GlowingLogoF: React.FC<LogoFProps> = ({ 
  size = 100,
  strokeColor = "#38bdf8",
  letterColor = "#38bdf8",
  backgroundColor = "#0f172e",
  ...rest 
}) => {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ 
        boxShadow: [
          `0 0 20px ${strokeColor}40`,
          `0 0 40px ${strokeColor}80`,
          `0 0 20px ${strokeColor}40`
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <LogoF 
        size={size}
        strokeColor={strokeColor}
        letterColor={letterColor}
        backgroundColor={backgroundColor}
        {...rest}
      />
    </motion.div>
  )
}

// Version avec badge de notification
export const BadgedLogoF: React.FC<LogoFProps & { badgeCount?: number }> = ({ 
  size = 100,
  badgeCount,
  ...rest 
}) => {
  return (
    <div className="relative inline-block">
      <LogoF size={size} {...rest} />
      {badgeCount && badgeCount > 0 && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center px-1 font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </motion.div>
      )}
    </div>
  )
}

// Exemple d'utilisation avec différents styles
export const LogoFShowcase = () => {
  return (
    <div className="flex flex-wrap gap-8 p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <LogoF size={80} />
        <p className="text-sm mt-2">Standard</p>
      </div>
      
      <div className="text-center">
        <LogoF size={80} animated />
        <p className="text-sm mt-2">Animé</p>
      </div>
      
      <div className="text-center">
        <AnimatedLogoF size={80} />
        <p className="text-sm mt-2">Contour animé</p>
      </div>
      
      <div className="text-center">
        <GlowingLogoF size={80} />
        <p className="text-sm mt-2">Brillant</p>
      </div>
      
      <div className="text-center">
        <BadgedLogoF size={80} badgeCount={3} />
        <p className="text-sm mt-2">Avec badge</p>
      </div>
      
      <div className="text-center">
        <LogoF 
          size={80} 
          strokeColor="#10b981" 
          letterColor="#10b981"
          backgroundColor="#064e3b"
        />
        <p className="text-sm mt-2">Couleurs personnalisées</p>
      </div>
    </div>
  )
}

export default LogoF