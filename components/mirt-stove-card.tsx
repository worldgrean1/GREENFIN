"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Flame, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function MirtStoveCard() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [animatedRings, setAnimatedRings] = useState(0)

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setAnimatedRings((prev) => {
          if (prev >= 3) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 300)

      return () => clearInterval(interval)
    }
  }, [inView])

  return (
    <section ref={ref} className="w-full max-w-7xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 lg:px-8 z-10 relative">
      <div
        className={cn(
          "w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[627px] rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative bg-gradient-to-b from-slate-950 to-slate-900",
          "transform transition-all duration-1000",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        )}
        aria-label="LinkedIn modern innovation card featuring Mirt Stove Deluxe"
        role="img"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="mirt-stove-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="8" fill="#4ade80" fillOpacity="0.3"></circle>
            </pattern>
            <rect width="100%" height="100%" fill="url(#mirt-stove-pattern)"></rect>
          </svg>
        </div>

        <div className="flex min-h-full flex-col">
          <div className="flex flex-col lg:flex-row flex-grow">
            {/* Content Section */}
            <div className="w-full lg:w-[55%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-full">
              <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-600 flex items-center justify-center">
                      <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">Mirt Stove Deluxe</h3>
                      <p className="text-sm sm:text-base font-medium text-slate-300">
                        Efficient Injera Baking Solution
                      </p>
                    </div>
                  </div>
                  <div className="backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-2 flex items-center space-x-2 self-start sm:self-auto bg-slate-800/80 border border-slate-700">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <p className="text-xs sm:text-sm font-medium text-white">@mirtstove</p>
                  </div>
                </div>

                {/* Main Description */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-5 rounded-lg shadow-lg overflow-hidden relative">
                  <div className="relative z-10">
                    <Badge className="mb-2 bg-white/20 backdrop-blur-sm text-white border-white/20">
                      Clean Cooking
                    </Badge>
                    <h4 className="text-xl font-black mb-2">Efficient, Durable, and Eco-Friendly</h4>
                    <p className="text-base font-medium">
                      The enhanced Mirt stove is made from durable sand and cement mortar, designed for Ethiopian
                      households to bake injera efficiently and reduce fuel use.
                    </p>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Key Features */}
                  <div className="p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                      <h5 className="font-semibold text-sm sm:text-base text-white">Key Features</h5>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-1 list-disc list-inside text-slate-300">
                      <li>Bakes up to 30 injeras per day</li>
                      <li>Reduces fuel consumption by 50%</li>
                      <li>5+ year lifespan with proper maintenance</li>
                    </ul>
                  </div>

                  {/* Environmental Impact */}
                  <div className="p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                      <h5 className="font-semibold text-sm sm:text-base text-white">Environmental Impact</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-green-400">50%</div>
                        <div className="text-xs text-slate-300">Fuel savings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-green-400">30+</div>
                        <div className="text-xs text-slate-300">Injeras/day</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-green-400">5 yrs</div>
                        <div className="text-xs text-slate-300">Lifespan</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-green-400">Eco</div>
                        <div className="text-xs text-slate-300">Local materials</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags and CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 flex-shrink-0">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Badge variant="outline" className="border-green-500 text-green-400 bg-transparent">
                      #CleanCooking
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-400 bg-transparent">
                      #Injera
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-400 bg-transparent">
                      #EcoStove
                    </Badge>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Visual Section */}
            <div className="w-full lg:w-[45%] relative overflow-hidden flex items-center justify-center min-h-[200px] sm:min-h-[250px] lg:min-h-0 p-4">
              <div className="absolute inset-0 bg-gradient-to-l from-[#3DD56D]/80 to-transparent z-0"></div>
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="relative w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[350px] sm:max-h-[350px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Animated Rings */}
                    <div
                      className={cn(
                        "w-full h-full max-w-[280px] max-h-[280px] rounded-full bg-[#3DD56D]/20 transition-all duration-500",
                        animatedRings >= 1 ? "animate-pulse opacity-100" : "opacity-0",
                      )}
                    ></div>
                    <div
                      className={cn(
                        "absolute w-[80%] h-[80%] max-w-[220px] max-h-[220px] rounded-full bg-[#3DD56D]/30 transition-all duration-500",
                        animatedRings >= 2 ? "animate-pulse opacity-100" : "opacity-0",
                      )}
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className={cn(
                        "absolute w-[60%] h-[60%] max-w-[160px] max-h-[160px] rounded-full bg-[#3DD56D]/40 transition-all duration-500",
                        animatedRings >= 3 ? "animate-pulse opacity-100" : "opacity-0",
                      )}
                      style={{ animationDelay: "1s" }}
                    ></div>

                    {/* Central Icon */}
                    <div
                      className={cn(
                        "absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[#2bb757]/60 flex items-center justify-center shadow-lg transition-all duration-700",
                        animatedRings >= 1 ? "scale-100 opacity-100" : "scale-50 opacity-0",
                      )}
                    >
                      <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                    </div>

                    {/* Decorative Elements */}
                    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400">
                      <g stroke="rgba(61, 213, 109, 0.4)" fill="none" strokeWidth="1">
                        <circle cx="200" cy="200" r="80" strokeDasharray="5,5">
                          <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            from="0 200 200"
                            to="360 200 200"
                            dur="20s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle cx="200" cy="200" r="120" strokeDasharray="3,7">
                          <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            from="360 200 200"
                            to="0 200 200"
                            dur="30s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                      <g fill="rgba(61, 213, 109, 0.6)">
                        <circle cx="200" cy="120" r="3">
                          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="280" cy="200" r="3">
                          <animate
                            attributeName="opacity"
                            values="0.6;1;0.6"
                            dur="2s"
                            begin="0.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle cx="200" cy="280" r="3">
                          <animate
                            attributeName="opacity"
                            values="0.6;1;0.6"
                            dur="2s"
                            begin="1s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle cx="120" cy="200" r="3">
                          <animate
                            attributeName="opacity"
                            values="0.6;1;0.6"
                            dur="2s"
                            begin="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
