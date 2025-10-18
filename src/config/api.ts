// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jollofai.render.com/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    RESET_PASSWORD: '/auth/reset-password',
    RESET_PASSWORD_TOKEN: (token: string) => `/auth/reset-password/${token}`,
    LOGOUT: '/auth/logout',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    ME: '/users/me',
    ALL: '/users/all',
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
  

  
  // Vendors
  VENDORS: {
    NEARBY: '/vendors/vendor/nearby',
    GET_BY_ID: (id: string) => `/vendors/vendor/${id}`,
    SYNC: '/vendors/sync',
  },
  
  // AI & Chat
  AI: {
    CHAT: '/ai/chat',
    COOKING_ASSISTANCE: '/ai/cooking-assistance',
    INGREDIENT_SUGGESTIONS: '/ai/ingredient-suggestions',
    RECIPE_MODIFICATIONS: '/ai/recipe-modifications',
  },
  
  // Chat
  CHAT: {
    MESSAGE: '/chat/message',
    HISTORY: (userId: string, recipeId: string) => `/chat/history/${userId}/${recipeId}`,
  },
  
  // Community
  COMMUNITY: {
    POSTS: '/community/posts',
    CREATE_POST: '/community/posts',
    LIKE_POST: (id: string) => `/community/posts/${id}/like`,
    COMMENT_POST: (id: string) => `/community/posts/${id}/comment`,
  },
  
  // Ratings
  RATINGS: {
    CREATE: '/ratings',
    GET: (targetType: string, targetId: string) => `/ratings/${targetType}/${targetId}`,
  },
  
  // Progress
  PROGRESS: {
    START: '/progress/start',
    TOGGLE_MODE: '/progress/toggle-mode',
  },
  
  // Meal Plans
  MEAL_PLANS: {
    GENERATE: (userId: string) => `/mealplans/generate/${userId}`,
    HISTORY: '/mealplans/history',
    GET_PLANS: '/meal-plans',
    CREATE: '/meal-plans',
    UPDATE: (id: string) => `/meal-plans/${id}`,
    DELETE: (id: string) => `/meal-plans/${id}`,
    GENERATE_SHOPPING_LIST: '/meal-plans/shopping-list',
  },
  
  // Nutrition
  NUTRITION: {
    ANALYZE: '/nutrition/analyze',
    RECOMMEND: '/nutrition/recommend',
    GET_GOALS: '/nutrition/goals',
    GET_DAILY_SUMMARY: '/nutrition/daily-summary',
    GET_ANALYSIS: '/nutrition/analysis',
    ADD_ENTRY: '/nutrition/entries',
    UPDATE_GOALS: '/nutrition/goals',
  },
  
  // Pantry (extend existing)
  PANTRY: {
    UPLOAD: '/pantry/upload',
    GET_ALL: '/pantry',
    GET_ITEMS: '/pantry/items',
    ADD_ITEM: '/pantry/items',
    UPDATE_ITEM: (id: string) => `/pantry/items/${id}`,
    DELETE_ITEM: (id: string) => `/pantry/items/${id}`,
    DELETE: (id: string) => `/pantry/${id}`,
    SUGGESTIONS: '/pantry/suggestions',
    SHOPPING_LIST: '/pantry/shopping-list',
    ADD_TO_SHOPPING_LIST: '/pantry/shopping-list',
    UPDATE_SHOPPING_ITEM: (id: string) => `/pantry/shopping-list/${id}`,
    DELETE_SHOPPING_ITEM: (id: string) => `/pantry/shopping-list/${id}`,
  },
  
  // CookAlong
  COOKALONGS: {
    GET_ALL: '/cookalongs',
    CREATE: '/cookalongs',
    JOIN: (id: string) => `/cookalongs/${id}/join`,
    LIVE: (id: string) => `/cookalongs/${id}/live`,
  },

  // Admin Management
  ADMIN: {
    USERS: '/admin/users',
    STATS: '/admin/stats',
    ACTIVITY_LOGS: '/admin/activity-logs',
    UPDATE_USER_ROLE: (userId: string) => `/admin/users/${userId}/role`,
    TOGGLE_USER_STATUS: (userId: string) => `/admin/users/${userId}/status`,
    DELETE_USER: (userId: string) => `/admin/users/${userId}`,
    EXPORT_USERS: '/admin/users/export',
    SYSTEM_SETTINGS: '/admin/settings',
    CONTENT_MODERATION: '/admin/moderation',
    ANALYTICS: '/admin/analytics',
  },
};

// Configure axios defaults
import axios from 'axios';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // For cookie-based auth

export default axios;