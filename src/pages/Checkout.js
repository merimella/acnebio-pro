import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import '../styles/Checkout.css';
import { getTaxClasses } from '../api'; // Importa la funzione per ottenere le classi fiscali

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
  const [formValid, setFormValid] = useState(false);
  const [taxClasses, setTaxClasses] = useState([]);

  useEffect(() => {
    const isValid = formData.firstName && formData.lastName && formData.address && formData.city &&
      formData.state && formData.postcode && formData.country && formData.email && formData.phone &&
      (formData.paymentMethod !== 'stripe' || (formData.paymentMethod === 'stripe' && stripe && elements));
    setFormValid(isValid);
  }, [formData, stripe, elements]);

  useEffect(() => {
    const fetchTaxClasses = async () => {
      try {
        const classes = await getTaxClasses();
        setTaxClasses(classes);
      } catch (error) {
        console.error('Errore nel recupero delle classi fiscali:', error);
      }
    };
    fetchTaxClasses();
  }, []);

  const calculateTax = (price, taxClass) => {
    const taxRate = taxClasses.find(t => t.slug === taxClass)?.rate || 0;
    return price * (taxRate / 100);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValid) {
      alert('Per favore, completa tutti i campi richiesti.');
      return;
    }

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

      // Conferma del pagamento
      const { paymentIntent, error: paymentError } = await stripe.confirmCardPayment(paymentMethod.id);

      if (paymentError) {
        console.error('Errore nel pagamento:', paymentError);
        alert('Errore nel pagamento');
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        paymentResult = paymentIntent.id;
      } else {
        alert('Pagamento non riuscito');
        return;
      }
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
      line_items: cart.map(product => {
        const price = parseFloat(product.price);
        const lineItem = {
          product_id: product.id,
          quantity: 1,
          subtotal: price.toFixed(2),
          subtotal_tax: calculateTax(price, product.tax_class).toFixed(2),
          total: price.toFixed(2),
          total_tax: calculateTax(price, product.tax_class).toFixed(2),
          taxes: [
            {
              id: product.tax_class,
              total: calculateTax(price, product.tax_class).toFixed(2),
            }
          ]
        };
        return lineItem;
      }),
      transaction_id: paymentResult
    };

    console.log('Dati dell\'ordine:', JSON.stringify(order, null, 2));

    try {
      const orderResponse = await axios.post('/woocommerce-api.php', {
        endpoint: '/orders',
        data: order
      });
      console.log('Ordine creato:', orderResponse.data);
      alert('Ordine creato con successo!');
      // Redireziona alla pagina di conferma dell'ordine
      window.location.href = `/order-confirmation?orderId=${orderResponse.data.id}`;
    } catch (error) {
      console.error('Errore nella creazione dell\'ordine:', error.response ? error.response.data : error);
      alert('Si è verificato un errore durante la creazione dell\'ordine.');
    }
  };

  const handlePayPalSuccess = async (details, data) => {
    const order = {
      payment_method: 'paypal',
      payment_method_title: 'PayPal',
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
      line_items: cart.map(product => {
        const price = parseFloat(product.price);
        const lineItem = {
          product_id: product.id,
          quantity: 1,
          subtotal: price.toFixed(2),
          subtotal_tax: calculateTax(price, product.tax_class).toFixed(2),
          total: price.toFixed(2),
          total_tax: calculateTax(price, product.tax_class).toFixed(2),
          taxes: [
            {
              id: product.tax_class,
              total: calculateTax(price, product.tax_class).toFixed(2),
            }
          ]
        };
        return lineItem;
      }),
      transaction_id: data.orderID
    };

    console.log('Dati dell\'ordine (PayPal):', JSON.stringify(order, null, 2));

    try {
      const orderResponse = await axios.post('/woocommerce-api.php', {
        endpoint: '/orders',
        data: order
      });
      console.log('Ordine creato:', orderResponse.data);
      alert('Ordine creato con successo!');
      // Redireziona alla pagina di conferma dell'ordine
      window.location.href = `/order-confirmation?orderId=${orderResponse.data.id}`;
    } catch (error) {
      console.error('Errore nella creazione dell\'ordine:', error.response ? error.response.data : error);
      alert('Si è verificato un errore durante la creazione dell\'ordine.');
    }
  };

  const totalPrice = cart.reduce((acc, product) => acc + parseFloat(product.price), 0);
  const totalTax = cart.reduce((acc, product) => acc + calculateTax(parseFloat(product.price), product.tax_class), 0);

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

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
                  <label>Telefono</label>
                  <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Note (opzionale)</label>
                  <input type="text" className="form-control" name="note" value={formData.note} onChange={handleChange} />
                </div>
              </div>
              <button type="submit" className="btn btn-block mt-4" disabled={!formValid}>Effettua Ordine</button>
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
            <p className="font-weight-bold">IVA: {totalTax.toFixed(2)} €</p>
            <p className="font-weight-bold">Totale con IVA: {(totalPrice + totalTax).toFixed(2)} €</p>
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
                <CardElement options={CARD_ELEMENT_OPTIONS} />
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
                <PayPalScriptProvider options={{ "client-id": "AaRxJ6asHFjszfEyzrCcb1koYJ5HX1n6qhJETS0GbsCU3WjbCyd1MN_wui3nmFD0MgaSZXl3FJBhvGNo", "currency": "EUR" }}>
                  <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          amount: {
                            currency_code: 'EUR', // Imposta la valuta su EUR
                            value: (totalPrice + totalTax).toFixed(2),
                          },
                        }],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then(details => {
                        handlePayPalSuccess(details, data);
                      });
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
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
