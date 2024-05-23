// src/components/StickpackModel.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url, true, (error) => {
    console.error('Error loading GLB file:', error);
  });
  return <primitive object={scene} />;
}

export default function StickpackModel() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Model url="/assets/acnebio-pro-stickpack.glb" />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}