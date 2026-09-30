import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowDown, ArrowUpRight, Menu, X, Github } from 'lucide-react';
import ThroneScene from './ThroneScene';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: '01',
    title: 'DEEP PACKET',
    category: 'NETWORK ANALYSIS',
    tech: 'C++17 · PCAP · TLS · MULTITHREADING',
    description: 'Deep Packet Inspection engine for PCAP analysis, traffic classification, TLS SNI inspection and rule-based filtering.',
    href: 'https://github.com/Abhijitbot277/Deep_Packet',
  },
  {
    number: '02',
    title: 'AIR SENTINAL',
    category: 'SMART AUTOMATION · SIH',
    tech: 'ESP32 · H₂S · AI · BLE / WI-FI',
    description: 'Worker-safety wristband concept combining H₂S exposure indication, AI-assisted reading, worker identity, health status and connected alerts.',
    href: '#contact',
  },
  {
    number: '03',
    title: 'GREEN REVIVE',
    category: 'CLEAN TECHNOLOGY · SIH',
    tech: 'NIR · MEMS · FFT · ARDUINO',
    description: 'Photoacoustic plastic-sorting concept using modulated near-infrared sensing and signal analysis for material classification.',
    href: '#contact',
  },
  {
    number: '04',
    title: 'MORE IN BUILD',
    category: 'EXPERIMENTS',
    tech: 'WEB · AI · DESIGN · ENGINEERING',
    description: 'A growing collection of experiments across creative web interfaces, AI tooling, automation and engineering prototypes.',
    href: 'https://github.com/Abhijitbot277',
  },
];

const skills = [
  ['Frontend', 'React · TypeScript · JavaScript · HTML · CSS'],
  ['Engineering', 'Python · C++ · Basic electronics · Embedded concepts'],
  ['AI', 'AI fundamentals · Generative AI · AI-assisted development'],
  ['Tools', 'Git · GitHub · VS Code · Figma · Canva'],
  ['Creative', 'UI / UX · Video editing · Visual design'],
  ['Communication', 'Public speaking · Presentation · Collaboration'],
];

export default function App() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [heroProgress, setHeroProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const timer = window.setTimeout(() => setLoading(false), 900);

    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      if (!hero) return;

      gsap.to({}, {
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=2400',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setHeroProgress(self.progress);
          },
        },
      });

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el, { y: 34, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('.marquee-track').forEach((el) => {
        gsap.to(el, {
          xPercent: -25,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    }, heroRef);

    const cursor = document.querySelector<HTMLElement>('.cursor');
    const moveCursor = (e: MouseEvent) => {
      if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.12, overwrite: true });
    };
    window.addEventListener('mousemove', moveCursor);

    const hoverables = document.querySelectorAll<HTMLElement>('[data-cursor]');
    const enter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      cursor?.classList.add('is-active');
      if (cursor) cursor.dataset.label = target.dataset.cursor || '';
    };
    const leave = () => {
      cursor?.classList.remove('is-active');
      if (cursor) cursor.dataset.label = '';
    };
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('mousemove', moveCursor);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSent(true);
    e.currentTarget.reset();
  };

  return (
    <>
      <div className="loader" aria-hidden={!loading} data-hidden={!loading}>
        <div className="loader-inner">
          <span className="loader-mark">AS</span>
          <span>ABHIJIT → Loading experience...</span>
          <div className="loader-line"><i /></div>
        </div>
      </div>

      <div className="cursor" aria-hidden="true" />
      <div className="grain" />

      <header className="site-nav">
        <a className="brand" href="#home" data-cursor="HOME">ABHIJIT<span>/ PORTFOLIO</span></a>
        <nav className="desktop-nav" aria-label="Primary">
          <a href="#about" data-cursor="ABOUT">About</a>
          <a href="#work" data-cursor="WORK">Work</a>
          <a href="#skills" data-cursor="SKILLS">Skills</a>
          <a href="#services" data-cursor="SERVICES">What I Build</a>
          <a href="#contact" data-cursor="CONTACT">Contact</a>
        </nav>
        <a className="nav-cta" href="#contact">Let's Work Together <ArrowUpRight size={14} /></a>
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
          {['about', 'work', 'skills', 'services', 'contact'].map((id) => (
            <a key={id} href={'#' + id} onClick={() => setMenuOpen(false)}>{id}</a>
          ))}
        </div>
      )}

      <main>
        <section ref={heroRef} id="home" className="hero-master">
          <div className="hero-side hero-side-left">
            <p className="eyebrow reveal">CREATIVE DEVELOPER · EEE · BUILDER</p>
            <h1 className="hero-title reveal">BUILDING<br /><em>DIGITAL</em><br />EXPERIENCES.</h1>
            <p className="hero-lead reveal">I build digital experiences that combine engineering, design, AI exploration and interaction.</p>
            <div className="hero-actions reveal">
              <a className="button-solid" href="#work" data-cursor="VIEW">View My Work <ArrowUpRight size={16} /></a>
              <a className="button-line" href="#contact">Let's Work Together</a>
            </div>
          </div>

          <div className="hero-visual-wrap">
            <ThroneScene progress={heroProgress} />
            <div className="hero-progress" aria-hidden="true">
              <span>FRONT</span>
              <div><i style={{ transform: `scaleX(${heroProgress})` }} /></div>
              <span>360°</span>
            </div>
          </div>

          <div className="hero-side hero-side-right">
            <p className="vertical-label">SCROLL → ROTATE → EXPLORE</p>
            <div className="hero-index">01 / 360</div>
          </div>

          <a className="scroll-indicator" href="#about">SCROLL TO EXPLORE <ArrowDown size={15} /></a>
        </section>

        <section id="about" className="section about-section">
          <div className="section-kicker">01 — ABOUT</div>
          <div className="split">
            <h2 className="display">More than<br /><em>a developer.</em></h2>
            <div className="copy">
              <p>I’m Abhijit Singha, a B.Tech Electrical & Electronics Engineering student at SVIST under MAKAUT.</p>
              <p>I work across software, AI fundamentals, UI/UX, creative tools and engineering ideas, using projects to learn and turn concepts into working experiences.</p>
              <div className="stat-row">
                <div><strong>EEE</strong><span>Engineering</span></div>
                <div><strong>AI</strong><span>Exploration</span></div>
                <div><strong>SIH</strong><span>Project Work</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="marquee" aria-label="Areas of work">
          <div className="marquee-track">FULL-STACK DEVELOPMENT / CREATIVE DEVELOPMENT / AI PRODUCTS / WEB DESIGN / INTERACTIVE EXPERIENCES / FULL-STACK DEVELOPMENT / CREATIVE DEVELOPMENT /</div>
        </section>

        <section id="work" className="section work-section">
          <div className="section-top">
            <div><div className="section-kicker">02 — SELECTED WORK</div><h2 className="display small">Built to <em>matter.</em></h2></div>
            <span className="section-count">04 PROJECTS</span>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row reveal" key={project.number} data-cursor="VIEW">
                <div className="project-number">{project.number}</div>
                <div className="project-main">
                  <div className="project-meta">{project.category}</div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">{project.tech}</div>
                </div>
                <a href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined} className="project-link" aria-label={'View ' + project.title}><ArrowUpRight /></a>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <div className="section-kicker">03 — SKILLS</div>
          <div className="split skills-split">
            <h2 className="display small">Tools that<br /><em>move ideas.</em></h2>
            <div className="skill-lines">
              {skills.map(([label, value]) => (
                <div className="skill-line" key={label}><span>{label}</span><strong>{value}</strong></div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="section services-section">
          <div className="section-kicker">04 — WHAT I CAN DO</div>
          <h2 className="display service-heading">What I’m<br /><em>building.</em></h2>
          <div className="service-grid">
            {[
              ['01', 'Web Development', 'Building responsive websites and portfolio experiences while growing my frontend and development skills.'],
              ['02', 'AI & Automation', 'Exploring practical AI tools, local agents and automation workflows through hands-on projects.'],
              ['03', 'UI / UX & Creative Design', 'Creating clean interfaces, visual systems and interactive experiences with a focus on presentation.'],
              ['04', 'Engineering Projects', 'Turning EEE concepts and ideas into practical software, hardware and prototype projects.'],
              ['05', 'Hackathon Projects', 'Working on problem-focused ideas, technical documentation, presentations and prototypes for competitions such as SIH.'],
              ['06', 'Learning & Experimentation', 'Continuously experimenting with new technologies and turning what I learn into visible projects.'],
            ].map(([n, title, desc]) => (
              <article key={n} className="service-item" data-cursor="EXPLORE">
                <span>{n}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight />
              </article>
            ))}
          </div>
        </section>

        <section className="section why-section">
          <div className="section-kicker">05 — WHY WORK WITH ME</div>
          <div className="split">
            <h2 className="display small">A student<br /><em>who builds.</em></h2>
            <div className="copy">
              <p>I’m not presenting myself as a finished expert. I’m a student actively learning, building and improving through real projects.</p>
              <div className="editorial-list">
                {[
                  ['01', 'Engineering + Software', 'EEE background combined with hands-on software and AI exploration.'],
                  ['02', 'Project First', 'I learn by turning ideas into working prototypes and documented projects.'],
                  ['03', 'Curious by Default', 'I enjoy exploring unfamiliar tools, technologies and technical problems.'],
                  ['04', 'Practical Mindset', 'I focus on making ideas understandable, presentable and useful.'],
                  ['05', 'Always Improving', 'Every project is an opportunity to improve my technical and creative skills.'],
                ].map(([n, title, desc]) => (
                  <div key={n} className="student-strength">
                    <span>{n}</span>
                    <div><strong>{title}</strong><p>{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section community-section">
          <div className="section-kicker">06 — BUILDING BEYOND CODE</div>
          <div className="split">
            <h2 className="display small">Learning in<br /><em>public.</em></h2>
            <div className="copy"><p>I’m building a public trail of projects, experiments and engineering ideas across GitHub.</p><a className="text-link" href="https://github.com/Abhijitbot277" target="_blank" rel="noreferrer">Explore GitHub <ArrowUpRight size={16} /></a></div>
          </div>
        </section>

        <section className="section testimonial-section">
          <div className="section-kicker">07 — TESTIMONIALS</div>
          <div className="testimonial-empty"><span>REAL WORDS ONLY</span><p>Testimonials will be added from real client or collaborator feedback.</p></div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="section-kicker">08 — CONTACT</div>
          <div className="split contact-split">
            <div><h2 className="display">Have an idea?<br /><em>Let's build it.</em></h2><p className="contact-copy">Whether you need a premium portfolio, business website or custom digital product, let's create something people remember.</p><div className="socials"><a href="https://github.com/Abhijitbot277" target="_blank" rel="noreferrer"><Github size={17}/> GitHub</a></div></div>
            <form onSubmit={submitForm} className="contact-form">
              <label>Name<input name="name" required placeholder="Your name" /></label>
              <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
              <label>Project Type<select name="type" defaultValue=""><option value="" disabled>Select one</option><option>Portfolio Website</option><option>Business Website</option><option>Interactive Website</option><option>AI Web Application</option><option>Custom Development</option></select></label>
              <label>Message<textarea name="message" required rows={5} placeholder="Tell me what you want to build..." /></label>
              <button className="button-solid" type="submit">Let's Build <ArrowUpRight size={16} /></button>
              {formSent && <p className="form-note">Brief captured locally. Connect through GitHub to continue the conversation.</p>}
            </form>
          </div>
        </section>

        <section className="final-cta">
          <p>YOUR NEXT WEBSITE COULD LOOK LIKE THIS.</p>
          <h2>LET'S MAKE<br /><em>IT HAPPEN.</em></h2>
          <a className="button-solid" href="#contact">Start a Project <ArrowUpRight size={17} /></a>
        </section>
      </main>

      <footer><span>ABHIJIT SINGHA</span><span>BUILT WITH CURIOSITY + CODE</span><span>© 2026</span></footer>
    </>
  );
}
