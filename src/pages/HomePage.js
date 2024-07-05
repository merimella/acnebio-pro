import React, { useEffect } from 'react';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import SectionContent from '../components/SectionContent';
import Slider from '../components/Slider';
import SectionIngredienti from '../components/SectionIngredienti';
import Section3 from '../components/Section3';
import ModoUso from '../components/ModoUso';
import Contact from '../components/Contacts';
import Prodotto from '../components/Prodotto';

import '../styles/HomePage.css';

const HomePage = () => {
  useEffect(() => {
    const handleScroll = () => {
      const section3 = document.getElementById('section3');
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

  return (
    <div className="App">
      <div className="noise-overlay"></div>
      <NavBar />
      <Header />
      <section className="section" id="section1">
        <div className="container">
         
          <Prodotto />
        </div>
      </section>
      <section className="section" id="section2">
        <div className="container">
          <SectionIngredienti />
          <div id="slider"><Slider /></div>
        </div>
      </section>
      <section className="section" id="section3">
        <Section3 />
      </section>
      <section className="section" id="section4">
        <div className="container">
          <ModoUso />
        </div>
      </section>
      <Contact />
    </div>
  );
};

export default HomePage;
