import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

const ORANGE = "#f58220";

const Bond = ({ start, end }) => {
  const { position, quaternion, length } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(e, s);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { position: mid, quaternion: quat, length: len };
  }, [start, end]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.045, 0.045, length, 12]} />
      <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.5} metalness={0.8} roughness={0.25} />
    </mesh>
  );
};

// Benzene ring — the core aromatic molecule in gasoline
const BenzeneMolecule = ({ position, scale = 1 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.25;
    }
  });
  const carbons = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pts.push([Math.cos(a) * 1.1, Math.sin(a) * 1.1, 0]);
    }
    return pts;
  }, []);
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.4}>
      <group ref={ref} position={position} scale={scale}>
        {carbons.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}
        {carbons.map((p, i) => (
          <Bond key={`b${i}`} start={p} end={carbons[(i + 1) % 6]} />
        ))}
        {carbons.map((p, i) => {
          const outer = [p[0] * 1.45, p[1] * 1.45, 0];
          return (
            <group key={`h${i}`}>
              <Bond start={p} end={outer} />
              <mesh position={outer}>
                <sphereGeometry args={[0.13, 18, 18]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.4} roughness={0.3} />
              </mesh>
            </group>
          );
        })}
      </group>
    </Float>
  );
};

// Glossy energy orb (ball)
const EnergyOrb = ({ position, scale = 1, color = ORANGE }) => (
  <Float speed={2} rotationIntensity={1} floatIntensity={2}>
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.8, 48, 48]} />
      <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.35} distort={0.45} speed={2.2} metalness={0.6} roughness={0.2} />
    </mesh>
  </Float>
);

// Oil drum with glowing rings
const Barrel = ({ position, scale = 1 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.25;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.4}>
      <group ref={ref} position={position} scale={scale}>
        <mesh>
          <cylinderGeometry args={[0.55, 0.55, 1.1, 32]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
        </mesh>
        {[-0.35, 0, 0.35].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <torusGeometry args={[0.57, 0.03, 12, 40]} />
            <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.7} metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

const Rig = ({ children }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.pointer.x * 0.12;
      ref.current.rotation.x = state.pointer.y * 0.06;
    }
  });
  return <group ref={ref}>{children}</group>;
};

export const Hero3D = () => (
  <div className="absolute inset-0" aria-hidden="true" data-testid="hero-3d-canvas">
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -2, 3]} intensity={1.6} color={ORANGE} />
      <pointLight position={[4, 3, -2]} intensity={0.9} color="#fbbf24" />
      <Suspense fallback={null}>
        <Rig>
          <BenzeneMolecule position={[3, 0.5, -1.2]} scale={0.75} />
          <Barrel position={[-3.6, -1.7, -0.5]} scale={1.05} />
          <EnergyOrb position={[0.8, -1.9, -1.8]} scale={1.2} />
          <EnergyOrb position={[-2, 1.9, -2.5]} scale={0.95} />
          <EnergyOrb position={[1.6, 2.4, -3.5]} scale={0.7} color="#fbbf24" />
        </Rig>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  </div>
);
