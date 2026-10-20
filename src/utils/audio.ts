/**
 * Web Audio API synthesizer + HTML5 Custom Audio for background music and festive effects
 */

let audioCtx: AudioContext | null = null;
let bgmTimer: number | null = null;
let isBgmPlaying = false;
let isMuted = false;

// Audio Configuration (managed by admin)
let currentBgmStyle: 'romantic_lullaby' | 'birthday_musicbox' | 'piano_dream' | 'custom_url' = 'romantic_lullaby';
let currentCustomUrl: string = '';
let currentConfettiSound: 'sparkle' | 'popper' | 'chime' | 'horn' | 'silent' = 'sparkle';
let customAudio: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  get isMuted() {
    return isMuted;
  },

  setMuted(mute: boolean) {
    isMuted = mute;
    if (mute && isBgmPlaying) {
      this.stopBgm();
    }
  },

  toggleMute() {
    this.setMuted(!isMuted);
    return isMuted;
  },

  configure(settings?: {
    bgmStyle?: 'romantic_lullaby' | 'birthday_musicbox' | 'piano_dream' | 'custom_url';
    customAudioUrl?: string;
    confettiSound?: 'sparkle' | 'popper' | 'chime' | 'horn' | 'silent';
    soundFxEnabled?: boolean;
    musicEnabled?: boolean;
  }) {
    if (!settings) return;
    if (settings.bgmStyle) currentBgmStyle = settings.bgmStyle;
    if (settings.customAudioUrl !== undefined) currentCustomUrl = settings.customAudioUrl;
    if (settings.confettiSound) currentConfettiSound = settings.confettiSound;
    if (settings.soundFxEnabled !== undefined) {
      this.setMuted(!settings.soundFxEnabled);
    }
  },

  get confettiSound() {
    return currentConfettiSound;
  },

  get bgmStyle() {
    return currentBgmStyle;
  },

  // Soft button tap
  playTap() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // audio error
    }
  },

  // Confetti celebration sound (plays whichever sound the admin configured!)
  playConfetti(forcedSound?: 'sparkle' | 'popper' | 'chime' | 'horn' | 'silent') {
    if (isMuted) return;
    const soundToPlay = forcedSound || currentConfettiSound;

    if (soundToPlay === 'silent') return;
    if (soundToPlay === 'sparkle') {
      this.playSparkle();
    } else if (soundToPlay === 'popper') {
      this.playPartyPopper();
    } else if (soundToPlay === 'chime') {
      this.playHappyBirthdayChime();
    } else if (soundToPlay === 'horn') {
      this.playPartyHorn();
    } else {
      this.playSparkle();
    }
  },

  // Celestial sparkle / fairy dust chime
  playSparkle() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);

        const startTime = ctx.currentTime + idx * 0.04;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch {
      // audio error
    }
  },

  // Party popper snap
  playPartyPopper() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);

      // Soft sizzle
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
    } catch {
      // audio error
    }
  },

  // Happy Birthday Melodic Chime
  playHappyBirthdayChime() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [
        { freq: 392.00, time: 0.0, dur: 0.2 },
        { freq: 392.00, time: 0.22, dur: 0.18 },
        { freq: 440.00, time: 0.42, dur: 0.35 },
        { freq: 392.00, time: 0.8, dur: 0.35 },
        { freq: 523.25, time: 1.2, dur: 0.4 },
        { freq: 493.88, time: 1.65, dur: 0.7 }
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + n.time + n.dur + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.time);
        osc.stop(ctx.currentTime + n.time + n.dur + 0.25);
      });
    } catch {
      // audio error
    }
  },

  // Party horn
  playPartyHorn() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // audio error
    }
  },

  // Candle blow sound
  playCandleBlow() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.25);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime + 0.05);
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.25);

      oscGain.gain.setValueAtTime(0.05, ctx.currentTime + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(ctx.currentTime + 0.05);
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // audio error
    }
  },

  // Balloon pop
  playBalloonPop() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);

      oscGain.gain.setValueAtTime(0.22, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);

      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
    } catch {
      // audio error
    }
  },

  // Magical gift opening fanfare
  playGiftOpen() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [392.0, 523.25, 659.25, 783.99, 987.77, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const startTime = ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {
      // audio error
    }
  },

  // Background Music Manager (Supports 3 distinct styles + Custom Audio track)
  startBgm(forcedStyle?: 'romantic_lullaby' | 'birthday_musicbox' | 'piano_dream' | 'custom_url', forcedUrl?: string) {
    if (isMuted) return;
    this.stopBgm();

    const style = forcedStyle || currentBgmStyle;
    const url = forcedUrl !== undefined ? forcedUrl : currentCustomUrl;

    // Handle Custom Audio URL if configured
    if (style === 'custom_url' && url) {
      isBgmPlaying = true;
      try {
        if (!customAudio) {
          customAudio = new Audio(url);
          customAudio.loop = true;
        } else {
          customAudio.src = url;
        }
        customAudio.volume = 0.45;
        customAudio.play().catch(() => {
          // Auto-play was prevented by browser policy until gesture
        });
      } catch {
        // audio tag error
      }
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;
    isBgmPlaying = true;

    // 1. Romantic Lullaby: Soft, peaceful, dreamy music box
    if (style === 'romantic_lullaby') {
      const melody = [
        523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 440.0,
        523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 523.25
      ];
      let idx = 0;
      const playStep = () => {
        if (!isBgmPlaying || isMuted) return;
        const nowCtx = getAudioContext();
        if (!nowCtx) return;

        const freq = melody[idx % melody.length];
        idx++;

        try {
          const osc = nowCtx.createOscillator();
          const gain = nowCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, nowCtx.currentTime);

          gain.gain.setValueAtTime(0.035, nowCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0002, nowCtx.currentTime + 1.4);

          osc.connect(gain);
          gain.connect(nowCtx.destination);
          osc.start();
          osc.stop(nowCtx.currentTime + 1.45);
        } catch {}

        if (isBgmPlaying) {
          bgmTimer = window.setTimeout(playStep, 800);
        }
      };
      playStep();
    }
    // 2. Birthday Music Box: Classic Happy Birthday in warm bells
    else if (style === 'birthday_musicbox') {
      const bdayMelody = [
        { f: 349.23, dur: 450 }, { f: 349.23, dur: 350 }, { f: 392.00, dur: 700 }, { f: 349.23, dur: 700 }, { f: 466.16, dur: 700 }, { f: 440.00, dur: 1200 },
        { f: 349.23, dur: 450 }, { f: 349.23, dur: 350 }, { f: 392.00, dur: 700 }, { f: 349.23, dur: 700 }, { f: 523.25, dur: 700 }, { f: 466.16, dur: 1200 },
        { f: 349.23, dur: 450 }, { f: 349.23, dur: 350 }, { f: 698.46, dur: 700 }, { f: 587.33, dur: 700 }, { f: 466.16, dur: 700 }, { f: 440.00, dur: 700 }, { f: 392.00, dur: 1100 }
      ];
      let bIdx = 0;
      const playBdayStep = () => {
        if (!isBgmPlaying || isMuted) return;
        const nowCtx = getAudioContext();
        if (!nowCtx) return;

        const item = bdayMelody[bIdx % bdayMelody.length];
        bIdx++;

        try {
          const osc = nowCtx.createOscillator();
          const gain = nowCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(item.f, nowCtx.currentTime);

          gain.gain.setValueAtTime(0.038, nowCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0003, nowCtx.currentTime + (item.dur / 1000) * 1.5);

          osc.connect(gain);
          gain.connect(nowCtx.destination);
          osc.start();
          osc.stop(nowCtx.currentTime + (item.dur / 1000) * 1.6);
        } catch {}

        if (isBgmPlaying) {
          bgmTimer = window.setTimeout(playBdayStep, item.dur);
        }
      };
      playBdayStep();
    }
    // 3. Piano Dream: Slow gentle piano arpeggios
    else {
      const chords = [
        [261.63, 329.63, 392.00, 523.25], // C maj
        [220.00, 261.63, 329.63, 440.00], // A min
        [174.61, 220.00, 261.63, 349.23], // F maj
        [196.00, 246.94, 293.66, 392.00]  // G maj
      ];
      let chordIdx = 0;
      let noteInChord = 0;

      const playPianoStep = () => {
        if (!isBgmPlaying || isMuted) return;
        const nowCtx = getAudioContext();
        if (!nowCtx) return;

        const currentChord = chords[chordIdx % chords.length];
        const freq = currentChord[noteInChord % currentChord.length];
        noteInChord++;
        if (noteInChord >= currentChord.length) {
          noteInChord = 0;
          chordIdx++;
        }

        try {
          const osc = nowCtx.createOscillator();
          const gain = nowCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, nowCtx.currentTime);

          gain.gain.setValueAtTime(0.04, nowCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0002, nowCtx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(nowCtx.destination);
          osc.start();
          osc.stop(nowCtx.currentTime + 1.25);
        } catch {}

        if (isBgmPlaying) {
          bgmTimer = window.setTimeout(playPianoStep, 550);
        }
      };
      playPianoStep();
    }
  },

  stopBgm() {
    isBgmPlaying = false;
    if (bgmTimer !== null) {
      clearTimeout(bgmTimer);
      bgmTimer = null;
    }
    if (customAudio) {
      customAudio.pause();
      customAudio.currentTime = 0;
    }
  },

  toggleBgm() {
    if (isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  },

  get isBgmActive() {
    return isBgmPlaying;
  }
};
