import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";
import axios, { API_ENDPOINTS, API_BASE_URL } from "../config/api";
import { APIConnectionService } from "../config/connectionTest";

interface TestResult {
  endpoint: string;
  method: string;
  status: "success" | "error" | "pending";
  statusCode?: number;
  responseTime?: number;
  response?: any;
  error?: string;
  timestamp: Date;
}

interface EndpointTest {
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  requiresAuth: boolean;
  testData?: any;
  description: string;
}

export default function APITester() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Define comprehensive test endpoints
  const testEndpoints: EndpointTest[] = [
    // Health & Connection
    {
      name: "Backend Health Check",
      endpoint: "/health",
      method: "GET",
      requiresAuth: false,
      description: "Check if backend server is running",
    },
    {
      name: "API Status",
      endpoint: "/api/status",
      method: "GET",
      requiresAuth: false,
      description: "Check API service status",
    },

    // Authentication
    {
      name: "User Profile (Auth Required)",
      endpoint: API_ENDPOINTS.USERS.PROFILE,
      method: "GET",
      requiresAuth: true,
      description: "Get current user profile",
    },
    {
      name: "Test Registration",
      endpoint: API_ENDPOINTS.AUTH.REGISTER,
      method: "POST",
      requiresAuth: false,
      testData: {
        email: `test_${Date.now()}@example.com`,
        password: "testPassword123",
        fullName: "Test User",
      },
      description: "Test user registration endpoint",
    },

    // Recipes
    {
      name: "Get All Recipes",
      endpoint: API_ENDPOINTS.RECIPES.GET_ALL,
      method: "GET",
      requiresAuth: false,
      description: "Fetch all available recipes",
    },
    {
      name: "Recipe Ingredient Matching",
      endpoint: API_ENDPOINTS.RECIPES.MATCH_INGREDIENTS,
      method: "POST",
      requiresAuth: false,
      testData: {
        ingredients: ["rice", "tomato", "onion"],
      },
      description: "Test ingredient-based recipe matching",
    },

    // Ingredients
    {
      name: "Get All Ingredients",
      endpoint: API_ENDPOINTS.INGREDIENTS.GET_ALL,
      method: "GET",
      requiresAuth: false,
      description: "Fetch all ingredients",
    },
    {
      name: "Search Ingredients",
      endpoint: API_ENDPOINTS.INGREDIENTS.SEARCH,
      method: "GET",
      requiresAuth: false,
      description: "Search ingredients by query",
    },

    // AI & Chat
    {
      name: "AI Chat Test",
      endpoint: API_ENDPOINTS.AI.CHAT,
      method: "POST",
      requiresAuth: true,
      testData: {
        message: "How do I make jollof rice?",
        context: "recipe_assistance",
      },
      description: "Test AI chat functionality",
    },
    {
      name: "Cooking Assistance",
      endpoint: API_ENDPOINTS.AI.COOKING_ASSISTANCE,
      method: "POST",
      requiresAuth: true,
      testData: {
        recipe_id: "test_recipe",
        step: 1,
        question: "How long should I cook this?",
      },
      description: "Test AI cooking assistance",
    },

    // Meal Planning
    {
      name: "Get Meal Plans",
      endpoint: API_ENDPOINTS.MEAL_PLANS.GET_PLANS,
      method: "GET",
      requiresAuth: true,
      description: "Fetch user meal plans",
    },
    {
      name: "Create Meal Plan",
      endpoint: API_ENDPOINTS.MEAL_PLANS.CREATE,
      method: "POST",
      requiresAuth: true,
      testData: {
        date: new Date().toISOString().split("T")[0],
        meals: {
          breakfast: {
            recipeId: "test_recipe_1",
            servings: 2,
          },
        },
      },
      description: "Test meal plan creation",
    },

    // Pantry Management
    {
      name: "Get Pantry Items",
      endpoint: API_ENDPOINTS.PANTRY.GET_ITEMS,
      method: "GET",
      requiresAuth: true,
      description: "Fetch user pantry items",
    },
    {
      name: "Add Pantry Item",
      endpoint: API_ENDPOINTS.PANTRY.ADD_ITEM,
      method: "POST",
      requiresAuth: true,
      testData: {
        name: "Test Tomatoes",
        quantity: 5,
        unit: "pieces",
        category: "vegetables",
      },
      description: "Test adding item to pantry",
    },

    // Nutrition
    {
      name: "Get Nutrition Goals",
      endpoint: API_ENDPOINTS.NUTRITION.GET_GOALS,
      method: "GET",
      requiresAuth: true,
      description: "Fetch user nutrition goals",
    },
    {
      name: "Nutrition Analysis",
      endpoint: API_ENDPOINTS.NUTRITION.ANALYZE,
      method: "POST",
      requiresAuth: true,
      testData: {
        ingredients: ["rice", "chicken", "tomato"],
        servings: 2,
      },
      description: "Test nutrition analysis",
    },
  ];

  const categories = [
    { id: "all", name: "All Tests", count: testEndpoints.length },
    {
      id: "health",
      name: "Health & Status",
      count: testEndpoints.filter(
        (e) => e.endpoint.includes("health") || e.endpoint.includes("status")
      ).length,
    },
    {
      id: "auth",
      name: "Authentication",
      count: testEndpoints.filter((e) => e.endpoint.includes("/auth/")).length,
    },
    {
      id: "recipes",
      name: "Recipes",
      count: testEndpoints.filter((e) => e.endpoint.includes("/recipes"))
        .length,
    },
    {
      id: "ai",
      name: "AI & Chat",
      count: testEndpoints.filter(
        (e) => e.endpoint.includes("/ai/") || e.endpoint.includes("/chat")
      ).length,
    },
    {
      id: "meals",
      name: "Meal Planning",
      count: testEndpoints.filter((e) => e.endpoint.includes("meal")).length,
    },
    {
      id: "pantry",
      name: "Pantry",
      count: testEndpoints.filter((e) => e.endpoint.includes("/pantry")).length,
    },
  ];

  // Check backend connection on load
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        checkBackendConnection();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const checkBackendConnection = async () => {
    setConnectionStatus("checking");
    try {
      const connectionService = APIConnectionService.getInstance();
      const isConnected = await connectionService.checkConnection();
      setConnectionStatus(isConnected ? "connected" : "disconnected");

      if (isConnected) {
        showToast("Backend connection successful!", "success");
      } else {
        showToast("Backend connection failed!", "error");
      }
    } catch (error) {
      setConnectionStatus("disconnected");
      showToast("Failed to connect to backend", "error");
    }
  };

  const runSingleTest = async (test: EndpointTest): Promise<TestResult> => {
    const startTime = Date.now();

    try {
      // Skip auth-required tests if user not logged in
      if (test.requiresAuth && !user) {
        return {
          endpoint: test.endpoint,
          method: test.method,
          status: "error",
          error: "Authentication required - please sign in",
          timestamp: new Date(),
          responseTime: 0,
        };
      }

      let response;
      const config = {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
          ...(user && { Authorization: `Bearer ${user.token}` }),
        },
      };

      // Make API request based on method
      switch (test.method) {
        case "GET":
          response = await axios.get(API_BASE_URL + test.endpoint, config);
          break;
        case "POST":
          response = await axios.post(
            API_BASE_URL + test.endpoint,
            test.testData || {},
            config
          );
          break;
        case "PUT":
          response = await axios.put(
            API_BASE_URL + test.endpoint,
            test.testData || {},
            config
          );
          break;
        case "DELETE":
          response = await axios.delete(API_BASE_URL + test.endpoint, config);
          break;
        default:
          throw new Error(`Unsupported method: ${test.method}`);
      }

      const responseTime = Date.now() - startTime;

      return {
        endpoint: test.endpoint,
        method: test.method,
        status: "success",
        statusCode: response.status,
        responseTime,
        response: response.data,
        timestamp: new Date(),
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      return {
        endpoint: test.endpoint,
        method: test.method,
        status: "error",
        statusCode: error.response?.status,
        responseTime,
        error:
          error.response?.data?.message || error.message || "Unknown error",
        timestamp: new Date(),
      };
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      const filteredTests =
        selectedCategory === "all"
          ? testEndpoints
          : testEndpoints.filter((test) => {
              switch (selectedCategory) {
                case "health":
                  return (
                    test.endpoint.includes("health") ||
                    test.endpoint.includes("status")
                  );
                case "auth":
                  return test.endpoint.includes("/auth/");
                case "recipes":
                  return test.endpoint.includes("/recipes");
                case "ai":
                  return (
                    test.endpoint.includes("/ai/") ||
                    test.endpoint.includes("/chat")
                  );
                case "meals":
                  return test.endpoint.includes("meal");
                case "pantry":
                  return test.endpoint.includes("/pantry");
                default:
                  return true;
              }
            });

      // Run tests sequentially to avoid overwhelming the server
      for (const test of filteredTests) {
        const result = await runSingleTest(test);
        setTestResults((prev) => [...prev, result]);

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const successCount = testResults.filter(
        (r) => r.status === "success"
      ).length;
      const totalCount = filteredTests.length;

      showToast(
        `Tests completed: ${successCount}/${totalCount} passed`,
        successCount === totalCount ? "success" : "warning"
      );
    } catch (error) {
      showToast("Error running tests", "error");
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-600 bg-green-100";
      case "disconnected":
        return "text-red-600 bg-red-100";
      case "checking":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            API Testing Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Test your backend API endpoints and monitor system health
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Backend Connection
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getConnectionStatusColor()}`}
              >
                {connectionStatus === "connected" && "🟢 Connected"}
                {connectionStatus === "disconnected" && "🔴 Disconnected"}
                {connectionStatus === "checking" && "🟡 Checking..."}
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={checkBackendConnection}
                variant="outline"
                disabled={connectionStatus === "checking"}
              >
                🔄 Test Connection
              </Button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto-refresh</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Backend URL:</span>
              <p className="text-gray-600">{API_BASE_URL}</p>
            </div>
            <div>
              <span className="font-medium">User Status:</span>
              <p className="text-gray-600">
                {user ? `Signed in as ${user.fullName}` : "Not signed in"}
              </p>
            </div>
            <div>
              <span className="font-medium">Tests Run:</span>
              <p className="text-gray-600">
                {testResults.length} endpoints tested
              </p>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={runAllTests}
                disabled={isRunningTests || connectionStatus === "disconnected"}
                loading={isRunningTests}
              >
                {isRunningTests ? "Running Tests..." : "🚀 Run All Tests"}
              </Button>
              <Button onClick={() => setTestResults([])} variant="outline">
                🗑️ Clear Results
              </Button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Test Results
            </h3>
            {testResults.length > 0 && (
              <div className="mt-2 flex gap-4 text-sm">
                <span className="text-green-600">
                  ✅ {testResults.filter((r) => r.status === "success").length}{" "}
                  Passed
                </span>
                <span className="text-red-600">
                  ❌ {testResults.filter((r) => r.status === "error").length}{" "}
                  Failed
                </span>
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {testResults.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-4xl mb-4">🧪</div>
                <p>
                  No tests run yet. Click "Run All Tests" to begin testing your
                  API.
                </p>
              </div>
            ) : (
              testResults.map((result, index) => {
                const test = testEndpoints.find(
                  (t) =>
                    t.endpoint === result.endpoint && t.method === result.method
                );

                return (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              result.status
                            )}`}
                          >
                            {result.method}
                          </span>
                          <h4 className="font-medium text-gray-900">
                            {test?.name || "Unknown Test"}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              result.status
                            )}`}
                          >
                            {result.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {result.endpoint}
                        </p>
                        {test?.description && (
                          <p className="text-xs text-gray-500 mb-2">
                            {test.description}
                          </p>
                        )}

                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>Status: {result.statusCode || "N/A"}</span>
                          <span>Response Time: {result.responseTime}ms</span>
                          <span>
                            Time: {result.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {result.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-700">
                          ❌ {result.error}
                        </p>
                      </div>
                    )}

                    {result.response && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                          View Response
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded-md text-xs overflow-x-auto">
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
