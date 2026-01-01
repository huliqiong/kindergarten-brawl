
// A lightweight sound synthesizer using Web Audio API
// This avoids dependencies on external audio files and ensures sounds work offline.

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // We lazily initialize the context on the first user interaction
    // to comply with browser autoplay policies.
  }

  private init() {
    if (!this.ctx) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  // Call this on the first button click (e.g. Start Game)
  public async resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public play(type: 'click' | 'dice' | 'damage' | 'heal' | 'switch' | 'normal' | 'skill' | 'burst' | 'win' | 'lose') {
    if (this.isMuted || !this.ctx) return;
    this.resume(); // Ensure context is running

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    switch (type) {
      case 'click':
        // High pitch blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'dice':
        // White noise burst for shaking
        this.playNoise(0.15);
        break;

      case 'normal':
        // Punchy low decay
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.2);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;

      case 'skill':
        // Magical slide up
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.linearRampToValueAtTime(800, t + 0.4);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.4);
        
        // Add a secondary harmony
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.frequency.setValueAtTime(450, t);
        osc2.frequency.linearRampToValueAtTime(1200, t + 0.4);
        gain2.gain.setValueAtTime(0.1, t);
        gain2.gain.linearRampToValueAtTime(0, t + 0.4);
        osc2.start(t);
        osc2.stop(t + 0.4);
        
        osc.start(t);
        osc.stop(t + 0.4);
        break;

      case 'burst':
        // Power up sound - complex
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 1.5);
        
        // Tremolo effect
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 20;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 500;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t+1.5);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
        osc.start(t);
        osc.stop(t + 1.5);
        
        // Boom at the start
        this.playNoise(0.5, 0.4);
        break;

      case 'damage':
        // Low thud
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(10, t + 0.2);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;

      case 'heal':
        // Gentle chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, t);
        osc.frequency.linearRampToValueAtTime(1000, t + 0.5);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.2);
        gain.gain.linearRampToValueAtTime(0, t + 0.5);
        osc.start(t);
        osc.stop(t + 0.5);
        break;

      case 'switch':
        // Whoosh
        this.playNoise(0.3, 0.1);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.linearRampToValueAtTime(600, t + 0.2);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
        
      case 'win':
        // Major Arpeggio
        this.playNote(523.25, t, 0.2); // C
        this.playNote(659.25, t + 0.2, 0.2); // E
        this.playNote(783.99, t + 0.4, 0.2); // G
        this.playNote(1046.50, t + 0.6, 0.6); // C
        break;
        
      case 'lose':
         // Sad slide
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.linearRampToValueAtTime(50, t + 1);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 1);
        osc.start(t);
        osc.stop(t + 1);
        break;
    }
  }

  // Helper for noise (used in Dice, Switch)
  private playNoise(duration: number, volume: number = 0.2) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    
    // Bandpass filter to make it sound less harsh
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    noise.start();
  }

  private playNote(freq: number, time: number, duration: number) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      osc.start(time);
      osc.stop(time + duration);
  }
}

export const soundManager = new SoundManager();
