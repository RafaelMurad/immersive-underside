import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import {
  TitleCard,
  NeonText,
  GlitchText,
  RetroButton,
  ScrollProgress,
  ScrollReveal,
  AnimatedText,
} from './components/ui';
import { FixedScene, DustParticles, CinematicEffects } from './components/three';
import { StrangerTitleSequence, AlphabetWall } from './features/hero';
import { ProjectCard, ProjectGrid } from './features/projects';
import { usePrefersReducedMotion, useGSAPSetup } from './hooks';
import './App.css';

// Sample projects data
const projects = [
  {
    title: 'Upside Down Portal',
    description:
      'A WebGL experiment featuring interactive portal effects and particle systems inspired by Stranger Things.',
    tags: ['Three.js', 'React', 'WebGL'],
    featured: true,
  },
  {
    title: 'Neon Dashboard',
    description:
      'Real-time data visualization with synthwave aesthetics and smooth animations.',
    tags: ['D3.js', 'TypeScript', 'GSAP'],
  },
  {
    title: 'Retro Game Engine',
    description: '8-bit style game engine with modern web technologies and CRT shader effects.',
    tags: ['Canvas API', 'Web Audio', 'JavaScript'],
  },
  {
    title: 'VHS Player',
    description:
      'Video player with authentic VHS tracking effects, scan lines, and tape distortion.',
    tags: ['Video.js', 'CSS Filters', 'React'],
  },
];

function App() {
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Initialize GSAP plugins
  useGSAPSetup();

  return (
    <MotionConfig reducedMotion="user">
      <Helmet>
        <title>Stranger Things Portfolio</title>
        <meta
          name="description"
          content="An immersive portfolio experience inspired by Stranger Things - featuring neon effects, 3D scenes, and retro 80s aesthetics"
        />
      </Helmet>

      {/* Title Sequence Intro */}
      {showIntro && !prefersReducedMotion && (
        <StrangerTitleSequence
          title="STRANGER"
          subtitle="PORTFOLIO"
          duration={8}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Fixed 3D Background */}
      {!prefersReducedMotion && (
        <FixedScene>
          <DustParticles count={300} size={0.02} speed={0.02} />
          <CinematicEffects bloom bloomIntensity={1} vignette noise={false} />
        </FixedScene>
      )}

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <main
        id="main-content"
        className={`content-wrapper ${isUpsideDown ? 'upside-down-filter' : ''}`}
      >
        {/* Hero Section */}
        <TitleCard title="STRANGER" subtitle="PORTFOLIO">
          <AnimatedText
            text="A journey into the Upside Down"
            animation="fadeUp"
            delay={0.5}
            as="p"
          />
          <div className="hero-buttons">
            <RetroButton onClick={() => setIsUpsideDown(!isUpsideDown)} variant="red">
              {isUpsideDown ? 'Return to Normal' : 'Enter the Upside Down'}
            </RetroButton>
          </div>
        </TitleCard>

        {/* About Section */}
        <section className="section about">
          <div className="container">
            <ScrollReveal animation="fadeUp">
              <h2 className="section-title">
                <NeonText color="cyan">About Me</NeonText>
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div className="about-content">
                <p>
                  I'm a frontend engineer passionate about creating immersive web experiences.
                  With expertise in React, TypeScript, and WebGL, I transform ideas into
                  visually stunning, performant applications.
                </p>
                <p>
                  This portfolio showcases the intersection of nostalgic aesthetics and
                  cutting-edge web technologies. Every effect you see - from the neon glows
                  to the 3D particles - is built with accessibility and performance in mind.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Projects Section */}
        <section className="section projects">
          <div className="container">
            <ScrollReveal animation="fadeUp">
              <h2 className="section-title">
                <NeonText color="pink">Projects</NeonText>
              </h2>
            </ScrollReveal>

            <ProjectGrid>
              {projects.map((project, index) => (
                <ScrollReveal key={project.title} animation="scale" delay={index * 0.1}>
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    featured={project.featured}
                  />
                </ScrollReveal>
              ))}
            </ProjectGrid>
          </div>
        </section>

        {/* Effects Showcase */}
        <section className="section showcase">
          <div className="container">
            <ScrollReveal animation="fadeUp">
              <h2 className="section-title">
                <NeonText color="red">Visual Effects</NeonText>
              </h2>
            </ScrollReveal>

            <div className="effects-grid">
              <ScrollReveal animation="slideLeft">
                <div className="effect-card neon-border">
                  <h3>Neon Glow</h3>
                  <div className="effect-demo">
                    <NeonText color="red" as="p">
                      HAWKINS
                    </NeonText>
                    <NeonText color="cyan" as="p">
                      INDIANA
                    </NeonText>
                    <NeonText color="pink" as="p">
                      1983
                    </NeonText>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="slideRight">
                <div className="effect-card neon-border-cyan">
                  <h3>Flickering Neon</h3>
                  <div className="effect-demo">
                    {!prefersReducedMotion && (
                      <NeonText color="red" flickering as="p">
                        DANGER
                      </NeonText>
                    )}
                    <NeonText color="subtle" pulsing as="p">
                      PULSING
                    </NeonText>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="slideLeft" delay={0.1}>
                <div className="effect-card neon-border-pink">
                  <h3>Glitch Effect</h3>
                  <div className="effect-demo">
                    <GlitchText text="THE UPSIDE DOWN" as="p" />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="slideRight" delay={0.1}>
                <div className="effect-card crt-screen">
                  <h3>CRT Screen</h3>
                  <div className="effect-demo">
                    <p>Scanlines and color fringing</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Alphabet Wall Section */}
        <section className="section alphabet-section">
          <div className="container">
            <ScrollReveal animation="fadeUp">
              <h2 className="section-title">
                <NeonText color="red">Message from the Upside Down</NeonText>
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="scale" delay={0.3}>
              <AlphabetWall message="HELLO" interactive autoPlay={false} />
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section contact vignette">
          <div className="container">
            <ScrollReveal animation="fadeUp">
              <h2 className="section-title">
                <NeonText color="cyan">Get in Touch</NeonText>
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.2}>
              <p className="contact-text">
                Interested in working together? Let's create something extraordinary.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="scale" delay={0.4}>
              <div className="contact-buttons">
                <RetroButton variant="red" size="large">
                  Send Message
                </RetroButton>
                <RetroButton variant="cyan" size="large">
                  View Resume
                </RetroButton>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>
              Built with <NeonText color="red">React</NeonText> +{' '}
              <NeonText color="cyan">Three.js</NeonText> +{' '}
              <NeonText color="pink">GSAP</NeonText>
            </p>
            <p className="footer-credits">
              Inspired by Stranger Things. Made with care for accessibility.
            </p>
            {prefersReducedMotion && (
              <p className="motion-notice">Reduced motion mode active</p>
            )}
          </div>
        </footer>
      </main>
    </MotionConfig>
  );
}

export default App;
