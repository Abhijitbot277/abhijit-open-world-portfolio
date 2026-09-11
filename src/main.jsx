import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import './styles.css';

const BUILDINGS = [
  { x: -5, z: -3, h: 3.8, label: 'AI LAB', description: 'AI experiments, agents & OSINT tools' },
  { x: 0, z: -5, h: 5.2, label: 'PROJECT HQ', description: 'ApexStore & web applications' },
  { x: 5, z: -2, h: 4.3, label: 'RESEARCH', description: 'Green Revive & AIR SENTINAL' },
  { x: 4, z: 4, h: 3.5, label: 'UNIVERSITY', description: 'Education, skills & certifications' },
];

function City() {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#111318" roughness={0.9} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><planeGeometry args={[3.5, 30]} /><meshStandardMaterial color="#24262b" /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}><planeGeometry args={[30, 3.5]} /><meshStandardMaterial color="#24262b" /></mesh>
    {BUILDINGS.map((b) => <group key={b.label} position={[b.x, b.h / 2, b.z]}>
      <mesh castShadow receiveShadow><boxGeometry args={[3.2, b.h, 3.2]} /><meshStandardMaterial color="#30343b" metalness={0.35} roughness={0.55} /></mesh>
      <Text position={[0, b.h / 2 + 0.35, 1.63]} fontSize={0.28} color="#f4c86b" anchorX="center">{b.label}</Text>
    </group>)}
  </group>;
}

function blocked(position) {
  const radius = 0.58;
  return BUILDINGS.some((b) => Math.abs(position.x - b.x) < 1.6 + radius && Math.abs(position.z - b.z) < 1.6 + radius);
}

function Player({ onInteract }) {
  const ref = useRef();
  const body = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const keys = useRef({});
  const velocity = useRef(new THREE.Vector3());
  const { camera } = useThree();

  useEffect(() => {
    const down = (e) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const k = keys.current;
    const input = new THREE.Vector3((k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0), 0, (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0));
    const moving = input.lengthSq() > 0;
    if (moving) input.normalize();

    const speed = k.shift ? 6.2 : 3.5;
    const targetVelocity = input.multiplyScalar(speed);
    velocity.current.lerp(targetVelocity, 1 - Math.pow(0.001, delta));

    const next = ref.current.position.clone().addScaledVector(velocity.current, delta);
    if (!blocked(new THREE.Vector3(next.x, 0, ref.current.position.z))) ref.current.position.x = THREE.MathUtils.clamp(next.x, -13.5, 13.5);
    if (!blocked(new THREE.Vector3(ref.current.position.x, 0, next.z))) ref.current.position.z = THREE.MathUtils.clamp(next.z, -13.5, 13.5);

    if (moving) ref.current.rotation.y = Math.atan2(velocity.current.x, velocity.current.z);

    const stride = moving ? Math.sin(state.clock.elapsedTime * (k.shift ? 12 : 9)) : 0;
    if (leftArm.current && rightArm.current && leftLeg.current && rightLeg.current) {
      leftArm.current.rotation.x = stride * 0.65;
      rightArm.current.rotation.x = -stride * 0.65;
      leftLeg.current.rotation.x = -stride * 0.7;
      rightLeg.current.rotation.x = stride * 0.7;
    }
    if (body.current) body.current.position.y = moving ? Math.abs(Math.sin(state.clock.elapsedTime * (k.shift ? 12 : 9))) * 0.035 : 0;

    const target = ref.current.position.clone().add(new THREE.Vector3(0, 1.15, 0));
    const desired = target.clone().add(new THREE.Vector3(5.5, 4.1, 6.5));
    camera.position.lerp(desired, 1 - Math.pow(0.002, delta));
    camera.lookAt(target);

    let nearest = { b: null, d: Infinity };
    BUILDINGS.forEach((b) => {
      const d = ref.current.position.distanceTo(new THREE.Vector3(b.x, 0, b.z));
      if (d < nearest.d) nearest = { b, d };
    });
    onInteract(nearest.d < 3.1 ? nearest.b : null);
  });

  return <group ref={ref} position={[0, 0.65, 3]}>
    <group ref={body}>
      <mesh castShadow><capsuleGeometry args={[0.38, 0.85, 6, 12]} /><meshStandardMaterial color="#b08a43" metalness={0.3} roughness={0.45} /></mesh>
      <mesh position={[0, 0.78, 0]} castShadow><sphereGeometry args={[0.34, 16, 16]} /><meshStandardMaterial color="#d8b06a" roughness={0.5} /></mesh>
      <mesh position={[0, 1.1, -0.04]}><boxGeometry args={[0.45, 0.06, 0.08]} /><meshStandardMaterial color="#08090c" /></mesh>
    </group>
    <mesh ref={leftArm} position={[-0.46, 0.18, 0]} castShadow><capsuleGeometry args={[0.11, 0.55, 4, 8]} /><meshStandardMaterial color="#9d783d" /></mesh>
    <mesh ref={rightArm} position={[0.46, 0.18, 0]} castShadow><capsuleGeometry args={[0.11, 0.55, 4, 8]} /><meshStandardMaterial color="#9d783d" /></mesh>
    <mesh ref={leftLeg} position={[-0.18, -0.48, 0]} castShadow><capsuleGeometry args={[0.13, 0.65, 4, 8]} /><meshStandardMaterial color="#5e4b2e" /></mesh>
    <mesh ref={rightLeg} position={[0.18, -0.48, 0]} castShadow><capsuleGeometry args={[0.13, 0.65, 4, 8]} /><meshStandardMaterial color="#5e4b2e" /></mesh>
    <pointLight position={[0, 1, 0]} intensity={0.7} distance={3} color="#f4c86b" />
  </group>;
}

function Game({ setNearby }) {
  return <Canvas shadows camera={{ position: [7, 5, 9], fov: 50 }}>
    <color attach="background" args={["#08090c"]} />
    <fog attach="fog" args={["#08090c", 18, 40]} />
    <ambientLight intensity={0.55} />
    <directionalLight position={[8, 14, 6]} intensity={2.1} castShadow shadow-mapSize={[2048, 2048]} />
    <pointLight position={[0, 4, 0]} intensity={8} distance={12} color="#d8a84d" />
    <City /><Player onInteract={setNearby} /><Environment preset="night" />
  </Canvas>;
}

function App() {
  const [nearby, setNearby] = useState(null);
  const [panel, setPanel] = useState(null);
  useEffect(() => {
    const interact = (e) => { if (e.key.toLowerCase() === 'e' && nearby) setPanel(nearby); };
    window.addEventListener('keydown', interact);
    return () => window.removeEventListener('keydown', interact);
  }, [nearby]);

  return <main>
    <div className="hud">
      <div className="brand">ABHIJIT CITY</div>
      <div className="mission"><span className="eyebrow">NEW MISSION</span><strong>EXPLORE THE DEVELOPER</strong><small>Walk through the city and discover each district.</small></div>
      <div className="controls"><b>W A S D</b> MOVE &nbsp; <b>SHIFT</b> RUN &nbsp; <b>E</b> INTERACT</div>
    </div>
    {nearby && !panel && <div className="interaction"><span>◈</span> {nearby.label} <b>[E]</b></div>}
    {panel && <div className="info-panel"><button onClick={() => setPanel(null)}>×</button><span className="eyebrow">DISTRICT DISCOVERED</span><h1>{panel.label}</h1><p>{panel.description}</p><div className="panel-action">MISSION AVAILABLE SOON</div></div>}
    <Game setNearby={setNearby} />
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
