/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Native Web Audio API Synthesizer for 8-bit sound effects and background BGM
class AudioSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmInterval: any = null;
  private bgmPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    }
    return this.isMuted;
  }

  public getMuteState(): boolean {
    return this.isMuted;
  }

  // Play a simple 8-bit coin sound effect
  public playCoin() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Super Mario coin is two notes: B5 (987.77 Hz) then E6 (1318.51 Hz)
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio coin error:', e);
    }
  }

  // Play a simple 8-bit jump sound effect
  public playJump() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Quick sweep from low to high
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.17);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      console.warn('Audio jump error:', e);
    }
  }

  // Play retro brick bump or hurt sound
  public playHit() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Dropping pitch
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn('Audio hit error:', e);
    }
  }

  // Play retro unlock/level-up chime
  public playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Arpeggio C Major C4-E4-G4-C5-E5-G5-C6
      const duration = 0.08;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'square';
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        const start = now + idx * duration;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + duration * 1.5);

        osc.start(start);
        osc.stop(start + duration * 1.8);
      });
    } catch (e) {
      console.warn('Audio level-up error:', e);
    }
  }

  // Play cute epic victory fan-fare
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Classic quick melody: C5 (0.1s), C5 (0.1s), C5 (0.1s), C5 (0.3s), G#4 (0.3s), A#4 (0.3s), C5 (0.6s)
      const notes = [
        { f: 523.25, d: 0.1, delay: 0.0 },
        { f: 523.25, d: 0.1, delay: 0.15 },
        { f: 523.25, d: 0.1, delay: 0.30 },
        { f: 523.25, d: 0.3, delay: 0.45 },
        { f: 415.30, d: 0.3, delay: 0.75 },
        { f: 466.16, d: 0.3, delay: 1.05 },
        { f: 523.25, d: 0.6, delay: 1.35 },
      ];

      notes.forEach((note) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'square';
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        const start = now + note.delay;
        osc.frequency.setValueAtTime(note.f, start);

        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + note.d);

        osc.start(start);
        osc.stop(start + note.d);
      });
    } catch (e) {
      console.warn('Audio victory error:', e);
    }
  }

  // Underworld / Secret Cave effect chimes
  public playSecretFound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4 -> C#5 -> E5 -> A5 ascending fast
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        const start = now + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.002, start + 0.2);

        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch (e) {
      console.warn('Audio secret chime error:', e);
    }
  }

  // Soft continuous rhythmic background accompaniment loop
  public startBGM() {
    if (this.isMuted || this.bgmPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.bgmPlaying = true;

      // retro super simple bass loop: C3, G3, A3, F3, C3, G3, C4, G3
      const bassMelody = [130.81, 196.00, 220.00, 174.61, 130.81, 196.00, 261.63, 196.00];
      const trebleMelody = [
        523.25, 0, 523.25, 523.25, 0, 392.00, 0, 0,
        440.00, 0, 440.00, 440.00, 0, 349.23, 0, 0
      ];
      let beat = 0;

      this.bgmInterval = setInterval(() => {
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;

        // Play bass note every 2 beats (every 0.6s)
        if (beat % 2 === 0) {
          const bassIdx = Math.floor(beat / 2) % bassMelody.length;
          const oscBass = this.ctx.createOscillator();
          const gainBass = this.ctx.createGain();
          oscBass.type = 'triangle';
          oscBass.connect(gainBass);
          gainBass.connect(this.ctx.destination);
          oscBass.frequency.setValueAtTime(bassMelody[bassIdx], now);
          gainBass.gain.setValueAtTime(0.06, now);
          gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          oscBass.start(now);
          oscBass.stop(now + 0.55);
        }

        // Play trebles notes every beat (every 0.3s)
        const trFreq = trebleMelody[beat % trebleMelody.length];
        if (trFreq > 0) {
          const oscTr = this.ctx.createOscillator();
          const gainTr = this.ctx.createGain();
          oscTr.type = 'sine';
          oscTr.connect(gainTr);
          gainTr.connect(this.ctx.destination);
          oscTr.frequency.setValueAtTime(trFreq, now);
          gainTr.gain.setValueAtTime(0.02, now);
          gainTr.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          oscTr.start(now);
          oscTr.stop(now + 0.22);
        }

        beat++;
      }, 300); // 100 BPM approx
    } catch (e) {
      console.warn('Audio BGM play error:', e);
    }
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audioSynth = new AudioSynth();
