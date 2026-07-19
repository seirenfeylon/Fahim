import type { Product } from '../../types';
import { products as seedProducts } from '../../data/products';

export type ProductInput = {
  name: string;
  category: Product['category'];
  price: number;
  discountPercent: number;
  stock: number;
  image: string;
  description: string;
  featured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
};

export type ProductListRow = {
  id: string;
  name: string;
  category: Product['category'];
  price: number;
  discountPercent: number;
  stock: number;
  image: string;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
};

export interface ProductsRepository {
  list(): Promise<ProductListRow[]>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: ProductInput): Promise<Product>;
  remove(id: string): Promise<void>;
}

function toRow(p: Product): ProductListRow {
  const discountPercent =
    p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;
  const stock = (p as Product & { stock?: number }).stock ?? 0;
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    discountPercent,
    stock,
    image: p.images[0] ?? '',
    inStock: p.inStock,
    featured: p.tags.includes('trending'),
    isNew: p.tags.includes('new'),
    isBestSeller: p.tags.includes('bestseller'),
  };
}

function fromInput(id: string, input: ProductInput): Product {
  const originalPrice =
    input.discountPercent > 0
      ? Math.round(input.price / (1 - input.discountPercent / 100))
      : undefined;
  const tags: Product['tags'] = [];
  if (input.isNew) tags.push('new');
  if (input.isBestSeller) tags.push('bestseller');
  if (input.featured) tags.push('trending');
  return {
    id,
    name: input.name,
    brand: 'CrazyFeb Atelier',
    category: input.category,
    gender: 'unisex',
    price: input.price,
    originalPrice,
    rating: 0,
    reviewCount: 0,
    colors: [],
    sizes: [],
    images: input.image ? [input.image] : [],
    description: input.description,
    details: [],
    tags,
    inStock: input.stock > 0,
    reviews: [],
  } as Product & { stock?: number };
}

const memoryStore: (Product & { stock?: number })[] = seedProducts.map((p) => ({
  ...p,
  stock: Math.floor(Math.random() * 40) + 5,
}));

function nextId(): string {
  return `p${Date.now().toString(36)}${Math.floor(Math.random() * 1000).toString(36)}`;
}

export const memoryProductsRepository: ProductsRepository = {
  async list() {
    return Promise.resolve(memoryStore.map(toRow));
  },
  async create(input) {
    const product = fromInput(nextId(), input);
    (product as Product & { stock?: number }).stock = input.stock;
    memoryStore.push(product as Product & { stock?: number });
    return Promise.resolve(product);
  },
  async update(id, input) {
    const idx = memoryStore.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error('Product not found');
    const updated = fromInput(id, input);
    (updated as Product & { stock?: number }).stock = input.stock;
    memoryStore[idx] = updated as Product & { stock?: number };
    return Promise.resolve(updated);
  },
  async remove(id) {
    const idx = memoryStore.findIndex((p) => p.id === id);
    if (idx >= 0) memoryStore.splice(idx, 1);
    return Promise.resolve();
  },
};

export const productsRepository: ProductsRepository = memoryProductsRepository;
