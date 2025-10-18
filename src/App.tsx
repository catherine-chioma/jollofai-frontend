import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserManagementProvider } from "./contexts/UserManagementContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./components/Toast";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import RecipeDiscovery from "./pages/RecipeDiscovery";
import RecipeDetail from "./pages/RecipeDetail";
import VendorMarketplace from "./pages/VendorMarketplace";
import About from "./pages/About";
import Ingredients from "./pages/Ingredients";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AIChatPage from "./pages/AIChatPage";
import Community from "./pages/Community";
import Blog from "./pages/Blog";
import APIDocumentation from "./pages/APIDocumentation";
import HelpCenter from "./pages/HelpCenter";
import Profile from "./pages/Profile";
import PasswordReset from "./pages/PasswordReset";
import ResetPassword from "./pages/ResetPassword";
import Pantry from "./pages/Pantry";
import ShoppingList from "./pages/ShoppingList";
import MealPlanning from "./pages/MealPlanning";
import NutritionDashboard from "./pages/NutritionDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateRecipe from "./pages/CreateRecipe";
// Privacy page inlined below
import Terms from "./pages/Terms";

// MealPlanning may be typed as a function returning void in its module; cast it to a React component type for use in JSX.
const MealPlanningComponent =
  MealPlanning as unknown as React.ComponentType<any>;

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserManagementProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/recipe-generator" element={<Recipe />} />
                  <Route
                    path="/recipe-discovery"
                    element={<RecipeDiscovery />}
                  />
                  <Route path="/recipe/:id" element={<RecipeDetail />} />
                  <Route path="/marketplace" element={<VendorMarketplace />} />
                  <Route path="/ingredients" element={<Ingredients />} />
                  <Route
                    path="/create-recipe"
                    element={
                      <ProtectedRoute>
                        <CreateRecipe />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/ai-chat" element={<AIChatPage />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route
                    path="/api-documentation"
                    element={<APIDocumentation />}
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/help-center" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/password-reset" element={<PasswordReset />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pantry"
                    element={
                      <ProtectedRoute>
                        <Pantry />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shopping-list"
                    element={
                      <ProtectedRoute>
                        <ShoppingList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meal-planning"
                    element={
                      <ProtectedRoute>
                        <MealPlanningComponent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/nutrition"
                    element={
                      <ProtectedRoute>
                        <NutritionDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </UserManagementProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// 404 Page Component
function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The recipe you're looking for doesn't exist on our menu.
        </p>
        <a
          href="/"
          className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

// Inlined Privacy Page (placeholder — replace with your full privacy policy)
function Privacy() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-4">
          We respect your privacy and only collect the information necessary to
          provide and improve our services. This is a placeholder privacy policy
          — please replace with your full policy text.
        </p>
        <a
          href="/"
          className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
