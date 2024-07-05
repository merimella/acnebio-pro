import React, { useState, useEffect, useContext, useRef } from 'react';
import { getProductsByIds } from '../api';
import { CartContext } from '../contexts/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Prodotto.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import glutenFreeIcon from '../assets/gluten-free.svg';
import lattosioFreeIcon from '../assets/lattosio-free.svg';
import veganIcon from '../assets/vegan.svg';

gsap.registerPlugin(ScrollTrigger);

const UnifiedProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const productIds = [8067]; // Replace with your product IDs

  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const iconContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByIds(productIds);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productIds]);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo(
      iconContainerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: iconContainerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + amount;
      return newQuantity < 1 ? 1 : newQuantity; // Ensure quantity is at least 1
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container shop-container" ref={sectionRef}>
      {products.map(product => (
        <div key={product.id} className="row product-detail">
          <div className="col-md-6 product-image" ref={imageRef}>
            <img src={product.images[0].src} alt={product.name} className="img-fluid" />
          </div>
          <div className="col-md-6 product-info" ref={textRef}>
            <h1>Acnebio PRO Stick Pack</h1>
            <p className="section-paragraph">
              Integratore alimentare a base di probiotici vivi (Saccharomyces cerevisiae 3 miliardi per razione giornaliera), vitamine e minerali. Niacina, biotina, zinco e vitamina A contribuiscono al mantenimento di una pelle normale.
            </p>
            <div className="section-icons-ellipse">
              <div className="d-flex justify-content-between">
                <div className="icon-item text-center">
                  <img src={glutenFreeIcon} alt="Senza Glutine" className="icon" />
                  <p>Senza Glutine</p>
                </div>
                <div className="icon-item text-center">
                  <img src={lattosioFreeIcon} alt="Senza Lattosio" className="icon" />
                  <p>Senza Lattosio</p>
                </div>
                <div className="icon-item text-center">
                  <img src={veganIcon} alt="Vegano" className="icon" />
                  <p>Vegano</p>
                </div>
              </div>
            </div>
            <p className="product-price">{product.price} €</p>
            <div className="d-flex align-items-center my-3">
              <div className="quantity-selector d-flex align-items-center">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <input type="number" min="1" value={quantity} readOnly className="form-control text-center mx-2" />
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
              <button className="btn btn-primary add-to-cart ms-3" onClick={() => addToCart(product, quantity)}>Aggiungi al Carrello</button>
            </div>
            <div className="product-shipping">
              <p>Spedizione Gratuita</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnifiedProductSection;
