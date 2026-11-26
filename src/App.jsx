import { useState } from 'react';
import ContactForm from './ContactForm.jsx';
import Photo from './components/Photo.jsx';
import Reveal from './components/Reveal.jsx';
import { BUSINESS, HERO_IMAGE, SERVICES, GALLERY, REASONS } from './data.js';

const WHATSAPP = `https://wa.me/91${BUSINESS.phone}?text=${encodeURIComponent(BUSINESS.whatsappMessage)}`;

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container nav">
          <a href="#top" className="brand" aria-label="Balumama Earthmovers home">
            <span className="brand-mark">BE</span>
            <span>
              <strong>{BUSINESS.name}</strong>
              <small>EARTHMOVERS</small>
            </span>
          </a>
          <button className="menu-btn" aria-label="Toggle menu" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? '✕' : '☰'}
          </button>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
            <a href="#services">Services</a>
            <a href="#machinery">Machinery</a>
            <a href="#why">Why Us</a>
            <a href="#contact">Contact</a>
            <a href={`tel:+91${BUSINESS.phone}`} className="btn btn-yellow">Call Now</a>
          </nav>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="container hero-grid">
          <div className="hero-text">
            <p className="blessing">{BUSINESS.blessing}</p>
            <h1>
              Build Stronger...
              <span>Dig Deeper...</span>
            </h1>
            <p className="lead">{BUSINESS.intro}</p>
            <div className="hero-actions">
              <a href={`tel:+91${BUSINESS.phone}`} className="btn btn-yellow">Call {BUSINESS.phone}</a>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-outline">WhatsApp Us</a>
              <a href="#contact" className="btn btn-outline">Send Enquiry</a>
            </div>
          </div>
          <figure className="hero-photo">
            <img src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} />
          </figure>
        </div>
        <div className="container">
          <div className="stats">
            <div className="stat"><b>35–50 ft</b><span>Well excavation without ramp</span></div>
            <div className="stat"><b>220 &amp; 380</b><span>Excavator models on site</span></div>
            <div className="stat"><b>JCB &amp; Breaker</b><span>Rock and hard ground work</span></div>
          </div>
          <a href="#services" className="scroll-cue">Scroll to explore ↓</a>
        </div>
      </section>

      <Reveal>
        <div className="slogan">{BUSINESS.slogan}</div>
      </Reveal>

      <section id="services">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Our Services</p>
            <h2>What we do</h2>
            <p>Professional excavation and earth moving, delivered on time and at fair rates.</p>
          </Reveal>
          <div className="grid-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <article className="service-card">
                  <div className="service-media">
                    <Photo src={s.image} alt={s.title} label={s.title} />
                    <span className="service-badge">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="service-body">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="machinery" className="section-dark">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Machinery Gallery</p>
            <h2>Our fleet</h2>
          </Reveal>
          <div className="gallery">
            {GALLERY.map((g, i) => (
              <Reveal key={g.name} delay={i * 100} className="gallery-slot">
                <figure className="gallery-item">
                  <Photo src={g.image} alt={g.name} label={g.name} />
                  <figcaption className="gallery-caption">
                    <h3>{g.name}</h3>
                    <p>{g.text}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="why">
        <div className="container contact-grid">
          <Reveal>
            <p className="eyebrow">Why Choose Us</p>
            <h2>Why choose Balumama Earthmovers?</h2>
            <p>Dependable crews and machines for projects where depth and reliability matter most.</p>
          </Reveal>
          <ul className="reasons">
            {REASONS.map((r, i) => (
              <Reveal key={r} delay={i * 80}>
                <li>{r}</li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="section-grey">
        <div className="container contact-grid">
          <Reveal className="contact-info">
            <p className="eyebrow">Contact Us</p>
            <h2>Get in touch</h2>
            <p><strong>{BUSINESS.person}</strong></p>
            <p>📞 <a href={`tel:+91${BUSINESS.phone}`}>{BUSINESS.phone}</a></p>
            <p><strong>Location:</strong><br />{BUSINESS.address}</p>
            <p className="slogan-inline">{BUSINESS.tagline}</p>
          </Reveal>
          <Reveal delay={150}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div>
            <h4>{BUSINESS.name} EARTHMOVERS</h4>
            <p>{BUSINESS.tagline}</p>
            <p>{BUSINESS.slogan}</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <p><a href="#services">Services</a></p>
            <p><a href="#machinery">Machinery</a></p>
            <p><a href="#contact">Contact</a></p>
          </div>
          <div>
            <h4>Reach Us</h4>
            <p>{BUSINESS.person}</p>
            <p><a href={`tel:+91${BUSINESS.phone}`}>+91 {BUSINESS.phone}</a></p>
            <p>{BUSINESS.address}</p>
          </div>
        </div>
        <div className="container copy">© {new Date().getFullYear()} Balumama Earthmovers. All rights reserved.</div>
      </footer>

      <a href={`tel:+91${BUSINESS.phone}`} className="fab" aria-label="Call Balumama Earthmovers">📞</a>
    </>
  );
}
