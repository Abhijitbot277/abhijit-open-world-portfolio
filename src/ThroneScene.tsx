import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  RoundedBox,
  Text,
  useGLTF,
} from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

type Props = { progress: number };

const skin = new THREE.MeshPhysicalMaterial({
  color: '#a86f55',
  roughness: 0.58,
  metalness: 0,
  clearcoat: 0.08,
});

const skinLight = new THREE.MeshPhysicalMaterial({
  color: '#bd8063',
  roughness: 0.52,
  metalness: 0,
});

const fabric = new THREE.MeshPhysicalMaterial({
  color: '#111014',
  roughness: 0.76,
  metalness: 0.04,
  clearcoat: 0.08,
});

const blazer = new THREE.MeshPhysicalMaterial({
  color: '#17161b',
  roughness: 0.64,
  metalness: 0.02,
  clearcoat: 0.12,
});

const hair = new THREE.MeshPhysicalMaterial({
  color: '#0b090b',
  roughness: 0.46,
  metalness: 0.02,
  clearcoat: 0.18,
});

function Face() {
  return (
    <group position={[0, 4.22, 0.18]}>
      <mesh scale={[0.82, 0.94, 0.74]}>
        <sphereGeometry args={[0.72, 64, 48]} />
        <primitive object={skin} attach="material" />
      </mesh>

      <mesh position={[0, 0.42, -0.02]} scale={[0.86, 0.54, 0.78]}>
        <sphereGeometry args={[0.7, 48, 32]} />
        <primitive object={hair} attach="material" />
      </mesh>

      {[-0.46, -0.29, -0.12, 0.07, 0.25, 0.43].map((x, i) => (
        <mesh key={i} position={[x, 0.66 + Math.sin(i) * 0.035, 0.02]} rotation={[0.08, 0, x * 0.24]}>
          <capsuleGeometry args={[0.075, 0.46 + (i % 2) * 0.12, 10, 14]} />
          <primitive object={hair} attach="material" />
        </mesh>
      ))}

      {[-0.28, 0.28].map((x) => (
        <group key={x} position={[x, 0.04, 0.61]}>
          <mesh scale={[0.19, 0.12, 0.06]}>
            <sphereGeometry args={[1, 32, 20]} />
            <meshPhysicalMaterial color="#f1eee9" roughness={0.22} />
          </mesh>
          <mesh position={[0, 0, 0.055]} scale={[0.055, 0.07, 0.035]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color="#241710" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.085]} scale={[0.018, 0.025, 0.012]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshBasicMaterial color="#050505" />
          </mesh>
        </group>
      ))}

      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.19, 0.6]} rotation={[0, 0, x * 0.18]} scale={[0.24, 0.035, 0.035]}>
          <capsuleGeometry args={[0.08, 0.45, 8, 12]} />
          <primitive object={hair} attach="material" />
        </mesh>
      ))}

      <mesh position={[0, -0.04, 0.67]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.12, 0.38, 24]} />
        <primitive object={skinLight} attach="material" />
      </mesh>

      <mesh position={[0, -0.29, 0.62]} scale={[0.25, 0.075, 0.06]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#6d3f39" roughness={0.55} />
      </mesh>

      <mesh position={[-0.73, 0.02, 0]} scale={[0.11, 0.2, 0.15]}>
        <sphereGeometry args={[1, 24, 16]} />
        <primitive object={skin} attach="material" />
      </mesh>
      <mesh position={[0.73, 0.02, 0]} scale={[0.11, 0.2, 0.15]}>
        <sphereGeometry args={[1, 24, 16]} />
        <primitive object={skin} attach="material" />
      </mesh>

      <group position={[0, 0.03, 0.72]}>
        <mesh position={[-0.28, 0, 0]} rotation={[0, 0, -0.02]}>
          <boxGeometry args={[0.48, 0.055, 0.035]} />
          <meshStandardMaterial color="#17151a" metalness={0.85} roughness={0.18} />
        </mesh>
        <mesh position={[0.28, 0, 0]} rotation={[0, 0, 0.02]}>
          <boxGeometry args={[0.48, 0.055, 0.035]} />
          <meshStandardMaterial color="#17151a" metalness={0.85} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.18, 0.035, 0.035]} />
          <meshStandardMaterial color="#17151a" metalness={0.85} roughness={0.18} />
        </mesh>
      </group>
    </group>
  );
}

function Person({ progress }: Props) {
  const root = useRef<THREE.Group>(null);

  useFrame(() => {
    if (root.current) root.current.rotation.y = progress * Math.PI * 2;
  });

  return (
    <group ref={root} position={[0, -1.65, 0]}>
      {/* Chair */}
      <group position={[0, 1.45, -0.7]}>
        <RoundedBox args={[3.5, 4.8, 1.05]} radius={0.32} smoothness={8} position={[0, 1.55, 0]}>
          <meshPhysicalMaterial color="#09090c" roughness={0.31} metalness={0.48} clearcoat={0.3} />
        </RoundedBox>
        <RoundedBox args={[3.9, 0.42, 1.55]} radius={0.18} smoothness={6} position={[0, -0.62, 0.1]}>
          <meshPhysicalMaterial color="#0d0c10" roughness={0.34} metalness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.32, 2.8, 0.52]} radius={0.12} smoothness={5} position={[-1.72, 0.65, 0.15]}>
          <meshPhysicalMaterial color="#111016" roughness={0.32} metalness={0.58} />
        </RoundedBox>
        <RoundedBox args={[0.32, 2.8, 0.52]} radius={0.12} smoothness={5} position={[1.72, 0.65, 0.15]}>
          <meshPhysicalMaterial color="#111016" roughness={0.32} metalness={0.58} />
        </RoundedBox>
      </group>

      {/* Torso */}
      <group position={[0, 3.05, 0.05]}>
        <RoundedBox args={[2.25, 2.55, 1.02]} radius={0.35} smoothness={8}>
          <primitive object={blazer} attach="material" />
        </RoundedBox>
        <RoundedBox args={[1.22, 1.8, 0.72]} radius={0.22} smoothness={7} position={[0, 0.2, 0.53]}>
          <primitive object={fabric} attach="material" />
        </RoundedBox>
        <mesh position={[0, 0.72, 0.55]}>
          <cylinderGeometry args={[0.27, 0.32, 0.62, 32]} />
          <primitive object={fabric} attach="material" />
        </mesh>
      </group>

      <Face />

      {/* Arms */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 1.16, 3.0, 0.12]} rotation={[0, 0, s * 0.2]}>
            <capsuleGeometry args={[0.28, 1.55, 14, 24]} />
            <primitive object={blazer} attach="material" />
          </mesh>
          <mesh position={[s * 1.42, 2.25, 0.35]} rotation={[0, 0, s * 0.65]}>
            <capsuleGeometry args={[0.22, 1.0, 14, 20]} />
            <primitive object={fabric} attach="material" />
          </mesh>
          <mesh position={[s * 1.53, 1.82, 0.57]} scale={[0.24, 0.31, 0.19]}>
            <sphereGeometry args={[1, 32, 20]} />
            <primitive object={skinLight} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Crossed legs */}
      <mesh position={[-0.52, 1.02, 0.46]} rotation={[0.1, 0.12, -0.2]}>
        <capsuleGeometry args={[0.38, 2.35, 14, 24]} />
        <primitive object={fabric} attach="material" />
      </mesh>
      <mesh position={[0.64, 0.82, 0.92]} rotation={[Math.PI / 2, 0, -0.04]}>
        <capsuleGeometry args={[0.31, 2.35, 14, 24]} />
        <primitive object={fabric} attach="material" />
      </mesh>

      {/* Shoes */}
      <mesh position={[1.15, 0.55, 1.75]} rotation={[0.05, 0, -0.05]} scale={[0.48, 0.3, 0.92]}>
        <sphereGeometry args={[1, 40, 24]} />
        <meshPhysicalMaterial color="#09090b" roughness={0.25} metalness={0.22} clearcoat={0.55} />
      </mesh>
      <mesh position={[-0.78, 0.75, 1.32]} rotation={[0, 0.15, -0.08]} scale={[0.38, 0.25, 0.72]}>
        <sphereGeometry args={[1, 40, 24]} />
        <meshPhysicalMaterial color="#09090b" roughness={0.25} metalness={0.22} clearcoat={0.55} />
      </mesh>

      {/* Watch */}
      <mesh position={[1.55, 1.83, 0.58]} scale={[0.16, 0.16, 0.05]}>
        <cylinderGeometry args={[1, 1, 0.12, 32]} />
        <meshPhysicalMaterial color="#09090d" metalness={0.92} roughness={0.16} />
      </mesh>
      <mesh position={[1.55, 1.83, 0.64]} scale={[0.11, 0.11, 0.025]}>
        <cylinderGeometry args={[1, 1, 0.12, 32]} />
        <meshStandardMaterial color="#11131a" metalness={0.65} roughness={0.2} />
      </mesh>
    </group>
  );
}

function OrbitRig() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.08;
  });

  return (
    <group ref={ref} position={[0, 2.2, 0]}>
      <mesh rotation={[Math.PI / 2.35, 0.18, 0]}>
        <torusGeometry args={[3.7, 0.018, 10, 160]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2.0, -0.42, 0.6]}>
        <torusGeometry args={[4.15, 0.011, 10, 160]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Holo({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.65, 0.95, 0.055]} radius={0.09} smoothness={5}>
        <meshPhysicalMaterial
          color="#090711"
          emissive="#7c3aed"
          emissiveIntensity={0.22}
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={0.86}
        />
      </RoundedBox>
      <Text position={[0, 0.02, 0.05]} fontSize={0.22} color="#e9d5ff" anchorX="center" anchorY="middle">
        {label}
      </Text>
      <mesh position={[0, -0.31, 0.055]}>
        <boxGeometry args={[1.0, 0.018, 0.018]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>
    </group>
  );
}

export default function ThroneScene({ progress }: Props) {
  return (
    <div className="throne-3d-shell" aria-label="Realistic 3D portrait of Abhijit Singha">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [7.1, 3.9, 9.5], fov: 36 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#040309']} />
        <fog attach="fog" args={['#040309', 11, 27]} />

        <ambientLight intensity={1.15} />
        <hemisphereLight args={['#f4eaff', '#09040f', 1.1]} />
        <spotLight position={[5.5, 8.5, 6]} intensity={125} angle={0.42} penumbra={0.82} />
        <spotLight position={[-5.5, 6.2, 3]} intensity={95} angle={0.55} penumbra={0.9} color="#7c3aed" />
        <pointLight position={[0, 4.5, 5]} intensity={22} color="#e9d5ff" />
        <pointLight position={[0, 2, -3]} intensity={18} color="#6d28d9" />

        <Person progress={progress} />
        <OrbitRig />

        <Holo position={[-3.4, 5.5, 0.2]} label="</>" />
        <Holo position={[3.4, 5.55, 0.1]} label="C++" />
        <Holo position={[-3.55, 3.15, 0.4]} label="AI" />
        <Holo position={[3.55, 3.15, 0.4]} label="EEE" />

        <ContactShadows position={[0, -1.7, 0]} opacity={0.48} scale={10} blur={2.8} far={4.5} />
        <Environment preset="city" background={false} />
      </Canvas>

      <div className="hero-visual-note"><span /> REALISTIC 3D CHARACTER · 360° TURN</div>
    </div>
  );
}
