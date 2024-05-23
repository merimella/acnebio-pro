import React, { useState, useEffect, useRef } from 'react';
import './Slider.css';
import nutritionalImage from '../assets/nutritional-info.png'; // Ensure the path is correct

const slidesData = [
  { id: 1, title: "Niacina 54mg", description: "Mantiene l’equilibrio e il benessere della barriera idrolipidica della pelle" },
  { id: 2, title: "Zinco 7,5 mg", description: "In 14 studi comparativi, l’efficacia terapeutica dello zinco è stata equiparata agli antibiotici sistemici per l’acne" },
  { id: 3, title: "Biotina 1200 µg ", description: "Favorisce il naturale benessere della cute. L’uso di antibiotici riduce i livelli di biotina, alterando il microbiota intestinale" },
  { id: 4, title: "Vitamina A 450 µg", description: "E’ in grado di ridurre la produzione di sebo e contrastare la cheratinizzazione" }
];

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [hideImage, setHideImage] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
      }, 3000); // Change slide every 3 seconds
    }

    return () => clearInterval(intervalRef.current);
  }, [isHovered]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleDotClick = (index) => setActiveIndex(index);

  const handleButtonClick = () => setShowImage(true);
  const handleCloseImage = () => {
    setHideImage(true);
    setTimeout(() => {
      setShowImage(false);
      setHideImage(false);
    }, 1000); // Durata dell'animazione in uscita
  };

  return (
    <div className="slider-container">
      <div className="slider" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="slides" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {slidesData.map((slide, index) => (
            <div key={slide.id} className={`slide ${index === activeIndex ? 'active' : ''}`}>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
            </div>
          ))}
        </div>
        <div className="dots">
          {slidesData.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
        <div className="button-container">
          <button className="btn" onClick={handleButtonClick}><span>TABELLA NUTRIZIONALE</span></button>
        </div>
        {showImage && (
          <>
            <div className={`image-modal ${hideImage ? 'hide' : ''}`} onClick={handleCloseImage}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={nutritionalImage} alt="Nutritional Info" className="nutritional-image" />
              </div>
            </div>
            <span className="close-button" onClick={handleCloseImage}>&times;</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Slider;
