# BlockTone - Minecraft Color Guessing Game

Restore distorted Minecraft textures by adjusting HSV sliders. Inspired by [Dialed.gg](https://dialed.gg) and Toon-Tone.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Gameplay

1. Pick a mode from the top-left nav: **blocks**, **items**, or **mobs**.
2. Read the mode description, choose **Daily** or **Unlimited**, then press **Play**.
3. A large Minecraft texture loads with a random HSV distortion.
4. Adjust **Hue**, **Saturation**, and **Value** — the image updates in real time.
5. **Submit** to score your restoration and compare Before · Your Result · Original.

## Mob Renders

Mobs use PNG renders from `public/images/mobs/` (not raw skin textures). Placeholder SVGs are included — swap them for PNGs and update the `render` path in `challenges.json`.

## Theming

Toggle light/dark mode with the button in the top-right corner. Preference is saved to localStorage.
