import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const totalPrice = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>Carrello</h2>
      <ul className="list-group mb-4">
        {cart.map(product => (
          <li className="list-group-item d-flex align-items-center" key={product.id}>
            <img src={product.images[0].src} alt={product.name} className="img-thumbnail" />
            <div className="product-info-cart">
              <span>{product.name}</span>
              <span>{product.price} €</span>
              <div className="quantity-controls">
                <button onClick={() => removeFromCart(product.id)}>-</button>
                <span className="quantity">{product.quantity}</span>
                <button onClick={() => addToCart(product)}>+</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="font-weight-bold">Totale: {totalPrice.toFixed(2)} €</p>
      <Link to="/checkout" className="btn btn-primary add-to-cart" onClick={onClose}>Vai al checkout</Link>
    </div>
  );
};

export default Cart;
