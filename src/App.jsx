import { useEffect, useState } from 'react'
import { themes } from './data/content.js'
import { ProgressBar, ParticleBg, Cursor } from './components/Effects.jsx'
import { Navbar, Hero, Marquee, About, Skills, Experience, Projects, Education, Contact, Footer } from './components/Sections.jsx'

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'cyan' } catch { return 'cyan' }
  })
  useEffect(() => {
    const t = themes.find((x) => x.id === theme) || themes[0]
    document.documentElement.style.setProperty('--a', t.a)
    document.documentElement.style.setProperty('--b', t.b)
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  return (
    <>
      <ProgressBar />
      <ParticleBg />
      <Cursor />
      <Navbar theme={theme} setTheme={setTheme} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
