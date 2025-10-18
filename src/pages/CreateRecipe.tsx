import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CameraScanner from "../components/CameraScanner";
import Button from "../components/Button";

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface Instruction {
  id: string;
  step: number;
  description: string;
}

interface RecipeData {
  title: string;
  description: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  cuisine: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
  image: File | null;
  nutritionNotes: string;
}

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recipe, setRecipe] = useState<RecipeData>({
    title: "",
    description: "",
    servings: 4,
    prepTime: 30,
    cookTime: 30,
    difficulty: "Medium",
    category: "",
    cuisine: "",
    ingredients: [],
    instructions: [],
    tags: [],
    image: null,
    nutritionNotes: "",
  });

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    amount: "",
    unit: "cups",
  });

  const [newInstruction, setNewInstruction] = useState("");
  const [newTag, setNewTag] = useState("");

  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Appetizer",
    "Side Dish",
    "Soup",
    "Salad",
    "Beverage",
  ];

  const cuisines = [
    "Nigerian",
    "Italian",
    "Chinese",
    "Mexican",
    "Indian",
    "French",
    "Japanese",
    "Thai",
    "Mediterranean",
    "American",
    "Other",
  ];

  const units = [
    "cups",
    "tbsp",
    "tsp",
    "oz",
    "lbs",
    "g",
    "kg",
    "ml",
    "l",
    "pieces",
    "cloves",
    "slices",
    "whole",
  ];

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        ...newIngredient,
      };
      setRecipe((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient],
      }));
      setNewIngredient({ name: "", amount: "", unit: "cups" });
    }
  };

  const removeIngredient = (id: string) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing.id !== id),
    }));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      const instruction: Instruction = {
        id: Date.now().toString(),
        step: recipe.instructions.length + 1,
        description: newInstruction.trim(),
      };
      setRecipe((prev) => ({
        ...prev,
        instructions: [...prev.instructions, instruction],
      }));
      setNewInstruction("");
    }
  };

  const removeInstruction = (id: string) => {
    setRecipe((prev) => {
      const filtered = prev.instructions.filter((inst) => inst.id !== id);
      // Renumber steps
      const renumbered = filtered.map((inst, index) => ({
        ...inst,
        step: index + 1,
      }));
      return {
        ...prev,
        instructions: renumbered,
      };
    });
  };

  const addTag = () => {
    if (newTag.trim() && !recipe.tags.includes(newTag.trim())) {
      setRecipe((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setRecipe((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRecipe((prev) => ({ ...prev, image: file }));
    }
  };

  const handleScanResult = (result: any) => {
    // Handle scanned ingredients or recipe data
    if (result.type === "ingredient") {
      setNewIngredient((prev) => ({ ...prev, name: result.name }));
    }
    setShowScanner(false);
  };

  const validateRecipe = () => {
    return (
      recipe.title.trim() &&
      recipe.description.trim() &&
      recipe.ingredients.length > 0 &&
      recipe.instructions.length > 0 &&
      recipe.category &&
      recipe.cuisine
    );
  };

  const handleSubmit = async () => {
    if (!validateRecipe()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would integrate with your backend API
      const formData = new FormData();
      formData.append("title", recipe.title);
      formData.append("description", recipe.description);
      formData.append("servings", recipe.servings.toString());
      formData.append("prepTime", recipe.prepTime.toString());
      formData.append("cookTime", recipe.cookTime.toString());
      formData.append("difficulty", recipe.difficulty);
      formData.append("category", recipe.category);
      formData.append("cuisine", recipe.cuisine);
      formData.append("ingredients", JSON.stringify(recipe.ingredients));
      formData.append("instructions", JSON.stringify(recipe.instructions));
      formData.append("tags", JSON.stringify(recipe.tags));
      formData.append("nutritionNotes", recipe.nutritionNotes);

      if (recipe.image) {
        formData.append("image", recipe.image);
      }

      // Mock API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Recipe created successfully!");
      navigate("/recipe-discovery");
    } catch (error) {
      console.error("Failed to create recipe:", error);
      alert("Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: "👨‍🍳" },
    { id: "ingredients", label: "Ingredients", icon: "🥕" },
    { id: "instructions", label: "Instructions", icon: "📝" },
    { id: "nutrition", label: "Nutrition", icon: "📊" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">Create New Recipe</h1>
          <p className="opacity-90">
            Share your culinary creativity with the JollofAI community
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Title *
                  </label>
                  <input
                    type="text"
                    value={recipe.title}
                    onChange={(e) =>
                      setRecipe((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter recipe title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Image
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    />
                    <Button
                      onClick={() => setShowScanner(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      📸
                    </Button>
                  </div>
                  {recipe.image && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(recipe.image)}
                        alt="Recipe preview"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={recipe.description}
                  onChange={(e) =>
                    setRecipe((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your recipe..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servings
                  </label>
                  <input
                    type="number"
                    value={recipe.servings}
                    onChange={(e) =>
                      setRecipe((prev) => ({
                        ...prev,
                        servings: parseInt(e.target.value),
                      }))
                    }
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={recipe.prepTime}
                    onChange={(e) =>
                      setRecipe((prev) => ({
                        ...prev,
                        prepTime: parseInt(e.target.value),
                      }))
                    }
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cook Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={recipe.cookTime}
                    onChange={(e) =>
                      setRecipe((prev) => ({
                        ...prev,
                        cookTime: parseInt(e.target.value),
                      }))
                    }
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={recipe.difficulty}
                    onChange={(e) =>
                      setRecipe((prev) => ({
                        ...prev,
                        difficulty: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={recipe.category}
                    onChange={(e) =>
                      setRecipe((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine *
                  </label>
                  <select
                    value={recipe.cuisine}
                    onChange={(e) =>
                      setRecipe((prev) => ({
                        ...prev,
                        cuisine: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select cuisine</option>
                    {cuisines.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ingredients Tab */}
          {activeTab === "ingredients" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredient Name
                  </label>
                  <input
                    type="text"
                    value={newIngredient.name}
                    onChange={(e) =>
                      setNewIngredient((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Tomatoes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={newIngredient.amount}
                    onChange={(e) =>
                      setNewIngredient((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="e.g., 2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={newIngredient.unit}
                    onChange={(e) =>
                      setNewIngredient((prev) => ({
                        ...prev,
                        unit: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={addIngredient}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-1"
                  >
                    <span>➕</span>
                    <span>Add</span>
                  </Button>
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    📸
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Ingredients List
                </h3>
                {recipe.ingredients.length === 0 ? (
                  <p className="text-gray-500">No ingredients added yet</p>
                ) : (
                  <div className="space-y-2">
                    {recipe.ingredients.map((ingredient) => (
                      <div
                        key={ingredient.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                      >
                        <span>
                          {ingredient.amount} {ingredient.unit}{" "}
                          {ingredient.name}
                        </span>
                        <button
                          onClick={() => removeIngredient(ingredient.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions Tab */}
          {activeTab === "instructions" && (
            <div className="space-y-6">
              <div className="flex space-x-2">
                <textarea
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  placeholder="Enter cooking instruction..."
                  rows={3}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
                <Button
                  onClick={addInstruction}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  ➕
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Cooking Instructions
                </h3>
                {recipe.instructions.length === 0 ? (
                  <p className="text-gray-500">No instructions added yet</p>
                ) : (
                  <div className="space-y-3">
                    {recipe.instructions.map((instruction) => (
                      <div
                        key={instruction.id}
                        className="flex items-start space-x-3 bg-gray-50 p-4 rounded-md"
                      >
                        <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                          {instruction.step}
                        </div>
                        <p className="flex-1 text-gray-700">
                          {instruction.description}
                        </p>
                        <button
                          onClick={() => removeInstruction(instruction.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === "nutrition" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nutrition Notes & Information
                </label>
                <textarea
                  value={recipe.nutritionNotes}
                  onChange={(e) =>
                    setRecipe((prev) => ({
                      ...prev,
                      nutritionNotes: e.target.value,
                    }))
                  }
                  placeholder="Add any nutrition information, dietary notes, allergen warnings, or health benefits..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Estimated Nutrition (per serving)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ~{Math.round(recipe.ingredients.length * 50)}
                    </div>
                    <div className="text-gray-600">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ~{Math.round(recipe.ingredients.length * 2)}g
                    </div>
                    <div className="text-gray-600">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ~{Math.round(recipe.ingredients.length * 3)}g
                    </div>
                    <div className="text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ~{Math.round(recipe.ingredients.length * 1)}g
                    </div>
                    <div className="text-gray-600">Fat</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Nutritional values are estimates based on ingredients and
                  may vary.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <Button
            onClick={() => navigate("/recipe-discovery")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!validateRecipe() || isSubmitting}
            className={`px-6 py-2 rounded-md flex items-center space-x-2 ${
              validateRecipe() && !isSubmitting
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            💾
            <span>{isSubmitting ? "Creating..." : "Create Recipe"}</span>
          </Button>
        </div>
      </div>

      {/* Camera Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Scan Ingredient</h3>
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CameraScanner
              onScanResult={handleScanResult}
              onClose={() => setShowScanner(false)}
              scanType="ingredient"
            />
          </div>
        </div>
      )}
    </div>
  );
}
