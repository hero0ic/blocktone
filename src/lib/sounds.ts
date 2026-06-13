import { getScoreTier, type ScoreTier } from "@/lib/score-label";

type SoundName = "slider" | "submit" | "challenge" | "highScore" | "play";

let audioContext: AudioContext | null = null;
let globalVolume = 0.7;

const VOLUME_KEY = "blocktone-volume";

const SCORE_JINGLE_NOTES = [523, 659, 784, 1047];
const NOTE_GAP_MS = 120;
const NOTE_DURATION_S = 0.18;

const THUD_HIGH_HZ = 180;
const THUD_LOW_HZ = 120;

const TIER_THUD_PITCH: Record<ScoreTier, number> = {
  perfect: 1,
  excellent: 0.95,
  great: 0.88,
  good: 0.8,
  close: 0.72,
  keepTrying: 0.64,
};

export function initVolume(): number {
  if (typeof window === "undefined") return globalVolume;
  const stored = localStorage.getItem(VOLUME_KEY);
  if (stored !== null) {
    const v = parseFloat(stored);
    if (!Number.isNaN(v)) globalVolume = Math.max(0, Math.min(1, v));
  }
  return globalVolume;
}

export function getVolume(): number {
  return globalVolume;
}

export function setVolume(value: number): void {
  globalVolume = Math.max(0, Math.min(1, value));
  if (typeof window !== "undefined") {
    localStorage.setItem(VOLUME_KEY, String(globalVolume));
  }
}

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.08
) {
  const ctx = getContext();
  if (!ctx || globalVolume <= 0) return;

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const scaled = volume * globalVolume;

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = scaled;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

function playScoreJingle(pitchMultiplier: number, repeats = 1) {
  const jingleLengthMs = SCORE_JINGLE_NOTES.length * NOTE_GAP_MS;
  const repeatGapMs = 280;

  for (let repeat = 0; repeat < repeats; repeat++) {
    const repeatOffsetMs = repeat * (jingleLengthMs + repeatGapMs);
    SCORE_JINGLE_NOTES.forEach((freq, index) => {
      window.setTimeout(() => {
        playTone(
          freq * pitchMultiplier,
          NOTE_DURATION_S,
          "square",
          0.07
        );
      }, repeatOffsetMs + index * NOTE_GAP_MS);
    });
  }
}

let clickNoiseBuffer: AudioBuffer | null = null;

function getClickNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const durationS = 0.012;
  const length = Math.ceil(ctx.sampleRate * durationS);

  if (clickNoiseBuffer && clickNoiseBuffer.length === length) {
    return clickNoiseBuffer;
  }

  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.sin(i * 17.31) * Math.cos(i * 9.13);
  }

  clickNoiseBuffer = buffer;
  return buffer;
}

/** Dry Minecraft UI button click — noise transient + low-mid body thud. */
function playMinecraftUiClick() {
  const ctx = getContext();
  if (!ctx || globalVolume <= 0) return;

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = globalVolume;
  master.connect(ctx.destination);

  const noiseDuration = 0.012;
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = getClickNoiseBuffer(ctx);

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 3000;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.09, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDuration);

  noiseSource.connect(highpass);
  highpass.connect(noiseGain);
  noiseGain.connect(master);
  noiseSource.start(now);
  noiseSource.stop(now + noiseDuration);

  const bodyDuration = 0.04;
  const body = ctx.createOscillator();
  body.type = "triangle";
  body.frequency.value = 210;

  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(0.1, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + bodyDuration);

  body.connect(bodyGain);
  bodyGain.connect(master);
  body.start(now);
  body.stop(now + bodyDuration);
}

function playSubmitThud(pitchMultiplier: number) {
  playTone(THUD_HIGH_HZ * pitchMultiplier, 0.12, "triangle", 0.1);
  setTimeout(
    () => playTone(THUD_LOW_HZ * pitchMultiplier, 0.15, "triangle", 0.08),
    60
  );
}

/** Submit thud (pitch drops per tier) + jingle for Perfect, Excellent, and Great. */
export function playScoreResultSound(accuracy: number) {
  const tier = getScoreTier(accuracy);
  playSubmitThud(TIER_THUD_PITCH[tier]);
  if (tier === "perfect" || tier === "excellent" || tier === "great") {
    setTimeout(() => playScoreJingle(1, 1), 200);
  }
}

export function playSound(name: SoundName) {
  switch (name) {
    case "slider":
      playTone(160 + Math.random() * 40, 0.05, "triangle", 0.06);
      break;
    case "submit":
      playSubmitThud(1);
      break;
    case "challenge":
      playTone(330, 0.08, "square", 0.06);
      setTimeout(() => playTone(440, 0.08, "square", 0.06), 80);
      setTimeout(() => playTone(550, 0.1, "square", 0.07), 160);
      break;
    case "highScore":
      playScoreJingle(1, 1);
      break;
    case "play":
      playMinecraftUiClick();
      break;
  }
}
