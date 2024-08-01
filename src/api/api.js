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
      }
    });
    return response.data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      tax_class: product.tax_class, // Assicurati che questo campo sia incluso nella risposta
      images: product.images.map(image => ({
        src: image.src,
        alt: image.name
      })) // Gestisce correttamente le immagini
    }));
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

const getTaxRates = async () => {
  try {
    const response = await fetch('https://roydermal.it/wp-json/wc/v3/taxes?consumer_key=ck_021e839b264b9ee5eebaf6cb44302729a86ae9a8&consumer_secret=cs_35dbb932e5d22cd0e052b92855e477a6e0bdd8b7', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const taxRates = await response.json();
    return taxRates;
  } catch (error) {
    console.error('Errore nel recupero delle aliquote fiscali:', error);
  }
};

// Utilizza questa funzione per ottenere gli ID delle tasse e mappali alle rispettive classi fiscali
const mapTaxRates = async () => {
  const taxRates = await getTaxRates();
  const taxRateIds = {};

  taxRates.forEach(taxRate => {
    taxRateIds[taxRate.class] = taxRate.id;
  });

  console.log(taxRateIds);
  return taxRateIds;
};

// Esegui la mappatura
mapTaxRates().then(taxRateIds => {
  console.log('Mappatura delle classi fiscali agli ID delle tasse:', taxRateIds);
});


// Esempio di aggiunta di un parametro di query per filtrare i dati restituiti
export const getOrderById = async (id, includeTaxes = true) => {
  try {
    const params = includeTaxes ? '?include=taxes' : '';
    const response = await api.get(`/orders/${id}${params}`);
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
