import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import CartProviderWrapper from './components/CartProviderWrapper';
import './App.css';

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <Router>
      <CartProvider>
        <CartProviderWrapper isCartOpen={isCartOpen} toggleCart={toggleCart} />
      </CartProvider>
    </Router>
  );
};

export default App;
