import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

type Props = { progress: number };

function Model({ progress }: Props) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = progress * Math.PI * 2;
  });

  return (
    <group ref={group} position={[0, -1.65, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[4.8, 96]} />
        <meshStandardMaterial color="#090909" roughness={0.72} metalness={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.7, 4.35, 96]} />
        <meshStandardMaterial color="#6d28d9" emissive="#24103f" emissiveIntensity={0.7} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.1, -0.5]}>
        <boxGeometry args={[4.9, 5.4, 0.7]} />
        <meshStandardMaterial color="#100c14" metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[0, 2, -0.86]}>
        <boxGeometry args={[4.05, 4.65, 0.24]} />
        <meshStandardMaterial color="#24113d" emissive="#130521" emissiveIntensity={0.8} roughness={0.62} />
      </mesh>
      <mesh position={[0, 5.2, -0.45]}>
        <boxGeometry args={[5.55, 0.34, 0.8]} />
        <meshStandardMaterial color="#a855f7" metalness={0.85} roughness={0.2} />
      </mesh>
      {[-2.25, -1.35, -0.45, 0.45, 1.35, 2.25].map((x, i) => (
        <mesh key={i} position={[x, 5.75 + (i % 2 ? 0.18 : 0), -0.45]} rotation={[0, 0, i % 2 ? 0.12 : -0.12]}>
          <coneGeometry args={[0.28, 1, 4]} />
          <meshStandardMaterial color="#d8b4fe" metalness={0.9} roughness={0.18} />
        </mesh>
      ))}
      {[-2.35, 2.35].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.25, -0.05]}>
            <boxGeometry args={[0.48, 2.2, 2.5]} />
            <meshStandardMaterial color="#15111e" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[x, 2.35, -0.05]}>
            <boxGeometry args={[0.72, 0.22, 2.65]} />
            <meshStandardMaterial color="#c4b5fd" metalness={0.88} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.65, 0.15]}>
        <boxGeometry args={[3.85, 0.62, 2.35]} />
        <meshStandardMaterial color="#090909" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.98, 0.05]}>
        <boxGeometry args={[3.45, 0.25, 1.95]} />
        <meshStandardMaterial color="#32154f" emissive="#1b0730" emissiveIntensity={0.5} roughness={0.55} />
      </mesh>
      <group position={[0, 0.15, 0.35]}>
        <mesh position={[0, 2.55, 0]}>
          <capsuleGeometry args={[0.66, 1.65, 10, 20]} />
          <meshStandardMaterial color="#030303" roughness={0.38} />
        </mesh>
        <mesh position={[0, 3.85, 0]}>
          <sphereGeometry args={[0.58, 32, 24]} />
          <meshStandardMaterial color="#7a4a32" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.12, -0.02]} scale={[1.02, 0.62, 1]}>
          <sphereGeometry args={[0.61, 32, 20]} />
          <meshStandardMaterial color="#030303" roughness={0.72} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.82, 2.52, 0.02]} rotation={[0, 0, s * 0.48]}>
              <capsuleGeometry args={[0.19, 1.1, 8, 16]} />
              <meshStandardMaterial color="#050505" roughness={0.4} />
            </mesh>
            <mesh position={[s * 1.28, 1.95, 0.04]}>
              <sphereGeometry args={[0.22, 18, 14]} />
              <meshStandardMaterial color="#7a4a32" roughness={0.7} />
            </mesh>
            <mesh position={[s * 0.45, 1.2, 0.42]}>
              <capsuleGeometry args={[0.3, 1.55, 8, 16]} />
              <meshStandardMaterial color="#030303" roughness={0.42} />
            </mesh>
            <mesh position={[s * 0.5, 0.52, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.22, 1.05, 8, 16]} />
              <meshStandardMaterial color="#020202" roughness={0.42} />
            </mesh>
            <mesh position={[s * 0.5, 0.02, 1.18]}>
              <boxGeometry args={[0.58, 0.24, 1.1]} />
              <meshStandardMaterial color="#020202" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export default function ThroneScene({ progress }: Props) {
  return (
    <div className="throne-3d-shell" aria-label="Interactive 3D portfolio hero">
      <Canvas dpr={[1, 1.8]} camera={{ position: [7.2, 4.1, 9], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={['#05040b', 10, 23]} />
        <ambientLight intensity={1.65} />
        <spotLight position={[5, 9, 7]} intensity={95} angle={0.45} penumbra={0.8} />
        <spotLight position={[-6, 5, 2]} intensity={55} angle={0.6} color="#7c3aed" />
        <pointLight position={[0, 2, 4]} intensity={20} color="#c084fc" />
        <Model progress={progress} />
        <Environment preset="night" />
      </Canvas>
      <div className="hero-visual-note"><span /> 360° SCROLL TURN</div>
    </div>
  );
}
