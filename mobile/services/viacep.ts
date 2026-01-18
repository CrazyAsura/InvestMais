import axios from 'axios';

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

const viaCEPClient = axios.create({
  baseURL: 'https://viacep.com.br/ws/',
});

export const getAddressByCEP = async (cep: string): Promise<ViaCEPResponse | null> => {
  const cleanCEP = cep.replace(/\D/g, '');
  if (cleanCEP.length !== 8) return null;

  try {
    const { data } = await viaCEPClient.get(`${cleanCEP}/json/`);
    if (data.erro) return null;
    return data;
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
};
