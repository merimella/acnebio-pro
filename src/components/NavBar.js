import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link as ScrollLink } from 'react-scroll';
import logo from '../assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../styles/NavBar.css';

const NavBar = () => {
  const [navbarOpaque, setNavbarOpaque] = useState(false);
  const [navbarShrink, setNavbarShrink] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setNavbarOpaque(true);
      setNavbarShrink(true);
    } else {
      setNavbarOpaque(false);
      setNavbarShrink(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar 
      expand="lg" 
      className={`navbar ${navbarOpaque ? 'opaque' : 'transparent'} ${navbarShrink ? 'shrink' : 'expand'}`} 
      fixed="top" 
      expanded={expanded} 
      onToggle={() => setExpanded(!expanded)}
    >
      <Navbar.Brand href="#">
        <img
          src={`${logo}?v=${new Date().getTime()}`}
          alt="Logo"
          className={`logo ${navbarShrink ? 'shrink' : 'expand'}`}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav">
        <FontAwesomeIcon icon={faBars} style={{ color: '#ff5c35', fontSize: '1.5rem' }} />
      </Navbar.Toggle>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <ScrollLink
            to="section2"
            smooth={true}
            duration={500}
            className={`nav-link ${navbarShrink ? 'shrink' : 'expand'}`}
            onClick={() => setExpanded(false)}
          >
            Ingredienti
          </ScrollLink>
          <Nav.Link 
            href="https://roydermal.it/chi-siamo/" 
            className={`nav-link ${navbarShrink ? 'shrink' : 'expand'}`}
            onClick={() => setExpanded(false)}
          >
            Chi siamo
          </Nav.Link>
          <Nav.Link 
            href="https://roydermal.it/prodotto/acnebio-pro-stimpack/" 
            className={`nav-link ${navbarShrink ? 'shrink' : 'expand'}`}
            onClick={() => setExpanded(false)}
          >
            Shop
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;