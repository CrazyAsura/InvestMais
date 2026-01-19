import api from './api';

export interface AccountBalance {
  balance: number;
  totalInvested: number;
}

export interface Transaction {
  _id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'pix' | 'boleto';
  amount: number;
  description: string;
  date: string;
  isNegative: boolean;
}

export interface PixData {
  amount: number;
  pixKey: string;
  description?: string;
}

export interface PixKey {
  _id: string;
  type: 'CPF' | 'EMAIL' | 'PHONE' | 'RANDOM';
  value: string;
  active: boolean;
}

export interface QrCodeData {
  qrCode: string;
  pixKey: string;
  amount: number;
  description?: string;
}

export interface DecodedPix {
  pixKey: string;
  amount: number;
  receiverName: string;
}

export interface BoletoData {
  barCode: string;
  amount: number;
  description?: string;
}

export enum CardType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  MULTIPLE = 'MULTIPLE',
}

export enum CardClass {
  STANDARD = 'STANDARD',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  BLACK = 'BLACK',
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CANCELLED = 'CANCELLED',
}

export interface CardData {
  _id?: string;
  cardNumber: string;
  holderName: string;
  expirationDate: string;
  cvv: string;
  type: CardType;
  class: CardClass;
  status: CardStatus;
  creditLimit: number;
  usedLimit: number;
  brand: string;
  isVirtual: boolean;
  contactless: boolean;
}

export interface Investment {
  symbol: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  change: string;
  changePercent: string;
  lastUpdated: string;
  imageUrl?: string;
}

export const bankingService = {
  getBalance: async (): Promise<AccountBalance> => {
    try {
      const response = await api.get('/banking/account/balance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get('/banking/transactions/history');
      return response.data.map((t: any) => ({
        _id: t._id,
        type: t.type,
        amount: t.amount,
        description: t.description || 'Transação',
        date: t.createdAt,
        isNegative: t.type !== 'deposit'
      }));
    } catch (error) {
      throw error;
    }
  },

  getTransactionById: async (id: string): Promise<Transaction> => {
    try {
      const response = await api.get(`/banking/transactions/${id}`);
      const t = response.data;
      return {
        _id: t._id,
        type: t.type,
        amount: t.amount,
        description: t.description || 'Transação',
        date: t.createdAt,
        isNegative: t.type !== 'deposit'
      };
    } catch (error) {
      throw error;
    }
  },

  deposit: async (amount: number, description?: string): Promise<any> => {
    try {
      const response = await api.post('/banking/transactions/deposit', { amount, description });
      return response.data;
    } catch (error) {
      console.error('Error making deposit:', error);
      throw error;
    }
  },

  withdraw: async (amount: number, description?: string): Promise<any> => {
    try {
      const response = await api.post('/banking/transactions/withdraw', { amount, description });
      return response.data;
    } catch (error) {
      console.error('Error making withdraw:', error);
      throw error;
    }
  },

  transfer: async (toAccountNumber: string, amount: number, description?: string): Promise<any> => {
    try {
      const response = await api.post('/banking/transactions/transfer', { toAccountNumber, amount, description });
      return response.data;
    } catch (error) {
      console.error('Error making transfer:', error);
      throw error;
    }
  },

  createAccount: async (): Promise<any> => {
    try {
      const response = await api.post('/banking/account');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendPix: async (pixData: PixData): Promise<any> => {
    try {
      const response = await api.post('/banking/pix/send', pixData);
      return response.data;
    } catch (error) {
      console.error('Error sending Pix:', error);
      throw error;
    }
  },

  getPixKeys: async (): Promise<PixKey[]> => {
    try {
      const response = await api.get('/banking/pix/keys');
      return response.data;
    } catch (error) {
      console.error('Error fetching Pix keys:', error);
      throw error;
    }
  },

  createPixKey: async (type: string, value: string): Promise<PixKey> => {
    try {
      const response = await api.post('/banking/pix/keys', { type, value });
      return response.data;
    } catch (error) {
      console.error('Error creating Pix key:', error);
      throw error;
    }
  },

  deletePixKey: async (id: string): Promise<any> => {
    try {
      const response = await api.delete(`/banking/pix/keys/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting Pix key:', error);
      throw error;
    }
  },

  updatePixKey: async (id: string, active: boolean): Promise<PixKey> => {
    try {
      const response = await api.put(`/banking/pix/keys/${id}`, { active });
      return response.data;
    } catch (error) {
      console.error('Error updating Pix key:', error);
      throw error;
    }
  },

  generatePixQrCode: async (amount: number, description?: string): Promise<QrCodeData> => {
    try {
      const response = await api.get('/banking/pix/generate-qr', {
        params: { amount, description }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating Pix QR Code:', error);
      throw error;
    }
  },

  decodePixQrCode: async (code: string): Promise<DecodedPix> => {
    try {
      const response = await api.get('/banking/pix/decode-qr', {
        params: { code }
      });
      return response.data;
    } catch (error) {
      console.error('Error decoding Pix QR Code:', error);
      throw error;
    }
  },

  payBoleto: async (boletoData: BoletoData): Promise<any> => {
    try {
      const response = await api.post('/banking/boleto/pay', boletoData);
      return response.data;
    } catch (error) {
      console.error('Error paying boleto:', error);
      throw error;
    }
  },

  getDDABoletos: async (): Promise<any[]> => {
    try {
      const response = await api.get('/banking/boleto/dda');
      return response.data;
    } catch (error) {
      console.error('Error fetching DDA boletos:', error);
      throw error;
    }
  },

  getCards: async (): Promise<CardData[]> => {
    try {
      const response = await api.get('/banking/cartao');
      return response.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  },

  createCard: async (cardData: Partial<CardData>): Promise<CardData> => {
    try {
      const response = await api.post('/banking/cartao', cardData);
      return response.data;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  },

  updateCard: async (id: string, cardData: Partial<CardData>): Promise<CardData> => {
    try {
      const response = await api.put(`/banking/cartao/${id}`, cardData);
      return response.data;
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  },

  deleteCard: async (id: string): Promise<void> => {
    try {
      await api.delete(`/banking/cartao/${id}`);
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  },

  blockCard: async (id: string): Promise<CardData> => {
    try {
      const response = await api.patch(`/banking/cartao/${id}/block`);
      return response.data;
    } catch (error) {
      console.error('Error blocking card:', error);
      throw error;
    }
  },

  unblockCard: async (id: string): Promise<CardData> => {
    try {
      const response = await api.patch(`/banking/cartao/${id}/unblock`);
      return response.data;
    } catch (error) {
      console.error('Error unblocking card:', error);
      throw error;
    }
  },

  getTrendingInvestments: async (): Promise<Investment[]> => {
    try {
      const response = await api.get('/banking/investimentos/trending');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending investments:', error);
      throw error;
    }
  },

  getStockPrice: async (symbol: string): Promise<any> => {
    try {
      const response = await api.get(`/banking/investimentos/price/${symbol}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      throw error;
    }
  }
};
