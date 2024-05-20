import React, { useEffect, useRef } from 'react';
import './SectionContent.css';
import acnebioImage from '../assets/acnebio-image.png'; // Ensure the path is correct
import glutenFreeIcon from '../assets/gluten-free.svg';
import lattosioFreeIcon from '../assets/lattosio-free.svg';

const SectionContent = () => {
  const lineRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      lineRefs.current.forEach(ref => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            ref.classList.add('in-view');
          } else {
            ref.classList.remove('in-view');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const paragraphLines = [
    "Acnebio PRO è un integratore alimentare al gusto cacao",
    "a base di probiotici vivi (SACCHAROMYCES Cerevisiae)",
    "vitamine e minerali che contribuiscono al mantenimento di una pelle normale.",
    "Adatto a vegetariani e vegani.",
    "Senza glutine e lattosio."
  ];

  return (
    <div className="section-content">
      <img src={acnebioImage} alt="Acnebio" className="section-image" />
      <div className="section-paragraph">
        {paragraphLines.map((line, index) => (
          <p
            key={index}
            ref={el => (lineRefs.current[index] = el)}
            className="paragraph-line"
          >
            {line}
          </p>
        ))}
      </div>
      <div className="section-icons-ellipse">
        <div className="section-icons">
          <img src={glutenFreeIcon} alt="Senza Glutine" className="icon" />
          <img src={lattosioFreeIcon} alt="Senza Lattosio" className="icon" />
        </div>
        <div className="ellipse">
          <span>100% VEGANO</span>
        </div>
      </div>
    </div>
  );
};

export default SectionContent;
