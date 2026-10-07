import { useEffect, useState } from 'react'
import { profile, stats, marquee, skills, job, projects, education, themes } from '../data/content.js'
import { useTyped, useInView, useCountUp, useScrollSpy } from '../hooks.js'
import { Reveal, Tilt } from './Effects.jsx'

const NAV = ['about', 'skills', 'experience', 'projects', 'education', 'contact']

export function Navbar({ theme, setTheme }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(['home', ...NAV])
  useEffect(() => {
    const f = () => setScrolled(scrollY > 30)
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#home" className="logo" onClick={() => setOpen(false)}>
        <span className="logo-mark">A</span>un<span className="dotc">.</span>
      </a>
      <nav className={`menu ${open ? 'open' : ''}`} aria-label="Main">
        {NAV.map((id) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setOpen(false)}>{id}</a>
        ))}
        <div className="swatches" aria-label="Accent color">
          {themes.map((t) => (
            <button key={t.id} title={t.id} aria-label={`${t.id} theme`} className={theme === t.id ? 'on' : ''}
              style={{ background: `linear-gradient(135deg,${t.a},${t.b})` }} onClick={() => setTheme(t.id)} />
          ))}
        </div>
      </nav>
      <button className={`burger ${open ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
    </header>
  )
}

export function Hero() {
  const typed = useTyped(profile.roles)
  const [ref, seen] = useInView({ threshold: 0.3 })
  return (
    <section id="home" className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="badge"><i className="pulse" /> Available for new opportunities</p>
          <p className="eyebrow mono">&lt;hello world /&gt; I'm</p>
          <h1>Syed M. <span className="grad">Aun Naqvi</span></h1>
          <p className="typed"><span className="mono">I build </span><span className="mono grad-text">{typed}</span><span className="caret">▍</span></p>
          <p className="lead">Frontend developer from Karachi crafting fast, responsive and intuitive web applications with React.js, turning complex designs into interfaces people love using.</p>
          <div className="cta">
            <a href="#projects" className="btn primary">Explore my work <span>→</span></a>
            <a href={profile.resume} download className="btn ghost">Download résumé ↓</a>
          </div>
          <div className="socials">
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={`mailto:${profile.email}`}>Email</a>
          </div>
        </div>

        <div className="hero-card" aria-hidden="true">
          <div className="code-win">
            <div className="win-bar"><i /><i /><i /><span className="mono">developer.jsx</span></div>
            <pre className="mono">
{`const developer = {
  name: "Aun Naqvi",
  role: "Frontend Engineer",
  stack: ["React", "Redux",
          "TypeScript"],
  location: "Karachi, PK",
  focus: "Performance & UX",
  coffee: Infinity,
};

developer.build("something great");`}
            </pre>
          </div>
          <div className="float f1">⚛️ React</div>
          <div className="float f2">⚡ Fast</div>
          <div className="float f3">📱 Responsive</div>
        </div>
      </div>

      <ul className="stats" ref={ref}>
        {stats.map((s) => <Stat key={s.label} s={s} on={seen} />)}
      </ul>
      <a href="#about" className="scroll" aria-label="Scroll down"><span /></a>
    </section>
  )
}

function Stat({ s, on }) {
  const v = useCountUp(s.n, on)
  return <li><b>{v}{s.suffix}</b><span>{s.label}</span></li>
}

export function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">{items.map((m, i) => <span key={i}>{m}<i>✦</i></span>)}</div>
    </div>
  )
}

export function SectionHead({ no, kicker, children }) {
  return (
    <Reveal className="head">
      <p className="kicker mono"><span>{no}</span> {kicker}</p>
      <h2>{children}</h2>
    </Reveal>
  )
}

export function About() {
  return (
    <section id="about" className="section">
      <div className="wrap about">
        <SectionHead no="01" kicker="About me">Clean code. <span className="grad-text">Sharp interfaces.</span></SectionHead>
        <div className="about-grid">
          <Reveal className="about-text">
            {profile.about.map((p, i) => <p key={i}>{p}</p>)}
            <div className="facts">
              <div><span className="mono">Based in</span>{profile.location}</div>
              <div><span className="mono">Currently</span>MindsCollide</div>
              <div><span className="mono">Degree</span>BS Computer Science</div>
            </div>
          </Reveal>
          <Reveal delay={150} className="about-points">
            {[['⚡', 'Performance first', 'Optimized load times and buttery interactions.'],
              ['📱', 'Truly responsive', 'Pixel-perfect on every screen size.'],
              ['🧪', 'Quality driven', 'Clean code, unit tests and documentation.'],
              ['🤝', 'Team player', 'Collaborative leadership that moves teams forward.']].map(([i, t, d]) => (
              <div key={t} className="point"><span className="pi">{i}</span><div><h4>{t}</h4><p>{d}</p></div></div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Skills() {
  const tabs = Object.keys(skills)
  const [tab, setTab] = useState(tabs[0])
  const [ref, seen] = useInView({ threshold: 0.25 })
  const items = skills[tab]
  return (
    <section id="skills" className="section alt">
      <div className="wrap" ref={ref}>
        <SectionHead no="02" kicker="Skills">My <span className="grad-text">toolkit</span></SectionHead>
        <Reveal className="tabs">
          {tabs.map((t) => <button key={t} className={`tab ${t === tab ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
        </Reveal>
        <div key={tab} className="skill-panel">
          {tab === 'Technical' ? (
            <div className="bars">
              {items.map((s) => (
                <div className="bar" key={s.name}>
                  <label>{s.name}<i className="mono">{seen ? s.v : 0}%</i></label>
                  <div><span style={{ width: seen ? `${s.v}%` : 0 }} /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="chips">{items.map((s, i) => <span className="chip" key={s} style={{ animationDelay: `${i * 45}ms` }}>{s}</span>)}</div>
          )}
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="wrap">
        <SectionHead no="03" kicker="Experience">Where I've <span className="grad-text">made impact</span></SectionHead>
        <div className="timeline">
          <Reveal className="job">
            <span className="node" />
            <div className="job-head">
              <div><h3>{job.title}</h3><p className="org">{job.company}</p></div>
              <span className="period mono">{job.period}</span>
            </div>
            <ul>{job.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Projects() {
  const [sel, setSel] = useState(null)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setSel(null)
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [])
  return (
    <section id="projects" className="section alt">
      <div className="wrap">
        <SectionHead no="04" kicker="Projects">Selected <span className="grad-text">work</span></SectionHead>
        <div className="cards">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <Tilt onClick={() => setSel(p)}>
                <span className="num mono">{p.id}</span>
                <div className="p-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p className="tag">{p.tagline}</p>
                <p className="sum">{p.summary}</p>
                <div className="tech">{p.tech.slice(0, 4).map((t) => <span key={t}>{t}</span>)}</div>
                <span className="more">View details →</span>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
      {sel && (
        <div className="modal-bg" onClick={() => setSel(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="x" aria-label="Close" onClick={() => setSel(null)}>×</button>
            <div className="p-icon big">{sel.icon}</div>
            <h3>{sel.title}</h3>
            <p className="tag">{sel.tagline}</p>
            <p className="sum">{sel.summary}</p>
            <ul>{sel.points.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="tech">{sel.tech.map((t) => <span key={t}>{t}</span>)}</div>
          </div>
        </div>
      )}
    </section>
  )
}

export function Education() {
  return (
    <section id="education" className="section">
      <div className="wrap">
        <SectionHead no="05" kicker="Education">Always <span className="grad-text">learning</span></SectionHead>
        <div className="edu-grid">
          {education.map((e, i) => (
            <Reveal key={e.title} delay={i * 100} className="edu">
              <span className="ei">{e.icon}</span>
              <span className="mono when">{e.when}</span>
              <h3>{e.title}</h3>
              <p>{e.org}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.target)
    const subject = encodeURIComponent(`Portfolio enquiry from ${f.get('name')}`)
    const body = encodeURIComponent(`${f.get('msg')}\n\n— ${f.get('name')} (${f.get('email')})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true); e.target.reset()
    setTimeout(() => setSent(false), 5000)
  }
  const items = [['Email', profile.email, `mailto:${profile.email}`], ['Phone', profile.phone, `tel:${profile.tel}`],
    ['LinkedIn', 'aun-naqvi', profile.linkedin], ['GitHub', 'aunrazanaqvi', profile.github], ['Location', profile.location]]
  return (
    <section id="contact" className="section alt">
      <div className="wrap">
        <SectionHead no="06" kicker="Contact">Let's build something <span className="grad-text">great</span></SectionHead>
        <div className="contact-grid">
          <Reveal className="c-list">
            {items.map(([l, v, h]) => h
              ? <a key={l} className="c-item" href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noreferrer"><span className="mono">{l}</span>{v}</a>
              : <div key={l} className="c-item"><span className="mono">{l}</span>{v}</div>)}
          </Reveal>
          <Reveal delay={120}>
            <form className="form" onSubmit={submit}>
              <input name="name" placeholder="Your name" required />
              <input name="email" type="email" placeholder="Your email" required />
              <textarea name="msg" rows="5" placeholder="Tell me about your project…" required />
              <button className="btn primary" type="submit">Send message <span>→</span></button>
              <p className="note" aria-live="polite">{sent ? '✓ Opening your email app — thanks for reaching out!' : ''}</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {profile.name} · Built with React</p>
      <button aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </footer>
  )
}
