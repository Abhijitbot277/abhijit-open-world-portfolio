import React, { Component, useEffect, useRef, useState } from 'react';
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

function City() {
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
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`x-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[(i - 5.5) * 2.2, 0.025, 0]}>
          <planeGeometry args={[1.1, 0.08]} />
          <meshStandardMaterial color="#d5b96c" />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`z-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, (i - 5.5) * 2.2]}>
          <planeGeometry args={[0.08, 1.1]} />
          <meshStandardMaterial color="#d5b96c" />
        </mesh>
      ))}
      {BUILDINGS.map((b) => (
        <group key={b.label} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.2, b.h, 3.2]} />
            <meshStandardMaterial color="#30343b" metalness={0.35} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0, 1.63]}>
            <boxGeometry args={[2.55, b.h * 0.65, 0.03]} />
            <meshStandardMaterial color="#11151d" />
          </mesh>
          <mesh position={[0, b.h * 0.28, 1.67]}>
            <boxGeometry args={[1.8, 0.16, 0.06]} />
            <meshStandardMaterial color="#f4c86b" emissive="#f4c86b" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}
      {[[-7, 0, -8], [7, 0, -8], [-7, 0, 8], [7, 0, 8], [-9, 0, 0], [9, 0, 0]].map((p, i) => (
        <group key={`light-${i}`} position={p}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 3.6, 8]} />
            <meshStandardMaterial color="#17191e" />
          </mesh>
          <pointLight position={[0, 3.4, 0]} intensity={2} distance={6} color="#f4c86b" />
          <mesh position={[0, 3.4, 0]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#f4c86b" emissive="#f4c86b" emissiveIntensity={4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Player({ activeVehicle, setActiveVehicle, onInteract }) {
  const ref = useRef();
  const keys = useRef({});
  const velocity = useRef(new THREE.Vector3());
  const { camera } = useThree();

  useEffect(() => {
    const down = (e) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useEffect(() => {
    const exit = (e) => { if (e.key.toLowerCase() === 'e' && activeVehicle) setActiveVehicle(false); };
    window.addEventListener('keydown', exit);
    return () => window.removeEventListener('keydown', exit);
  }, [activeVehicle, setActiveVehicle]);

  useFrame((state, delta) => {
    if (!ref.current || activeVehicle) return;
    const k = keys.current;
    const input = new THREE.Vector3(
      (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0),
      0,
      (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0)
    );
    const moving = input.lengthSq() > 0;
    if (moving) input.normalize();
    const speed = k.shift ? 6 : 3.4;
    velocity.current.lerp(input.multiplyScalar(speed), 1 - Math.pow(0.001, delta));
    const next = ref.current.position.clone().addScaledVector(velocity.current, delta);
    if (!blocked(new THREE.Vector3(next.x, 0, ref.current.position.z))) ref.current.position.x = THREE.MathUtils.clamp(next.x, -13.5, 13.5);
    if (!blocked(new THREE.Vector3(ref.current.position.x, 0, next.z))) ref.current.position.z = THREE.MathUtils.clamp(next.z, -13.5, 13.5);
    if (moving) ref.current.rotation.y = Math.atan2(velocity.current.x, velocity.current.z);
    const target = ref.current.position.clone().add(new THREE.Vector3(0, 1.1, 0));
    const desired = target.clone().add(new THREE.Vector3(5.5, 4.1, 6.5));
    camera.position.lerp(desired, 1 - Math.pow(0.002, delta));
    camera.lookAt(target);
    let nearest = null;
    let distance = Infinity;
    BUILDINGS.forEach((b) => {
      const d = ref.current.position.distanceTo(new THREE.Vector3(b.x, 0, b.z));
      if (d < distance) { distance = d; nearest = b; }
    });
    onInteract(distance < 3.1 ? nearest : null);
    ref.current.position.y = 0.65 + Math.abs(Math.sin(state.clock.elapsedTime * 9)) * (moving ? 0.035 : 0);
  });

  return (
    <group ref={ref} position={[0, 0.65, 3]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.38, 0.85, 6, 12]} />
        <meshStandardMaterial color="#b08a43" />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshStandardMaterial color="#d8b06a" />
      </mesh>
      <mesh position={[-0.46, 0.18, 0]}>
        <capsuleGeometry args={[0.11, 0.55, 4, 8]} />
        <meshStandardMaterial color="#9d783d" />
      </mesh>
      <mesh position={[0.46, 0.18, 0]}>
        <capsuleGeometry args={[0.11, 0.55, 4, 8]} />
        <meshStandardMaterial color="#9d783d" />
      </mesh>
      <pointLight position={[0, 1, 0]} intensity={0.7} distance={3} color="#f4c86b" />
    </group>
  );
}

function Car({ active, onEnter }) {
  const ref = useRef();
  const keys = useRef({});
  const velocity = useRef(0);
  const { camera } = useThree();

  useEffect(() => {
    const down = (e) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || !active) return;
    const k = keys.current;
    const throttle = (k.w || k.arrowup ? 1 : 0) - (k.s || k.arrowdown ? 1 : 0);
    const steer = (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0);
    const maxSpeed = k.shift ? 8 : 5;
    velocity.current = THREE.MathUtils.lerp(velocity.current, throttle * maxSpeed, 1 - Math.pow(0.01, delta));
    ref.current.rotation.y -= steer * delta * (Math.abs(velocity.current) / maxSpeed) * 1.6;
    const forward = new THREE.Vector3(Math.sin(ref.current.rotation.y), 0, Math.cos(ref.current.rotation.y));
    const next = ref.current.position.clone().addScaledVector(forward, velocity.current * delta);
    if (!blocked(new THREE.Vector3(next.x, 0, next.z), 0.95)) {
      ref.current.position.x = THREE.MathUtils.clamp(next.x, -13.5, 13.5);
      ref.current.position.z = THREE.MathUtils.clamp(next.z, -13.5, 13.5);
    } else velocity.current = 0;
    const target = ref.current.position.clone().add(new THREE.Vector3(0, 1.1, 0));
    camera.position.lerp(target.clone().add(new THREE.Vector3(5.8, 3.6, 6.8)), 1 - Math.pow(0.002, delta));
    camera.lookAt(target);
  });

  return (
    <group ref={ref} position={[0, 0.38, 6.2]} onClick={() => !active && onEnter()}>
      <mesh castShadow><boxGeometry args={[1.65, 0.42, 3.1]} /><meshStandardMaterial color="#15181d" metalness={0.8} /></mesh>
      <mesh position={[0, 0.35, -0.15]}><boxGeometry args={[1.35, 0.42, 1.35]} /><meshStandardMaterial color="#252a33" /></mesh>
      {[[-0.78, -0.95], [0.78, -0.95], [-0.78, 0.95], [0.78, 0.95]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.2, 16]} />
          <meshStandardMaterial color="#08090b" />
        </mesh>
      ))}
      <mesh position={[0, 0.18, -1.57]}><boxGeometry args={[1.2, 0.12, 0.04]} /><meshStandardMaterial color="#f4c86b" emissive="#f4c86b" emissiveIntensity={3} /></mesh>
      <pointLight position={[0, 0.35, -1.8]} intensity={1.5} distance={5} color="#f4c86b" />
    </group>
  );
}

function Game({ setNearby, activeVehicle, setActiveVehicle }) {
  return (
    <Canvas
      fallback={<div className="engine-fallback"><strong>3D ENGINE COULD NOT START</strong><span>Your browser did not create a WebGL canvas.</span><span>Open Chrome Settings → System and enable graphics acceleration.</span></div>}
      camera={{ position: [7, 5, 9], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => { gl.setClearColor('#08090c'); }}
    >
      <fog attach="fog" args={['#08090c', 18, 40]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[8, 14, 6]} intensity={2} castShadow />
      <pointLight position={[0, 4, 0]} intensity={6} distance={12} color="#d8a84d" />
      <City />
      <Car active={activeVehicle} onEnter={() => setActiveVehicle(true)} />
      <Player activeVehicle={activeVehicle} setActiveVehicle={setActiveVehicle} onInteract={setNearby} />
    </Canvas>
  );
}

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="engine-fallback fatal">
          <strong>ABHIJIT CITY FAILED TO START</strong>
          <span>{String(this.state.error?.message || this.state.error)}</span>
          <span>Open browser DevTools → Console if more detail is needed.</span>
        </div>
      );
    }
    return this.props.children;
  }
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
        <div className="controls">[WASD] MOVE &nbsp; [SHIFT] RUN &nbsp; [E] INTERACT / EXIT</div>
        <div className="status">{activeVehicle ? 'VEHICLE ACTIVE' : 'ON FOOT'}</div>
      </div>
      {nearby && !panel && !activeVehicle && <div className="interact">[E] ENTER {nearby.label}</div>}
      {activeVehicle && <div className="driving">[WASD] DRIVE &nbsp; [SHIFT] BOOST &nbsp; [E] EXIT</div>}
      {panel && (
        <div className="panel">
          <button onClick={() => setPanel(null)}>×</button>
          <div className="eyebrow">DISTRICT</div>
          <h1>{panel.label}</h1>
          <p>{panel.description}</p>
          <span>Portfolio content will be connected here.</span>
        </div>
      )}
      <AppErrorBoundary>
        <Game setNearby={setNearby} activeVehicle={activeVehicle} setActiveVehicle={setActiveVehicle} />
      </AppErrorBoundary>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
