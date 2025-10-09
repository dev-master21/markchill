// src/services/strain.service.ts
import api from './api';

export interface Strain {
  id: number;
  name: string;
  description?: string;
  effects?: string[];
  flavors?: string[];
  thc_content?: string;
  cbd_content?: string;
  type?: 'Sativa' | 'Indica' | 'Hybrid';
}

class StrainService {
  async getStrains(): Promise<Strain[]> {
    const response = await api.get('/admin/strains');
    return response.data.strains;
  }
  
  async getStrain(id: number): Promise<Strain> {
    const response = await api.get(`/admin/strains/${id}`);
    return response.data.strain;
  }
  
  async createStrain(data: Partial<Strain>): Promise<Strain> {
    const response = await api.post('/admin/strains', data);
    return response.data.strain;
  }
  
  async updateStrain(id: number, data: Partial<Strain>): Promise<Strain> {
    const response = await api.put(`/admin/strains/${id}`, data);
    return response.data.strain;
  }
  
  async deleteStrain(id: number): Promise<void> {
    await api.delete(`/admin/strains/${id}`);
  }
}

export default new StrainService();