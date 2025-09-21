const API_BASE_URL = 'https://productsback-production.up.railway.app/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Общий метод для выполнения запросов
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Добавляем токен авторизации если он есть
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Аутентификация
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Продукты
  async getProducts() {
    return this.request('/products');
  }

  // Корзина пользователя
  async getUserCart(userId) {
    return this.request(`/users/${userId}/bucket`);
  }

  async addToCart(userId, productId) {
    return this.request(`/users/${userId}/bucket`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromCart(userId, productId) {
    return this.request(`/users/${userId}/bucket/${productId}`, {
      method: 'DELETE',
    });
  }
}

// Создаем единственный экземпляр сервиса
const apiService = new ApiService();

export default apiService;
