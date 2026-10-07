import { useEffect, useRef, useState } from 'react'

export function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    }, options)
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen]
}

export function useTyped(words, speed = 65) {
  const [text, setText] = useState('')
  useEffect(() => {
    let w = 0, c = 0, del = false, t
    const tick = () => {
      const word = words[w]
      setText(word.slice(0, c))
      if (!del && c === word.length) { del = true; t = setTimeout(tick, 1500); return }
      if (del && c === 0) { del = false; w = (w + 1) % words.length }
      c += del ? -1 : 1
      t = setTimeout(tick, del ? speed / 2 : speed)
    }
    tick()
    return () => clearTimeout(t)
  }, [])
  return text
}

export function useCountUp(target, active, duration = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf, start
    const step = (ts) => {
      start ??= ts
      const p = Math.min((ts - start) / duration, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, target])
  return v
}

export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const onScroll = () => {
      let cur = ids[0]
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = id
      })
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return active
}
