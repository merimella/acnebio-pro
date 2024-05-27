import React, { useEffect, useRef } from 'react';
import '../styles/ModoUso.css';
import dissolveIcon from '../assets/dissolve-icon.png';
import stirIcon from '../assets/stir-icon.png';
import drinkIcon from '../assets/drink-icon.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ModoUso = () => {
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
    <section ref={sectionRef} className="modo-uso">
      <div className="container">
        <h2>Modo d'Uso</h2>
        <ol>
          <li ref={stepRefs.current[0]}>
            <img src={dissolveIcon} alt="Dissolve Icon" className="icon" />
            Sciogliere il contenuto di 1 stick pack <br />
            in circa mezzo bicchiere di acqua (80-100 ml) <br />
            <span className="small-text">o altra bevanda di proprio gradimento (latte, bevanda vegetale di soia, riso, mandorla, ecc.).</span>
          </li>
          <li ref={stepRefs.current[1]}>
            <img src={stirIcon} alt="Stir Icon" className="icon" />
            Mescolare bene fino a completa solubilizzazione della polvere.
          </li>
          <li ref={stepRefs.current[2]}>
            <img src={drinkIcon} alt="Drink Icon" className="icon" />
            Assumere 1 volta al giorno <br />
            <span className="small-text">a partire dai <b>10 anni</b> di età.</span>
          </li>
        </ol>
      </div>
    </section>
  );
};

export default ModoUso;
