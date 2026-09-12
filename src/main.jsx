import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './styles.css';

const BUILDINGS = [
  { x: -5, z: -3, h: 3.8, label: 'AI LAB', description: 'AI experiments, agents & OSINT tools' },
  { x: 0, z: -5, h: 5.2, label: 'PROJECT HQ', description: 'ApexStore & web applications' },
  { x: 5, z: -2, h: 4.3, label: 'RESEARCH', description: 'Green Revive & AIR SENTINAL' },
  { x: 4, z: 4, h: 3.5, label: 'UNIVERSITY', description: 'Education, skills & certifications' },
];

function blocked(position, radius = 0.58) {
  return BUILDINGS.some((b) => Math.abs(position.x - b.x) < 1.6 + radius && Math.abs(position.z - b.z) < 1.6 + radius);
}

function StreetLight({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.8, 0]}><cylinderGeometry args={[0.035, 0.05, 3.6, 8]} /><meshStandardMaterial color="#17191e" metalness={0.8} /></mesh>
      <mesh position={[0.25, 3.55, 0]} rotation={[0, 0, -0.65]}><cylinderGeometry args={[0.035, 0.035, 0.65, 8]} /><meshStandardMaterial color="#17191e" /></mesh>
      <pointLight position={[0.5, 3.35, 0]} intensity={2.2} distance={6} color="#f4c86b" />
      <mesh position={[0.5, 3.35, 0]}><sphereGeometry args={[0.09, 10, 10]} /><meshStandardMaterial emissive="#f4c86b" emissiveIntensity={4} color="#f4c86b" /></mesh>
    </group>
  );
}

function Building({ building }) {
  const { x, z, h } = building;
  return (
    <group position={[x, h / 2, z]}>
      <mesh castShadow receiveShadow><boxGeometry args={[3.2, h, 3.2]} /><meshStandardMaterial color="#30343b" metalness={0.35} roughness={0.55} /></mesh>
      <mesh position={[0, 0, 1.63]}><boxGeometry args={[2.55, h * 0.65, 0.025]} /><meshStandardMaterial color="#11151d" metalness={0.6} roughness={0.2} /></mesh>
      <mesh position={[0, h * 0.28, 1.67]}><boxGeometry args={[1.8, 0.16, 0.06]} /><meshStandardMaterial color="#f4c86b" emissive="#f4c86b" emissiveIntensity={3} /></mesh>
      <mesh position={[0, -h * 0.1, 1.67]}><boxGeometry args={[1.15, 0.09, 0.06]} /><meshStandardMaterial color="#d8a84d" emissive="#d8a84d" emissiveIntensity={2} /></mesh>
    </group>
  );
}

function City() {
  const lights = [[-7,0,-8],[7,0,-8],[-7,0,8],[7,0,8],[-9,0,0],[9,0,0],[0,0,-10],[0,0,10]];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#111318" roughness={0.9} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><planeGeometry args={[3.5, 30]} /><meshStandardMaterial color="#24262b" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}><planeGeometry args={[30, 3.5]} /><meshStandardMaterial color="#24262b" /></mesh>
      {Array.from({ length: 12 }).map((_, i) => <mesh key={`dx-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[(i - 5.5) * 2.2, 0.025, 0]}><planeGeometry args={[1.1, 0.08]} /><meshStandardMaterial color="#d5b96c" emissive="#6b5422" emissiveIntensity={0.4} /></mesh>)}
      {Array.from({ length: 12 }).map((_, i) => <mesh key={`dz-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, (i - 5.5) * 2.2]}><planeGeometry args={[0.08, 1.1]} /><meshStandardMaterial color="#d5b96c" emissive="#6b5422" emissiveIntensity={0.4} /></mesh>)}
      {BUILDINGS.map((b) => <Building key={b.label} building={b} />)}
      {lights.map((p, i) => <StreetLight key={i} position={p} />)}
    </group>
  );
}

function Car({ active, onEnter }) {
  const ref = useRef();
  const wheels = useRef([]);
  const keys = useRef({});
  const velocity = useRef(0);
  const { camera } = useThree();

  useEffect(() => {
    const down = (e) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || !active) return;
    const k = keys.current;
    const throttle = (k.w || k.arrowup ? 1 : 0) - (k.s || k.arrowdown ? 1 : 0);
    const steer = (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0);
    const maxSpeed = k.shift ? 9 : 6;
    velocity.current = THREE.MathUtils.lerp(velocity.current, throttle * maxSpeed, 1 - Math.pow(0.01, delta));
    ref.current.rotation.y -= steer * delta * (Math.abs(velocity.current) / maxSpeed) * 1.7;
    const forward = new THREE.Vector3(Math.sin(ref.current.rotation.y), 0, Math.cos(ref.current.rotation.y));
    const next = ref.current.position.clone().addScaledVector(forward, velocity.current * delta);
    if (!blocked(new THREE.Vector3(next.x, 0, next.z), 0.95)) {
      ref.current.position.x = THREE.MathUtils.clamp(next.x, -13.5, 13.5);
      ref.current.position.z = THREE.MathUtils.clamp(next.z, -13.5, 13.5);
    } else velocity.current = 0;
    wheels.current.forEach((w) => { if (w) w.rotation.x -= velocity.current * delta * 2.5; });
    const target = ref.current.position.clone().add(new THREE.Vector3(0, 1.1, 0));
    const desired = target.clone().add(new THREE.Vector3(5.8, 3.6, 6.8));
    camera.position.lerp(desired, 1 - Math.pow(0.002, delta));
    camera.lookAt(target);
  });

  return (
    <group ref={ref} position={[0, 0.38, 6.2]} onClick={() => !active && onEnter()}>
      <mesh castShadow><boxGeometry args={[1.65, 0.42, 3.1]} /><meshStandardMaterial color="#15181d" metalness={0.85} roughness={0.22} /></mesh>
      <mesh position={[0, 0.35, -0.15]} castShadow><boxGeometry args={[1.35, 0.42, 1.35]} /><meshStandardMaterial color="#252a33" metalness={0.7} roughness={0.25} /></mesh>
      <mesh position={[0, 0.38, 0.56]}><boxGeometry args={[1.2, 0.28, 0.65]} /><meshStandardMaterial color="#090b0f" metalness={0.7} roughness={0.12} /></mesh>
      {[-0.78, 0.78].map((x) => <React.Fragment key={x}><mesh ref={(el) => { wheels.current[x < 0 ? 0 : 1] = el; }} position={[x, 0.05, -0.95]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.31, 0.31, 0.2, 16]} /><meshStandardMaterial color="#08090b" /></mesh><mesh position={[x, 0.05, 0.95]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.31, 0.31, 0.2, 16]} /><meshStandardMaterial color="#08090b" /></mesh></React.Fragment>)}
      <mesh position={[0, 0.18, -1.57]}><boxGeometry args={[1.2, 0.12, 0.04]} /><meshStandardMaterial emissive="#f4c86b" emissiveIntensity={3} color="#f4c86b" /></mesh>
      <pointLight position={[0, 0.35, -1.8]} intensity={1.5} distance={5} color="#f4c86b" />
    </group>
  );
}

function Player({ activeVehicle, setActiveVehicle, onInteract }) {
  const ref = useRef(); const body = useRef(); const leftArm = useRef(); const rightArm = useRef(); const leftLeg = useRef(); const rightLeg = useRef();
  const keys = useRef({}); const velocity = useRef(new THREE.Vector3()); const { camera } = useThree();

  useEffect(() => {
    const down = (e) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useEffect(() => {
    const toggle = (e) => { if (e.key.toLowerCase() === 'e' && activeVehicle) setActiveVehicle(false); };
    window.addEventListener('keydown', toggle); return () => window.removeEventListener('keydown', toggle);
  }, [activeVehicle, setActiveVehicle]);

  useFrame((state, delta) => {
    if (!ref.current || activeVehicle) return;
    const k = keys.current;
    const input = new THREE.Vector3((k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0), 0, (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0));
    const moving = input.lengthSq() > 0;
    if (moving) input.normalize();
    const speed = k.shift ? 6.2 : 3.5;
    velocity.current.lerp(input.multiplyScalar(speed), 1 - Math.pow(0.001, delta));
    const next = ref.current.position.clone().addScaledVector(velocity.current, delta);
    if (!blocked(new THREE.Vector3(next.x, 0, ref.current.position.z))) ref.current.position.x = THREE.MathUtils.clamp(next.x, -13.5, 13.5);
    if (!blocked(new THREE.Vector3(ref.current.position.x, 0, next.z))) ref.current.position.z = THREE.MathUtils.clamp(next.z, -13.5, 13.5);
    if (moving) ref.current.rotation.y = Math.atan2(velocity.current.x, velocity.current.z);
    const stride = moving ? Math.sin(state.clock.elapsedTime * (k.shift ? 12 : 9)) : 0;
    if (leftArm.current) leftArm.current.rotation.x = stride * 0.65;
    if (rightArm.current) rightArm.current.rotation.x = -stride * 0.65;
    if (leftLeg.current) leftLeg.current.rotation.x = -stride * 0.7;
    if (rightLeg.current) rightLeg.current.rotation.x = stride * 0.7;
    if (body.current) body.current.position.y = moving ? Math.abs(Math.sin(state.clock.elapsedTime * (k.shift ? 12 : 9))) * 0.035 : 0;
    const target = ref.current.position.clone().add(new THREE.Vector3(0, 1.15, 0));
    const desired = target.clone().add(new THREE.Vector3(5.5, 4.1, 6.5));
    camera.position.lerp(desired, 1 - Math.pow(0.002, delta));
    camera.lookAt(target);
    let nearest = { b: null, d: Infinity };
    BUILDINGS.forEach((b) => { const d = ref.current.position.distanceTo(new THREE.Vector3(b.x, 0, b.z)); if (d < nearest.d) nearest = { b, d }; });
    onInteract(nearest.d < 3.1 ? nearest.b : null);
  });

  return (
    <group ref={ref} position={[0, 0.65, 3]}>
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
    </group>
  );
}

function Game({ setNearby, activeVehicle, setActiveVehicle }) {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [7, 5, 9], fov: 50 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={["#08090c"]} />
      <fog attach="fog" args={["#08090c", 18, 40]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 14, 6]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 4, 0]} intensity={8} distance={12} color="#d8a84d" />
      <City />
      <Car active={activeVehicle} onEnter={() => setActiveVehicle(true)} />
      <Player activeVehicle={activeVehicle} setActiveVehicle={setActiveVehicle} onInteract={setNearby} />
    </Canvas>
  );
}

function App() {
  const [nearby, setNearby] = useState(null);
  const [panel, setPanel] = useState(null);
  const [activeVehicle, setActiveVehicle] = useState(false);

  useEffect(() => {
    const interact = (e) => {
      if (e.key.toLowerCase() === 'e' && nearby && !activeVehicle) setPanel(nearby);
    };
    window.addEventListener('keydown', interact);
    return () => window.removeEventListener('keydown', interact);
  }, [nearby, activeVehicle]);

  return (
    <main>
      <div className="hud">
        <div className="brand">ABHIJIT CITY</div>
        <div className="mission"><span className="eyebrow">NEW MISSION</span><strong>EXPLORE THE DEVELOPER</strong></div>
        <div className="controls">WASD / ARROWS · SHIFT SPRINT · E INTERACT · E EXIT VEHICLE</div>
        <div className="status">{activeVehicle ? 'VEHICLE MODE' : 'ON FOOT'} · SYSTEM ONLINE</div>
        {nearby && !activeVehicle && <div className="interaction"><span>{nearby.label}</span><small>PRESS E TO EXPLORE</small></div>}
        {activeVehicle && <div className="interaction"><span>DRIVING</span><small>WASD / ARROWS TO DRIVE · E TO EXIT</small></div>}
        <div className="districts">
          {BUILDINGS.map((b) => <span key={b.label}>{b.label}</span>)}
        </div>
      </div>
      {panel && (
        <div className="panel" onClick={() => setPanel(null)}>
          <div className="panel-inner" onClick={(e) => e.stopPropagation()}>
            <div className="eyebrow">DISTRICT DISCOVERED</div>
            <h2>{panel.label}</h2>
            <p>{panel.description}</p>
            <button onClick={() => setPanel(null)}>RETURN TO CITY</button>
          </div>
        </div>
      )}
      <Game setNearby={setNearby} activeVehicle={activeVehicle} setActiveVehicle={setActiveVehicle} />
      <div className="vignette" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
