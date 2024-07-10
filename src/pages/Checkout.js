import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { createOrder } from '../api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, PaymentRequestButtonElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import '../styles/Checkout.css';

// Sostituisci con la tua chiave pubblica di Stripe
const stripePromise = loadStripe('pk_live_51L0MYKEI7SKHVw32MYFuUZSQjsHVGKGLVDdXSn9xOFupLWoaEpxBf02j71LtXQBbBEE3CX3r4wNVxFbQ2gtMbSXn00GIJ8fic7');

const CheckoutForm = () => {
  const { cart } = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Italia',
    email: '',
    phone: '',
    note: '',
    paymentMethod: 'stripe'
  });

  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'IT',
        currency: 'eur',
        total: {
          label: 'Total',
          amount: cart.reduce((total, product) => total + product.price * product.quantity, 0) * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, cart]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let paymentResult;

    if (formData.paymentMethod === 'stripe') {
      if (!stripe || !elements) {
        return;
      }

      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postcode,
            country: formData.country,
          },
        },
      });

      if (error) {
        console.error('Errore nel metodo di pagamento:', error);
        alert('Errore nel metodo di pagamento');
        return;
      }

      paymentResult = paymentMethod.id;
    } else if (formData.paymentMethod === 'paypal') {
      // L'implementazione di PayPal richiede di gestire il risultato di pagamento
      // Utilizza PayPalButtons per ottenere il risultato e assegnalo a paymentResult
    }

    // Crea l'ordine su WooCommerce
    const order = {
      payment_method: formData.paymentMethod,
      payment_method_title: formData.paymentMethod === 'stripe' ? 'Credit Card (Stripe)' : 'PayPal',
      set_paid: true,
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.postcode,
        country: formData.country,
        email: formData.email,
        phone: formData.phone,
        note: formData.note
      },
      shipping: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.postcode,
        country: formData.country
      },
      line_items: cart.map(product => ({
        product_id: product.id,
        quantity: 1,
      })),
      transaction_id: paymentResult // Aggiungi il risultato del pagamento all'ordine
    };

    try {
      const orderResponse = await createOrder(order);
      console.log('Ordine creato:', orderResponse);
      alert('Ordine creato con successo!');
    } catch (error) {
      console.error('Errore nella creazione dell\'ordine:', error);
      alert('Si è verificato un errore durante la creazione dell\'ordine.');
    }
  };

  const totalPrice = cart.reduce((acc, product) => acc + parseFloat(product.price), 0);

  return (
    <div className="container checkout-container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="billing-and-payment card p-4 mb-4">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h1>Completa Ordine</h1>
                <h3>Inserisci i tuoi dati per la Spedizione</h3>
                <div className="form-group">
                  <label>Nome</label>
                  <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Cognome</label>
                  <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Paese/Regione</label>
                  <input type="text" className="form-control" name="country" value={formData.country} onChange={handleChange} readOnly />
                </div>
                <div className="form-group">
                  <label>Via e numero</label>
                  <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Città</label>
                  <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Provincia</label>
                  <input type="text" className="form-control" name="state" value={formData.state} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>C.A.P.</label>
                  <input type="text" className="form-control" name="postcode" value={formData.postcode} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Note (opzionale)</label>
                  <input type="text" className="form-control" name="note" value={formData.note} onChange={handleChange} />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="order-summary card p-4">
            <h2>Ordine</h2>
            <ul className="list-group mb-4">
              {cart.map(product => (
                <li className="list-group-item" key={product.id}>
                  {product.name} x1 - {product.price} €
                </li>
              ))}
            </ul>
            <p className="font-weight-bold">Totale: {totalPrice.toFixed(2)} €</p>
          </div>
          <div>
            <h2>Spedizione Gratuita in Italia</h2>
          </div>
          <div className="payment-method">
            <h2>Pagamento</h2>
            <div className="form-group">
              <label>
                <input type="radio" name="paymentMethod" value="stripe" checked={formData.paymentMethod === 'stripe'} onChange={handleChange} />
                Carta di Credito (Stripe)
              </label>
            </div>
            {formData.paymentMethod === 'stripe' && (
              <div className="form-group">
                <CardElement />
              </div>
            )}
            {paymentRequest && (
              <div className="form-group">
                <PaymentRequestButtonElement options={{ paymentRequest }} />
              </div>
            )}
            <div className="form-group">
              <label>
                <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleChange} />
                PayPal
              </label>
            </div>
            {formData.paymentMethod === 'paypal' && (
              <div className="form-group">
                <PayPalScriptProvider options={{ "client-id": "AaRxJ6asHFjszfEyzrCcb1koYJ5HX1n6qhJETS0GbsCU3WjbCyd1MN_wui3nmFD0MgaSZXl3FJBhvGNo" }}>
                  <PayPalButtons style={{ layout: "horizontal" }} />
                </PayPalScriptProvider>
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-block">Effettua Ordine</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
