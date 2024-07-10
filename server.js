const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const stripe = require('stripe')('sk_test_51L0MYKEI7SKHVw322AiD70awsc3J40CFnnUvIZby2JBvsO2KP7tdH6lULBytpWs606UNajpETo0EXdDQaawCAGvk00dwq0YpnK'); // Chiave di test di Stripe per acnebio.it
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const paypal = require('@paypal/checkout-server-sdk');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

// Middleware per loggare tutte le richieste in arrivo
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// Chiavi segrete e configurazione API
const wooSecret = '+b..WgtLwQbnC2!~GKe{o56uwi9xN|zo*|IQ/hZyt]`0Sn_^X&'; // Chiave segreta per WooCommerce webhook
const stripeWebhookSecret = 'whsec_JCNpJBOZnQC6TFEg9FmZbousdZzCJMyT'; // Chiave segreta del webhook di Stripe per acnebio.it

const api = new WooCommerceRestApi({
  url: 'https://roydermal.it',
  consumerKey: 'ck_021e839b264b9ee5eebaf6cb44302729a86ae9a8',
  consumerSecret: 'cs_35dbb932e5d22cd0e052b92855e477a6e0bdd8b7',
  version: 'wc/v3'
});

// Configurazione PayPal per Sandbox
const sandboxEnvironment = new paypal.core.SandboxEnvironment(
  'AaRxJ6asHFjszfEyzrCcb1koYJ5HX1n6qhJETS0GbsCU3WjbCyd1MN_wui3nmFD0MgaSZXl3FJBhvGNo'
);
const client = new paypal.core.PayPalHttpClient(sandboxEnvironment);


// Gestione Webhook WooCommerce
app.post('/webhook-endpoint', bodyParser.urlencoded({ extended: true }), (req, res) => {
  const payload = JSON.stringify(req.body);
  const sigHeader = req.get('x-wc-webhook-signature');

  console.log('WooCommerce Payload received:', req.body);
  console.log('WooCommerce Signature header:', sigHeader);

  if (!sigHeader) {
    console.error('WooCommerce Signature header missing');
    return res.status(400).send('WooCommerce Signature header missing');
  }

  const sigHash = crypto.createHmac('sha256', wooSecret).update(payload).digest('base64');

  console.log('Signature hash:', sigHash);

  if (sigHeader !== sigHash) {
    console.error('WooCommerce Signature mismatch');
    return res.status(400).send('WooCommerce Signature mismatch');
  }

  console.log('WooCommerce Webhook received and verified:', req.body);
  // Aggiungi la logica per gestire l'ordine WooCommerce qui

  res.status(200).send('WooCommerce Webhook received');
});

// Gestione Webhook Stripe
app.post('/stripe-webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payload = req.body;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, stripeWebhookSecret);
  } catch (err) {
    console.log(`⚠️  Stripe Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestisci il tipo di evento
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      createWooCommerceOrder(paymentIntent);
      break;
    // gestisci altri eventi qui
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Funzione per creare un ordine WooCommerce
function createWooCommerceOrder(paymentIntent) {
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

// Gestione Webhook PayPal
app.post('/paypal-webhook', bodyParser.json(), (req, res) => {
  const body = req.body;

  console.log('PayPal Webhook received:', body);

  // Verifica la firma del webhook (da implementare se necessario)
  // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature

  // Gestisci gli eventi PayPal
  switch (body.event_type) {
    case 'PAYMENT.SALE.COMPLETED':
      console.log('Payment completed');
      createWooCommerceOrderFromPayPal(body);
      break;
    default:
      console.log(`Unhandled event type ${body.event_type}`);
  }

  res.status(200).send('Webhook received');
});

// Funzione per creare un ordine WooCommerce da PayPal
function createWooCommerceOrderFromPayPal(payment) {
  const orderData = {
    payment_method: 'paypal',
    payment_method_title: 'PayPal',
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

// Serve il frontend React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
