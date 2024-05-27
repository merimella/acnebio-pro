// Contacts.js
import React from 'react';
import './Contacts.css';
import logo from '../assets/logo-footer.svg'; // Assicurati di avere il logo nella cartella assets
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-content">
          <img src={logo} alt="Company Logo" className="contact-logo" />
          <p>Un prodotto Roydermmal</p>
          <p>Email: <a href="mailto:info@roydermal.it">info@roydermal.it</a></p>
          <div className="social-icons">
            <a href="https://www.facebook.com/Roydermal/" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/roydermal_italia/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
