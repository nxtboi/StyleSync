import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function BackgroundParticles() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.3} />
    </points>
  );
}

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} scale={2}>
        <MeshDistortMaterial
          color="#1a1a1a"
          speed={3}
          distort={0.4}
          radius={1}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10 bg-brand-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff4e00" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00e5ff" />
        <spotLight position={[0, 5, 0]} intensity={0.8} />
        
        <BackgroundParticles />
        <FloatingShape />
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-black/20 to-brand-black" />
    </div>
  );
}
