import axios from 'axios';

// Carica le chiavi dal file .env
const consumerKey = process.env.REACT_APP_WC_CONSUMER_KEY;
const consumerSecret = process.env.REACT_APP_WC_CONSUMER_SECRET;

console.log('Consumer Key:', consumerKey); // Debug log
console.log('Consumer Secret:', consumerSecret); // Debug log

const api = axios.create({
  baseURL: 'https://roydermal.it/wp-json/wc/v3', // URL del tuo sito WordPress con WooCommerce
  auth: {
    username: consumerKey, // Consumer Key
    password: consumerSecret, // Consumer Secret
  },
});

console.log('API Base URL:', api.defaults.baseURL); // Debug log

// Funzione per recuperare le classi fiscali
export const getTaxClasses = async () => {
    try {
        const response = await api.get('/settings/tax_classes'); // Endpoint alternativo per recuperare le classi fiscali
        console.log('Tax Classes Response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Errore nel recupero delle classi fiscali:', error);
        throw error;
    }
};

// Funzione per recuperare i prodotti per ID, incluso tax_status e tax_class
export const getProductsByIds = async (ids) => {
    try {
        const response = await api.get('/products', {
            params: {
                include: ids.join(','),
            },
        });
        return response.data;
    } catch (error) {
        console.error('Errore nel recupero dei prodotti:', error);
        throw error;
    }
};

// Funzione per creare un ordine
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post('/woocommerce-api.php', {
      endpoint: '/orders',
      data: orderData
    });
    return response.data;
  } catch (error) {
    console.error('Errore nella creazione dell\'ordine:', error.response ? error.response.data : error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero dell\'ordine:', error);
    throw error;
  }
};

export const getCartDetails = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero dei dettagli del carrello:', error);
    throw error;
  }
};

export default api;
