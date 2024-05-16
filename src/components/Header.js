import React from 'react';
import './Header.css';
import wave from '../assets/header-sfondo.svg'; // Assicurati che il percorso sia corretto

const Header = () => {
  return (
    <header className="header">
      <div className="svg-container">
        <img src={wave} alt="Wave Background" className="wave" />
      </div>
    </header>
  );
};

export default Header;