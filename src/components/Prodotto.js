import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import '../styles/Prodotto.css';
//import prodottoImage from '../assets/sfondo-prodotto.png';
import acnebioProGLB from '../assets/acnebio-pro.glb';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2.0} />;
}

const Prodotto = () => {
  return (
    <div className="prodotto-container">
      
      <Canvas className="canvas">
        <ambientLight intensity={2} />
        <directionalLight position={[2, 5, 2]} intensity={2} />
        <directionalLight position={[-2, -5, -2]} intensity={2} />
        <pointLight position={[0, 0, 5]} intensity={2} />
        <Model url={acnebioProGLB} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default Prodotto;
