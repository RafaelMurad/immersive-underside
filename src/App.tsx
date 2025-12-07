import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TitleCard, NeonText, GlitchText, RetroButton } from './components/ui';
import { usePrefersReducedMotion } from './hooks';
import './App.css';

function App() {
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <Helmet>
        <title>Stranger Things Portfolio</title>
        <meta
          name="description"
          content="An immersive portfolio experience inspired by Stranger Things"
        />
      </Helmet>

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <main id="main-content" className={isUpsideDown ? 'upside-down-filter' : ''}>
        {/* Hero Section with Title Card */}
        <TitleCard title="STRANGER" subtitle="THINGS">
          <p>A portfolio journey into the Upside Down</p>
          <div className="hero-buttons">
            <RetroButton
              onClick={() => setIsUpsideDown(!isUpsideDown)}
              variant="red"
            >
              {isUpsideDown ? 'Return to Normal' : 'Enter the Upside Down'}
            </RetroButton>
          </div>
        </TitleCard>

        {/* Effects Showcase Section */}
        <section className="section showcase">
          <div className="container">
            <h2 className="section-title">
              <NeonText color="pink">Visual Effects</NeonText>
            </h2>

            <div className="effects-grid">
              {/* Neon Text Variants */}
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

              {/* Flickering Neon */}
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

              {/* Glitch Text */}
              <div className="effect-card neon-border-pink">
                <h3>Glitch Effect</h3>
                <div className="effect-demo">
                  <GlitchText text="THE UPSIDE DOWN" as="p" />
                </div>
              </div>

              {/* Glitch on Hover */}
              <div className="effect-card neon-border">
                <h3>Hover Glitch</h3>
                <div className="effect-demo">
                  <GlitchText text="HOVER OVER ME" hoverOnly as="p" />
                </div>
              </div>

              {/* CRT Screen */}
              <div className="effect-card crt-screen">
                <h3>CRT Screen</h3>
                <div className="effect-demo">
                  <p>Scanlines and color fringing</p>
                </div>
              </div>

              {/* Film Grain */}
              <div className="effect-card film-grain">
                <h3>Film Grain</h3>
                <div className="effect-demo">
                  <p>Nostalgic texture overlay</p>
                </div>
              </div>
            </div>

            {/* Button Variants */}
            <div className="button-showcase">
              <h3 className="neon-text-subtle">Interactive Buttons</h3>
              <div className="button-row">
                <RetroButton variant="red">Red Variant</RetroButton>
                <RetroButton variant="cyan">Cyan Variant</RetroButton>
                <RetroButton variant="pink">Pink Variant</RetroButton>
              </div>
              <div className="button-row">
                <RetroButton variant="red" size="small">
                  Small
                </RetroButton>
                <RetroButton variant="cyan" size="medium">
                  Medium
                </RetroButton>
                <RetroButton variant="pink" size="large">
                  Large
                </RetroButton>
              </div>
            </div>
          </div>
        </section>

        {/* Vignette Demo */}
        <section className="section vignette-demo vignette">
          <div className="container">
            <h2>
              <NeonText color="red">Vignette Effect</NeonText>
            </h2>
            <p>Dark edges draw focus to the center content</p>
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
            {prefersReducedMotion && (
              <p className="motion-notice">
                Reduced motion mode active - animations minimized
              </p>
            )}
          </div>
        </footer>
      </main>
    </>
  );
}

export default App;
