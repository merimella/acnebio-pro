// Header.js
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/Header.css';
import ciocco from '../assets/cioccolato.png';

const Header = () => {
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleSecondRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const imgRef = useRef(null);
  const ellisseRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(headerRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
      .fromTo(imgRef.current, { x: '-100%', opacity: 0 }, { x: '0%', opacity: 1, duration: 1 }, '-=0.5')
      .fromTo(titleRef.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1 }, '-=0.5')
      .fromTo(subtitleSecondRef.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1 }, '-=0.5')
      .fromTo(subtitleRef.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1 }, '-=0.5')
      .fromTo(buttonRef.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1 }, '-=0.5')
      .fromTo(ellisseRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.5'); // Animazione ellisse

    gsap.fromTo(imgRef.current, { y: 0 }, {
      y: -20,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      duration: 2
    });
  }, []);

  const handleButtonClick = () => {
    window.location.href = "https://roydermal.it/prodotto/acnebio-pro-stimpack/";
  };

  return (
    <header className="header" ref={headerRef}>
      <div className="container h-100">
        <div className="row h-100 align-items-center">
          <div className="col-md-6">
            <img ref={imgRef} src={ciocco} alt="Cioccolato" className="img-fluid" />
          </div>
          <div className="col-md-6 text-left">
            <h1 ref={titleRef}>
              ACNEBIO<sup className="trademark">®</sup> <span className="highlight">PRO</span>
            </h1>
            <h3 ref={subtitleSecondRef}>Integratore Alimentare a base di probiotici vivi </h3>
            <h2 ref={subtitleRef}>IL PRIMO CIOCCOLATO* PER LA TUA PELLE</h2>
            <button className="btn" onClick={handleButtonClick} ref={buttonRef}>
              <span>ACQUISTA</span>
            </button>
          </div>
        </div>
        <div className="ellisse" ref={ellisseRef}>
          <svg viewBox="0 0 200 100">
            <ellipse cx="100" cy="50" rx="100" ry="50" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">*gusto cacao</text>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
