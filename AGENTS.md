# Immersive Underside

Interactive creative showcase with Three.js/R3F scenes, GSAP scroll animations, and Framer Motion. Stranger Things aesthetic.

## Stack

React 19, TypeScript (strict), Vite 7, Three.js/R3F 9.
No path aliases — all imports use relative paths.
No database, no API, no tests.

## Development

```bash
npm run lint        # must pass clean
npm run build       # tsc -b && vite build — must pass clean
```

## Conventions

- All animated components check `usePrefersReducedMotion()` and disable animation when true.
- GSAP: complex sequences, ScrollTrigger reveals, text splitting. Wrapped in `useGSAP()` with scope ref.
- Framer Motion: scroll progress, parallax, hover interactions. `<MotionConfig reducedMotion="user">` at app root.
- 3D content is procedural (Three.js primitives) — no `.glb`/`.gltf` model files.
- CSS custom properties in `src/styles/variables.css`, effects in `src/styles/effects.css`.
