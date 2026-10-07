import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks.js'

export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const [ref, seen] = useInView({ threshold: 0.12 })
  return (
    <Tag ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

export function ProgressBar() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - innerHeight
      setP(h > 0 ? (scrollY / h) * 100 : 0)
    }
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  return <div className="progress" style={{ width: `${p}%` }} />
}

// Particle network that reacts to the cursor
export function ParticleBg() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d')
    let W, H, pts = [], raf
    const mouse = { x: -999, y: -999 }
    const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()
    const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return `${n >> 16},${(n >> 8) & 255},${n & 255}` }
    const resize = () => {
      W = cv.width = innerWidth; H = cv.height = innerHeight
      pts = Array.from({ length: Math.min(90, Math.floor((W * H) / 15000)) }, () => ({
        x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      }))
    }
    const move = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const draw = () => {
      const a = rgb(css('--a') || '#22d3ee'), b = rgb(css('--b') || '#6366f1')
      ctx.clearRect(0, 0, W, H)
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.fillStyle = `rgba(${b},.75)`
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill()
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 125) { ctx.strokeStyle = `rgba(${b},${0.2 * (1 - d / 125)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() }
        }
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        if (dm < 170) { ctx.strokeStyle = `rgba(${a},${0.6 * (1 - dm / 170)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke() }
      })
      raf = requestAnimationFrame(draw)
    }
    resize(); draw()
    addEventListener('resize', resize); addEventListener('mousemove', move)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('mousemove', move) }
  }, [])
  return <canvas ref={ref} className="bg-canvas" aria-hidden="true" />
}

// Glowing custom cursor (desktop / fine pointers only)
export function Cursor() {
  const dot = useRef(null), ring = useRef(null)
  const [hover, setHover] = useState(false)
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return
    document.body.classList.add('has-cursor')
    let x = 0, y = 0, rx = 0, ry = 0, raf
    const move = (e) => {
      x = e.clientX; y = e.clientY
      dot.current.style.transform = `translate(${x}px,${y}px)`
      setHover(!!e.target.closest('a,button,input,textarea,.card,.chip'))
    }
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    addEventListener('mousemove', move)
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', move); document.body.classList.remove('has-cursor') }
  }, [])
  return (
    <>
      <div ref={ring} className={`cursor-ring ${hover ? 'hover' : ''}`} />
      <div ref={dot} className="cursor-dot" />
    </>
  )
}

// 3D tilt + spotlight wrapper
export function Tilt({ children, className = '', onClick }) {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current, r = el.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`); el.style.setProperty('--my', `${y}px`)
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y / r.height) * 9}deg) rotateY(${(x / r.width - 0.5) * 9}deg) translateY(-6px)`
  }
  const leave = () => { ref.current.style.transform = '' }
  return (
    <div ref={ref} className={`card ${className}`} onMouseMove={move} onMouseLeave={leave} onClick={onClick}>
      {children}
    </div>
  )
}
