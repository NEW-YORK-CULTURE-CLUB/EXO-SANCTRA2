'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clone} scale={1} position={[0, -0.5, 0]} />;
}

function SpinnerMesh() {
  return (
    <mesh>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

export default function ModelViewer3D({ modelPath }: { modelPath: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 3.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
      <directionalLight position={[-4, -2, -4]} intensity={0.4} />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#ffffff" />
      <Suspense fallback={<SpinnerMesh />}>
        <Model path={modelPath} />
      </Suspense>
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.7}
        enableZoom
        enablePan={false}
        minDistance={1.5}
        maxDistance={10}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.85}
      />
    </Canvas>
  );
}
