// Simple script to generate basic audio files using Node.js
// This creates minimal WAV files that can be used as placeholders

const fs = require('fs');
const path = require('path');

// Create a simple WAV file with a sine wave
function createWavFile(frequency, duration, filename) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const amplitude = 0.1; // Low volume

  // WAV header (44 bytes)
  const header = Buffer.alloc(44);

  // RIFF header
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + numSamples * 2, 4); // File size - 8
  header.write('WAVE', 8);

  // fmt chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Chunk size
  header.writeUInt16LE(1, 20); // Audio format (PCM)
  header.writeUInt16LE(1, 22); // Number of channels
  header.writeUInt32LE(sampleRate, 24); // Sample rate
  header.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  header.writeUInt16LE(2, 32); // Block align
  header.writeUInt16LE(16, 34); // Bits per sample

  // data chunk
  header.write('data', 36);
  header.writeUInt32LE(numSamples * 2, 40); // Data size

  // Generate audio data
  const audioData = Buffer.alloc(numSamples * 2);
  for (let i = 0; i < numSamples; i++) {
    const sample =
      Math.sin((2 * Math.PI * frequency * i) / sampleRate) * amplitude * 32767;
    audioData.writeInt16LE(Math.round(sample), i * 2);
  }

  // Combine header and data
  const wavFile = Buffer.concat([header, audioData]);

  // Write to file
  const soundsDir = path.join(__dirname, '..', 'public', 'sounds');
  if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(soundsDir, filename), wavFile);
  console.log(`Created ${filename} (${frequency}Hz, ${duration}s)`);
}

// Create noise for fan sound
function createNoiseWavFile(duration, filename) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const amplitude = 0.05; // Very low volume for noise

  // WAV header (44 bytes)
  const header = Buffer.alloc(44);

  // RIFF header
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + numSamples * 2, 4);
  header.write('WAVE', 8);

  // fmt chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);

  // data chunk
  header.write('data', 36);
  header.writeUInt32LE(numSamples * 2, 40);

  // Generate white noise
  const audioData = Buffer.alloc(numSamples * 2);
  for (let i = 0; i < numSamples; i++) {
    const sample = (Math.random() * 2 - 1) * amplitude * 32767;
    audioData.writeInt16LE(Math.round(sample), i * 2);
  }

  const wavFile = Buffer.concat([header, audioData]);

  const soundsDir = path.join(__dirname, '..', 'public', 'sounds');
  if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(soundsDir, filename), wavFile);
  console.log(`Created ${filename} (white noise, ${duration}s)`);
}

// Generate sound files
console.log('Generating sound files...');

// Button click - short high frequency beep
createWavFile(1000, 0.1, 'button-click.wav');

// Alarm - alternating tones (we'll just use one tone for simplicity)
createWavFile(800, 0.5, 'alarm.wav');

// Inverter hum - low frequency
createWavFile(60, 1.0, 'inverter-hum.wav');

// Fan noise - white noise
createNoiseWavFile(0.5, 'fan-noise.wav');

// Typing sound - very short click
createWavFile(600, 0.05, 'typing.wav');

console.log('Sound generation complete!');
console.log(
  'Note: These are basic WAV files. For production, consider using proper MP3 files.'
);
