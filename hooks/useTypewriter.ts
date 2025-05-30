'use client';

import { useState, useEffect } from 'react';

export function useTypewriter(text: string, speed = 50, delay = 0, shouldStart = true) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset state when shouldStart changes
    if (!shouldStart) {
      setDisplayText('');
      setIsTyping(false);
      setIsComplete(false);
      return;
    }

    let timeout: NodeJS.Timeout;

    // Initial delay before starting typing
    timeout = setTimeout(() => {
      setIsTyping(true);

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, shouldStart]);

  return { displayText, isTyping, isComplete };
}
