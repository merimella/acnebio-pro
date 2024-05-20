// src/App.js
import React, { useEffect } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import SectionContent from './components/SectionContent';
import Slider from './components/Slider'; // Import the new component
import SectionIngredienti from './components/SectionIngredienti'; // Import the new SectionIngredienti component
import Ingredients from './components/Ingredients';
import './App.css';

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const ingredientiSection = document.querySelector('.ingredienti');
      if (ingredientiSection && window.scrollY + window.innerHeight >= ingredientiSection.offsetTop) {
        ingredientiSection.classList.add('start-animation');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      <NavBar />
      <Header />
      <section className="section" id="section1">
        <div className="container">
          <SectionContent />
        </div>
      </section>
      <div className="ingredienti">
        <Ingredients />
      </div>
      <section className="section" id="section2">
        <div className="container">
          <SectionIngredienti /> {/* Add the SectionIngredienti component */}
          <div id="slider"><Slider /> {/* Use the new component */}</div>
          </div>
      </section>
      <section className="section" id="section3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col text-center">
              <h1>Servizi</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="section4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col text-center">
              <h1>Contatti</h1>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
