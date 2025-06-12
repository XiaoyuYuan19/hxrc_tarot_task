export function animateShuffle(groupRef, onComplete) {
  const cards = Array.from(groupRef.current.children)
  const total = cards.length

  function tween(from, to, duration, apply, done) {
    const start = performance.now()
    function frame(now) {
      const t = Math.min((now - start) / duration, 1)
      apply(from + (to - from) * t)
      if (t < 1) requestAnimationFrame(frame)
      else done && done()
    }
    requestAnimationFrame(frame)
  }

  cards.forEach(m => {
    const lift = 1 + Math.random() * 0.5
    tween(m.position.y, m.position.y + lift, 300, v => (m.position.y = v))
  })

  setTimeout(() => {
    cards.forEach(m => {
      tween(m.position.x, (Math.random() - 0.5) * 1.5, 400, v => (m.position.x = v))
      tween(m.rotation.y,   0, 400, r => (m.rotation.y = r))
    })
  }, 350)

  setTimeout(() => {
    let done = 0
    cards.forEach((m, i) => {
      tween(m.position.x,   0,          500, v => (m.position.x = v))
      tween(m.position.y,  -i * 0.02,   500, v => (m.position.y = v))
      tween(m.position.z,   i * 0.001,  500, v => (m.position.z = v))
      tween(m.rotation.y,   0,          500, r => (m.rotation.y = r), () => {
        done++
        if (done === total && onComplete) onComplete()
      })
    })
  }, 800)
}
