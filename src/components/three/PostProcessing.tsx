import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  HueSaturation,
  BrightnessContrast,
} from '@react-three/postprocessing';
import { usePrefersReducedMotion } from '../../hooks';

interface CinematicEffectsProps {
  bloom?: boolean;
  bloomIntensity?: number;
  noise?: boolean;
  vignette?: boolean;
}

/**
 * Cinematic post-processing effects
 * Adds bloom, noise, and vignette
 */
export function CinematicEffects({
  bloom = true,
  bloomIntensity = 1.5,
  noise = true,
  vignette = true,
}: CinematicEffectsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Reduce effects for motion sensitivity
  const effectIntensity = prefersReducedMotion ? 0.3 : 1;

  // Only render effects that are enabled
  if (!bloom && !noise && !vignette) {
    return null;
  }

  return (
    <EffectComposer>
      <Bloom
        intensity={bloom ? bloomIntensity * effectIntensity : 0}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.025}
        mipmapBlur
      />
      <Noise opacity={noise ? 0.02 * effectIntensity : 0} />
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={vignette ? 1.1 * effectIntensity : 0}
      />
    </EffectComposer>
  );
}

interface UpsideDownEffectsProps {
  enabled?: boolean;
}

/**
 * Upside Down visual filter
 * Desaturated, cool-toned, darker atmosphere
 */
export function UpsideDownEffects({ enabled = true }: UpsideDownEffectsProps) {
  if (!enabled) return null;

  return (
    <EffectComposer>
      <HueSaturation hue={0.5} saturation={-0.3} />
      <BrightnessContrast brightness={-0.2} contrast={0.3} />
      <Vignette darkness={1.5} offset={0.1} />
      <Noise opacity={0.04} />
    </EffectComposer>
  );
}

interface NeonGlowEffectsProps {
  intensity?: number;
}

/**
 * Neon glow optimized post-processing
 * Lower threshold to catch more glowing elements
 */
export function NeonGlowEffects({ intensity = 2 }: NeonGlowEffectsProps) {
  return (
    <EffectComposer>
      <Bloom
        intensity={intensity}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.1} darkness={0.8} />
    </EffectComposer>
  );
}
