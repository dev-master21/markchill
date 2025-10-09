import { create } from 'zustand';
import type { Product } from '../types';
import api from '../services/api';

interface ProductsStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  fetchProducts: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  searchQuery: '',

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/products');
      // response.data содержит объект с полем products
      const { products } = response.data;
      
      // Transform backend data to match frontend types
      const transformedProducts: Product[] = products.map((product: any) => ({
        id: product.id.toString(),
        name: product.name,
        slug: product.slug,
        type: product.type,
        category: product.category || product.category_name || 'Unknown',
        category_id: product.category_id,
        category_name: product.category_name,
        strains: product.strains || [],
        price: product.price,
        originalPrice: product.original_price,
        discount: product.discount,
        sizes: product.sizes || ['1g', '3g', '5g'],
        size: product.sizes?.[0] || '1g', // default size
        image: product.image,
        images: product.images || [product.image],
        description: product.description,
        features: product.features || [],
        stock: product.stock_quantity || 0,
        inStock: product.stock_quantity > 0,
        rating: product.rating || 4.8,
        reviews: product.reviews || 0,
      }));
      
      set({ products: transformedProducts, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ error: 'Failed to load products', isLoading: false });
    }
  },

  getProductBySlug: (slug: string) => {
    const { products } = get();
    return products.find(product => product.slug === slug);
  },

  searchProducts: (query: string) => {
    const { products } = get();
    if (!query) return products;

    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.type.toLowerCase().includes(lowerQuery)
    );
  },
}));