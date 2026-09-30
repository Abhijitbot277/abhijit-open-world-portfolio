import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  RoundedBox,
  Text,
  useGLTF,
} from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Props = { progress: number };

const HERO_MODEL =
  'https://storage.to3d.app/generated-3d/models/2026-09-30/task_8f7969dc-4716-482b-9344-2b4a173fc90f_model.glb';

function RealisticHeroModel({ progress }: Props) {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(HERO_MODEL);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const material = object.material;
      if (Array.isArray(material)) {
        material.forEach((m) => {
          m.needsUpdate = true;
          if ('envMapIntensity' in m) m.envMapIntensity = 1.35;
        });
      } else {
        material.needsUpdate = true;
        if ('envMapIntensity' in material) material.envMapIntensity = 1.35;
      }
    });

    // Normalize the generated model so it stays sharp and consistently framed.
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const height = Math.max(size.y, 0.001);
    const scale = 6.9 / height;

    clone.scale.setScalar(scale);
    clone.position.set(
      -center.x * scale,
      -center.y * scale + 0.25,
      -center.z * scale,
    );

    return clone;
  }, [scene]);

  useFrame(() => {
    if (root.current) {
      root.current.rotation.y = progress * Math.PI * 2;
    }
  });

  return (
    <group ref={root} position={[0, -0.9, 0]}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(HERO_MODEL);

function OrbitRig() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <group ref={ref} position={[0, 2.2, 0]}>
      <mesh rotation={[Math.PI / 2.35, 0.18, 0]}>
        <torusGeometry args={[3.7, 0.018, 12, 192]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.62} />
      </mesh>
      <mesh rotation={[Math.PI / 2, -0.42, 0.6]}>
        <torusGeometry args={[4.15, 0.011, 12, 192]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.36} />
      </mesh>
    </group>
  );
}

function Holo({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) {
  return (
    <group position={position}>
      <RoundedBox args={[1.65, 0.95, 0.055]} radius={0.09} smoothness={6}>
        <meshPhysicalMaterial
          color="#090711"
          emissive="#7c3aed"
          emissiveIntensity={0.25}
          metalness={0.62}
          roughness={0.18}
          transparent
          opacity={0.86}
        />
      </RoundedBox>

      <Text
        position={[0, 0.02, 0.05]}
        fontSize={0.22}
        color="#e9d5ff"
        anchorX="center"
        anchorY="middle"
      >
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
    <div
      className="throne-3d-shell"
      aria-label="High quality realistic 3D portrait of Abhijit Singha"
    >
      <Canvas
        shadows
        dpr={[1, 2.5]}
        camera={{ position: [7.1, 3.9, 9.5], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <color attach="background" args={['#040309']} />
        <fog attach="fog" args={['#040309', 11, 28]} />

        <ambientLight intensity={1.0} />
        <hemisphereLight args={['#f7efff', '#08030f', 1.15]} />

        <spotLight
          position={[5.5, 8.5, 6]}
          intensity={145}
          angle={0.42}
          penumbra={0.82}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.00012}
        />

        <spotLight
          position={[-5.5, 6.2, 3]}
          intensity={105}
          angle={0.55}
          penumbra={0.9}
          color="#7c3aed"
        />

        <pointLight
          position={[0, 4.5, 5]}
          intensity={24}
          color="#f1e5ff"
        />

        <pointLight
          position={[0, 2, -3]}
          intensity={20}
          color="#6d28d9"
        />

        <RealisticHeroModel progress={progress} />
        <OrbitRig />

        <Holo position={[-3.4, 5.5, 0.2]} label="</>" />
        <Holo position={[3.4, 5.55, 0.1]} label="C++" />
        <Holo position={[-3.55, 3.15, 0.4]} label="AI" />
        <Holo position={[3.55, 3.15, 0.4]} label="EEE" />

        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.52}
          scale={10}
          blur={2.5}
          far={5}
        />

        <Environment preset="city" background={false} />
      </Canvas>

      <div className="hero-visual-note">
        <span /> HIGH-QUALITY 3D CHARACTER · 360° TURN
      </div>
    </div>
  );
}
