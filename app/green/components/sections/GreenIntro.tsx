"use client"

import { useState, useEffect } from "react"
import { Sparkles, Star } from "lucide-react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { SplineBackground } from "@/components/shared/SplineBackground"
import { useTheme } from "@/hooks/useTheme"
import { useBrandTheme } from "@/components/theme-provider"
import { GreanButton } from "@/components/ui/grean-button"

// Custom hook for typing animation
function useTypewriter(text: string, speed = 50, delay = 0, shouldStart = true) {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Reset state when shouldStart changes
    if (!shouldStart) {
      setDisplayText("")
      setIsTyping(false)
      setIsComplete(false)
      return
    }

    let timeout: NodeJS.Timeout

    // Initial delay before starting typing
    timeout = setTimeout(() => {
      setIsTyping(true)

      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsTyping(false)
          setIsComplete(true)
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, speed, delay, shouldStart])

  return { displayText, isTyping, isComplete }
}

export default function GreenIntro() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [animationsStarted, setAnimationsStarted] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { isDark, isLight } = useTheme()
  const { isDarkMode } = useBrandTheme()

  // Start animations only after loading is complete
  useEffect(() => {
    if (loadingComplete) {
      const timer = setTimeout(() => {
        setAnimationsStarted(true)
      }, 800) // Small delay after loading completes
      return () => clearTimeout(timer)
    }
  }, [loadingComplete])

  // Initialize typing animations with our custom hook
  const titleAnimation = useTypewriter("GREAN WORLD", 120, 500, animationsStarted)
  const taglineAnimation = useTypewriter(
    "Pioneering Ethiopia's Sustainable Energy Revolution",
    60,
    2000,
    animationsStarted,
  )

  // Detect client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Simulate loading progress
    if (prefersReducedMotion) {
      setLoadingProgress(100)
      setLoadingComplete(true)
      return
    }
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  useEffect(() => {
    // If loading progress is complete, wait a moment then transition out the overlay
    if (loadingProgress === 100) {
      if (prefersReducedMotion) {
        setLoadingComplete(true)
        return
      }
      const timer = setTimeout(() => {
        setLoadingComplete(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [loadingProgress, prefersReducedMotion])

  return (
    <section
      id="green-intro"
      className="relative h-screen w-full overflow-hidden mb-0"
      style={{ clipPath: "inset(0)" }}
    >
      {/* Loading Overlay - Index Loading UI */}
      {!loadingComplete && !prefersReducedMotion && (
        <motion.div
          className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${
            isDarkMode ? 'bg-slate-950' : 'bg-white'
          }`}
          initial={{ opacity: 1 }}
          animate={{ opacity: loadingComplete ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            pointerEvents: loadingComplete ? "none" : "auto",
          }}
        >
          {/* Grean World Logo */}
          <div className="relative flex flex-col items-center justify-center mb-12">
            {/* Spinning Logo with Glow Effect */}
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${
                isDarkMode
                  ? 'bg-gradient-to-r from-grean-primary/25 to-grean-secondary/25'
                  : 'bg-gradient-to-r from-grean-secondary/25 to-grean-accent/25'
              }`}></div>
              <Image
                src="/images/grean-logo-icon.png"
                alt="GREAN WORLD Logo"
                width={80}
                height={80}
                className="relative z-10 object-contain drop-shadow-2xl animate-spin-slow"
              />
            </div>
            <h1 className={`text-3xl md:text-4xl font-extrabold text-center typography-h1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
            style={{
              filter: isDarkMode
                ? 'drop-shadow(0 0 15px rgba(61,213,109,0.6))'
                : 'drop-shadow(0 0 15px rgba(43,183,87,0.4))'
            }}>
              <span className={`bg-clip-text text-transparent ${
                isDarkMode
                  ? 'bg-gradient-to-r from-grean-accent via-grean-primary to-grean-secondary'
                  : 'bg-gradient-to-r from-grean-secondary via-grean-accent to-grean-primary'
              }`}>
                GREAN WORLD
              </span>
            </h1>
          </div>

          <div className={`relative w-64 h-1 rounded-full overflow-hidden mb-4 ${
            isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
          }`}>
            <div
              className={`h-full transition-all duration-300 ease-out ${
                isDarkMode
                  ? 'bg-gradient-to-r from-grean-primary to-grean-secondary'
                  : 'bg-gradient-to-r from-grean-secondary to-grean-accent'
              }`}
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className={`text-sm font-mono typography-small ${
            isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'
          }`}>Loading Green Energy... {Math.round(loadingProgress)}%</div>

          {/* Solar panel animation */}
          <div className="mt-8 relative">
            <div className={`w-32 h-32 border-2 rounded-lg relative overflow-hidden ${
              isDarkMode
                ? 'border-grean-primary/30'
                : 'border-grean-secondary/30'
            }`}>
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm animate-pulse ${
                      isDarkMode
                        ? 'bg-grean-primary/50'
                        : 'bg-grean-secondary/50'
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-8 border rounded-b-lg ${
              isDarkMode
                ? 'border-grean-primary/30 bg-slate-800'
                : 'border-grean-secondary/30 bg-gray-100'
            }`} />
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div
        className={`relative z-10 transition-opacity duration-700 ${
          loadingComplete || prefersReducedMotion ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Spline 3D Lightning Bulb Background */}
        <SplineBackground opacity={1} />

        {/* EXACT INVERTER CARD OVERLAY - No Modifications */}
        <div className="absolute inset-0 pointer-events-none z-40">
          {/* EXACT SVG Pattern from Inverter Card */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="inverter-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="8" fill={isDarkMode ? "#3DD56D" : "#2bb757"} fillOpacity="0.3"></circle>
              </pattern>
              <rect width="100%" height="100%" fill="url(#inverter-pattern)"></rect>
            </svg>
          </div>

          {/* EXACT Green Gradient from Inverter Card - Full Width Coverage */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: isDarkMode
                ? "linear-gradient(to right, rgba(61, 213, 109, 0.8) 0%, rgba(61, 213, 109, 0.4) 30%, transparent 50%)"
                : "linear-gradient(to right, rgba(43, 183, 87, 0.8) 0%, rgba(43, 183, 87, 0.4) 30%, transparent 50%)",
            }}
          ></div>
        </div>

        {/* GREAN WORLD Logo Header */}
        <div className="absolute top-0 left-0 z-[100] pt-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start">
            <div className="flex-shrink-0 items-center gap-3 relative z-[101]" style={{ opacity: 1, transform: 'none' }}>
              <div className="flex items-center">
                <div className="flex items-center">
                  <motion.div
                    className="logo-container relative mr-3"
                    tabIndex={0}
                    style={{ transform: 'none' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <div className="logo-glow-effect"></div>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 logo-spin z-[102]">
                      <Image
                        src="/logos/grean-world-logo.png"
                        alt="GREAN WORLD Logo"
                        width={48}
                        height={48}
                        loading="eager"
                        decoding="sync"
                        data-nimg="1"
                        className="object-contain relative z-[103]"
                        style={{ color: 'transparent', display: 'block' }}
                        priority
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="flex flex-col relative z-[102]">
                      <div className="flex items-center">
                        <span className="text-[#3DD56D] text-xl sm:text-2xl font-bold tracking-wide drop-shadow-lg">
                          GREAN
                        </span>
                        <span className="text-xl sm:text-2xl font-bold tracking-wide ml-1 text-white drop-shadow-lg">
                          WORLD
                        </span>
                      </div>
                      <p className="text-xs tracking-wide text-gray-300 drop-shadow-md">
                        ENERGY TECHNOLOGY
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Hero Content - POINTER EVENTS NONE ON CONTAINER */}
        <div className="hero-overlay relative z-50 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="text-center max-w-6xl mx-auto">
            {/* Premium Badge - POINTER EVENTS AUTO ONLY ON INTERACTIVE ELEMENTS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm pointer-events-auto typography-small ${
                isDarkMode
                  ? 'text-grean-primary border-grean-primary/20 bg-white/10'
                  : 'text-grean-secondary border-grean-secondary/20 bg-green-50/80'
              }`}
            >
              <Star className={`w-3 h-3 mr-2 ${
                isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'
              }`} />
              <span className={`font-semibold ${
                isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'
              }`}>Premium Energy Solutions</span>
              <Sparkles className={`w-3 h-3 ml-2 ${
                isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'
              }`} />
            </motion.div>

            {/* Main Company Title - POINTER EVENTS AUTO FOR TEXT SELECTION */}
            <motion.div
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-none tracking-tight text-center mb-6 pointer-events-auto typography-display"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: loadingComplete ? 1 : 0, scale: loadingComplete ? 1 : 0.9 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              {/* Fixed height container for title typing animation */}
              <div className="relative inline-block min-h-[1.2em] min-w-[8ch] flex items-center justify-center">
                <span
                  className={`font-black ${
                    isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'
                  }`}
                  style={{
                    textShadow: isDarkMode
                      ? "0 2px 4px rgba(0, 0, 0, 0.3)"
                      : "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {animationsStarted ? titleAnimation.displayText : ""}
                  <span
                    className={`inline-block w-2 h-[0.8em] ml-1 align-middle ${
                      isDarkMode ? 'bg-grean-primary' : 'bg-grean-secondary'
                    } ${
                      titleAnimation.isTyping && animationsStarted ? "animate-blink" : "opacity-0"
                    }`}
                  ></span>
                </span>
              </div>
            </motion.div>

            {/* Clean Tagline - POINTER EVENTS AUTO FOR TEXT SELECTION */}
            <motion.div
              className="text-xl md:text-2xl lg:text-3xl text-center mb-8 max-w-4xl mx-auto pointer-events-auto typography-h2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {/* Fixed height container for tagline typing animation */}
              <div className="relative min-h-[1.5em] flex items-center justify-center">
                <span
                  className={`font-light tracking-wide leading-relaxed ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}
                  style={{
                    textShadow: isDarkMode ? "0 1px 3px rgba(0, 0, 0, 0.5)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {animationsStarted ? taglineAnimation.displayText : ""}
                  <span
                    className={`inline-block w-1 h-[0.8em] ml-1 align-middle ${
                      isDarkMode ? 'bg-white' : 'bg-gray-800'
                    } ${
                      taglineAnimation.isTyping && animationsStarted ? "animate-blink" : "opacity-0"
                    }`}
                  ></span>
                </span>
                {taglineAnimation.isComplete && animationsStarted && (
                  <motion.div
                    className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full ${
                      isDarkMode ? 'bg-grean-primary' : 'bg-grean-secondary'
                    }`}
                    initial={{ width: "0%" }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-blink {
          animation: blink 0.8s step-end infinite;
        }

        /* Logo container styles */
        .logo-container {
          position: relative;
          overflow: visible;
        }

        .logo-glow-effect {
          position: absolute;
          inset: -5px;
          background: radial-gradient(
            circle,
            rgba(61, 213, 109, 0.4) 0%,
            rgba(61, 213, 109, 0) 70%
          );
          opacity: 0;
          transition: opacity 0.5s ease;
          border-radius: 50%;
          z-index: -1;
        }

        .logo-container:hover .logo-glow-effect {
          opacity: 1;
        }

        /* Logo spin animation */
        .logo-spin {
          animation: logoRotate 30s linear infinite;
          filter: drop-shadow(0 0 10px rgba(61, 213, 109, 0.4));
        }

        .logo-spin:hover {
          animation-duration: 15s;
          filter: drop-shadow(0 0 15px rgba(61, 213, 109, 0.6));
        }

        @keyframes logoRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}
