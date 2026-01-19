export interface Category {
  _id: string;
  name: string;
  description?: string;
  active: boolean;
  imageUrl?: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: Category | string;
  active: boolean;
  discount?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
