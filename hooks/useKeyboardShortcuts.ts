'use client';

import { useEffect, useCallback, useRef } from 'react';
import { playButtonClickSound } from '@/utils/sound';

interface KeyboardShortcutsConfig {
  onSpacePress?: () => void; // Pause/resume animations
  onRPress?: () => void; // Reset 3D model view
  onFPress?: () => void; // Toggle fullscreen mode
  onEscapePress?: () => void; // Exit fullscreen or close modals
  enabled?: boolean; // Enable/disable shortcuts
}

interface FullscreenAPI {
  requestFullscreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface FullscreenDocument {
  fullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  exitFullscreen?: () => Promise<void>;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig = {}) {
  const {
    onSpacePress,
    onRPress,
    onFPress,
    onEscapePress,
    enabled = true,
  } = config;

  const isFullscreen = useRef(false);
  const animationsPaused = useRef(false);

  // Fullscreen utilities
  const enterFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;

    const element = document.documentElement as HTMLElement & FullscreenAPI;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      isFullscreen.current = true;
      playButtonClickSound();
    } catch (error) {
      console.warn('Failed to enter fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;

    const doc = document as Document & FullscreenDocument;

    try {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
      isFullscreen.current = false;
      playButtonClickSound();
    } catch (error) {
      console.warn('Failed to exit fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen.current) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  // Check if currently in fullscreen
  const checkFullscreenStatus = useCallback(() => {
    if (typeof document === 'undefined') return false;

    const doc = document as Document & FullscreenDocument;
    const fullscreenElement =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    isFullscreen.current = !!fullscreenElement;
    return isFullscreen.current;
  }, []);

  // Default handlers
  const defaultSpaceHandler = useCallback(() => {
    animationsPaused.current = !animationsPaused.current;
    playButtonClickSound();

    // Dispatch custom event for animation control
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('grean:toggle-animations', {
          detail: { paused: animationsPaused.current },
        })
      );
    }
  }, []);

  const defaultRHandler = useCallback(() => {
    playButtonClickSound();

    // Dispatch custom event for 3D model reset
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('grean:reset-3d-view'));
    }
  }, []);

  const defaultFHandler = useCallback(() => {
    toggleFullscreen();
  }, [toggleFullscreen]);

  const defaultEscapeHandler = useCallback(() => {
    if (isFullscreen.current) {
      exitFullscreen();
    } else {
      playButtonClickSound();

      // Dispatch custom event for closing modals
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('grean:close-modals'));
      }
    }
  }, [exitFullscreen]);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          (onSpacePress || defaultSpaceHandler)();
          break;

        case 'KeyR':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            (onRPress || defaultRHandler)();
          }
          break;

        case 'KeyF':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            (onFPress || defaultFHandler)();
          }
          break;

        case 'Escape':
          event.preventDefault();
          (onEscapePress || defaultEscapeHandler)();
          break;
      }
    },
    [
      enabled,
      onSpacePress,
      onRPress,
      onFPress,
      onEscapePress,
      defaultSpaceHandler,
      defaultRHandler,
      defaultFHandler,
      defaultEscapeHandler,
    ]
  );

  // Set up event listeners
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    window.addEventListener('keydown', handleKeyDown);

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      checkFullscreenStatus();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'MSFullscreenChange',
        handleFullscreenChange
      );
    };
  }, [enabled, handleKeyDown, checkFullscreenStatus]);

  return {
    isFullscreen: isFullscreen.current,
    animationsPaused: animationsPaused.current,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    checkFullscreenStatus,
  };
}
