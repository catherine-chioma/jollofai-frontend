import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";
import axios, { API_ENDPOINTS } from "../config/api";

interface MealPlan {
  id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipeId: string;
  recipeName: string;
  servings: number;
  notes?: string;
  createdAt: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
}

interface WeeklyMealPlan {
  [date: string]: {
    breakfast?: MealPlan;
    lunch?: MealPlan;
    dinner?: MealPlan;
    snack?: MealPlan;
  };
}

export default function MealPlanning() {}
const { user } = useAuth();
const { showToast } = useToast();

const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
const [recipes, setRecipes] = useState<Recipe[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [currentWeek, setCurrentWeek] = useState(new Date());
const [showAddModal, setShowAddModal] = useState(false);
const [selectedDate, setSelectedDate] = useState("");
const [selectedMealType, setSelectedMealType] = useState<
  "breakfast" | "lunch" | "dinner" | "snack"
>("breakfast");
const [isSubmitting, setIsSubmitting] = useState(false);

const [newMealPlan, setNewMealPlan] = useState({
  recipeId: "",
  servings: 1,
  notes: "",
});

const mealTypes = [
  {
    id: "breakfast",
    name: "Breakfast",
    icon: "🌅",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "lunch",
    name: "Lunch",
    icon: "☀️",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "dinner",
    name: "Dinner",
    icon: "🌙",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "snack",
    name: "Snack",
    icon: "🍿",
    color: "bg-green-100 text-green-800",
  },
];

useEffect(() => {
  if (user) {
    fetchMealPlans();
    fetchRecipes();
  }
}, [user, currentWeek]);

const fetchMealPlans = async () => {
  try {
    setIsLoading(true);
    const startDate = getWeekStart(currentWeek);
    const endDate = getWeekEnd(currentWeek);

    const response = await axios.get("/meal-plans", {
      params: {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      },
    });
    setMealPlans(response.data);
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    showToast("Failed to load meal plans", "error");
  } finally {
    setIsLoading(false);
  }
};

const fetchRecipes = async () => {
  try {
    const response = await axios.get("/recipes"); // Assuming we have a recipes endpoint
    setRecipes(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

const getWeekStart = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  return new Date(start.setDate(diff));
};

const getWeekEnd = (date: Date) => {
  const end = getWeekStart(date);
  return new Date(end.setDate(end.getDate() + 6));
};

const getWeekDays = () => {
  const start = getWeekStart(currentWeek);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
};

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const formatDisplayDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const getMealPlanForDateAndType = (date: string, mealType: string) => {
  return mealPlans.find(
    (plan) => plan.date === date && plan.mealType === mealType
  );
};

const organizeWeeklyMealPlan = (): WeeklyMealPlan => {
  const weekDays = getWeekDays();
  const weeklyPlan: WeeklyMealPlan = {};

  weekDays.forEach((day) => {
    const dateStr = formatDate(day);
    weeklyPlan[dateStr] = {
      breakfast: getMealPlanForDateAndType(dateStr, "breakfast"),
      lunch: getMealPlanForDateAndType(dateStr, "lunch"),
      dinner: getMealPlanForDateAndType(dateStr, "dinner"),
      snack: getMealPlanForDateAndType(dateStr, "snack"),
    };
  });

  return weeklyPlan;
};

const handleAddMealPlan = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) {
    showToast("You must be logged in to create meal plans", "error");
    return;
  }

  setIsSubmitting(true);
  try {
    const mealPlanData = {
      date: selectedDate,
      mealType: selectedMealType,
      recipeId: newMealPlan.recipeId,
      servings: newMealPlan.servings,
      notes: newMealPlan.notes.trim() || undefined,
    };

    const response = await axios.post("/meal-plans", mealPlanData);
    setMealPlans([...mealPlans, response.data]);

    setShowAddModal(false);
    setNewMealPlan({
      recipeId: "",
      servings: 1,
      notes: "",
    });

    showToast("Meal plan added successfully!", "success");
  } catch (error: any) {
    console.error("Error adding meal plan:", error);
    showToast(
      error.response?.data?.message || "Failed to add meal plan",
      "error"
    );
  } finally {
    setIsSubmitting(false);
  }
};

const handleDeleteMealPlan = async (planId: string) => {
  try {
    // Use the explicit endpoint path to avoid relying on API_ENDPOINTS shape
    await axios.delete(`/meal-plans/${planId}`);
    setMealPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
    showToast("Meal plan removed", "success");
  } catch (error: any) {
    console.error("Error deleting meal plan:", error);
    showToast(
      error?.response?.data?.message || "Failed to remove meal plan",
      "error"
    );
  }
};

const handleOpenAddModal = (
  date: string,
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
) => {
  setSelectedDate(date);
  setSelectedMealType(mealType);
  setShowAddModal(true);
};

const navigateWeek = (direction: "prev" | "next") => {
  const newWeek = new Date(currentWeek);
  const generateShoppingList = async () => {
    try {
      const weekDays = getWeekDays();
      const startDate = formatDate(weekDays[0]);
      const endDate = formatDate(weekDays[6]);

      // Call the explicit endpoint instead of API_ENDPOINTS.MEAL_PLANS.GENERATE_SHOPPING_LIST
      const response = await axios.post("/meal-plans/generate-shopping-list", {
        startDate,
        endDate,
      });

      // If the API returns the shopping list or a download URL, handle it here.
      // For now, just notify success.
      showToast("Shopping list generated", "success");
      // Optionally handle response.data (e.g., download or navigate to a page)
      return response.data;
    } catch (error: any) {
      console.error("Error generating shopping list:", error);
      showToast("Failed to generate shopping list", "error");
    }
  };

  const weeklyPlan = organizeWeeklyMealPlan();
  const weekDays = getWeekDays();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Meal Planning
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access meal planning features.
          </p>
          <Button onClick={() => (window.location.href = "/signin")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meal Planning
          </h1>
          <p className="text-lg text-gray-600">
            Plan your weekly meals and generate shopping lists automatically.
          </p>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigateWeek("prev")}
                variant="outline"
                size="sm"
              >
                ← Previous Week
              </Button>
              <h2 className="text-xl font-semibold text-gray-900">
                {formatDisplayDate(weekDays[0])} -{" "}
                {formatDisplayDate(weekDays[6])}
              </h2>
              <Button
                onClick={() => navigateWeek("next")}
                variant="outline"
                size="sm"
              >
                Next Week →
              </Button>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={generateShoppingList}
                variant="outline"
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                🛒 Generate Shopping List
              </Button>
              <Button
                onClick={() => setCurrentWeek(new Date())}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                📅 This Week
              </Button>
            </div>
          </div>
        </div>

        {/* Meal Planning Calendar */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" message="Loading meal plans..." />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Meal Type
                </span>
              </div>
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${
                    formatDate(day) === formatDate(new Date())
                      ? "bg-primary text-white"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="text-sm font-medium">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-lg font-bold">{day.getDate()}</div>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            {mealTypes.map((mealType) => (
              <div
                key={mealType.id}
                className="grid grid-cols-8 border-b border-gray-200 last:border-b-0"
              >
                {/* Meal Type Header */}
                <div className="p-4 bg-gray-50 border-r border-gray-200 flex items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{mealType.icon}</span>
                    <span className="font-medium text-gray-900">
                      {mealType.name}
                    </span>
                  </div>
                </div>

                {/* Daily Meal Slots */}
                {weekDays.map((day, dayIndex) => {
                  const dateStr = formatDate(day);
                  const mealPlan =
                    weeklyPlan[dateStr]?.[
                      mealType.id as keyof (typeof weeklyPlan)[string]
                    ];

                  return (
                    <div
                      key={dayIndex}
                      className="p-3 border-r border-gray-200 last:border-r-0 min-h-[120px] relative group hover:bg-gray-50 transition-colors"
                    >
                      {mealPlan ? (
                        <div className="h-full">
                          <div className="bg-white rounded-lg border border-gray-200 p-3 h-full shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                {mealPlan.recipeName}
                              </h4>
                              <button
                                onClick={() =>
                                  handleDeleteMealPlan(mealPlan.id)
                                }
                                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="text-xs text-gray-600">
                              {mealPlan.servings} serving
                              {mealPlan.servings !== 1 ? "s" : ""}
                            </div>
                            {mealPlan.notes && (
                              <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                                {mealPlan.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            handleOpenAddModal(dateStr, mealType.id as any)
                          }
                          className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group-hover:border-primary/50"
                        >
                          <div className="text-center">
                            <div className="text-2xl text-gray-400 group-hover:text-primary mb-1">
                              +
                            </div>
                            <div className="text-xs text-gray-500 group-hover:text-primary">
                              Add Meal
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Weekly Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              This Week's Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Planned Meals:</span>
                <span className="font-medium">{mealPlans.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unique Recipes:</span>
                <span className="font-medium">
                  {new Set(mealPlans.map((plan) => plan.recipeId)).size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Servings:</span>
                <span className="font-medium">
                  {mealPlans.reduce((sum, plan) => sum + plan.servings, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Meal Distribution
            </h3>
            <div className="space-y-3">
              {mealTypes.map((mealType) => {
                const count = mealPlans.filter(
                  (plan) => plan.mealType === mealType.id
                ).length;
                return (
                  <div
                    key={mealType.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{mealType.icon}</span>
                      <span className="text-gray-600">{mealType.name}:</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                onClick={generateShoppingList}
                variant="outline"
                className="w-full text-left justify-start"
              >
                🛒 Generate Shopping List
              </Button>
              <Button
                onClick={() => {
                  /* Navigate to recipes */
                }}
                variant="outline"
                className="w-full text-left justify-start"
              >
                📖 Browse Recipes
              </Button>
              <Button
                onClick={() => {
                  /* Navigate to pantry */
                }}
                variant="outline"
                className="w-full text-left justify-start"
              >
                🥫 Check Pantry
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Meal Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add {mealTypes.find((m) => m.id === selectedMealType)?.name}{" "}
                  Plan
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  Planning for:{" "}
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Meal:{" "}
                  <span className="font-medium capitalize">
                    {selectedMealType}
                  </span>
                </div>
              </div>

              <form onSubmit={handleAddMealPlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe *
                  </label>
                  <select
                    value={newMealPlan.recipeId}
                    onChange={(e) =>
                      setNewMealPlan({
                        ...newMealPlan,
                        recipeId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select a recipe</option>
                    {recipes.map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servings
                  </label>
                  <input
                    type="number"
                    value={newMealPlan.servings}
                    onChange={(e) =>
                      setNewMealPlan({
                        ...newMealPlan,
                        servings: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    min="1"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newMealPlan.notes}
                    onChange={(e) =>
                      setNewMealPlan({ ...newMealPlan, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Any special notes for this meal..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    Add Meal Plan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
