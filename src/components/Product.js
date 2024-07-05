import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

const Product = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product">
      <h2>{product.name}</h2>
      <p>{product.price} €</p>
      <button onClick={handleAddToCart}>Aggiungi al Carrello</button>
    </div>
  );
};

export default Product;
