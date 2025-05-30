'use client';

import { useRef } from 'react';
import { useEnergySystemStore } from '@/store/energySystemStore';
import StaticSwitchNode from '@/components/static-nodes/static-switch-node';
import StaticInverterNode from '@/components/static-nodes/inverter';
import PowerFlowAnimation from '@/components/animations/power-flow-animation';

import { playButtonClickSound } from '@/utils/sound';
import { useIsMobile } from '@/hooks/use-mobile';

interface PremiumInteractiveDemoProps {
  showInfoPanel: boolean;
  setShowInfoPanel: (show: boolean) => void;
  containerWidth: number;
  containerHeight: number;
  showEnergyAnimation?: boolean;
  setShowEnergyAnimation?: (show: boolean) => void;
  onSwitchChange?: (active: boolean) => void;
}

export default function PremiumInteractiveDemo({
  showInfoPanel,
  setShowInfoPanel,
  containerWidth,
  containerHeight,
  onSwitchChange,
}: PremiumInteractiveDemoProps) {
  const demoRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  const { inverterActive, switchActive, setInverterActive, setSwitchActive } =
    useEnergySystemStore();

  // Calculate component positions with mobile-specific adjustments
  const getComponentPositions = () => {
    // Use a larger scale for better visibility
    const scale = Math.max(
      0.7,
      Math.min(containerWidth / 1200, containerHeight / 800)
    );

    // Center the components in the container
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    if (isMobile) {
      // Mobile layout: Stack components vertically
      // Position inverter at the top
      const inverterX = centerX;
      const inverterY = centerY - containerHeight * 0.25; // Move inverter up

      // Position switch at the very bottom of the container section
      const switchX = centerX;
      const switchY = containerHeight + 30; // Move switch down 20px more (was +10, now +30)

      // PowerFlow connects in straight line directly to center of switch
      const powerFlowStartY = inverterY + 60; // Start further below inverter
      const powerFlowEndY = switchY; // End directly at center of switch

      return {
        inverterPosition: { x: inverterX, y: inverterY },
        switchPosition: { x: switchX, y: switchY },
        powerFlowStart: { x: centerX, y: powerFlowStartY },
        powerFlowEnd: { x: centerX + 50, y: powerFlowEndY }, // Move PowerFlow end point 50px to the right
        scale,
      };
    } else {
      // Desktop layout: Keep original horizontal layout
      const inverterX = centerX - containerWidth * 0.35; // Move inverter further left
      const switchX = centerX + containerWidth * 0.25; // Move switch right of center
      const inverterY = centerY - containerHeight * 0.4; // Move inverter up even more
      const powerFlowY = centerY; // Keep power flow at center
      const switchY = centerY; // Keep switch at center

      return {
        inverterPosition: { x: inverterX, y: inverterY },
        switchPosition: { x: switchX, y: switchY },
        powerFlowStart: { x: inverterX, y: powerFlowY },
        powerFlowEnd: { x: switchX, y: powerFlowY },
        scale,
      };
    }
  };

  const {
    inverterPosition,
    switchPosition,
    powerFlowStart,
    powerFlowEnd,
    scale,
  } = getComponentPositions();

  // Handle inverter activation
  const handleInverterChange = (active: boolean) => {
    setInverterActive(active);
    playButtonClickSound();
  };

  // Handle switch activation
  const handleSwitchChange = (active: boolean) => {
    setSwitchActive(active);
    playButtonClickSound();

    if (onSwitchChange) {
      onSwitchChange(active);
    }
  };

  return (
    <div
      ref={demoRef}
      className="relative flex items-center justify-center"
      style={{
        width: '100%',
        height: '100%',
        minHeight: isMobile ? '700px' : '480px', // Increase height for mobile to accommodate vertical layout with proper spacing
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Power Flow Animation */}
      <PowerFlowAnimation
        inverterOn={inverterActive}
        inverterPosition={powerFlowStart}
        switchPosition={powerFlowEnd}
        scale={scale}
      />

      {/* Inverter Component */}
      <div
        className="absolute"
        style={{
          left: `${inverterPosition.x}px`,
          top: `${inverterPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
      >
        <StaticInverterNode
          position={{ x: 0, y: 0 }}
          inverterOn={inverterActive}
          onInverterChange={handleInverterChange}
          scale={scale}
          key={inverterActive ? 'on' : 'off'}
        />
      </div>

      {/* Switch Component */}
      <div
        className="absolute"
        style={{
          left: `${switchPosition.x}px`,
          top: `${switchPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
      >
        <StaticSwitchNode
          position={{ x: 0, y: 0 }}
          switchOn={switchActive}
          onSwitchChange={handleSwitchChange}
          scale={isMobile ? scale * 2 * 0.8 : scale * 2} // Reduce by 20% on mobile (0.8 = 80% of original)
        />
      </div>
    </div>
  );
}
