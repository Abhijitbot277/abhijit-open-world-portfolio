import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Float } from '@react-three/drei';
import './styles.css';

function City() {
  const buildings = [
    { x: -5, z: -3, h: 3.8, label: 'AI LAB' },
    { x: 0, z: -5, h: 5.2, label: 'PROJECT HQ' },
    { x: 5, z: -2, h: 4.3, label: 'RESEARCH' },
    { x: 4, z: 4, h: 3.5, label: 'UNIVERSITY' },
  ];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#111318" roughness={0.9} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[3.5, 30]} />
        <meshStandardMaterial color="#24262b" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <planeGeometry args={[30, 3.5]} />
        <meshStandardMaterial color="#24262b" />
      </mesh>

      {buildings.map((b) => (
        <group key={b.label} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.2, b.h, 3.2]} />
            <meshStandardMaterial color="#30343b" metalness={0.35} roughness={0.55} />
          </mesh>
          <Text position={[0, b.h / 2 + 0.35, 1.63]} fontSize={0.28} color="#f4c86b" anchorX="center">
            {b.label}
          </Text>
        </group>
      ))}

      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[0, 2.8, 0]} castShadow>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color="#d5a84f" emissive="#5a4217" emissiveIntensity={1.2} metalness={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

function App() {
  return (
    <main>
      <div className="hud">
        <div className="brand">ABHIJIT CITY</div>
        <div className="mission">
          <span className="eyebrow">NEW MISSION</span>
          <strong>EXPLORE THE DEVELOPER</strong>
          <small>Move the camera to explore the first prototype.</small>
        </div>
        <div className="controls">DRAG · ROTATE &nbsp;&nbsp; SCROLL · ZOOM</div>
      </div>

      <Canvas shadows camera={{ position: [12, 9, 14], fov: 45 }}>
        <color attach="background" args={["#08090c"]} />
        <fog attach="fog" args={["#08090c", 18, 40]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[8, 14, 6]} intensity={2.1} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[0, 4, 0]} intensity={8} distance={12} color="#d8a84d" />
        <City />
        <Environment preset="night" />
        <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2.05} minDistance={7} maxDistance={28} />
      </Canvas>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
