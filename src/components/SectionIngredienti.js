// src/components/SectionIngredienti.js
import React, { useEffect, useRef } from 'react';
import './SectionIngredienti.css';
import Lottie from 'lottie-react';
import celluleAnimation from '../assets/cellule.json'; // Importa il file JSON
import { ReactComponent as FormaArancione } from '../assets/forma-arancione.svg'; // Importa l'SVG come componente React
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SectionIngredienti = () => {
  const lottieRef = useRef(null); // Crea un riferimento per l'animazione Lottie
  const sectionRef = useRef(null);
  const stepRefs = [useRef(null), useRef(null)];

  useEffect(() => {
    stepRefs.forEach(ref => {
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
      <div className='container'>
        <h1>INGREDIENTI</h1>
      </div>
      <div ref={stepRefs[0]} className="row align-items-center mb-4">
        <div className="col-md-3 text-center text-md-right ingredienti-shape-container">
          <FormaArancione className="ingredienti-shape" />
          <span className="shape-text">LYNSIDE<sup>®</sup><br />Acty SCI</span>
        </div>
        <div ref={stepRefs[1]} className="col-md-9 text-left">
          <h2 className="ingredienti-main-title">SACCHAROMYCES</h2>
          <h2 className="highlight">Cerevisiae</h2>
          <p className="ingredienti-description">Lievito probiotico per il benessere del microbiota intestinale e della cute.</p>
        </div>
      </div>
      <div ref={stepRefs[1]} className="row align-items-center">
        <div className="col-md-3 text-center text-md-right ingredienti-icon-container">
          <div 
            onMouseEnter={() => lottieRef.current.pause()} // Ferma l'animazione al passaggio del mouse
            onMouseLeave={() => lottieRef.current.play()} // Riprende l'animazione quando il mouse esce
          >
            <Lottie 
              lottieRef={lottieRef} // Assegna il riferimento al componente Lottie
              animationData={celluleAnimation} 
              className="ingredienti-icon" 
              loop={true}  // Imposta il loop continuo
              autoplay={true} // Avvia l'animazione automaticamente
              style={{ width: 200, height: 200 }} // Imposta le dimensioni
            />
          </div>
        </div>
        <div className="col-md-9 text-left">
          <p className="ingredienti-subtitle">3 miliardi di cellule vive</p>
          <p className="ingredienti-text">Grazie all’azione seboregolatrice e antiossidante, il probiotico S. Cerevisiae si è dimostrato efficace sia in termini di miglioramento che di guarigione.</p>
          <p className="ingredienti-reference">Weber, G., A. Adamczyk, and S. Freytag, "Treatment of acne with a yeast preparation", Fortschr Med, 1989, 107(26): p. 563-6.</p>
        </div>
      </div>
    </div>
  );
};

export default SectionIngredienti;
