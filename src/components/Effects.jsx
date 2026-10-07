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

// Aurora background: slow morphing colour blobs, film grain and a light that follows the cursor
export function Aurora() {
  const glow = useRef(null)
  useEffect(() => {
    let x = innerWidth / 2, y = innerHeight / 3, tx = x, ty = y, raf
    const move = (e) => { tx = e.clientX; ty = e.clientY }
    const loop = () => {
      x += (tx - x) * 0.07; y += (ty - y) * 0.07
      if (glow.current) glow.current.style.transform = `translate(${x}px,${y}px)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    addEventListener('mousemove', move)
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', move) }
  }, [])
  return (
    <div className="aurora" aria-hidden="true">
      <i className="blob b1" /><i className="blob b2" /><i className="blob b3" /><i className="blob b4" />
      <div ref={glow} className="light" />
      <div className="grain" />
    </div>
  )
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
