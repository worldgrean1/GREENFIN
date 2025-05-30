'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Smartphone,
  Keyboard,
  Palette,
  Info,
  X,
} from 'lucide-react';
import { useEnergySystemStore } from '@/store/energySystemStore';
import { useTheme } from '@/hooks/useTheme';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import {
  getAudioEnabled,
  getAudioVolume,
  setAudioEnabled,
} from '@/utils/sound';
import { useState, useEffect, useRef } from 'react';

interface SystemStatusProps {
  className?: string;
  compact?: boolean;
}

// Custom hook for click outside detection
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}

// Tooltip-style System Status component
export function SystemStatusTooltip({
  className = '',
}: {
  className?: string;
}) {
  const { animationsPaused, inverterActive, switchActive } =
    useEnergySystemStore();
  const { theme, effectiveTheme } = useTheme();
  const { isFullscreen } = useKeyboardShortcuts();

  const [audioEnabled, setAudioEnabledState] = useState(true);
  const [audioVolume, setAudioVolumeState] = useState(0.3);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'right'>(
    'top'
  );

  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Click outside to close
  useClickOutside(tooltipRef, () => setIsOpen(false));

  useEffect(() => {
    setAudioEnabledState(getAudioEnabled());
    setAudioVolumeState(getAudioVolume());
    setMounted(true);
  }, []);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    setAudioEnabledState(newState);
  };

  const toggleTooltip = () => {
    if (!isOpen && triggerRef.current) {
      // Calculate optimal position based on viewport space
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Check if there's enough space above (for top positioning)
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.right;

      // Tooltip dimensions (approximate)
      const tooltipHeight = 300; // Approximate height
      const tooltipWidth = 208; // min-w-52 = 208px

      // Prefer top positioning, but switch to right if not enough space
      if (spaceAbove >= tooltipHeight) {
        setTooltipPosition('top');
      } else if (spaceRight >= tooltipWidth) {
        setTooltipPosition('right');
      } else {
        setTooltipPosition('top'); // Default to top even if cramped
      }
    }
    setIsOpen(!isOpen);
  };

  if (!mounted) return null;

  const statusItems = [
    {
      icon: animationsPaused ? Pause : Play,
      label: 'Animations',
      value: animationsPaused ? 'Paused' : 'Running',
      color: animationsPaused ? 'text-yellow-500' : 'text-green-500',
      shortcut: 'Space',
    },
    {
      icon: audioEnabled ? Volume2 : VolumeX,
      label: 'Audio',
      value: audioEnabled ? `${Math.round(audioVolume * 100)}%` : 'Muted',
      color: audioEnabled ? 'text-blue-500' : 'text-gray-500',
      onClick: toggleAudio,
    },
    {
      icon: Palette,
      label: 'Theme',
      value: theme,
      color: effectiveTheme === 'dark' ? 'text-purple-500' : 'text-orange-500',
    },
    {
      icon: isFullscreen ? Minimize : Maximize,
      label: 'Display',
      value: isFullscreen ? 'Fullscreen' : 'Windowed',
      color: isFullscreen ? 'text-indigo-500' : 'text-gray-500',
      shortcut: 'F',
    },
  ];

  const componentStatus = [
    {
      label: 'Inverter',
      active: inverterActive,
      color: 'text-blue-500',
    },
    {
      label: 'Switch',
      active: switchActive,
      color: 'text-green-500',
    },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Info Icon Trigger */}
      <motion.button
        ref={triggerRef}
        onClick={toggleTooltip}
        className="flex items-center justify-center w-8 h-8 bg-black/60 backdrop-blur-sm border border-gray-700/60 rounded-full hover:bg-black/80 hover:border-gray-600/80 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="System Status Information"
      >
        <Info
          size={14}
          className="text-gray-300 hover:text-white transition-colors"
        />
      </motion.button>

      {/* Tooltip Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={tooltipRef}
            className={`absolute z-50 ${
              tooltipPosition === 'top'
                ? 'bottom-full left-0 mb-2'
                : 'left-full top-0 ml-2'
            }`}
            initial={{
              opacity: 0,
              y: tooltipPosition === 'top' ? 10 : 0,
              x: tooltipPosition === 'right' ? -10 : 0,
              scale: 0.95,
            }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: tooltipPosition === 'top' ? 10 : 0,
              x: tooltipPosition === 'right' ? -10 : 0,
              scale: 0.95,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="bg-black/85 backdrop-blur-sm border border-gray-700/60 rounded-lg p-2.5 shadow-xl min-w-52">
              <div className="space-y-2.5">
                {/* Header with close button */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-white tracking-wide">
                    System Status
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Keyboard size={10} className="text-gray-400" />
                    <Smartphone size={10} className="text-gray-400" />
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-4 h-4 hover:bg-gray-700/50 rounded transition-colors"
                      aria-label="Close"
                    >
                      <X size={8} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>

                {/* Main Status Items with optimized grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {statusItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        className={`flex items-start gap-2 p-2 rounded-md bg-gray-800/60 border border-gray-700/30 ${item.onClick ? 'cursor-pointer hover:bg-gray-700/60 hover:border-gray-600/50' : ''}`}
                        whileHover={item.onClick ? { scale: 1.02 } : {}}
                        onClick={item.onClick}
                      >
                        {/* Icon container with fixed size for alignment */}
                        <div className="flex-shrink-0 flex items-center justify-center w-4 h-4">
                          <Icon size={12} className={item.color} />
                        </div>

                        {/* Content with improved text alignment */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="text-[9px] text-gray-400 leading-none font-medium uppercase tracking-wider">
                            {item.label}
                          </div>
                          <div
                            className={`text-[10px] font-semibold ${item.color} leading-none`}
                          >
                            {item.value}
                          </div>
                        </div>

                        {/* Shortcut badge with better positioning */}
                        {item.shortcut && (
                          <div className="flex-shrink-0 flex items-center">
                            <kbd className="text-[7px] bg-gray-700/80 px-1.5 py-0.5 rounded text-gray-300 font-mono border border-gray-600/50">
                              {item.shortcut}
                            </kbd>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Component Status with improved spacing */}
                <div className="border-t border-gray-700/50 pt-2">
                  <div className="text-[9px] text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
                    Components
                  </div>
                  <div className="flex gap-3">
                    {componentStatus.map((component, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-1.5 text-[9px] ${component.color}`}
                      >
                        <div className="flex items-center justify-center w-3 h-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              component.active
                                ? 'bg-current animate-pulse shadow-sm'
                                : 'bg-gray-600'
                            }`}
                          />
                        </div>
                        <span className="font-medium">{component.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyboard Shortcuts with enhanced layout */}
                <div className="border-t border-gray-700/50 pt-2">
                  <div className="text-[9px] text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
                    Shortcuts
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center justify-between bg-gray-800/40 px-1.5 py-1 rounded border border-gray-700/30">
                      <span className="text-[9px] text-gray-400 font-medium">
                        Reset:
                      </span>
                      <kbd className="text-[7px] bg-gray-700/80 px-1.5 py-0.5 rounded text-gray-300 font-mono border border-gray-600/50">
                        R
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800/40 px-1.5 py-1 rounded border border-gray-700/30">
                      <span className="text-[9px] text-gray-400 font-medium">
                        Exit:
                      </span>
                      <kbd className="text-[7px] bg-gray-700/80 px-1.5 py-0.5 rounded text-gray-300 font-mono border border-gray-600/50">
                        Esc
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tooltip Arrow */}
            {tooltipPosition === 'top' ? (
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-700/60"></div>
            ) : (
              <div className="absolute right-full top-4 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-700/60"></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SystemStatus({
  className = '',
  compact = false,
}: SystemStatusProps) {
  const { animationsPaused, inverterActive, switchActive } =
    useEnergySystemStore();
  const { theme, effectiveTheme } = useTheme();
  const { isFullscreen } = useKeyboardShortcuts();

  const [audioEnabled, setAudioEnabledState] = useState(true);
  const [audioVolume, setAudioVolumeState] = useState(0.3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAudioEnabledState(getAudioEnabled());
    setAudioVolumeState(getAudioVolume());
    setMounted(true);
  }, []);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    setAudioEnabledState(newState);
  };

  if (!mounted) return null;

  const statusItems = [
    {
      icon: animationsPaused ? Pause : Play,
      label: 'Animations',
      value: animationsPaused ? 'Paused' : 'Running',
      color: animationsPaused ? 'text-yellow-500' : 'text-green-500',
      shortcut: 'Space',
    },
    {
      icon: audioEnabled ? Volume2 : VolumeX,
      label: 'Audio',
      value: audioEnabled ? `${Math.round(audioVolume * 100)}%` : 'Muted',
      color: audioEnabled ? 'text-blue-500' : 'text-gray-500',
      onClick: toggleAudio,
    },
    {
      icon: Palette,
      label: 'Theme',
      value: theme,
      color: effectiveTheme === 'dark' ? 'text-purple-500' : 'text-orange-500',
    },
    {
      icon: isFullscreen ? Minimize : Maximize,
      label: 'Display',
      value: isFullscreen ? 'Fullscreen' : 'Windowed',
      color: isFullscreen ? 'text-indigo-500' : 'text-gray-500',
      shortcut: 'F',
    },
  ];

  const componentStatus = [
    {
      label: 'Inverter',
      active: inverterActive,
      color: 'text-blue-500',
    },
    {
      label: 'Switch',
      active: switchActive,
      color: 'text-green-500',
    },
  ];

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className={`flex items-center gap-1.5 text-[10px] bg-gray-800/40 px-2 py-1 rounded-md border border-gray-700/30 ${item.color} ${item.onClick ? 'cursor-pointer hover:bg-gray-700/50' : ''}`}
              whileHover={{ scale: 1.05 }}
              onClick={item.onClick}
              style={{ cursor: item.onClick ? 'pointer' : 'default' }}
            >
              <div className="flex items-center justify-center w-3 h-3">
                <Icon size={10} />
              </div>
              <span className="hidden sm:inline font-medium">{item.value}</span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-black/85 backdrop-blur-sm border border-gray-700/60 rounded-lg p-2.5 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2.5">
        {/* Header with improved alignment */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white tracking-wide">
            System Status
          </h3>
          <div className="flex items-center gap-1.5">
            <Keyboard size={10} className="text-gray-400" />
            <Smartphone size={10} className="text-gray-400" />
          </div>
        </div>

        {/* Main Status Items with optimized grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {statusItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className={`flex items-start gap-2 p-2 rounded-md bg-gray-800/60 border border-gray-700/30 ${item.onClick ? 'cursor-pointer hover:bg-gray-700/60 hover:border-gray-600/50' : ''}`}
                whileHover={item.onClick ? { scale: 1.02 } : {}}
                onClick={item.onClick}
              >
                {/* Icon container with fixed size for alignment */}
                <div className="flex-shrink-0 flex items-center justify-center w-4 h-4">
                  <Icon size={12} className={item.color} />
                </div>

                {/* Content with improved text alignment */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="text-[9px] text-gray-400 leading-none font-medium uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div
                    className={`text-[10px] font-semibold ${item.color} leading-none`}
                  >
                    {item.value}
                  </div>
                </div>

                {/* Shortcut badge with better positioning */}
                {item.shortcut && (
                  <div className="flex-shrink-0 flex items-center">
                    <kbd className="text-[7px] bg-gray-700/80 px-1.5 py-0.5 rounded text-gray-300 font-mono border border-gray-600/50">
                      {item.shortcut}
                    </kbd>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Component Status with improved spacing */}
        <div className="border-t border-gray-700/50 pt-2">
          <div className="text-[9px] text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
            Components
          </div>
          <div className="flex gap-3">
            {componentStatus.map((component, index) => (
              <div
                key={index}
                className={`flex items-center gap-1.5 text-[9px] ${component.color}`}
              >
                <div className="flex items-center justify-center w-3 h-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      component.active
                        ? 'bg-current animate-pulse shadow-sm'
                        : 'bg-gray-600'
                    }`}
                  />
                </div>
                <span className="font-medium">{component.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts with enhanced layout */}
        <div className="border-t border-gray-700/50 pt-2">
          <div className="text-[9px] text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
            Shortcuts
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center justify-between bg-gray-800/40 px-1.5 py-1 rounded border border-gray-700/30">
              <span className="text-[9px] text-gray-400 font-medium">
                Reset:
              </span>
              <kbd className="text-[7px] bg-gray-700/80 px-1.5 py-0.5 rounded text-gray-300 font-mono border border-gray-600/50">
                R
              </kbd>
            </div>
            <div className="flex items-center justify-between bg-gray-800/40 px-1.5 py-1 rounded border border-gray-700/30">
              <span className="text-[9px] text-gray-400 font-medium">
                Exit:
              </span>
              <kbd className="text-[7px] bg-gray-700/80 px-1.5 py-0.5 rounded text-gray-300 font-mono border border-gray-600/50">
                Esc
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Ultra-compact hideable status indicator
export function FloatingStatus({ className = '' }: { className?: string }) {
  const { animationsPaused, inverterActive, switchActive } =
    useEnergySystemStore();
  const { effectiveTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioEnabled, setAudioEnabledState] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAudioEnabledState(getAudioEnabled());
    setMounted(true);
  }, []);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    setAudioEnabledState(newState);
  };

  if (!mounted) return null;

  return (
    <motion.div
      className={`fixed bottom-3 left-3 z-40 ${className}`}
      initial={{ x: -60, opacity: 0 }}
      animate={{
        x: isExpanded ? 0 : -45,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="bg-black/95 backdrop-blur-sm border border-gray-600/40 rounded-md overflow-hidden shadow-lg">
        {/* Ultra-compact indicator strip (always visible) */}
        <div className="flex flex-col w-3 bg-gray-900/90">
          <div
            className={`h-1.5 ${animationsPaused ? 'bg-yellow-400' : 'bg-green-400'} ${!animationsPaused ? 'animate-pulse' : ''}`}
          />
          <div
            className={`h-1.5 ${inverterActive ? 'bg-blue-400' : 'bg-gray-700'} ${inverterActive ? 'animate-pulse' : ''}`}
          />
          <div
            className={`h-1.5 ${switchActive ? 'bg-green-400' : 'bg-gray-700'} ${switchActive ? 'animate-pulse' : ''}`}
          />
          <div
            className={`h-1.5 ${audioEnabled ? 'bg-cyan-400' : 'bg-gray-700'}`}
          />
          <div
            className={`h-1.5 ${effectiveTheme === 'dark' ? 'bg-purple-400' : 'bg-orange-400'}`}
          />
        </div>

        {/* Compact expanded panel */}
        <motion.div
          className="absolute left-3 top-0 bg-black/98 backdrop-blur-sm border-l border-gray-600/40 rounded-r-md"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isExpanded ? 140 : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        >
          {isExpanded && (
            <div className="p-2 space-y-1 w-32">
              <div className="text-xs font-medium text-white mb-1">Status</div>

              {/* Compact status items */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {animationsPaused ? <Pause size={8} /> : <Play size={8} />}
                    <span className="text-gray-400 text-xs">Anim</span>
                  </div>
                  <span
                    className={`text-xs ${animationsPaused ? 'text-yellow-400' : 'text-green-400'}`}
                  >
                    {animationsPaused ? 'Pause' : 'Run'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${inverterActive ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}
                    />
                    <span className="text-gray-400 text-xs">Inv</span>
                  </div>
                  <span
                    className={`text-xs ${inverterActive ? 'text-blue-400' : 'text-gray-500'}`}
                  >
                    {inverterActive ? 'On' : 'Off'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${switchActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}
                    />
                    <span className="text-gray-400 text-xs">Sw</span>
                  </div>
                  <span
                    className={`text-xs ${switchActive ? 'text-green-400' : 'text-gray-500'}`}
                  >
                    {switchActive ? 'On' : 'Off'}
                  </span>
                </div>

                <div
                  className="flex items-center justify-between text-xs cursor-pointer hover:bg-gray-800/50 rounded px-0.5 py-0.5"
                  onClick={toggleAudio}
                >
                  <div className="flex items-center gap-1">
                    {audioEnabled ? <Volume2 size={8} /> : <VolumeX size={8} />}
                    <span className="text-gray-400 text-xs">Audio</span>
                  </div>
                  <span
                    className={`text-xs ${audioEnabled ? 'text-cyan-400' : 'text-gray-500'}`}
                  >
                    {audioEnabled ? 'On' : 'Off'}
                  </span>
                </div>
              </div>

              {/* Mini shortcuts */}
              <div className="border-t border-gray-700/30 pt-1 mt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Space</span>
                  <span className="text-gray-600">R</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
