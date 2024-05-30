import React from 'react';
import '../styles/Prodotto.css'; // Assicurati di creare e collegare questo file CSS
import prodottoImage from '../assets/sfondo-prodotto.png'; // Assicurati che il percorso sia corretto
import exampleProductImage from '../assets/acnebio-image.png'; // Assicurati di sostituire con l'immagine reale del prodotto

const Prodotto = () => {
  return (
    <div className="prodotto-container">
      <div className="prodotto-background">
        <img src={prodottoImage} alt="Sfondo Prodotto" className="sfondo-prodotto" />
        <img src={exampleProductImage} alt="Prodotto" className="img-fluid product-image" />
      </div>
    </div>
  );
};

export default Prodotto;