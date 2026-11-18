/**
 * Web Audio API procedural sound engine for the Smart Industrial Safety Helmet showcase.
 * Faithful reproduction of:
 * - Subtle electronic startup tones
 * - Precision assembly sounds & soft mechanical clicks
 * - Low industrial ambience
 * - Robotic movement & conveyor motors
 * - Restrained warning pulse during emergency alert
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;

  // Sound source nodes
  private ambienceOsc: OscillatorNode | null = null;
  private ambienceGain: GainNode | null = null;
  private ambienceFilter: BiquadFilterNode | null = null;

  private conveyorOsc: OscillatorNode | null = null;
  private conveyorGain: GainNode | null = null;

  private warningInterval: number | null = null;
  private clickInterval: number | null = null;
  private lastSceneId: number = -1;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.startContinuousBeds();
    } catch (e) {
      console.warn('Web Audio not available', e);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private startContinuousBeds() {
    if (!this.ctx || !this.masterGain) return;

    // Low industrial room ambience (soft filtered drone)
    this.ambienceOsc = this.ctx.createOscillator();
    this.ambienceOsc.type = 'sine';
    this.ambienceOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

    this.ambienceFilter = this.ctx.createBiquadFilter();
    this.ambienceFilter.type = 'lowpass';
    this.ambienceFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.ambienceOsc.connect(this.ambienceFilter);
    this.ambienceFilter.connect(this.ambienceGain);
    this.ambienceGain.connect(this.masterGain);
    this.ambienceOsc.start();

    // Conveyor motor subtle rhythmic hum
    this.conveyorOsc = this.ctx.createOscillator();
    this.conveyorOsc.type = 'triangle';
    this.conveyorOsc.frequency.setValueAtTime(74, this.ctx.currentTime);

    this.conveyorGain = this.ctx.createGain();
    this.conveyorGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

    this.conveyorOsc.connect(this.conveyorGain);
    this.conveyorGain.connect(this.masterGain);
    this.conveyorOsc.start();
  }

  /**
   * Called on every timeline update (currentTime in seconds, isPlaying boolean)
   */
  public updateSceneAudio(currentTime: number, isPlaying: boolean) {
    if (!this.ctx || !isPlaying || this.isMuted) {
      this.stopWarningPulse();
      this.stopAssemblyClicks();
      return;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Determine current scene
    let currentSceneId = 1;
    if (currentTime >= 40) currentSceneId = 7;
    else if (currentTime >= 32) currentSceneId = 6;
    else if (currentTime >= 26) currentSceneId = 5;
    else if (currentTime >= 19) currentSceneId = 4;
    else if (currentTime >= 13) currentSceneId = 3;
    else if (currentTime >= 7) currentSceneId = 2;
    else currentSceneId = 1;

    // Detect scene transitions
    if (currentSceneId !== this.lastSceneId) {
      this.handleSceneEnter(currentSceneId);
      this.lastSceneId = currentSceneId;
    }

    // Scene-specific continuous adjustments
    if (currentSceneId === 1) {
      if (!this.clickInterval) {
        this.startAssemblyClicks();
      }
    } else {
      this.stopAssemblyClicks();
    }

    if (currentSceneId === 5) {
      if (!this.warningInterval) {
        this.startWarningPulse();
      }
    } else {
      this.stopWarningPulse();
    }

    // Dynamic ambience scaling
    if (this.ambienceGain && this.ctx) {
      const targetAmbience = currentSceneId === 6 ? 0.16 : currentSceneId === 3 ? 0.12 : 0.07;
      this.ambienceGain.gain.setTargetAtTime(targetAmbience, this.ctx.currentTime, 0.2);
    }

    // Conveyor presence in wide factory scene
    if (this.conveyorGain && this.ctx) {
      const targetConveyor = currentSceneId === 6 ? 0.08 : 0.02;
      this.conveyorGain.gain.setTargetAtTime(targetConveyor, this.ctx.currentTime, 0.2);
    }
  }

  private handleSceneEnter(sceneId: number) {
    if (!this.ctx || !this.masterGain) return;

    if (sceneId === 2) {
      // Scene 2: Electronic startup tones
      this.playStartupChime();
    } else if (sceneId === 4) {
      // Scene 4: Visor HUD initialization tone
      this.playHudInitTone();
    } else if (sceneId === 6) {
      // Scene 6: Robotic movement servo sweep
      this.playRoboticServo();
    } else if (sceneId === 7) {
      // Scene 7: Hero resolving harmonic tone
      this.playHeroResolveTone();
    }
  }

  /**
   * Subtle electronic startup tones (Scene 2, 7-13s)
   */
  public playStartupChime() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const frequencies = [440, 554.37, 659.25, 880]; // A major 7th chord ascent

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);

      gain.gain.setValueAtTime(0, now + idx * 0.14);
      gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.14 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 1.0);
    });
  }

  /**
   * Visor HUD soft activation tone (Scene 4)
   */
  private playHudInitTone() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.25); // E6

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  /**
   * Precision assembly sounds: soft mechanical clicks and ESD contacts (Scene 1)
   */
  private startAssemblyClicks() {
    if (this.clickInterval) return;
    this.clickInterval = window.setInterval(() => {
      this.playPrecisionClick();
    }, 1400);
  }

  private stopAssemblyClicks() {
    if (this.clickInterval) {
      clearInterval(this.clickInterval);
      this.clickInterval = null;
    }
  }

  public playPrecisionClick() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400 + Math.random() * 800, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Restrained warning pulse during emergency alert (Scene 5, 26-32s)
   * Urgent but not chaotic, controlled amber/red warning tone
   */
  private startWarningPulse() {
    if (this.warningInterval) return;
    this.playWarningBeep(); // immediate first beep
    this.warningInterval = window.setInterval(() => {
      this.playWarningBeep();
    }, 850);
  }

  private stopWarningPulse() {
    if (this.warningInterval) {
      clearInterval(this.warningInterval);
      this.warningInterval = null;
    }
  }

  private playWarningBeep() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Dual-tone harmonic pulse: 640Hz + 760Hz
    [640, 760].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.setValueAtTime(0.12, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  /**
   * Robotic arm movement servo sound (Scene 6)
   */
  public playRoboticServo() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.8);
    osc.frequency.exponentialRampToValueAtTime(120, now + 1.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
    gain.gain.setValueAtTime(0.05, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.1);
  }

  /**
   * Resolving hero drone & callout chime (Scene 7)
   */
  public playHeroResolveTone() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.9);
  }

  /**
   * Interactive callout pin click sound
   */
  public playCalloutClick() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public stopAll() {
    this.stopWarningPulse();
    this.stopAssemblyClicks();
  }
}

export const soundEngine = new SoundEngine();
