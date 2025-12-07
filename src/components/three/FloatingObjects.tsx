import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import type { Mesh, Group } from 'three';
import { usePrefersReducedMotion } from '../../hooks';

interface FloatingBoxProps {
  position?: [number, number, number];
  color?: string;
  glowColor?: string;
  size?: number;
  speed?: number;
}

/**
 * Floating box with rotation animation
 */
export function FloatingBox({
  position = [0, 0, 0],
  color = '#ff2975',
  glowColor = '#ff2975',
  size = 1,
  speed = 0.5,
}: FloatingBoxProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((_, delta) => {
    if (!meshRef.current || prefersReducedMotion) return;
    meshRef.current.rotation.x += delta * speed;
    meshRef.current.rotation.y += delta * speed * 0.7;
  });

  return (
    <Float speed={prefersReducedMotion ? 0 : 2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? 1.1 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={hovered ? 2 : 0.5}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

interface FloatingTorusProps {
  position?: [number, number, number];
  color?: string;
  radius?: number;
  tube?: number;
  speed?: number;
}

/**
 * Floating torus (donut) with glow
 */
export function FloatingTorus({
  position = [0, 0, 0],
  color = '#00ffff',
  radius = 1,
  tube = 0.3,
  speed = 0.3,
}: FloatingTorusProps) {
  const meshRef = useRef<Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((state) => {
    if (!meshRef.current || prefersReducedMotion) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.5;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed;
  });

  return (
    <Float speed={prefersReducedMotion ? 0 : 1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[radius, tube, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

interface NeonTextProps {
  text: string;
  position?: [number, number, number];
  color?: string;
  fontSize?: number;
}

/**
 * 3D neon text with glow effect
 */
export function NeonText3D({
  text,
  position = [0, 0, 0],
  color = '#ff1e1e',
  fontSize = 0.5,
}: NeonTextProps) {
  const groupRef = useRef<Group>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((state) => {
    if (!groupRef.current || prefersReducedMotion) return;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      <Text
        color="white"
        fontSize={fontSize}
        font="/fonts/Playfair-Display.woff"
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshStandardMaterial
          color="white"
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Text>
    </group>
  );
}

interface FloatingGroupProps {
  children?: React.ReactNode;
  rotationSpeed?: number;
}

/**
 * Container that rotates its children slowly
 */
export function FloatingGroup({ children, rotationSpeed = 0.1 }: FloatingGroupProps) {
  const groupRef = useRef<Group>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((state) => {
    if (!groupRef.current || prefersReducedMotion) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
  });

  return <group ref={groupRef}>{children}</group>;
}
