import axios from 'axios';

// Carica le chiavi dal file .env
const consumerKey = process.env.REACT_APP_WC_CONSUMER_KEY;
const consumerSecret = process.env.REACT_APP_WC_CONSUMER_SECRET;

const api = axios.create({
  baseURL: 'https://roydermal.it/wp-json/wc/v3',
  auth: {
    username: consumerKey,
    password: consumerSecret,
  },
});

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

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    console.log('Order Response from WooCommerce API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Errore nella creazione dell\'ordine:', error.response ? error.response.data : error);
    throw error;
  }
};

// Funzione per recuperare un ordine per ID
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero dell\'ordine:', error);
    throw error;
  }
};

// Funzione per recuperare i dettagli del carrello
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
