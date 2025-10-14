// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GOOGLE: '/auth/google',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Recipes
  RECIPES: {
    GET_ALL: '/recipes',
    GET_BY_ID: (id: string) => `/recipes/${id}`,
    CREATE: '/recipes',
    UPDATE: (id: string) => `/recipes/${id}`,
    DELETE: (id: string) => `/recipes/${id}`,
    FOR_YOU: '/recipes/foryou',
    MATCH_INGREDIENTS: '/recipes/match-ingredients',
  },
  
  // Ingredients
  INGREDIENTS: {
    GET_ALL: '/ingredients',
    GET_BY_ID: (id: string) => `/ingredients/${id}`,
    SEARCH: '/ingredients/search',
    BY_CATEGORY: (category: string) => `/ingredients/category/${category}`,
    NUTRITION: (id: string) => `/ingredients/${id}/nutrition`,
  },
  
  // Pantry
  PANTRY: {
    UPLOAD: '/pantry/upload',
    GET_ALL: '/pantry',
    DELETE: (id: string) => `/pantry/${id}`,
  },
  
  // Vendors
  VENDORS: {
    NEARBY: '/vendors/vendor/nearby',
    GET_BY_ID: (id: string) => `/vendors/vendor/${id}`,
    SYNC: '/vendors/sync',
  },
  
  // Chat
  CHAT: {
    MESSAGE: '/chat/message',
    HISTORY: (userId: string, recipeId: string) => `/chat/history/${userId}/${recipeId}`,
  },
  
  // Progress
  PROGRESS: {
    START: '/progress/start',
    TOGGLE_MODE: '/progress/toggle-mode',
  },
};

// Configure axios defaults
import axios from 'axios';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // For cookie-based auth

export default axios;