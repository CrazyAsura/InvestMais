import axios from 'axios';

export interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

export interface IBGECity {
  id: number;
  nome: string;
}

const ibgeClient = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/',
});

export const getStates = async (): Promise<IBGEState[]> => {
  try {
    const { data } = await ibgeClient.get('estados?orderBy=nome');
    return data;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

export const getCitiesByState = async (uf: string): Promise<IBGECity[]> => {
  try {
    const { data } = await ibgeClient.get(`estados/${uf}/municipios?orderBy=nome`);
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};
