'use client';

// Audio generator for creating programmatic sound effects when files are not available

export class AudioGenerator {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('AudioContext not supported:', error);
      }
    }
  }

  private async ensureAudioContext(): Promise<AudioContext | null> {
    if (!this.audioContext) return null;

    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume AudioContext:', error);
        return null;
      }
    }

    return this.audioContext;
  }

  // Generate a button click sound
  async generateButtonClick(): Promise<void> {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Quick click sound: high frequency, short duration
      oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        800,
        ctx.currentTime + 0.1
      );

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.warn('Failed to generate button click:', error);
    }
  }

  // Generate typing sound
  async generateTyping(): Promise<void> {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Typing sound: mid frequency, very short
      oscillator.frequency.setValueAtTime(600, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (error) {
      // Silently handle audio generation errors in production
    }
  }

  // Generate alarm sound
  async generateAlarm(): Promise<void> {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Alarm: alternating frequencies
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.4);

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.6);
    } catch (error) {
      // Silently handle audio generation errors in production
    }
  }

  // Generate morning sunshine sound (nature-inspired ambient tones)
  async generateMorningSunshine(): Promise<void> {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      const duration = 4.0; // 4 seconds
      const currentTime = ctx.currentTime;

      // Create a gentle wind sound using filtered white noise
      const windBuffer = ctx.createBuffer(
        1,
        ctx.sampleRate * duration,
        ctx.sampleRate
      );
      const windData = windBuffer.getChannelData(0);

      for (let i = 0; i < windData.length; i++) {
        windData[i] = (Math.random() * 2 - 1) * 0.05; // Very gentle wind
      }

      const windSource = ctx.createBufferSource();
      const windFilter = ctx.createBiquadFilter();
      const windGain = ctx.createGain();

      windSource.buffer = windBuffer;
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(800, currentTime);

      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(ctx.destination);

      // Wind envelope - very gentle
      windGain.gain.setValueAtTime(0, currentTime);
      windGain.gain.linearRampToValueAtTime(0.02, currentTime + 0.5);
      windGain.gain.setValueAtTime(0.02, currentTime + 3.0);
      windGain.gain.linearRampToValueAtTime(0, currentTime + duration);

      // Create a gentle rising tone (sunrise feeling)
      const sunriseOsc = ctx.createOscillator();
      const sunriseGain = ctx.createGain();
      const sunriseFilter = ctx.createBiquadFilter();

      sunriseOsc.connect(sunriseFilter);
      sunriseFilter.connect(sunriseGain);
      sunriseGain.connect(ctx.destination);

      sunriseOsc.type = 'triangle';
      sunriseOsc.frequency.setValueAtTime(220, currentTime);
      sunriseOsc.frequency.exponentialRampToValueAtTime(
        440,
        currentTime + duration
      );

      sunriseFilter.type = 'lowpass';
      sunriseFilter.frequency.setValueAtTime(1000, currentTime);
      sunriseFilter.frequency.linearRampToValueAtTime(
        2000,
        currentTime + duration
      );

      // Sunrise tone envelope - very gentle
      sunriseGain.gain.setValueAtTime(0, currentTime);
      sunriseGain.gain.linearRampToValueAtTime(0.015, currentTime + 1.0);
      sunriseGain.gain.setValueAtTime(0.015, currentTime + 2.5);
      sunriseGain.gain.linearRampToValueAtTime(0, currentTime + duration);

      // Start all sounds
      windSource.start(currentTime);
      windSource.stop(currentTime + duration);

      sunriseOsc.start(currentTime);
      sunriseOsc.stop(currentTime + duration);

      console.log('Playing morning sunshine sound (4s nature ambient)');
    } catch (error) {
      console.warn('Failed to generate morning sunshine sound:', error);
    }
  }
}

// Singleton instance
let audioGenerator: AudioGenerator | null = null;

export function getAudioGenerator(): AudioGenerator {
  if (!audioGenerator) {
    audioGenerator = new AudioGenerator();
  }
  return audioGenerator;
}
