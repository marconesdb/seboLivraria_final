import axios from 'axios';

const api = axios.create({
  baseURL: process.env.MELHOR_ENVIO_URL,
  headers: {
    Authorization: process.env.MELHOR_ENVIO_TOKEN,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Sebo Livraria (contato@sebo.com.br)'
  }
});

export const getShippingQuotes = async (
  fromCep: string, toCep: string,
  items: { id: string; weight: number; insurance_value: number; quantity: number }[]
) => {
  const { data } = await api.post('/me/shipment/calculate', {
    from: { postal_code: fromCep },
    to:   { postal_code: toCep },
    products: items.map(i => ({
      ...i, width: 14, height: 2, length: 20
    })),
    options: { own_hand: false, receipt: false, insurance_value: 0 }
  });
  return data.filter((q: any) => !q.error && q.price);
};