import React, { useEffect, useRef } from 'react';
import '../styles/SectionIngredienti.css';
import Lottie from 'lottie-react';
import celluleAnimation from '../assets/cellule.json';
import glassAnimation from '../assets/glass.json'; // Importa il nuovo file JSON
import { ReactComponent as FormaArancione } from '../assets/forma-arancione.svg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SectionIngredienti = () => {
  const lottieRef = useRef(null);
  const glassRef = useRef(null); // Crea un riferimento per l'animazione glass
  const sectionRef = useRef(null);
  const stepRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);

  useEffect(() => {
    stepRefs.current.forEach(ref => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <div ref={sectionRef} className="section-ingredienti container">
      <div className="glass-animation-container">
        <Lottie 
          lottieRef={glassRef} 
          animationData={glassAnimation} 
          className="glass-animation" 
          loop={true} 
          autoplay={true} 
          style={{ width: 500, height: 'auto' }} // Imposta le dimensioni dell'animazione
          speed={0.9} // Imposta una velocità ridotta per il loop
        />
      </div>
      <div ref={stepRefs.current[1]} className="row align-items-center mb-4">
        <div className="col-md-3 text-center text-md-right ingredienti-shape-container">
          <FormaArancione className="ingredienti-shape" />
          <span className="shape-text">LYNSIDE<sup>®</sup><br />Acty SCI</span>
        </div>
        <div className="col-md-9 text-left">
          <h2 className="ingredienti-main-title">SACCHAROMYCES</h2>
          <h2 className="highlight">Cerevisiae</h2>
          <p className="ingredienti-description">Lievito probiotico per il benessere del microbiota intestinale e della cute.</p>
        </div>
      </div>
      <div ref={stepRefs.current[2]} className="row align-items-center">
        <div className="col-md-3 text-center text-md-right ingredienti-icon-container">
          <div 
            onMouseEnter={() => lottieRef.current.pause()}
            onMouseLeave={() => lottieRef.current.play()}
          >
            <Lottie 
              lottieRef={lottieRef} 
              animationData={celluleAnimation} 
              className="ingredienti-icon" 
              loop={true}
              autoplay={true}
            />
          </div>
        </div>
        <div className="col-md-9 text-left">
          <p className="ingredienti-subtitle"><b>3 miliardi di cellule vive</b></p>
          <p className="ingredienti-text">Grazie all’azione seboregolatrice e antiossidante, il probiotico S. Cerevisiae si è dimostrato efficace sia in termini di miglioramento che di guarigione.</p>
          <p className="ingredienti-reference">Weber, G., A. Adamczyk, and S. Freytag, "Treatment of acne with a yeast preparation", Fortschr Med, 1989, 107(26): p. 563-6.</p>
        </div>
      </div>
    </div>
  );
};

export default SectionIngredienti;
