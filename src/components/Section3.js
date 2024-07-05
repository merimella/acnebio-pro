// src/components/Section3.js
import React, { useRef, useEffect, useState } from 'react';
import '../styles/Section3.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import focusImage from '../assets/young-boy.png';
import mobileImage from '../assets/young-boy-pointing-up.png'; // Importa l'immagine per mobile
import intestinoSVG from '../assets/intestino.svg';

gsap.registerPlugin(ScrollTrigger);

const Section3 = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section3 = sectionRef.current;
      const sectionTop = section3.getBoundingClientRect().top;
      const sectionHeight = section3.offsetHeight;
      const viewportHeight = window.innerHeight;

      if (sectionTop <= viewportHeight / 2 && sectionTop >= -sectionHeight / 2) {
        section3.classList.add('bg-transition');
      } else {
        section3.classList.remove('bg-transition');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0 },
      {
        opacity: 1,
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
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="section section-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-left" ref={textRef}>
            <h2>
              <img src={intestinoSVG} alt="Intestino" className="intestino-icon" />
              <div className="title-wrapper">
                <span className="asse-text">asse</span><br />
                <span className="cute-intestino">cute · intestino</span>
              </div>
            </h2>
            <p>Oltre il 50% dei pazienti acneici mostra un'alterazione del microbiota intestinale.</p>
            <p>Una delle cause di disbiosi intestinale è rappresentata dall'uso prolungato ed eccessivo delle terapie antibiotiche nel trattamento dell'acne, sempre meno efficaci a causa dell'antibiotico-resistenza.</p>
            <p className='biblio'>Bowe, W.P., Logan, A.C. Acne vulgaris, probiotics and the gut-brain-skin axis - back to the future?. Gut Pathog 3, 1 (2011).</p>
          </div>
          <div className="col-md-6 text-center">
            <img
              ref={imageRef}
              src={isMobile ? mobileImage : focusImage} // Cambia immagine in base alla dimensione dello schermo
              alt="Focus"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section3;
