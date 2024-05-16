import React from 'react';
import './Header.css'; // Assicurati di creare un file CSS per lo stile

const Header = () => {
  return (
    <header className="header">
      <div className="svg-container">
        <img src="../assets/header-sfondo.svg'" alt="Wave Background" className="wave" />
      </div>
    </header>
  );
};

export default Header;