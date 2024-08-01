import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import '../styles/Checkout.css';
import { getProductsByIds, createOrder } from '../api/api';

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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const isValid = formData.firstName && formData.lastName && formData.address && formData.city &&
      formData.state && formData.postcode && formData.country && formData.email && formData.phone &&
      (formData.paymentMethod !== 'stripe' || (formData.paymentMethod === 'stripe' && stripe && elements));
    setFormValid(isValid);
  }, [formData, stripe, elements]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ids = cart.map(product => product.id);
        const products = await getProductsByIds(ids);
        setProducts(products);
      } catch (error) {
        console.error('Errore nel recupero dei prodotti:', error);
      }
    };
    fetchProducts();
  }, [cart]);

  const calculateTax = (price, taxClass) => {
    const taxRates = {
      'standard': 22,
      'tariffa-ridotta': 10,
    };
    const taxRate = taxRates[taxClass] || 0;
    return (price * taxRate) / (100 + taxRate); // Calcola l'IVA inclusa
  };

  const getTaxRateId = (taxClass) => {
    const taxRateIds = {
      'standard': 122, // ID fiscale per la classe standard
      'tariffa-ridotta': 5, // ID fiscale per la classe tariffa-ridotta
    };
    return taxRateIds[taxClass] || 0; // Ritorna un ID di default se la classe non è trovata
  };

  const handleOrderCreation = async (paymentResult) => {
    const lineItems = products.map(product => ({
      product_id: product.id,
      quantity: 1,
      total: parseFloat(product.price).toFixed(2), // Prezzo con IVA inclusa
      taxes: [
        {
          id: getTaxRateId(product.tax_class), // Utilizza l'ID corretto per la classe fiscale
          
        }
      ]
    }));
  
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
      line_items: lineItems,
      transaction_id: paymentResult
    };
  
    try {
      console.log('Creazione dell\'ordine con i seguenti dati:', order);
      const orderResponse = await createOrder(order);
      if (orderResponse.id) {
        console.log('Ordine creato:', orderResponse);
        window.location.href = `/RiepilogoOrdine?orderId=${orderResponse.id}`;
      } else {
        throw new Error('ID dell\'ordine non trovato nella risposta');
      }
    } catch (error) {
      console.error('Errore nella creazione dell\'ordine:', error.response ? error.response.data : error);
      alert('Si è verificato un errore durante la creazione dell\'ordine.');
    }
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
  
    const calculateShippingCost = (shippingAddress) => {
      const { country } = shippingAddress;
      if (country === 'IT') {
        return 0.00;
      }
      const standardShippingCost = 10.00;
      return standardShippingCost;
    };
  
    const isShippingFree = formData.country === 'IT';
    let shippingCost = calculateShippingCost(formData);
  
    let paymentResult;
    try {
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
  
    } catch (error) {
      console.error('Errore nella creazione del metodo di pagamento:', error);
      alert('Errore nella procedura di pagamento');
      return;
    }
  
    // Log per verificare i calcoli dei prezzi e delle tasse
    console.log('Prodotti:', products);
    console.log('Total Price:', totalPrice);
    console.log('Total Tax:', totalTax);
    console.log('Total Price With Tax:', totalPriceWithTax);
  
    handleOrderCreation(paymentResult);
  };
  

  const totalPrice = products.reduce((acc, product) => acc + parseFloat(product.price), 0);
  const totalTax = products.reduce((acc, product) => {
    const taxClass = product.tax_class;
    const tax = calculateTax(parseFloat(product.price), taxClass);
    return acc + tax;
  }, 0);

  const totalPriceWithTax = totalPrice; // Totale con IVA inclusa

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
              {products.map(product => (
                <li className="list-group-item" key={product.id}>
                  {product.name} x1 - {product.price} €
                </li>
              ))}
            </ul>
            <p className="font-weight-bold">Totale (senza IVA): {(totalPrice - totalTax).toFixed(2)} €</p>
            <p className="font-weight-bold">IVA: {totalTax.toFixed(2)} €</p>
            <p className="font-weight-bold">Totale (con IVA): {totalPriceWithTax.toFixed(2)} €</p> {/* Mostra il totale con IVA */}
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
    const totalPrice = products.reduce((acc, product) => acc + parseFloat(product.price), 0);
    const totalTax = 0; // Non calcolare le imposte separatamente
    const totalPriceWithTax = totalPrice; // Totale già incluso di imposte

    console.log('Total Price:', totalPrice.toFixed(2));
    console.log('Total Price With Tax:', totalPriceWithTax.toFixed(2));

    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: totalPriceWithTax.toFixed(2), // Totale con IVA inclusa
          breakdown: {
            item_total: {
              currency_code: 'EUR',
              value: totalPrice.toFixed(2), // Importo totale senza tassare separatamente
            },
            tax_total: {
              currency_code: 'EUR',
              value: totalTax.toFixed(2), // Imposta totale (0)
            }
          }
        },
      }],
    }).then((orderID) => {
      console.log('Order Created:', orderID);
      return orderID;
    }).catch((error) => {
      console.error('Error in createOrder:', error);
    });
  }}
  onApprove={(data, actions) => {
    return actions.order.capture().then(details => {
      console.log('Order Approved:', details);
      handleOrderCreation(details.id); // Passa l'ID della transazione
    }).catch((error) => {
      console.error('Error in onApprove:', error);
    });
  }}
  onError={(error) => {
    console.error('Error in PayPal Buttons:', error);
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
