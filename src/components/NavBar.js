import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../assets/logo.svg';
import './NavBar.css';

const NavBar = () => {
  const [navbarOpaque, setNavbarOpaque] = useState(false);
  const [navbarShrink, setNavbarShrink] = useState(false);

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
    <Navbar expand="lg" className={`navbar ${navbarOpaque ? 'opaque' : 'transparent'} ${navbarShrink ? 'shrink' : 'expand'}`} fixed="top">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Brand className="mx-auto d-lg-none" href="#">
          <img
            src={`${logo}?v=${new Date().getTime()}`} // Aggiungi un parametro di cache busting
            alt="Logo"
            className={`logo ${navbarShrink ? 'shrink' : 'expand'}`}
          />
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#about" className={`nav-link ${navbarShrink ? 'shrink' : 'expand'}`}>
              ABOUT
              <div className="sub-link">ROYDERMAL</div>
            </Nav.Link>
            <Navbar.Brand href="#" className="d-none d-lg-block mx-auto">
              <img
                src={`${logo}?v=${new Date().getTime()}`} // Aggiungi un parametro di cache busting
                alt="Logo"
                className={`logo ${navbarShrink ? 'shrink' : 'expand'}`}
              />
            </Navbar.Brand>
            <Nav.Link href="#shop" className={`nav-link ${navbarShrink ? 'shrink' : 'expand'}`}>
              SHOP
              <div className="sub-link">ROYDERMAL.IT</div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;