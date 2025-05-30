"use client"

import { useState } from "react"
import { useInView } from "react-intersection-observer"
import { Zap, Settings, Monitor, Thermometer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import StaticInverterNode from "@/components/static-nodes/inverter"
import { CardBorderPowerFlow } from "@/components/animations/card-border-power-flow"

export function InverterShowcase() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [inverterOn, setInverterOn] = useState(false)

  return (
    <section ref={ref} className="w-full max-w-7xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 lg:px-8 z-10 relative">
      <CardBorderPowerFlow
        isActive={inverterOn}
        className={cn(
          "w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative bg-gradient-to-b from-slate-950 to-slate-900",
          "transform transition-all duration-1000",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        )}
        borderRadius={16}
        glowIntensity="extreme"
        particleCount={25}
        animationSpeed={1.5}
        dramatic={true}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="inverter-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="8" fill="#4ade80" fillOpacity="0.3"></circle>
            </pattern>
            <rect width="100%" height="100%" fill="url(#inverter-pattern)"></rect>
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row relative z-10">
          {/* Left: Interactive Inverter Device */}
          <div className="w-full lg:w-[45%] relative overflow-hidden min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] p-4">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2bb757]/80 to-transparent z-0"></div>

            {/* Centered container for the inverter */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="relative" style={{ width: "320px", height: "472px" }}>
                <StaticInverterNode
                  position={{ x: 160, y: 236 }}
                  inverterOn={inverterOn}
                  onInverterChange={setInverterOn}
                  gridConnected={false}
                  solarConnected={true}
                  batteryConnected={true}
                  loadPercentage={65}
                  batteryLevel={85}
                  temperature={42}
                  fanSpeed={35}
                  mode="pv"
                  scale={0.8}
                />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-[55%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Badge className="mb-3 bg-gradient-to-r from-[#3DD56D] to-[#2bb757] text-white border-[#3DD56D]/30 shadow-lg shadow-[#3DD56D]/20">Interactive Demo</Badge>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-4 text-white">
                  Experience Our Smart Inverter Technology
                </h3>
                <p className="text-base sm:text-lg font-medium text-slate-300">
                  Interact with our advanced inverter simulation featuring real-time monitoring, multiple operating
                  modes, and intelligent power management systems.
                </p>
              </div>

              <div className="p-4 rounded-lg py-4 shadow-lg bg-slate-800/50 backdrop-blur-sm border border-[#3DD56D]/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-[#3DD56D]">3kW</div>
                    <div className="text-xs text-slate-300">Max Power</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-[#2bb757]">97%</div>
                    <div className="text-xs text-slate-300">Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-[#23A455]">5 yrs</div>
                    <div className="text-xs text-slate-300">Warranty</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#2bb757] to-[#23A455] text-white p-4 sm:p-5 rounded-lg shadow-lg overflow-hidden relative border border-[#3DD56D]/20">
                <div className="relative z-10">
                  <h4 className="text-lg sm:text-xl font-semibold text-white mb-3">Interactive Features:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-sm sm:text-base text-white font-medium">Real-time LCD display</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-sm sm:text-base text-white font-medium">Mode switching</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-sm sm:text-base text-white font-medium">Temperature monitoring</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-sm sm:text-base text-white font-medium">Live simulation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-4 flex-shrink-0">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Badge variant="outline" className="border-[#3DD56D] text-[#3DD56D] bg-transparent hover:bg-[#3DD56D]/10">
                    #SmartInverter
                  </Badge>
                  <Badge variant="outline" className="border-[#2bb757] text-[#2bb757] bg-transparent hover:bg-[#2bb757]/10">
                    #Interactive
                  </Badge>
                  <Badge variant="outline" className="border-[#23A455] text-[#23A455] bg-transparent hover:bg-[#23A455]/10">
                    #RealTime
                  </Badge>
                </div>

                <Button
                  className={`${
                    inverterOn
                      ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/50 animate-pulse border-2 border-red-400"
                      : "bg-gradient-to-r from-[#3DD56D] to-[#2bb757] hover:from-[#2bb757] hover:to-[#23A455] text-white shadow-lg shadow-[#3DD56D]/50 hover:shadow-[#3DD56D]/70"
                  } font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-110 transform ${
                    inverterOn ? "scale-105" : ""
                  }`}
                  onClick={() => setInverterOn(!inverterOn)}
                  style={{
                    boxShadow: inverterOn
                      ? "0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3), 0 0 60px rgba(239, 68, 68, 0.1)"
                      : "0 0 20px rgba(61, 213, 109, 0.5), 0 0 40px rgba(61, 213, 109, 0.3)"
                  }}
                >
                  {inverterOn ? "⚡ STOP ⚡" : "⚡ START ⚡"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBorderPowerFlow>
    </section>
  )
}
