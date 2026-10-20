/**
 * Web Audio API synthesizer for sound effects and gentle ambient music box
 * Eliminates dependencies on external audio files that could fail to load.
 */

let audioCtx: AudioContext | null = null;
let bgmInterval: number | null = null;
let isBgmPlaying = false;
let isMuted = false;

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

  // Soft tap
  playTap() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio tap error', e);
    }
  },

  // Candle blow sound: filtered white noise + gentle pitch drop
  playCandleBlow() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      // Noise burst for puff
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

      // Soft extinguishing sparkle tone
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime + 0.05); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.25); // E6

      oscGain.gain.setValueAtTime(0.05, ctx.currentTime + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(ctx.currentTime + 0.05);
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio blow error', e);
    }
  },

  // Balloon pop: punchy transient + noise snap
  playBalloonPop() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      // Fast downward sine sweep
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);

      oscGain.gain.setValueAtTime(0.25, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);

      // Noise pop
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      console.warn('Audio pop error', e);
    }
  },

  // Celestial sparkle / fairy dust chime
  playSparkle() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
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
    } catch (e) {
      console.warn('Audio sparkle error', e);
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
    } catch (e) {
      console.warn('Audio gift error', e);
    }
  },

  // Ambient gentle music box tune
  startBgm() {
    if (isBgmPlaying || isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    isBgmPlaying = true;
    const melody = [
      523.25, 587.33, 659.25, 783.99, // C5, D5, E5, G5
      659.25, 587.33, 523.25, 440.0,  // E5, D5, C5, A4
      523.25, 659.25, 783.99, 880.0,  // C5, E5, G5, A5
      783.99, 659.25, 587.33, 523.25   // G5, E5, D5, C5
    ];
    let noteIdx = 0;

    const playNextNote = () => {
      if (!isBgmPlaying || isMuted) return;
      const nowCtx = getAudioContext();
      if (!nowCtx) return;

      const freq = melody[noteIdx % melody.length];
      noteIdx++;

      try {
        const osc = nowCtx.createOscillator();
        const gain = nowCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, nowCtx.currentTime);

        // Music box soft attack & ringing decay
        gain.gain.setValueAtTime(0.035, nowCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, nowCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(nowCtx.destination);
        osc.start();
        osc.stop(nowCtx.currentTime + 1.25);
      } catch (e) {
        // audio node error
      }
    };

    playNextNote();
    bgmInterval = window.setInterval(playNextNote, 950);
  },

  stopBgm() {
    isBgmPlaying = false;
    if (bgmInterval !== null) {
      clearInterval(bgmInterval);
      bgmInterval = null;
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
