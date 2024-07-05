import axios from 'axios';

const api = axios.create({
  baseURL: 'https://roydermal.it/wp-json/wc/v3', // URL del tuo sito WordPress con WooCommerce
  auth: {
    username: 'ck_021e839b264b9ee5eebaf6cb44302729a86ae9a8', // Consumer Key
    password: 'cs_35dbb932e5d22cd0e052b92855e477a6e0bdd8b7', // Consumer Secret
  },
});

export const getProductsByIds = async (ids) => {
    try {
      const response = await api.get('/products', {
        params: {
          include: ids.join(','), // Include only specific product IDs
        },
      });
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero dei prodotti:', error);
      throw error;
    }
  };
  

export const createOrder = async (order) => {
  try {
    const response = await api.post('/orders', order);
    return response.data;
  } catch (error) {
    console.error('Errore nella creazione dell\'ordine:', error);
    throw error;
  }
};

export default api;
