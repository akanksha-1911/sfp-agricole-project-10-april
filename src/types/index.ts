export interface Product {
  mrp: number;
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  brand: string;
  category: string;
  region?: string;
  // subcategory: string;
  images: string[];
  videoUrl?: string;
  flashVideoUrl?: string;
  tags: string[];
  size?: string;
  weight?: string;
  company: string;
  // rating: number;
  // reviews: Review[];
  catalogue?: string;
  stock: number;
  isRestricted?: boolean;
  isSpecialOffer?: boolean;
  discount?: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isAdmin: boolean;
  points: number;
  createdAt: string;
  orders: Order[];
}

export interface Order {
  id: string;
  userId: string;
  products: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: ShippingAddress;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface WishlistItem {
  productId: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export interface CatalogueRequest {
  productId: string;
  name: string;
  contact: string;
  email: string;
  date: string;
}
