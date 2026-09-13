// Rotating project prompts with a typewriter effect.
// Prompts live in the markup (.prompt-list) so the section still reads
// without JavaScript; this script hides the list and types them out instead.
;(() => {
  const TYPE_MS = 28 // base delay per character
  const DELETE_MS = 14
  const HOLD_MS = 2400
  const GAP_MS = 450

  const container = document.querySelector('.prompts')
  const target = document.querySelector('.prompt-typed')
  const items = [...document.querySelectorAll('.prompt-list li')]
  if (!container || !target || items.length === 0) return

  const prompts = items.map((li) => li.textContent.trim()).filter(Boolean)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  document.documentElement.classList.replace('no-js', 'js')

  let index = 0
  let timer = 0
  let generation = 0

  const wait = (ms) =>
    new Promise((resolve) => {
      timer = window.setTimeout(resolve, ms)
    })

  // Each loop step checks that no newer loop has replaced it.
  const stale = (gen) => gen !== generation

  const jitter = (base, spread) => base + Math.random() * spread

  // Per-character delay that mimics a human typist: quick bursts through
  // words, a beat at spaces, a longer pause after punctuation, and the
  // occasional hesitation.
  const delayAfter = (char, next) => {
    if (/[.?!]/.test(char) && next === ' ') return jitter(320, 220)
    if (/[,;:]/.test(char)) return jitter(160, 120)
    if (char === ' ') return jitter(TYPE_MS * 1.6, 60)
    if (Math.random() < 0.06) return jitter(TYPE_MS * 3, 140)
    return jitter(TYPE_MS * 0.6, TYPE_MS * 1.2)
  }

  const typeOut = async (text, gen) => {
    for (let i = 1; i <= text.length; i++) {
      if (stale(gen)) return
      target.textContent = text.slice(0, i)
      await wait(delayAfter(text[i - 1], text[i]))
    }
  }

  const deleteOut = async (text, gen) => {
    for (let i = text.length - 1; i >= 0; i--) {
      if (stale(gen)) return
      target.textContent = text.slice(0, i)
      // Deleting speeds up as it goes, like holding backspace.
      await wait(i > text.length - 6 ? DELETE_MS * 3 : DELETE_MS)
    }
  }

  const run = async (gen) => {
    while (!stale(gen)) {
      const text = prompts[index]
      index = (index + 1) % prompts.length

      if (reduceMotion.matches) {
        // No typing animation: swap the full sentence in place.
        target.textContent = text
        await wait(HOLD_MS + 1500)
        continue
      }

      await typeOut(text, gen)
      await wait(HOLD_MS)
      await deleteOut(text, gen)
      await wait(GAP_MS)
    }
  }

  const start = () => {
    window.clearTimeout(timer)
    target.textContent = ''
    run(++generation)
  }

  // Pause while the tab is hidden; restart with a fresh prompt on return.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.clearTimeout(timer)
      generation++
    } else {
      start()
    }
  })

  start()
})()
