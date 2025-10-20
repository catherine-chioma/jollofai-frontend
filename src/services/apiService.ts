import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { mockRecipes, mockIngredients, mockVendors, mockCommunityPosts, simulateApiDelay } from '../data/mockData';

const IS_OFFLINE_MODE = import.meta.env.VITE_OFFLINE_MODE === 'true';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Service with offline mode support
export class ApiService {
  // Recipe endpoints
  static async getRecipes(params: any = {}) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      let recipes = [...mockRecipes];
      
      // Apply filters if provided
      if (params.cuisine) {
        recipes = recipes.filter(r => r.cuisine.toLowerCase() === params.cuisine.toLowerCase());
      }
      if (params.difficulty) {
        recipes = recipes.filter(r => r.difficulty.toLowerCase() === params.difficulty.toLowerCase());
      }
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        
        // Log the search method for backend processing
        if (params.searchMethod) {
          console.log(`Recipe search via ${params.searchMethod}: "${searchTerm}"`);
        }
        
        recipes = recipes.filter(r => 
          r.title.toLowerCase().includes(searchTerm) ||
          r.description.toLowerCase().includes(searchTerm) ||
          r.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        
        // Apply different filtering logic based on search method
        if (params.searchMethod === 'voice') {
          // For voice search, we might want to be more lenient with matching
          // and consider phonetic similarities or common voice-to-text errors
          recipes = recipes.filter(r => {
            const ingredients = r.ingredients?.join(' ').toLowerCase() || '';
            return r.title.toLowerCase().includes(searchTerm) ||
                   r.description.toLowerCase().includes(searchTerm) ||
                   ingredients.includes(searchTerm) ||
                   r.tags.some(tag => tag.toLowerCase().includes(searchTerm));
          });
        }
      }
      
      return { data: recipes };
    }
    
    return api.get('/recipes', { params });
  }

  static async getRecipe(id: string) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      const recipe = mockRecipes.find(r => r.id === id);
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      return { data: recipe };
    }
    
    return api.get(`/recipes/${id}`);
  }

  static async createRecipe(recipeData: any) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      const newRecipe = {
        ...recipeData,
        id: String(mockRecipes.length + 1),
        author: { 
          name: 'Demo User', 
          id: 'demo-user',
          avatar: '/images/demo-avatar.jpg'
        },
        rating: 0,
        reviews: 0,
        createdAt: new Date().toISOString(),
      };
      mockRecipes.push(newRecipe);
      return { data: newRecipe };
    }
    
    return api.post('/recipes', recipeData);
  }

  static async updateRecipe(id: string, recipeData: any) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      const index = mockRecipes.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error('Recipe not found');
      }
      mockRecipes[index] = { ...mockRecipes[index], ...recipeData };
      return { data: mockRecipes[index] };
    }
    
    return api.put(`/recipes/${id}`, recipeData);
  }

  static async deleteRecipe(id: string) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      const index = mockRecipes.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error('Recipe not found');
      }
      mockRecipes.splice(index, 1);
      return { data: { message: 'Recipe deleted successfully' } };
    }
    
    return api.delete(`/recipes/${id}`);
  }

  // Ingredient endpoints
  static async getIngredients(params: any = {}) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      let ingredients = [...mockIngredients];
      
      if (params.category) {
        ingredients = ingredients.filter(i => 
          i.category.toLowerCase() === params.category.toLowerCase()
        );
      }
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        ingredients = ingredients.filter(i => 
          i.name.toLowerCase().includes(searchTerm) ||
          i.description.toLowerCase().includes(searchTerm)
        );
      }
      
      return { data: ingredients };
    }
    
    return api.get('/ingredients', { params });
  }

  // Vendor endpoints
  static async getVendors(params: any = {}) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      let vendors = [...mockVendors];
      
      if (params.city) {
        vendors = vendors.filter(v => 
          v.location.city.toLowerCase().includes(params.city.toLowerCase())
        );
      }
      
      return { data: vendors };
    }
    
    return api.get('/vendors/vendor/nearby', { params });
  }

  static async getVendor(id: string) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      const vendor = mockVendors.find(v => v.id === id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return { data: vendor };
    }
    
    return api.get(`/vendors/vendor/${id}`);
  }

  // User/Profile endpoints
  static async getUserProfile() {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      return {
        data: {
          id: 'demo-user',
          name: 'Demo User',
          email: 'demo@example.com',
          avatar: '/images/demo-avatar.jpg',
          preferences: {
            cuisine: ['Nigerian', 'African'],
            dietaryRestrictions: [],
            spiceLevel: 'Medium'
          },
          stats: {
            recipesCreated: 5,
            recipesLiked: 23,
            following: 12,
            followers: 8
          }
        }
      };
    }
    
    return api.get('/users/profile');
  }

  static async updateUserProfile(profileData: any) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      // In offline mode, just return the updated data
      return { data: { ...profileData, id: 'demo-user' } };
    }
    
    return api.put('/users/profile', profileData);
  }

  // Meal planning endpoints
  static async getMealPlan(date: string) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      return {
        data: {
          date,
          meals: {
            breakfast: mockRecipes[0],
            lunch: mockRecipes[1],
            dinner: mockRecipes[2]
          }
        }
      };
    }
    
    return api.get(`/meal-plans?date=${date}`);
  }

  static async createMealPlan(mealPlanData: any) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      return { data: { ...mealPlanData, id: String(Date.now()) } };
    }
    
    return api.post('/meal-plans', mealPlanData);
  }

  // Shopping list endpoints
  static async getShoppingList() {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      return {
        data: {
          items: [
            { id: '1', name: 'Rice (3 cups)', category: 'Grains', completed: false },
            { id: '2', name: 'Fresh Tomatoes (4 large)', category: 'Vegetables', completed: true },
            { id: '3', name: 'Red Bell Peppers (2)', category: 'Vegetables', completed: false },
            { id: '4', name: 'Palm Oil (3 tbsp)', category: 'Oils', completed: false }
          ]
        }
      };
    }
    
    return api.get('/pantry/shopping-list');
  }

  static async addToShoppingList(item: any) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      return { data: { ...item, id: String(Date.now()) } };
    }
    
    return api.post('/pantry/shopping-list', item);
  }

  // AI Chat endpoints
  static async sendChatMessage(message: string, recipeId?: string) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      // Mock AI response
      const responses = [
        "That sounds delicious! For better flavor, try adding a pinch of thyme.",
        "Great choice! Make sure to wash your rice properly before cooking.",
        "Pro tip: Let your tomato stew cook until the oil separates for the best taste.",
        "You can substitute palm oil with vegetable oil if needed, but palm oil gives the authentic flavor.",
        "For spicier food, add more scotch bonnet peppers, but be careful - they're very hot!"
      ];
      
      return {
        data: {
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString()
        }
      };
    }
    
    return api.post('/ai/chat', { message, recipeId });
  }

  // Pantry endpoints
  static async getPantryItems() {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      return {
        data: [
          { id: '1', name: 'Rice', quantity: '2 kg', category: 'Grains', expiryDate: '2024-12-31' },
          { id: '2', name: 'Tomatoes', quantity: '1 kg', category: 'Vegetables', expiryDate: '2024-02-15' },
          { id: '3', name: 'Palm Oil', quantity: '500ml', category: 'Oils', expiryDate: '2025-01-30' }
        ]
      };
    }
    
    return api.get('/pantry/items');
  }

  static async addPantryItem(item: any) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      return { data: { ...item, id: String(Date.now()) } };
    }
    
    return api.post('/pantry/items', item);
  }

  // Community endpoints
  static async getCommunityPosts(category?: string) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      let posts = [...mockCommunityPosts];
      
      if (category && category !== 'all') {
        posts = posts.filter(p => p.category === category);
      }
      
      return { data: posts };
    }
    
    const params = category && category !== 'all' ? { category } : {};
    return api.get('/community/posts', { params });
  }

  static async createCommunityPost(postData: any) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      const newPost = {
        id: String(Date.now()),
        ...postData,
        author: {
          id: '1',
          fullName: 'Current User',
          email: 'user@example.com'
        },
        likes: 0,
        likedBy: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockCommunityPosts.unshift(newPost);
      return { data: newPost };
    }
    
    return api.post('/community/posts', postData);
  }

  static async likeCommunityPost(postId: string) {
    if (IS_OFFLINE_MODE) {
      await simulateApiDelay();
      const post = mockCommunityPosts.find(p => p.id === postId);
      if (post) {
        post.likes += 1;
        post.likedBy = post.likedBy || [];
        post.likedBy.push('1'); // Current user ID
      }
      return { data: post };
    }
    
    return api.post(`/community/posts/${postId}/like`);
  }
}

export default ApiService;