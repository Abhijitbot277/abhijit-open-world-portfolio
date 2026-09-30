import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, RoundedBox, Text } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

type Props = { progress: number };

function HologramPanel({ position, rotation, label, accent = '#a855f7' }: { position: [number, number, number]; rotation: [number, number, number]; label: string; accent?: string }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[1.7, 1.05, 0.06]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#090711" emissive={accent} emissiveIntensity={0.28} metalness={0.65} roughness={0.2} transparent opacity={0.88} />
      </RoundedBox>
      <Text position={[0, 0.08, 0.045]} fontSize={0.24} color="#e9d5ff" anchorX="center" anchorY="middle">
        {label}
      </Text>
      <mesh position={[0, -0.3, 0.05]}>
        <boxGeometry args={[1.05, 0.025, 0.02]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

function Character({ progress }: Props) {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = progress * Math.PI * 2;
    if (rings.current) {
      rings.current.rotation.z = state.clock.elapsedTime * 0.16;
      rings.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.55) * 0.06;
    }
  });

  return (
    <group ref={group} position={[0, -1.25, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[4.8, 96]} />
        <meshStandardMaterial color="#05040a" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.45, 4.35, 96]} />
        <meshStandardMaterial color="#7c3aed" emissive="#6d28d9" emissiveIntensity={1.2} metalness={0.72} roughness={0.25} />
      </mesh>

      <RoundedBox args={[4.65, 5.35, 0.72]} radius={0.28} smoothness={5} position={[0, 2.25, -0.55]}>
        <meshStandardMaterial color="#0d0a12" metalness={0.78} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[3.75, 4.65, 0.24]} radius={0.18} smoothness={5} position={[0, 2.1, -0.94]}>
        <meshStandardMaterial color="#1b1028" emissive="#260b43" emissiveIntensity={0.7} roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[5.25, 0.28, 0.78]} radius={0.12} smoothness={4} position={[0, 5.18, -0.52]}>
        <meshStandardMaterial color="#a855f7" emissive="#7c3aed" emissiveIntensity={0.7} metalness={0.9} roughness={0.16} />
      </RoundedBox>

      <group position={[0, 0.18, 0.25]}>
        <mesh position={[0, 2.75, 0]} scale={[1.05, 1.25, 0.72]}>
          <capsuleGeometry args={[0.72, 1.55, 12, 24]} />
          <meshStandardMaterial color="#111014" roughness={0.5} metalness={0.08} />
        </mesh>
        <mesh position={[0, 3.12, 0.12]} scale={[0.72, 0.85, 0.5]}>
          <capsuleGeometry args={[0.56, 0.72, 10, 20]} />
          <meshStandardMaterial color="#050505" roughness={0.65} />
        </mesh>

        <mesh position={[0, 3.75, 0]}>
          <cylinderGeometry args={[0.26, 0.3, 0.45, 24]} />
          <meshStandardMaterial color="#8b5a43" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.25, 0]} scale={[0.9, 1.04, 0.88]}>
          <sphereGeometry args={[0.62, 32, 24]} />
          <meshStandardMaterial color="#9b674c" roughness={0.72} />
        </mesh>
        <mesh position={[0, 4.61, -0.03]} scale={[0.96, 0.58, 0.9]}>
          <sphereGeometry args={[0.64, 32, 20]} />
          <meshStandardMaterial color="#151217" roughness={0.78} />
        </mesh>
        {[-0.4, -0.16, 0.16, 0.4].map((x, i) => (
          <mesh key={i} position={[x, 4.73 + (i % 2) * 0.04, 0.05]} rotation={[0, 0, x * 0.18]}>
            <coneGeometry args={[0.16, 0.5, 8]} />
            <meshStandardMaterial color="#0b090d" roughness={0.8} />
          </mesh>
        ))}

        {[-0.27, 0.27].map((x) => (
          <mesh key={x} position={[x, 4.3, 0.57]} rotation={[0, 0, x * 0.08]}>
            <torusGeometry args={[0.19, 0.025, 10, 32]} />
            <meshStandardMaterial color="#16131b" metalness={0.8} roughness={0.18} />
          </mesh>
        ))}
        <mesh position={[0, 4.3, 0.57]}>
          <boxGeometry args={[0.12, 0.025, 0.025]} />
          <meshStandardMaterial color="#16131b" metalness={0.8} roughness={0.18} />
        </mesh>

        {[-0.27, 0.27].map((x) => (
          <mesh key={x} position={[x, 4.32, 0.59]}>
            <sphereGeometry args={[0.045, 12, 8]} />
            <meshBasicMaterial color="#e9d5ff" />
          </mesh>
        ))}
        <mesh position={[0, 4.02, 0.59]} scale={[0.24, 0.035, 0.035]}>
          <sphereGeometry args={[1, 16, 8]} />
          <meshStandardMaterial color="#5b3329" roughness={0.8} />
        </mesh>

        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.82, 2.78, 0.02]} rotation={[0, 0, s * 0.38]}>
              <capsuleGeometry args={[0.2, 1.15, 10, 18]} />
              <meshStandardMaterial color="#151318" roughness={0.46} />
            </mesh>
            <mesh position={[s * 1.27, 2.15, 0.16]}>
              <sphereGeometry args={[0.21, 18, 14]} />
              <meshStandardMaterial color="#9b674c" roughness={0.72} />
            </mesh>
          </group>
        ))}

        <mesh position={[-0.48, 1.45, 0.35]} rotation={[0.08, 0, -0.2]}>
          <capsuleGeometry args={[0.31, 2.05, 10, 18]} />
          <meshStandardMaterial color="#101014" roughness={0.46} />
        </mesh>
        <mesh position={[0.68, 0.78, 0.88]} rotation={[Math.PI / 2, 0, -0.06]}>
          <capsuleGeometry args={[0.25, 1.7, 10, 18]} />
          <meshStandardMaterial color="#0b0b0e" roughness={0.42} />
        </mesh>
        <mesh position={[0.82, 0.18, 1.58]} rotation={[0, 0, -0.05]}>
          <RoundedBox args={[0.62, 0.32, 1.28]} radius={0.12} smoothness={4}>
            <meshStandardMaterial color="#050507" metalness={0.35} roughness={0.35} />
          </RoundedBox>
        </mesh>
      </group>

      <group ref={rings} position={[0, 3.05, 0]}>
        <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
          <torusGeometry args={[3.35, 0.018, 8, 128]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2.1, -0.4, 0.8]}>
          <torusGeometry args={[3.75, 0.012, 8, 128]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.45} />
        </mesh>
      </group>

      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.16}>
        <HologramPanel position={[-3.05, 4.7, 0.3]} rotation={[0, 0.35, -0.12]} label="</>" />
        <HologramPanel position={[3.05, 4.8, 0.1]} rotation={[0, -0.35, 0.12]} label="C++" />
        <HologramPanel position={[3.35, 2.65, 0.5]} rotation={[0, -0.42, 0.08]} label="AI" />
        <HologramPanel position={[-3.35, 2.65, 0.5]} rotation={[0, 0.42, -0.08]} label="EEE" />
      </Float>
    </group>
  );
}

export default function ThroneScene({ progress }: Props) {
  return (
    <div className="throne-3d-shell" aria-label="Interactive 3D portrait of Abhijit Singha">
      <Canvas dpr={[1, 1.8]} camera={{ position: [7.2, 4.2, 9], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#05040b']} />
        <fog attach="fog" args={['#05040b', 10, 24]} />
        <ambientLight intensity={1.45} />
        <spotLight position={[5, 9, 7]} intensity={110} angle={0.46} penumbra={0.8} />
        <spotLight position={[-6, 6, 3]} intensity={75} angle={0.6} color="#7c3aed" />
        <pointLight position={[0, 4, 4]} intensity={28} color="#c084fc" />
        <pointLight position={[0, 1, -2]} intensity={14} color="#6d28d9" />
        <Character progress={progress} />
        <Environment preset="night" />
      </Canvas>
      <div className="hero-visual-note"><span /> 360° CHARACTER TURN</div>
    </div>
  );
}
