import React, { useRef, useEffect, useState } from 'react';
import '../styles/SectionContent.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import acnebioImage from '../assets/acnebio-image.png'; // Assicurati che il percorso sia corretto
import glutenFreeIcon from '../assets/gluten-free.svg';
import lattosioFreeIcon from '../assets/lattosio-free.svg';

gsap.registerPlugin(ScrollTrigger);

const SectionContent = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const iconContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo(
      iconContainerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: iconContainerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <div ref={sectionRef} className="section-content">
      <img ref={imageRef} src={acnebioImage} alt="Acnebio" className="section-image" />
      <p ref={textRef} className="section-paragraph">
        <b>Acnebio PRO</b> è un integratore alimentare a base di probiotici vivi (Saccharomyces cerevisiae 3 miliardi per razione giornaliera), vitamine e minerali. Niacina, biotina, zinco e vitamina A contribuiscono al mantenimento di una pelle normale. Adatto a vegetariani e vegani.
      </p>
      <div ref={iconContainerRef} className="section-icons-ellipse">
        {isMobile ? (
          <div className="section-icons">
            <div className="icon-item">
              <img src={glutenFreeIcon} alt="Senza Glutine" className="icon" />
              <p>Senza Glutine</p>
            </div>
            <div className="icon-item">
              <img src={lattosioFreeIcon} alt="Senza Lattosio" className="icon" />
              <p>Senza Lattosio</p>
            </div>
          </div>
        ) : (
          <div className="section-icons">
            <div className="icon-item">
              <img src={glutenFreeIcon} alt="Senza Glutine" className="icon" />
              <p>Senza Glutine</p>
            </div>
            <div className="icon-item">
              <img src={lattosioFreeIcon} alt="Senza Lattosio" className="icon" />
              <p>Senza Lattosio</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionContent;
