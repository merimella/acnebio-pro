// src/webhook-handler.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bodyParser = require('body-parser');
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const api = new WooCommerceRestApi({
  url: 'https://roydermal.it',
  consumerKey: 'ck_021e839b264b9ee5eebaf6cb44302729a86ae9a8',
  consumerSecret: 'cs_35dbb932e5d22cd0e052b92855e477a6e0bdd8b7',
  version: 'wc/v3'
});

router.use(bodyParser.json());

// Stripe webhook secret
const endpointSecret = 'whsec_Ndv6IT8Q8B2xWpz3YBGPz6vsD1pOQs0r';

router.post('/webhook-endpoint', (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Implement your business logic for creating WooCommerce order
      createWooCommerceOrder(paymentIntent);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

function createWooCommerceOrder(paymentIntent) {
  // Example logic to create order in WooCommerce
  const orderData = {
    payment_method: 'stripe',
    payment_method_title: 'Stripe',
    set_paid: true,
    billing: {
      first_name: 'John',
      last_name: 'Doe',
      address_1: '1234 Main St',
      city: 'Anytown',
      state: 'CA',
      postcode: '12345',
      country: 'US',
      email: 'john.doe@example.com',
      phone: '(555) 555-5555'
    },
    shipping: {
      first_name: 'John',
      last_name: 'Doe',
      address_1: '1234 Main St',
      city: 'Anytown',
      state: 'CA',
      postcode: '12345',
      country: 'US'
    },
    line_items: [
      {
        product_id: 123,
        quantity: 1
      }
    ]
  };

  api.post('orders', orderData)
    .then((response) => {
      console.log('Order created:', response.data);
    })
    .catch((error) => {
      console.error('Error creating order:', error.response.data);
    });
}

module.exports = router;
