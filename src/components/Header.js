import React from 'react';
import './Header.css';
import wave from '../assets/header-sfondo.svg'; // Assicurati che il percorso sia corretto
import ciocco from '../assets/cioccolato.png'; // L'immagine che desideri usare

const Header = () => {
  return (
    <header className="header">
     
      <div className="container h-100">
        <div className="row h-100 align-items-center">
          <div className="col-md-6">
            <img src={ciocco} alt="Cioccolato" className="img-fluid" />
            <div className="ellipse">
              <span>GUSTO CACAO*</span>
            </div>
          </div>
          <div className="col-md-6 text-right">
            <h1>
              ACNEBIO<sup className="trademark">®</sup> <span className="highlight">PRO</span>
            </h1>
            <h2>IL PRIMO CIOCCOLATO* CONTRO L'ACNE</h2>
            <button className="btn">
              <span>SHOP</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;