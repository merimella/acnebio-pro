import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrderById } from '../api';

const OrderConfirmation = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const orderId = new URLSearchParams(location.search).get('orderId');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Errore nel recupero dell\'ordine:', error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>Caricamento...</div>;
  }

  return (
    <div>
      <h1>Conferma Ordine</h1>
      <h2>Grazie per il tuo ordine!</h2>
      <p>Il tuo ordine è stato ricevuto con successo. Ecco i dettagli:</p>
      <div>
        <h3>Dettagli Ordine</h3>
        <p>Order ID: {order.id}</p>
        <p>Data: {order.date_created}</p>
        <p>Totale: {order.total} {order.currency}</p>
        <h3>Prodotti</h3>
        <ul>
          {order.line_items.map(item => (
            <li key={item.id}>{item.name} x {item.quantity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderConfirmation;
