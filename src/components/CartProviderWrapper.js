import React, { useEffect, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import NavBar from './NavBar';
import Cart from './Cart';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ChiSiamo from '../pages/ChiSiamo';
import Checkout from '../pages/Checkout';
import RiepilogoOrdine from '../pages/RiepilogoOrdine'; // Importa il componente RiepilogoOrdine

const CartProviderWrapper = ({ isCartOpen, toggleCart }) => {
  const { setOnAddToCart } = useContext(CartContext);

  useEffect(() => {
    setOnAddToCart(() => toggleCart);
  }, [setOnAddToCart, toggleCart]);

  return (
    <>
      <NavBar onCartClick={toggleCart} />
      <Cart isOpen={isCartOpen} onClose={toggleCart} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/RiepilogoOrdine" element={<RiepilogoOrdine />} /> {/* Aggiungi la rotta per RiepilogoOrdine */}
      </Routes>
    </>
  );
};

export default CartProviderWrapper;
