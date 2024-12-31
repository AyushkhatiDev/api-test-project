import { apiClient } from '../utils/apiClient';
import { Category } from '../types/category';
import { API_CONFIG } from '../config/api';

export async function fetchCategories(): Promise<Category[]> {
  return apiClient<Category[]>(API_CONFIG.ENDPOINTS.CATEGORIES, {
    method: 'POST',
    body: JSON.stringify({
      _searchVar: { ActiveStatus: 'Active' }
    })
  });
}