import api from './api';
import { Product } from '../types';

export interface ProductFilters {
  type?: string;
  category_id?: number;
  search?: string;
  page?: number;
  limit?: number;
}

class ProductService {
  async getProducts(filters?: ProductFilters): Promise<{
    products: Product[];
    page: number;
    limit: number;
  }> {
    const response = await api.get('/products', { params: filters });
    return response.data;
  }
  
  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  }
  
  async getLowStockProducts(): Promise<Product[]> {
    const response = await api.get('/products/low-stock');
    return response.data.products;
  }
  
  async createProduct(data: FormData): Promise<Product> {
    const response = await api.post('/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.product;
  }
  
  async updateProduct(id: string, data: FormData): Promise<Product> {
    const response = await api.put(`/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.product;
  }
  
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }
}

export default new ProductService();