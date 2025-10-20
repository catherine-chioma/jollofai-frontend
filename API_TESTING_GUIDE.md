# 🧪 Complete API Testing Guide for JollofAI Backend

## 🎯 **How to Test Your Backend API**

I've created multiple ways for you to test your backend API thoroughly:

### 🚀 **Method 1: Built-in API Testing Dashboard**

**Access**: Navigate to `/api-tester` in your app

**Features**:

- ✅ **Real-time Connection Testing** - Check if backend is responding
- 🔍 **Comprehensive Endpoint Testing** - Test all major API endpoints
- 📊 **Categorized Tests** - Health, Auth, Recipes, AI, Meal Planning, etc.
- 📈 **Performance Monitoring** - Response times and status codes
- 🔄 **Auto-refresh** - Continuous health monitoring
- 📋 **Detailed Results** - View responses and error details

**Test Categories Available**:

- **Health & Status** - Backend health checks
- **Authentication** - Login, register, profile endpoints
- **Recipes** - Recipe CRUD and ingredient matching
- **AI & Chat** - AI assistance and chat functionality
- **Meal Planning** - Meal plan creation and management
- **Pantry** - Pantry item management
- **Nutrition** - Nutrition tracking and analysis

### 🌐 **Method 2: Browser-based HTML Tester**

**Access**: Open `/public/api-test.html` in your browser

This provides a standalone testing interface that doesn't require your React app to be running.

### 🛠️ **Method 3: Manual Testing Methods**

#### **A. Using cURL Commands**

```bash
# 1. Test Backend Health
curl -X GET https://jollofapi.onrender.com/api/health

# 2. Test Recipe Endpoints
curl -X GET https://jollofapi.onrender.com/api/recipes

# 3. Test Ingredient Matching
curl -X POST https://jollofapi.onrender.com/api/recipes/match-ingredients \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["rice", "tomato", "onion"]}'

# 4. Test AI Chat (requires auth)
curl -X POST https://jollofapi.onrender.com/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "How do I make jollof rice?"}'
```

#### **B. Using Postman Collection**

Create a Postman collection with these endpoints:

```json
{
  "name": "JollofAI API Tests",
  "requests": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "https://jollofapi.onrender.com/api/health"
    },
    {
      "name": "Get Recipes",
      "method": "GET",
      "url": "https://jollofapi.onrender.com/api/recipes"
    },
    {
      "name": "Ingredient Match",
      "method": "POST",
      "url": "https://jollofapi.onrender.com/api/recipes/match-ingredients",
      "body": {
        "ingredients": ["rice", "tomato", "chicken"]
      }
    }
  ]
}
```

#### **C. Using Browser Developer Tools**

Open browser console and run:

```javascript
// Test API connection
fetch("https://jollofapi.onrender.com/api/health")
  .then((response) => response.json())
  .then((data) => console.log("Health Check:", data))
  .catch((error) => console.error("Error:", error));

// Test recipes endpoint
fetch("https://jollofapi.onrender.com/api/recipes")
  .then((response) => response.json())
  .then((data) => console.log("Recipes:", data))
  .catch((error) => console.error("Error:", error));
```

### 🔍 **Method 4: Automated Testing Suite**

Create automated tests using the built-in testing utilities:

```typescript
import { APIConnectionService } from "../config/connectionTest";

// Test connection
const connectionService = APIConnectionService.getInstance();
const isConnected = await connectionService.checkConnection();

if (isConnected) {
  console.log("✅ Backend is responsive");
} else {
  console.log("❌ Backend connection failed");
}
```

## 📋 **Complete Testing Checklist**

### 🔗 **1. Connection & Health Tests**

- [ ] Backend health endpoint responds (`/health`)
- [ ] API status endpoint works (`/api/status`)
- [ ] Response times are acceptable (< 5 seconds)
- [ ] CORS headers are properly configured

### 🔐 **2. Authentication Tests**

- [ ] User registration works
- [ ] User login returns valid JWT token
- [ ] Protected routes require authentication
- [ ] Token validation works correctly
- [ ] Password reset functionality works

### 🍽️ **3. Core Feature Tests**

- [ ] **Recipes**: Get, create, update, delete recipes
- [ ] **Ingredients**: Fetch ingredients, search functionality
- [ ] **AI Chat**: Chat responses are generated
- [ ] **Meal Planning**: Create, modify, delete meal plans
- [ ] **Pantry**: Add, update, remove pantry items
- [ ] **Nutrition**: Nutrition tracking and analysis

### ⚡ **4. Performance Tests**

- [ ] Response times under load
- [ ] Concurrent user handling
- [ ] Large payload processing
- [ ] Database query optimization

### 🛡️ **5. Security Tests**

- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Authentication bypass attempts
- [ ] Rate limiting functionality

## 🚨 **Common Issues & Solutions**

### **Issue 1: CORS Errors**

```
Access to fetch at 'https://jollofapi.onrender.com' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**: Ensure backend CORS configuration allows your frontend domain.

### **Issue 2: Authentication Failures**

```
401 Unauthorized
```

**Solution**: Check if JWT token is being sent in Authorization header.

### **Issue 3: Slow Response Times**

```
Request timeout after 15000ms
```

**Solution**:

- Check server performance
- Optimize database queries
- Consider caching strategies

### **Issue 4: 500 Internal Server Errors**

**Solution**: Check backend logs for detailed error information.

## 📊 **Expected Test Results**

### ✅ **Healthy API Responses**:

```json
// Health Check
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2025-10-20T10:30:00Z",
  "version": "1.0.0"
}

// Recipes
{
  "data": [...],
  "count": 25,
  "status": "success"
}
```

### ❌ **Error Responses**:

```json
{
  "error": "Internal Server Error",
  "message": "Database connection failed",
  "timestamp": "2025-10-20T10:30:00Z"
}
```

## 🎯 **Testing Recommendations**

### **Daily Testing**:

1. Run health check tests
2. Test critical user flows
3. Monitor response times

### **Pre-deployment Testing**:

1. Full endpoint test suite
2. Load testing
3. Security vulnerability scan
4. Data integrity verification

### **Production Monitoring**:

1. Set up automated health checks
2. Configure alerting for failures
3. Monitor performance metrics
4. Track error rates

## 📱 **Quick Start Guide**

1. **Open API Tester**: Go to `/api-tester` in your app
2. **Check Connection**: Click "Test Connection" button
3. **Run Tests**: Select test category and click "Run All Tests"
4. **Review Results**: Check passed/failed tests and error details
5. **Fix Issues**: Address any failing tests in your backend

## 🔧 **Backend Requirements Checklist**

Ensure your backend has these endpoints:

```
GET  /health                     ✅ Health check
GET  /api/status                 ✅ API status
GET  /api/recipes               ✅ Get recipes
POST /api/recipes/match-ingredients ✅ Ingredient matching
GET  /api/ingredients           ✅ Get ingredients
POST /api/auth/register         ✅ User registration
POST /api/auth/login           ✅ User login
GET  /api/users/profile        ✅ User profile
POST /api/ai/chat              ✅ AI chat
GET  /api/meal-plans           ✅ Meal plans
POST /api/pantry/items         ✅ Pantry management
```

## 🎉 **Success Indicators**

Your API is working correctly when:

- ✅ All health checks pass
- ✅ Response times < 3 seconds
- ✅ Authentication flows work
- ✅ Core features respond properly
- ✅ Error handling is graceful
- ✅ Data persistence works

Use the built-in API tester at `/api-tester` to verify all these aspects of your backend!
