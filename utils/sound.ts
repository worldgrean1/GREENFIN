import { Howl } from 'howler';
import { getAudioGenerator } from './audioGenerator';

// Audio preferences interface
interface AudioPreferences {
  enabled: boolean;
  volume: number;
}

// Get audio preferences from localStorage
function getAudioPreferences(): AudioPreferences {
  if (typeof window === 'undefined') {
    return { enabled: true, volume: 0.3 };
  }

  try {
    const stored = localStorage.getItem('grean-audio-preferences');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load audio preferences:', error);
  }

  return { enabled: true, volume: 0.3 };
}

// Save audio preferences to localStorage
function saveAudioPreferences(preferences: AudioPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(
      'grean-audio-preferences',
      JSON.stringify(preferences)
    );
  } catch (error) {
    console.warn('Failed to save audio preferences:', error);
  }
}

// Sound effects library with fallback formats (only existing files)
const soundEffects = {
  typing: ['/sounds/typing.wav', '/sounds/typing.mp3'],
  buttonClick: ['/sounds/button-click.wav'],
  alarm: ['/sounds/alarm.wav'],
  morningSunshine: ['/sounds/magic-sunshine.m4a'],
};

// Create and cache sound instances
const soundInstances: { [key: string]: Howl } = {};
const soundLoadStatus: { [key: string]: 'loading' | 'loaded' | 'error' } = {};

function createSound(srcArray: string[], volume: number = 0.3): Howl {
  return new Howl({
    src: srcArray,
    volume,
    preload: true,
    onload: () => {
      const key = srcArray[0].split('/').pop()?.split('.')[0] || 'unknown';
      soundLoadStatus[key] = 'loaded';
    },
    onloaderror: (id: any, error: any) => {
      const key = srcArray[0].split('/').pop()?.split('.')[0] || 'unknown';
      soundLoadStatus[key] = 'error';
    },
  });
}

// Initialize sound instances
function initializeSounds(): void {
  const preferences = getAudioPreferences();

  Object.entries(soundEffects).forEach(([key, srcArray]) => {
    soundInstances[key] = createSound(srcArray, preferences.volume);
  });
}

// Play a sound effect with fallback to programmatic audio
async function playSound(soundKey: keyof typeof soundEffects): Promise<void> {
  const preferences = getAudioPreferences();

  if (!preferences.enabled) {
    return;
  }

  try {
    // Try to play the audio file first
    if (!soundInstances[soundKey]) {
      soundInstances[soundKey] = createSound(
        soundEffects[soundKey],
        preferences.volume
      );
      soundLoadStatus[soundKey] = 'loading';
    }

    // Check if the sound file loaded successfully
    const soundFile =
      soundEffects[soundKey][0].split('/').pop()?.split('.')[0] || soundKey;

    if (soundLoadStatus[soundKey] === 'loaded') {
      soundInstances[soundKey].volume(preferences.volume);
      soundInstances[soundKey].play();
      console.log(`Playing sound file: ${soundKey}`);
    } else if (soundLoadStatus[soundKey] === 'error') {
      // Fallback to programmatic audio
      console.log(`Sound file failed, using fallback for: ${soundKey}`);
      await playFallbackSound(soundKey);
    } else {
      // Still loading, try to play anyway
      soundInstances[soundKey].volume(preferences.volume);
      soundInstances[soundKey].play();
    }
  } catch (error) {
    console.warn(`Failed to play sound: ${soundKey}, trying fallback`, error);
    await playFallbackSound(soundKey);
  }
}

// Fallback to programmatic audio generation
async function playFallbackSound(
  soundKey: keyof typeof soundEffects
): Promise<void> {
  const audioGen = getAudioGenerator();

  try {
    switch (soundKey) {
      case 'buttonClick':
        await audioGen.generateButtonClick();
        break;
      case 'typing':
        await audioGen.generateTyping();
        break;
      case 'alarm':
        await audioGen.generateAlarm();
        break;
      case 'morningSunshine':
        await audioGen.generateMorningSunshine();
        break;
      // Removed fanNoise and inverterHum as they don't exist in AudioGenerator
      // case 'fanNoise':
      //   await audioGen.generateFanNoise();
      //   break;
      // case 'inverterHum':
      //   await audioGen.generateInverterHum();
      //   break;
      default:
        await audioGen.generateButtonClick(); // Default fallback
    }
  } catch (error) {
    // Silently handle fallback sound errors in production
  }
}

// Exported functions
export function playTypingSound(): void {
  playSound('typing').catch(() => {});
}

export function playButtonClickSound(): void {
  playSound('buttonClick').catch(() => {});
}

export function playAlarmSound(): void {
  playSound('alarm').catch(() => {});
}

export function playMorningSunshineSound(): void {
  playSound('morningSunshine').catch(() => {}); // Using magic-sunshine.m4a
}

// Get sound status for debugging (development only)
export function getSoundStatus(): { [key: string]: string } {
  return process.env.NODE_ENV === 'development' ? { ...soundLoadStatus } : {};
}

// Test individual sound file loading
export async function testSoundFile(filename: string): Promise<boolean> {
  return new Promise(resolve => {
    const sound = new Howl({
      src: [`/sounds/${filename}`],
      volume: 0.1,
      preload: true,
      onload: () => {
        console.log(`✅ ${filename} loaded successfully`);
        resolve(true);
      },
      onloaderror: (id: any, error: any) => {
        console.log(`❌ ${filename} failed to load:`, error);
        resolve(false);
      },
    });
  });
}

// Comprehensive audio system test
export async function runAudioDiagnostics(): Promise<void> {
  console.log('🔊 Running comprehensive audio diagnostics...');

  // Test all existing sound files
  const files = [
    'typing.wav',
    'typing.mp3',
    'button-click.wav',
    'alarm.wav',
    'magic-sunshine.m4a',
  ];

  console.log('Testing sound file loading...');
  for (const file of files) {
    await testSoundFile(file);
  }

  console.log('Audio diagnostics completed!');
}

// Audio preferences management
export function setAudioEnabled(enabled: boolean): void {
  const preferences = getAudioPreferences();
  preferences.enabled = enabled;
  saveAudioPreferences(preferences);
}

export function setAudioVolume(volume: number): void {
  const preferences = getAudioPreferences();
  preferences.volume = Math.max(0, Math.min(1, volume));
  saveAudioPreferences(preferences);

  // Update existing sound instances
  Object.values(soundInstances).forEach(sound => {
    sound.volume(preferences.volume);
  });
}

export function getAudioEnabled(): boolean {
  return getAudioPreferences().enabled;
}

export function getAudioVolume(): number {
  return getAudioPreferences().volume;
}

// Initialize sounds when module loads
if (typeof window !== 'undefined') {
  initializeSounds();
}
