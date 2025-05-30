"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { SunMedium, Building2, Users, GraduationCap, TrendingUp, Award, Target, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTypewriter } from "@/hooks/useTypewriter"
import { useTheme } from "@/hooks/useTheme"
import { GreanCard } from "@/components/ui/grean-card"
import { GreanButton } from "@/components/ui/grean-button"

// Animated Counter Component
interface AnimatedCounterProps {
  value: string | number;
  suffix?: string;
  duration?: number;
  delay?: number;
  isDark?: boolean;
}

const AnimatedCounter = ({ value, suffix = "", duration = 2000, delay = 0, isDark = true }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        let start = 0
        const end = Number.parseInt(value.toString().replace(/\D/g, ""))
        const increment = end / (duration / 16)

        const counter = setInterval(() => {
          start += increment
          if (start >= end) {
            setCount(end)
            clearInterval(counter)
          } else {
            setCount(Math.floor(start))
          }
        }, 16)

        return () => clearInterval(counter)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [inView, value, duration, delay])

  return (
    <div ref={ref} className={`text-3xl sm:text-4xl font-bold ${
      isDark ? 'text-[#3DD56D]' : 'text-small-title'
    }`}>
      {count.toLocaleString()}
      {suffix}
    </div>
  )
}

export function EnergyPillars() {
  const { isDark } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Typing animation for the main heading
  const headingAnimation = useTypewriter("Four Pillars of Energy Excellence", 70, 800, inView)

  const statistics = [
    {
      value: "500",
      suffix: "+",
      label: "Projects Completed",
      icon: Target,
      delay: 0,
    },
    {
      value: "1200",
      suffix: "+",
      label: "Professionals Trained",
      icon: Users,
      delay: 200,
    },
    {
      value: "40",
      suffix: "%",
      label: "Average Cost Savings",
      icon: TrendingUp,
      delay: 400,
    },
    {
      value: "25",
      suffix: "+",
      label: "Institutions Served",
      icon: Building,
      delay: 600,
    },
  ]

  // Brand-compliant pillars using official GREAN WORLD colors
  const pillars = [
    {
      title: "Community Solar Projects",
      icon: SunMedium,
      color: "from-[#3DD56D] to-[#2bb757]", // Primary brand gradient
      bgColor: "bg-[#3DD56D]/10",
      borderColor: "border-[#3DD56D]/20",
      textColor: "text-[#3DD56D]",
      services: ["Residential", "Smart Communities", "Sustainable Living"],
      description: "Empowering neighborhoods with premium solar energy solutions and smart grid integration.",
      features: ["Solar energy audits", "Community installations", "Smart grid integration"],
    },
    {
      title: "Commercial Energy Transition",
      icon: Building2,
      color: "from-[#2bb757] to-[#23A455]", // Secondary brand gradient
      bgColor: "bg-[#2bb757]/10",
      borderColor: "border-[#2bb757]/20",
      textColor: "text-[#2bb757]",
      services: ["Energy Efficiency", "Cost Reduction", "Sustainability"],
      description: "Helping businesses reduce costs and carbon footprint through smart energy solutions.",
      features: ["Commercial energy audits", "System optimization", "ROI analysis"],
    },
    {
      title: "Workforce Development",
      icon: Users,
      color: "from-[#23A455] to-[#3DD56D]", // Accent to primary gradient
      bgColor: "bg-[#23A455]/10",
      borderColor: "border-[#23A455]/20",
      textColor: "text-[#23A455]",
      services: ["Training Programs", "Capacity Building", "Career Development"],
      description: "Building local expertise through comprehensive renewable energy training programs.",
      features: ["Technical certification", "Skills development", "Career placement"],
    },
    {
      title: "Sustainable Campus Initiative",
      icon: GraduationCap,
      color: "from-[#3DD56D] to-[#23A455]", // Primary to accent gradient
      bgColor: "bg-[#3DD56D]/15",
      borderColor: "border-[#3DD56D]/25",
      textColor: "text-[#3DD56D]",
      services: ["Education", "Campus Solutions", "Learning Labs"],
      description: "Transforming educational institutions into sustainable energy showcases.",
      features: ["Campus energy solutions", "Educational programs", "Research partnerships"],
    },
  ]

  return (
    <section ref={ref} className="w-full max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8 z-10 relative">
      {/* Brand-Compliant Header Section */}
      <div className="text-center mb-12 sm:mb-16">
        <div
          className={cn(
            "transition-all duration-1000",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          {/* Brand-compliant badge */}
          <div className={`inline-flex items-center rounded-full px-4 py-2 typography-small mb-6 shadow-lg backdrop-blur-sm ${
            isDark
              ? 'bg-[#3DD56D]/20 text-[#3DD56D] border border-[#3DD56D]/30'
              : 'bg-[#2bb757]/20 text-[#2bb757] border border-[#2bb757]/50'
          }`}>
            <Award className="w-4 h-4 mr-2" />
            Integrated Service Approach
          </div>

          {/* Fixed height container for typing animation with brand typography */}
          <div className="min-h-[200px] sm:min-h-[240px] md:min-h-[280px] flex items-center justify-center mb-6">
            <h2 className={`typography-display text-4xl sm:text-5xl md:text-6xl text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {headingAnimation.displayText}
              <span
                className={`inline-block w-1 h-[0.8em] ml-2 align-middle bg-[#3DD56D] ${
                  headingAnimation.isTyping ? "animate-blink" : "opacity-0"
                }`}
              ></span>
            </h2>
          </div>

          <p className={`typography-body text-lg md:text-xl max-w-4xl mx-auto text-center ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Our comprehensive services work together seamlessly to provide <span className="text-[#2bb757] font-semibold">end-to-end energy solutions</span> that transform communities and businesses across Ethiopia.
          </p>
        </div>
      </div>

      {/* Premium Statistics Section */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-300",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        )}
      >
        {statistics.map((stat, index) => {
          const Icon = stat.icon
          return (
            <GreanCard
              key={index}
              pattern="none"
              gradient={false}
              className={cn(
                "p-6 text-center group transition-all duration-500 hover:scale-105 hover:shadow-xl",
                "border-2 hover:border-[#3DD56D]/50",
                isDark
                  ? "bg-slate-900/90 border-slate-700/50 hover:bg-slate-800/90 shadow-lg"
                  : "bg-white/90 border-gray-200/50 hover:bg-gray-50/90 shadow-md",
                "backdrop-blur-sm"
              )}
              style={{
                animationDelay: `${stat.delay}ms`,
              }}
            >
              {/* Premium gradient overlay */}
              <div className={cn(
                "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "bg-gradient-to-br from-[#3DD56D]/5 via-[#2bb757]/3 to-[#23A455]/5"
              )} />

              <div className="relative z-10">
                <div className="mb-4 flex justify-center">
                  <div className={cn(
                    "p-3 rounded-full transition-all duration-300",
                    "bg-gradient-to-br from-[#3DD56D]/20 to-[#2bb757]/20",
                    "group-hover:from-[#3DD56D]/30 group-hover:to-[#2bb757]/30",
                    "group-hover:scale-110 group-hover:shadow-lg"
                  )}>
                    <Icon className="w-6 h-6 text-[#3DD56D] group-hover:text-[#2bb757] transition-colors duration-300" />
                  </div>
                </div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} delay={stat.delay} isDark={isDark} />
                <div className={`typography-small mt-2 transition-colors duration-300 ${
                  isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                }`}>{stat.label}</div>
              </div>
            </GreanCard>
          )
        })}
      </div>

      {/* Premium Pillars Grid */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 transition-all duration-1000 delay-500",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        )}
      >
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon
          return (
            <GreanCard
              key={index}
              pattern="none"
              gradient={false}
              className={cn(
                "p-6 lg:p-8 group hover:scale-105 transition-all duration-500 relative",
                "border-2 hover:border-[#3DD56D]/50",
                isDark
                  ? "bg-slate-900/90 border-slate-700/50 hover:bg-slate-800/90 shadow-lg hover:shadow-2xl"
                  : "bg-white/90 border-gray-200/50 hover:bg-gray-50/90 shadow-md hover:shadow-xl",
                "backdrop-blur-sm"
              )}
              style={{
                animationDelay: `${600 + index * 100}ms`,
              }}
            >
              {/* Premium gradient overlay */}
              <div className={cn(
                "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "bg-gradient-to-br from-[#3DD56D]/5 via-[#2bb757]/3 to-[#23A455]/5"
              )} />

              <div className="relative z-10">
                {/* Enhanced Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    "bg-gradient-to-br from-[#3DD56D]/20 to-[#2bb757]/20",
                    "group-hover:from-[#3DD56D]/30 group-hover:to-[#2bb757]/30",
                    "group-hover:scale-110 group-hover:shadow-lg"
                  )}>
                    <Icon className="w-6 h-6 text-[#3DD56D] group-hover:text-[#2bb757] transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`typography-h3 mb-3 group-hover:text-[#3DD56D] transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {pillar.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {pillar.services.map((service, serviceIndex) => (
                        <span
                          key={serviceIndex}
                          className={cn(
                            "px-3 py-1 rounded-full typography-small border transition-all duration-300",
                            "bg-gradient-to-r from-[#3DD56D]/10 to-[#2bb757]/10",
                            "text-[#3DD56D] border-[#3DD56D]/30",
                            "group-hover:from-[#3DD56D]/20 group-hover:to-[#2bb757]/20",
                            "group-hover:border-[#3DD56D]/50 group-hover:shadow-sm"
                          )}
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Description */}
                <p className={`typography-body mb-6 transition-colors duration-300 ${
                  isDark ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-800'
                }`}>{pillar.description}</p>

                {/* Premium Features */}
                <div className="space-y-3">
                  {pillar.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3 group/feature">
                      <div className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        "bg-gradient-to-r from-[#3DD56D] to-[#2bb757]",
                        "group-hover/feature:scale-125 group-hover/feature:shadow-sm"
                      )} />
                      <span className={`typography-small transition-colors duration-300 ${
                        isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                      }`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GreanCard>
          )
        })}
      </div>

      {/* Premium Bottom CTA */}
      <div
        className={cn(
          "text-center mt-16 transition-all duration-1000 delay-700",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        )}
      >
        <GreanCard
          pattern="none"
          gradient={false}
          className={cn(
            "inline-flex items-center justify-center p-8 max-w-4xl mx-auto group",
            "border-2 hover:border-[#3DD56D]/50 transition-all duration-500",
            isDark
              ? "bg-slate-900/90 border-slate-700/50 hover:bg-slate-800/90 shadow-lg hover:shadow-2xl"
              : "bg-white/90 border-gray-200/50 hover:bg-gray-50/90 shadow-md hover:shadow-xl",
            "backdrop-blur-sm"
          )}
        >
          {/* Premium gradient overlay */}
          <div className={cn(
            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-gradient-to-br from-[#3DD56D]/5 via-[#2bb757]/3 to-[#23A455]/5"
          )} />

          <div className="relative z-10 text-center space-y-4">
            <div className={`typography-h3 transition-colors duration-300 ${
              isDark ? 'text-white group-hover:text-gray-100' : 'text-gray-900 group-hover:text-gray-800'
            }`}>
              Comprehensive energy solutions for every need
            </div>
            <div className={`typography-body transition-colors duration-300 ${
              isDark ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-800'
            }`}>
              Trusted by <span className="text-[#3DD56D] font-semibold group-hover:text-[#2bb757] transition-colors duration-300">25+ institutions</span> across Ethiopia
            </div>
            <div className="pt-2">
              <GreanButton variant="primary" size="lg">
                Explore Our Solutions
              </GreanButton>
            </div>
          </div>
        </GreanCard>
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-blink {
          animation: blink 0.8s step-end infinite;
        }
      `}</style>
    </section>
  )
}
