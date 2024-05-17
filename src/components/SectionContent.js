// SectionContent.js
import React from 'react';
import './SectionContent.css';
import acnebioImage from '../assets/acnebio-image.png'; // Ensure the path is correct
import glutenFreeIcon from '../assets/gluten-free.svg';
import lattosioFreeIcon from '../assets/lattosio-free.svg';

const SectionContent = () => {
  return (
    <div className="section-content">
      <img src={acnebioImage} alt="Acnebio" className="section-image" />
      <p className="section-paragraph">
        <b>Acnebio PRO</b> è un integratore alimentare con edulcorante a base di probiotici vivi (Saccharomyces cerevisiae 3 miliardi per razione giornaliera), vitamine e minerali. Niacina, biotina, zinco e vitamina A contribuiscono al mantenimento di una pelle normale. Adatto a vegetariani e vegani.
        Senza glutine e lattosio.
      </p>
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
