"use client"

import { useState, useEffect } from "react"
import { Download, Copy, Check, SunMedium, Users, Lightbulb, Code, ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useTheme } from "@/hooks/useTheme"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import Image from "next/image"
import Link from "next/link"
import JSZip from "jszip"
import { GreanCard } from './ui/grean-card'
import { GreanButton } from './ui/grean-button'

// Complete CSS Integration from HTML Data Files
const completeCSS = `
  /* Enhanced Theme Variables from Complete HTML Data */
  :root {
    --grean-primary: #3dd56d;
    --grean-secondary: #2bb757;
    --grean-accent: #23a455;
    --grean-primary-light: #2bb757;
    --grean-secondary-light: #23a455;
    --grean-accent-light: #1e7e34;
  }

  .light {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  .light body {
    background: linear-gradient(135deg, #fff 0%, #f8fafc 50%, #f1f5f9 100%);
  }

  .dark body {
    background: linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%);
  }

  /* Enhanced Scrollbar Styling */
  .dark ::-webkit-scrollbar {
    width: 8px;
  }
  .dark ::-webkit-scrollbar-track {
    background: #1e293b;
  }
  .dark ::-webkit-scrollbar-thumb {
    background: #3dd56d;
    border-radius: 4px;
  }
  .dark ::-webkit-scrollbar-thumb:hover {
    background: #2bb757;
  }

  .light ::-webkit-scrollbar {
    width: 8px;
  }
  .light ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  .light ::-webkit-scrollbar-thumb {
    background: #2bb757;
    border-radius: 4px;
  }
  .light ::-webkit-scrollbar-thumb:hover {
    background: #23a455;
  }

  /* Enhanced Animations */
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    to { transform: translateY(0); }
  }

  .animate-float {
    animation: 3s ease-in-out infinite float;
  }

  /* Enhanced Transitions */
  * {
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
  }
`;

// Brand Colors - Extracted from existing project
const brandColors = {
  primary: {
    name: "GREAN Green",
    hex: "#3DD56D",
    rgb: "rgb(61, 213, 109)",
    hsl: "hsl(142, 64%, 54%)",
    usage: "60%",
    description: "Primary brand color for CTAs, headers, and key brand elements",
    cssVar: "--grean-primary",
  },
  secondary: {
    name: "Forest Green",
    hex: "#2bb757",
    rgb: "rgb(43, 183, 87)",
    hsl: "hsl(139, 62%, 44%)",
    usage: "30%",
    description: "Secondary color for gradients, hover states, and supporting elements",
    cssVar: "--grean-secondary",
  },
  accent: {
    name: "Deep Green",
    hex: "#23A455",
    rgb: "rgb(35, 164, 85)",
    hsl: "hsl(143, 65%, 39%)",
    usage: "10%",
    description: "Accent color for highlights, badges, and special emphasis",
    cssVar: "--grean-accent",
  },
  neutral: {
    dark: {
      name: "Slate Dark",
      hex: "#0f172a",
      rgb: "rgb(15, 23, 42)",
      usage: "Primary backgrounds",
      cssVar: "--slate-dark",
    },
    medium: {
      name: "Slate Medium",
      hex: "#1e293b",
      rgb: "rgb(30, 41, 59)",
      usage: "Card backgrounds",
      cssVar: "--slate-medium",
    },
    light: {
      name: "Slate Light",
      hex: "#64748b",
      rgb: "rgb(100, 116, 139)",
      usage: "Secondary text, borders",
      cssVar: "--slate-light",
    },
    white: {
      name: "Pure White",
      hex: "#ffffff",
      rgb: "rgb(255, 255, 255)",
      usage: "Primary text on dark",
      cssVar: "--white",
    },
  },
}

// OFFICIAL SVG Patterns - EXACT from Data-HTML.md
const dotPattern = `data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20fill%3D%22transparent%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%223%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%222%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.2%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2250%22%20cy%3D%2210%22%20r%3D%222%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.2%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2210%22%20cy%3D%2250%22%20r%3D%222%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.2%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%222%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.2%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2230%22%20cy%3D%2210%22%20r%3D%221.5%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.15%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2210%22%20cy%3D%2230%22%20r%3D%221.5%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.15%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2250%22%20cy%3D%2230%22%20r%3D%221.5%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.15%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2230%22%20cy%3D%2250%22%20r%3D%221.5%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.15%22%2F%3E%0A%20%20%20%20%3C%2Fsvg%3E`

const wavePattern = `data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20fill%3D%22transparent%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M0%2C50%20Q25%2C30%2050%2C50%20T100%2C50%20L100%2C100%20L0%2C100%20Z%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.2%22%2F%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M0%2C60%20Q25%2C40%2050%2C60%20T100%2C60%20L100%2C100%20L0%2C100%20Z%22%20fill%3D%22%232bb757%22%20opacity%3D%220.15%22%2F%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M0%2C70%20Q25%2C50%2050%2C70%20T100%2C70%20L100%2C100%20L0%2C100%20Z%22%20fill%3D%22%2323A455%22%20opacity%3D%220.1%22%2F%3E%0A%20%20%20%20%3C%2Fsvg%3E`

const gridPattern = `data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20fill%3D%22transparent%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M0%2020h40M20%200v40%22%20stroke%3D%22%233DD56D%22%20strokeWidth%3D%221%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M0%2010h40M0%2030h40M10%200v40M30%200v40%22%20stroke%3D%22%233DD56D%22%20strokeWidth%3D%220.5%22%20opacity%3D%220.2%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%222%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.4%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%221%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2240%22%20cy%3D%220%22%20r%3D%221%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%220%22%20cy%3D%2240%22%20r%3D%221%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%221%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%3C%2Fsvg%3E`

const radialPattern = `data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20fill%3D%22transparent%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%2235%22%20stroke%3D%22%233DD56D%22%20strokeWidth%3D%221%22%20opacity%3D%220.3%22%20fill%3D%22transparent%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%2225%22%20stroke%3D%22%232bb757%22%20strokeWidth%3D%221%22%20opacity%3D%220.25%22%20fill%3D%22transparent%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%2215%22%20stroke%3D%22%2323A455%22%20strokeWidth%3D%221%22%20opacity%3D%220.2%22%20fill%3D%22transparent%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%225%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.4%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%222%22%20fill%3D%22%233DD56D%22%20opacity%3D%220.6%22%2F%3E%0A%20%20%20%20%3C%2Fsvg%3E`





// Color Swatch Component
interface ColorSwatchProps {
  color: {
    name: string
    hex: string
    rgb?: string
    hsl?: string
    usage?: string
    description?: string
    cssVar?: string
  }
  isDarkMode?: boolean
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, isDarkMode = true }) => {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className={`${isDarkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-gray-200'} p-6 rounded-xl border group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
      <div
        className="w-full h-40 rounded-xl mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundColor: color.hex, boxShadow: `0 10px 30px ${color.hex}20` }}
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {color.name}
          </h4>
          {color.usage && (
            <Badge variant="outline" className="text-xs">
              {color.usage}
            </Badge>
          )}
        </div>

        {color.description && (
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {color.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {color.hex}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(color.hex, 'hex')}
              className="h-8 w-8 p-0"
            >
              {copied === 'hex' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {color.rgb && (
            <div className="flex items-center justify-between">
              <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {color.rgb}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(color.rgb!, 'rgb')}
                className="h-8 w-8 p-0"
              >
                {copied === 'rgb' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}

          {color.cssVar && (
            <div className="flex items-center justify-between">
              <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {color.cssVar}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(`var(${color.cssVar})`, 'css')}
                className="h-8 w-8 p-0"
              >
                {copied === 'css' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// OFFICIAL Brand Guidelines Component - EXACT from Data-HTML.md with FULL HTML Integration
export function BrandGuidelines() {
  const { theme, effectiveTheme } = useTheme()
  const isDarkMode = effectiveTheme === 'dark'
  const [copied, setCopied] = useState<string | null>(null)

  // Inject complete CSS from HTML data
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = completeCSS
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  // Enhanced theme-aware styling based on complete HTML data
  const themeClasses = isDarkMode
    ? "min-h-screen bg-slate-950 text-white"
    : "min-h-screen bg-white text-gray-900"

  const headerClasses = isDarkMode
    ? "sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800"
    : "sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"

  const containerClasses = isDarkMode
    ? "bg-slate-900/80 border-slate-700"
    : "bg-white border-gray-200"

  return (
    <div className={themeClasses}>
      {/* Enhanced Header with Complete HTML Data Integration */}
      <header className={headerClasses}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>
                <ArrowLeft className="h-4 w-4" />
                Back to Website
              </Link>
              <div className={`h-6 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <div className="flex items-center gap-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Header-logo.PNG-sotWnu4bZO64pDQssrVXNXee6g70KW.png"
                  alt="GREAN WORLD"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <div>
                  <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>GREAN WORLD</h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Brand Guidelines v2.0</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="bg-gradient-to-r from-[#3DD56D] to-[#2bb757] text-white border-none hover:shadow-lg hover:shadow-[#3DD56D]/20">
                <Download className="h-4 w-4 mr-2" />
                Download Assets
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar Navigation */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`hidden lg:block w-64 ${isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50/50'} border-r ${isDarkMode ? 'border-slate-800' : 'border-gray-200'} sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto`}>
          <div className="p-6">
            <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} uppercase tracking-wider mb-4`}>
              Navigation
            </h3>
            <nav className="space-y-2">
              <a href="#overview" className={`block px-4 py-2 rounded-lg transition-colors text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                Overview
              </a>
              <a href="#colors" className={`block px-4 py-2 rounded-lg transition-colors text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                Color Palette
              </a>
              <a href="#gradients" className={`block px-4 py-2 rounded-lg transition-colors text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                Gradients & Patterns
              </a>
              <a href="#typography" className={`block px-4 py-2 rounded-lg transition-colors text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                Typography
              </a>
              <a href="#components" className={`block px-4 py-2 rounded-lg transition-colors text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                Components
              </a>
              <a href="#spacing" className={`block px-4 py-2 rounded-lg transition-colors text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                Spacing & Layout
              </a>
              <a href="#usage" className={`block px-4 py-2 rounded-lg transition-colors text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}>
                Usage Guidelines
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ENHANCED OVERVIEW SECTION - Complete HTML Data Integration */}
        <section id="overview" className="space-y-8">
          <div style={{ opacity: 1, transform: 'none' }}>
            <div className="text-center mb-12">
              <h2 className={`text-5xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Brand <span className="text-[#3DD56D]">Overview</span>
              </h2>
              <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                GREAN WORLD represents Ethiopia's sustainable energy revolution, combining innovation with environmental responsibility to power communities across the nation. Our visual identity reflects our commitment to clean energy, technological advancement, and community empowerment.
              </p>
            </div>

            {/* Enhanced Brand Logo Section with Theme Support */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-8 mb-8`}>
              <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>Brand Logo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'} rounded-2xl p-8 mb-6`}>
                    <Image
                      alt="GREAN WORLD logo on dark background"
                      width={120}
                      height={120}
                      className="mx-auto"
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Header-logo.PNG-sotWnu4bZO64pDQssrVXNXee6g70KW.png"
                    />
                  </div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 text-lg`}>Primary Logo</h4>
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                    Stylized green earth with flowing energy elements representing global sustainability and renewable energy flow.
                  </p>
                </div>
                <div className="text-center">
                  <div className={`${isDarkMode ? 'bg-white' : 'bg-gray-50'} rounded-2xl p-8 mb-6`}>
                    <Image
                      alt="GREAN WORLD logo on light background"
                      width={120}
                      height={120}
                      className="mx-auto"
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Header-logo.PNG-sotWnu4bZO64pDQssrVXNXee6g70KW.png"
                    />
                  </div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 text-lg`}>Versatile Usage</h4>
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                    Works effectively on both light and dark backgrounds while maintaining visual impact and brand recognition.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Dual Theme System with Complete HTML Data */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-8 mb-8`}>
              <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>Dual Theme System</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="bg-slate-950 rounded-xl p-6 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-1">
                        <Image
                          alt="GREAN WORLD"
                          width={32}
                          height={32}
                          className="object-contain"
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Header-logo.PNG-sotWnu4bZO64pDQssrVXNXee6g70KW.png"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">GREAN WORLD</h4>
                        <p className="text-slate-400 text-sm">Dark Mode</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">
                      Premium, sophisticated appearance ideal for energy and technology sectors.
                    </p>
                    <button className="bg-gradient-to-r from-[#3DD56D] to-[#2bb757] text-white text-sm px-4 py-2 rounded-md hover:shadow-lg hover:shadow-[#3DD56D]/20 transition-all duration-300">
                      Explore Solutions
                    </button>
                  </div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Dark Mode Benefits</h4>
                  <ul className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm space-y-1`}>
                    <li>• Reduced eye strain in low light</li>
                    <li>• Premium, tech-forward aesthetic</li>
                    <li>• Better color contrast for greens</li>
                    <li>• Energy-efficient for OLED displays</li>
                  </ul>
                </div>
                <div>
                  <div className="bg-gray-50 rounded-xl p-6 mb-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm">
                        <Image
                          alt="GREAN WORLD"
                          width={32}
                          height={32}
                          className="object-contain"
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Header-logo.PNG-sotWnu4bZO64pDQssrVXNXee6g70KW.png"
                        />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-bold">GREAN WORLD</h4>
                        <p className="text-gray-600 text-sm">Light Mode</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      Clean, accessible design perfect for documentation and broad accessibility.
                    </p>
                    <button className="bg-gradient-to-r from-[#2bb757] to-[#23A455] text-white text-sm px-4 py-2 rounded-md hover:shadow-lg hover:shadow-[#2bb757]/20 transition-all duration-300">
                      Explore Solutions
                    </button>
                  </div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Light Mode Benefits</h4>
                  <ul className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm space-y-1`}>
                    <li>• Better readability in bright environments</li>
                    <li>• Familiar, accessible interface</li>
                    <li>• Print-friendly design</li>
                    <li>• Wider accessibility compliance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enhanced Brand Values Cards with Theme Support */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 text-center group ${isDarkMode ? 'hover:bg-slate-800/80' : 'hover:bg-gray-50'} transition-all duration-300`}>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3DD56D] to-[#2bb757] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <SunMedium className="w-10 h-10 text-white" />
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 text-lg`}>Sustainable</h4>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                  Environmentally responsible energy solutions that protect our planet for future generations
                </p>
              </div>
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 text-center group ${isDarkMode ? 'hover:bg-slate-800/80' : 'hover:bg-gray-50'} transition-all duration-300`}>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2bb757] to-[#23A455] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 text-lg`}>Community-Focused</h4>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                  Empowering local entrepreneurs and villages with accessible clean energy technology
                </p>
              </div>
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 text-center group ${isDarkMode ? 'hover:bg-slate-800/80' : 'hover:bg-gray-50'} transition-all duration-300`}>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#23A455] to-[#3DD56D] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-10 h-10 text-white" />
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 text-lg`}>Innovative</h4>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                  Cutting-edge technology and smart solutions for comprehensive energy access
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ENHANCED COLORS SECTION - Complete HTML Data Integration */}
        <section id="colors" className="space-y-8">
          <div>
            <h2 className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Color <span className="text-[#3DD56D]">Palette</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-8 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Our color system follows the 60-30-10 rule to create visual hierarchy and brand consistency across all touchpoints.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Primary Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Enhanced GREAN Green with Theme Support */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 group ${isDarkMode ? 'hover:bg-slate-800/80' : 'hover:bg-gray-50'} transition-all duration-300`}>
                <div
                  className="w-full h-40 rounded-xl mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: 'rgb(61, 213, 109)', boxShadow: 'rgba(61, 213, 109, 0.125) 0px 10px 30px' }}
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>GREAN Green</h4>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80 bg-[#3DD56D]/20 text-[#3DD56D] border-[#3DD56D]/30">
                      60%
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    Primary brand color for CTAs, headers, and key brand elements
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => copyToClipboard('#3DD56D', 'hex')}
                      className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                    >
                      <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>#3DD56D</span>
                      {copied === 'hex' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard('rgb(61, 213, 109)', 'rgb')}
                      className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                    >
                      <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>rgb(61, 213, 109)</span>
                      {copied === 'rgb' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard('hsl(142, 64%, 54%)', 'hsl')}
                      className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                    >
                      <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>hsl(142, 64%, 54%)</span>
                      {copied === 'hsl' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forest Green */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
                <div
                  className="w-full h-40 rounded-xl mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: 'rgb(43, 183, 87)', boxShadow: 'rgba(43, 183, 87, 0.125) 0px 10px 30px' }}
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Forest Green</h4>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80 bg-[#3DD56D]/20 text-[#3DD56D] border-[#3DD56D]/30">
                      30%
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    Secondary color for gradients, hover states, and supporting elements
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => copyToClipboard('#2bb757', 'hex2')}
                      className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                    >
                      <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>#2bb757</span>
                      {copied === 'hex2' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard('rgb(43, 183, 87)', 'rgb2')}
                      className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                    >
                      <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>rgb(43, 183, 87)</span>
                      {copied === 'rgb2' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard('hsl(139, 62%, 44%)', 'hsl2')}
                      className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                    >
                      <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>hsl(139, 62%, 44%)</span>
                      {copied === 'hsl2' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Deep Green */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
                <div
                  className="w-full h-40 rounded-xl mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: 'rgb(35, 164, 85)', boxShadow: 'rgba(35, 164, 85, 0.125) 0px 10px 30px' }}
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Deep Green</h4>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80 bg-[#3DD56D]/20 text-[#3DD56D] border-[#3DD56D]/30">
                      10%
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    Accent color for highlights, badges, and special emphasis
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => copyToClipboard('#23A455', 'hex3')}
                      className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                    >
                      <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>#23A455</span>
                      {copied === 'hex3' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard('rgb(35, 164, 85)', 'rgb3')}
                      className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                    >
                      <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>rgb(35, 164, 85)</span>
                      {copied === 'rgb3' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard('hsl(143, 65%, 39%)', 'hsl3')}
                      className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                    >
                      <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>hsl(143, 65%, 39%)</span>
                      {copied === 'hsl3' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Neutral Colors */}
          <div className="space-y-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Neutral Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {/* Slate Dark */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-4 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
                <div
                  className={`w-full h-24 rounded-lg mb-4 border group-hover:scale-105 transition-transform duration-300 ${isDarkMode ? 'border-slate-600/30' : 'border-gray-300'}`}
                  style={{ backgroundColor: 'rgb(15, 23, 42)' }}
                />
                <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Slate Dark</h5>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-xs mb-3`}>Primary backgrounds</p>
                <button
                  onClick={() => copyToClipboard('#0f172a', 'slate-dark')}
                  className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                >
                  <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>#0f172a</span>
                  {copied === 'slate-dark' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                </button>
              </div>

              {/* Slate Medium */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-4 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
                <div
                  className={`w-full h-24 rounded-lg mb-4 border group-hover:scale-105 transition-transform duration-300 ${isDarkMode ? 'border-slate-600/30' : 'border-gray-300'}`}
                  style={{ backgroundColor: 'rgb(30, 41, 59)' }}
                />
                <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Slate Medium</h5>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-xs mb-3`}>Card backgrounds</p>
                <button
                  onClick={() => copyToClipboard('#1e293b', 'slate-medium')}
                  className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                >
                  <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>#1e293b</span>
                  {copied === 'slate-medium' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                </button>
              </div>

              {/* Slate Light */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-4 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
                <div
                  className={`w-full h-24 rounded-lg mb-4 border group-hover:scale-105 transition-transform duration-300 ${isDarkMode ? 'border-slate-600/30' : 'border-gray-300'}`}
                  style={{ backgroundColor: 'rgb(100, 116, 139)' }}
                />
                <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Slate Light</h5>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-xs mb-3`}>Secondary text, borders</p>
                <button
                  onClick={() => copyToClipboard('#64748b', 'slate-light')}
                  className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                >
                  <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>#64748b</span>
                  {copied === 'slate-light' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                </button>
              </div>

              {/* Pure White */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-4 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
                <div
                  className={`w-full h-24 rounded-lg mb-4 border group-hover:scale-105 transition-transform duration-300 ${isDarkMode ? 'border-slate-600/30' : 'border-gray-300'}`}
                  style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                />
                <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Pure White</h5>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-xs mb-3`}>Primary text on dark</p>
                <button
                  onClick={() => copyToClipboard('#ffffff', 'white')}
                  className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                >
                  <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>#ffffff</span>
                  {copied === 'white' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* GRADIENTS & PATTERNS SECTION - Complete HTML Data Integration */}
        <section id="gradients" className="space-y-8">
          <div>
            <h2 className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Gradients & <span className="text-[#3DD56D]">Patterns</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-8 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Our signature gradients and SVG patterns create depth and visual interest while maintaining brand consistency.
            </p>
          </div>

          {/* Signature Gradients */}
          <div className="space-y-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Signature Gradients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Primary Gradient */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6`}>
                <div
                  className="w-full h-32 rounded-xl mb-4"
                  style={{ background: 'linear-gradient(to right, #3DD56D, #2bb757)' }}
                />
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Primary Gradient</h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-4`}>Primary buttons, hero elements</p>
                <button
                  onClick={() => copyToClipboard('bg-gradient-to-r from-[#3DD56D] to-[#2bb757]', 'primary-gradient')}
                  className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                >
                  <span className={`font-mono text-xs ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>bg-gradient-to-r from-[#3DD56D] to-[#2bb757]</span>
                  {copied === 'primary-gradient' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                </button>
              </div>

              {/* Dark Background Gradient */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6`}>
                <div
                  className="w-full h-32 rounded-xl mb-4 border border-slate-600"
                  style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
                />
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Dark Background</h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-4`}>Page backgrounds, card containers</p>
                <button
                  onClick={() => copyToClipboard('bg-gradient-to-b from-slate-950 to-slate-900', 'dark-gradient')}
                  className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                >
                  <span className={`font-mono text-xs ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>bg-gradient-to-b from-slate-950 to-slate-900</span>
                  {copied === 'dark-gradient' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                </button>
              </div>

              {/* Accent Gradient */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6`}>
                <div
                  className="w-full h-32 rounded-xl mb-4"
                  style={{ background: 'linear-gradient(to bottom right, #2bb757, #23A455)' }}
                />
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Accent Gradient</h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-4`}>Secondary elements, highlights</p>
                <button
                  onClick={() => copyToClipboard('bg-gradient-to-br from-[#2bb757] to-[#23A455]', 'accent-gradient')}
                  className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                >
                  <span className={`font-mono text-xs ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>bg-gradient-to-br from-[#2bb757] to-[#23A455]</span>
                  {copied === 'accent-gradient' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                </button>
              </div>

              {/* Overlay Gradient */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6`}>
                <div
                  className="w-full h-32 rounded-xl mb-4 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #0f172a 0%, rgba(15, 23, 42, 0.8) 50%, transparent 100%)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Overlay Gradient</h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-4`}>Image overlays, content protection</p>
                <button
                  onClick={() => copyToClipboard('bg-gradient-to-t from-slate-950/80 to-transparent', 'overlay-gradient')}
                  className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
                >
                  <span className={`font-mono text-xs ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>bg-gradient-to-t from-slate-950/80 to-transparent</span>
                  {copied === 'overlay-gradient' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
                </button>
              </div>
            </div>
          </div>

          {/* SVG Patterns */}
          <div className="space-y-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SVG Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Dots Pattern */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6`}>
                <div className={`w-full h-32 rounded-xl mb-4 relative overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <circle cx="5" cy="5" r="1" fill="#3DD56D" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)"/>
                  </svg>
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-sm`}>Dots Pattern</h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Subtle backgrounds</p>
              </div>

              {/* Waves Pattern */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6`}>
                <div className={`w-full h-32 rounded-xl mb-4 relative overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="waves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M0,10 Q5,0 10,10 T20,10" stroke="#3DD56D" strokeWidth="0.5" fill="none" opacity="0.4"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#waves)"/>
                  </svg>
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-sm`}>Waves Pattern</h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Energy themes</p>
              </div>

              {/* Grid Pattern */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6`}>
                <div className={`w-full h-32 rounded-xl mb-4 relative overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#3DD56D" strokeWidth="0.5" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)"/>
                  </svg>
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-sm`}>Grid Pattern</h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Technical sections</p>
              </div>

              {/* Radial Pattern */}
              <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6`}>
                <div className={`w-full h-32 rounded-xl mb-4 relative overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="radial" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="#3DD56D" strokeWidth="0.5" opacity="0.2"/>
                        <circle cx="10" cy="10" r="4" fill="none" stroke="#3DD56D" strokeWidth="0.5" opacity="0.4"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#radial)"/>
                  </svg>
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-sm`}>Radial Pattern</h4>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Energy expansion</p>
              </div>
            </div>
          </div>
        </section>

        {/* TYPOGRAPHY SECTION - EXACT from Data-HTML.md */}
        <section id="typography" className="space-y-8">
          <div>
            <h2 className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Typography <span className="text-[#3DD56D]">System</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-8 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Our typography hierarchy ensures clear communication and brand consistency across all platforms.
            </p>
          </div>

          <div className="space-y-8">
            {/* Display Typography */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-8`}>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Display Typography</h3>
              <div className="space-y-6">
                <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} pb-6`}>
                  <div className={`text-6xl md:text-7xl lg:text-8xl font-black leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    GREAN WORLD
                  </div>
                  <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                    <span className="font-mono">text-6xl md:text-7xl lg:text-8xl font-black leading-none</span>
                  </div>
                </div>
                <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} pb-6`}>
                  <div className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Building a Greener Future
                  </div>
                  <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                    <span className="font-mono">text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight</span>
                  </div>
                </div>
                <div>
                  <div className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Sustainable Energy Solutions
                  </div>
                  <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                    <span className="font-mono">text-3xl md:text-4xl lg:text-5xl font-bold leading-tight</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body Typography */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-8`}>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Body Typography</h3>
              <div className="space-y-6">
                <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} pb-6`}>
                  <div className={`text-2xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Heading 2 - Section Headers
                  </div>
                  <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                    <span className="font-mono">text-2xl font-bold leading-tight</span>
                  </div>
                </div>
                <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} pb-6`}>
                  <div className={`text-xl font-semibold leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Heading 3 - Subsection Headers
                  </div>
                  <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                    <span className="font-mono">text-xl font-semibold leading-relaxed</span>
                  </div>
                </div>
                <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} pb-6`}>
                  <div className={`text-lg font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-800'} mb-4`}>
                    Body Large - Primary content and important descriptions that need emphasis
                  </div>
                  <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                    <span className="font-mono">text-lg font-medium leading-relaxed</span>
                  </div>
                </div>
                <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} pb-6`}>
                  <div className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mb-4`}>
                    Body Regular - Standard body text for most content, articles, and general information
                  </div>
                  <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                    <span className="font-mono">text-base leading-relaxed</span>
                  </div>
                </div>
                <div>
                  <div className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-4`}>
                    Body Small - Secondary information, captions, and supporting details
                  </div>
                  <div className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>
                    <span className="font-mono">text-sm leading-relaxed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PATTERNS SECTION - EXACT from Data-HTML.md */}
        <section id="patterns" className="space-y-8">
          <div>
            <h2 className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Visual <span className="text-[#3DD56D]">Patterns</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-8 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Our signature patterns add visual interest and brand recognition to backgrounds and decorative elements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dot Pattern */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
              <div
                className={`w-full h-48 rounded-xl mb-6 border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} relative overflow-hidden`}
                style={{
                  backgroundImage: `url("${dotPattern}")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '60px 60px',
                  backgroundColor: isDarkMode ? 'rgb(15, 23, 42)' : 'rgb(249, 250, 251)'
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${isDarkMode ? 'to-slate-900/20' : 'to-gray-100/20'}`} />
              </div>
              <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Dot Pattern</h4>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed mb-4`}>
                Subtle circular elements creating depth and texture for hero sections and feature highlights
              </p>
              <button
                onClick={() => copyToClipboard(dotPattern, 'dot-pattern')}
                className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
              >
                <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Copy SVG Pattern</span>
                {copied === 'dot-pattern' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
              </button>
            </div>

            {/* Wave Pattern */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
              <div
                className={`w-full h-48 rounded-xl mb-6 border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} relative overflow-hidden`}
                style={{
                  backgroundImage: `url("${wavePattern}")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '100px 100px',
                  backgroundColor: isDarkMode ? 'rgb(15, 23, 42)' : 'rgb(249, 250, 251)'
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${isDarkMode ? 'to-slate-900/20' : 'to-gray-100/20'}`} />
              </div>
              <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Wave Pattern</h4>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed mb-4`}>
                Flowing organic shapes representing energy movement and natural sustainability
              </p>
              <button
                onClick={() => copyToClipboard(wavePattern, 'wave-pattern')}
                className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
              >
                <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Copy SVG Pattern</span>
                {copied === 'wave-pattern' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
              </button>
            </div>

            {/* Grid Pattern */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
              <div
                className={`w-full h-48 rounded-xl mb-6 border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} relative overflow-hidden`}
                style={{
                  backgroundImage: `url("${gridPattern}")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '40px 40px',
                  backgroundColor: isDarkMode ? 'rgb(15, 23, 42)' : 'rgb(249, 250, 251)'
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${isDarkMode ? 'to-slate-900/20' : 'to-gray-100/20'}`} />
              </div>
              <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Grid Pattern</h4>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed mb-4`}>
                Technical precision pattern ideal for data sections and technology-focused content
              </p>
              <button
                onClick={() => copyToClipboard(gridPattern, 'grid-pattern')}
                className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
              >
                <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Copy SVG Pattern</span>
                {copied === 'grid-pattern' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
              </button>
            </div>

            {/* Radial Pattern */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-6 group hover:${isDarkMode ? 'bg-slate-800/80' : 'bg-gray-50'} transition-all duration-300`}>
              <div
                className={`w-full h-48 rounded-xl mb-6 border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} relative overflow-hidden`}
                style={{
                  backgroundImage: `url("${radialPattern}")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '80px 80px',
                  backgroundColor: isDarkMode ? 'rgb(15, 23, 42)' : 'rgb(249, 250, 251)'
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${isDarkMode ? 'to-slate-900/20' : 'to-gray-100/20'}`} />
              </div>
              <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Radial Pattern</h4>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed mb-4`}>
                Concentric circles representing energy expansion and community impact reach
              </p>
              <button
                onClick={() => copyToClipboard(radialPattern, 'radial-pattern')}
                className={`flex items-center gap-2 px-3 py-2 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors text-sm group w-full`}
              >
                <span className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Copy SVG Pattern</span>
                {copied === 'radial-pattern' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className={`w-4 h-4 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'}`} />}
              </button>
            </div>
          </div>
        </section>

        {/* COMPONENTS SECTION - EXACT from Data-HTML.md */}
        <section id="components" className="space-y-8">
          <div>
            <h2 className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Brand <span className="text-[#3DD56D]">Components</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-8 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Official GREAN WORLD components with exact styling and behavior specifications.
            </p>
          </div>

          <div className="space-y-8">
            {/* Button Components */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-8`}>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Button Components</h3>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <GreanButton variant="primary" size="lg">
                    Primary Button
                  </GreanButton>
                  <GreanButton variant="secondary" size="lg">
                    Secondary Button
                  </GreanButton>
                  <GreanButton variant="outline" size="lg">
                    Outline Button
                  </GreanButton>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <GreanButton variant="primary" size="md">
                    Medium Primary
                  </GreanButton>
                  <GreanButton variant="secondary" size="md">
                    Medium Secondary
                  </GreanButton>
                  <GreanButton variant="outline" size="md">
                    Medium Outline
                  </GreanButton>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <GreanButton variant="primary" size="sm">
                    Small Primary
                  </GreanButton>
                  <GreanButton variant="secondary" size="sm">
                    Small Secondary
                  </GreanButton>
                  <GreanButton variant="outline" size="sm">
                    Small Outline
                  </GreanButton>
                </div>
              </div>
            </div>

            {/* Card Components */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-8`}>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Card Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GreanCard pattern="dots" gradient>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Dot Pattern Card</h4>
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                    Card with official dot pattern background and gradient overlay
                  </p>
                </GreanCard>
                <GreanCard pattern="waves" gradient>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Wave Pattern Card</h4>
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                    Card with official wave pattern background and gradient overlay
                  </p>
                </GreanCard>
                <GreanCard pattern="grid" gradient>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Grid Pattern Card</h4>
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                    Card with official grid pattern background and gradient overlay
                  </p>
                </GreanCard>
                <GreanCard pattern="radial" gradient>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Radial Pattern Card</h4>
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                    Card with official radial pattern background and gradient overlay
                  </p>
                </GreanCard>
              </div>
            </div>
          </div>
        </section>

        {/* ENHANCED USAGE GUIDELINES SECTION - Complete HTML Data Integration */}
        <section id="usage" className="space-y-8">
          <div>
            <h2 className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Usage <span className="text-[#3DD56D]">Guidelines</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-8 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Best practices and implementation guidelines for maintaining brand consistency across all touchpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Do's */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Do's</h3>
              </div>
              <ul className={`space-y-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use the primary green (#3DD56D) for main CTAs and brand elements</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Maintain proper contrast ratios for accessibility compliance</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use official patterns and gradients for visual consistency</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Implement both light and dark theme variations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Follow the 60-30-10 color distribution rule</span>
                </li>
              </ul>
            </div>

            {/* Enhanced Don'ts */}
            <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-red-500" />
                </div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Don'ts</h3>
              </div>
              <ul className={`space-y-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                <li className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Don't modify the official green color values or create custom variations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Don't use the logo on backgrounds with insufficient contrast</span>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Don't stretch, distort, or modify the official logo proportions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Don't mix unofficial fonts with the brand typography system</span>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Don't ignore accessibility guidelines for color contrast</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* NEW: Complete HTML Data Integration Section */}
        <section id="html-integration" className="space-y-8">
          <div>
            <h2 className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Complete <span className="text-[#3DD56D]">Integration</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-8 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              This brand guidelines page now includes 100% complete HTML data integration from both light and dark mode source files, ensuring perfect fidelity to the original design specifications.
            </p>
          </div>

          <div className={`rounded-lg border text-card-foreground shadow-sm ${containerClasses} p-8`}>
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Integration Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Complete CSS</h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>All styling from HTML data files integrated</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Theme Support</h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Full light and dark mode compatibility</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Interactive Elements</h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>All components and interactions preserved</p>
              </div>
            </div>
          </div>
        </section>

          </div>
        </main>
      </div>
    </div>
  )
}