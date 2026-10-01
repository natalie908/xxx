import confetti from 'canvas-confetti'

let shapes: confetti.Shape[] | null = null
const getShapes = () =>
  (shapes ??= ['🌺', '🦜', '🥥', '🐢', '🌴'].map((text) => confetti.shapeFromText({ text, scalar: 3 })))

export function burst() {
  confetti({ particleCount: 45, spread: 90, startVelocity: 45, origin: { y: 0.65 }, shapes: getShapes(), scalar: 3, ticks: 220 })
  confetti({ particleCount: 60, spread: 110, startVelocity: 35, origin: { y: 0.65 }, colors: ['#0fb5ae', '#ff8a4c', '#ffd166', '#3ec28f', '#ff6b81'] })
}

export function bigCelebration() {
  const end = Date.now() + 2500
  const tick = () => {
    confetti({ particleCount: 14, angle: 60, spread: 70, origin: { x: 0, y: 0.75 }, shapes: getShapes(), scalar: 3, ticks: 260 })
    confetti({ particleCount: 14, angle: 120, spread: 70, origin: { x: 1, y: 0.75 }, shapes: getShapes(), scalar: 3, ticks: 260 })
    confetti({ particleCount: 10, spread: 360, startVelocity: 25, origin: { x: Math.random(), y: Math.random() * 0.4 }, colors: ['#0fb5ae', '#ff8a4c', '#ffd166', '#3ec28f'] })
    if (Date.now() < end) setTimeout(tick, 180)
  }
  tick()
}

export function sunBurst() {
  confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 }, colors: ['#ffd166', '#ff8a4c', '#ffb703', '#fff1c1'] })
}

let ctx: AudioContext | null = null
const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 987.77] // pentatonika

export function pling() {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    const t = ctx.currentTime
    const f = NOTES[Math.floor(Math.random() * NOTES.length)]
    ;[f, f * 1.5].forEach((freq, i) => {
      const o = ctx!.createOscillator()
      const g = ctx!.createGain()
      o.type = 'sine'
      o.frequency.value = freq
      g.gain.setValueAtTime(0, t + i * 0.09)
      g.gain.linearRampToValueAtTime(0.16, t + i * 0.09 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.55)
      o.connect(g).connect(ctx!.destination)
      o.start(t + i * 0.09)
      o.stop(t + i * 0.09 + 0.6)
    })
  } catch {
    /* zvuk je jen bonus */
  }
}

export const buzz = () => navigator.vibrate?.(30)
