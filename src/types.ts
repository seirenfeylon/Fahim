export type Category = 'men' | 'women' | 'accessories' | 'shoes' | 'bags';

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  description: string;
  details: string[];
  tags: ('new' | 'bestseller' | 'trending' | 'limited' | 'flash')[];
  badge?: string;
  inStock: boolean;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export type Route =
  | { name: 'home' }
  | { name: 'shop'; category?: Category; gender?: 'men' | 'women' }
  | { name: 'collections' }
  | { name: 'collection'; id: string }
  | { name: 'product'; id: string }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'checkout' }
  | { name: 'account' }
  | { name: 'wishlist' }
  | { name: 'track' }
  | { name: 'signin' }
  | { name: 'signup' }
  | { name: 'forgot' }
  | { name: 'profile' };
