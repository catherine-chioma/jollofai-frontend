import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import VoiceInput from "../components/VoiceInput";
import CameraScanner from "../components/CameraScanner";
import { useToast } from "../components/Toast";
import { ApiService } from "../services/apiService";

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

import { PantryItem as ApiPantryItem } from "../types/api";

interface PantryItemUI extends Omit<ApiPantryItem, "id"> {
  imageUrl?: string;
}

const generateMockRecipes = (ingredientsInput: string): Recipe[] => {
  const ingredientsList = ingredientsInput
    .split(",")
    .map((i) => i.trim())
    .filter((i) => i);
  const hasRice = ingredientsList.some((ing) =>
    ing.toLowerCase().includes("rice")
  );
  const hasTomato = ingredientsList.some((ing) =>
    ing.toLowerCase().includes("tomato")
  );
  const hasChicken = ingredientsList.some((ing) =>
    ing.toLowerCase().includes("chicken")
  );
  const hasOnion = ingredientsList.some((ing) =>
    ing.toLowerCase().includes("onion")
  );

  // Array of available recipe images
  const getRandomRecipeImage = () => {
    const images = [
      "/recipes/picai.jpeg",
      "/recipes/picai4.jpeg",
      "/recipes/picai5.jpeg",
      "/recipes/picai6.jpeg",
      "/recipes/picai7.jpeg",
      "/recipes/picai8.jpeg",
      "/recipes/picai9.jpeg",
      "/recipes/picai10.jpeg",
      "/recipes/picai11.jpeg",
      "/recipes/picai12.jpeg",
      "/recipes/picai15.jpeg",
      "/recipes/picai16.jpeg",
      "/recipes/picai18.jpeg",
      "/recipes/picai20.jpeg",
      "/recipes/picai25.jpeg",
      "/recipes/picai30.jpeg",
      "/recipes/picai35.jpeg",
      "/recipes/picai40.jpeg",
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const recipes: Recipe[] = [];

  if (hasRice || hasTomato) {
    recipes.push({
      id: "1",
      title: "Classic Nigerian Jollof Rice",
      ingredients: [
        "2 cups long-grain rice",
        "3 medium tomatoes, blended",
        "1 red bell pepper",
        "1 medium onion, chopped",
        "3 cloves garlic, minced",
        "2 tbsp vegetable oil",
        "2 cups chicken stock",
        "1 tsp curry powder",
        "1 tsp thyme",
        "Salt and pepper to taste",
        ...(hasChicken ? ["1 lb chicken, cut into pieces"] : []),
      ],
      instructions: [
        "Wash and parboil rice until 70% cooked, then drain and set aside.",
        "Heat oil in a large pot and sauté onions until translucent.",
        "Add blended tomatoes and peppers, cook for 10-15 minutes until oil floats on top.",
        "Add garlic, curry powder, thyme, salt, and pepper. Stir well.",
        hasChicken
          ? "Add chicken pieces and cook until tender."
          : "Continue to next step.",
        "Add the parboiled rice and mix gently with the sauce.",
        "Pour in chicken stock gradually, ensuring rice is covered.",
        "Cover pot and simmer on low heat for 20-25 minutes until rice is fully cooked.",
        "Stir occasionally and add more stock if needed.",
        "Taste and adjust seasoning. Serve hot with fried plantains or salad.",
      ].filter((step) => step !== "Continue to next step."),
      imageUrl: "/rice-image.jpg",
    });
  }

  if (hasChicken) {
    recipes.push({
      id: "2",
      title: "Spicy Chicken Jollof Rice",
      ingredients: [
        "2 cups jasmine rice",
        "1 lb chicken thighs, cut into pieces",
        "4 Roma tomatoes, blended",
        "2 scotch bonnet peppers (optional)",
        "1 large onion, diced",
        "4 cloves garlic, minced",
        "1 inch ginger, grated",
        "3 tbsp palm oil",
        "2½ cups chicken broth",
        "2 tsp curry powder",
        "1 tsp smoked paprika",
        "2 bay leaves",
        "Salt and white pepper to taste",
      ],
      instructions: [
        "Season chicken with salt, pepper, and 1 tsp curry powder. Let marinate for 30 minutes.",
        "Brown chicken pieces in palm oil until golden. Remove and set aside.",
        "In the same pot, sauté onions until soft and golden.",
        "Add ginger and garlic, cook for 1 minute until fragrant.",
        "Add blended tomatoes and scotch bonnet, cook for 15 minutes until thickened.",
        "Return chicken to pot, add remaining curry powder, paprika, and bay leaves.",
        "Add rice and stir gently to coat with sauce.",
        "Pour in hot chicken broth, bring to boil, then reduce heat to low.",
        "Cover and simmer for 25-30 minutes until rice is tender and liquid absorbed.",
        "Let rest for 5 minutes before serving. Garnish with fresh herbs.",
      ],
      imageUrl: getRandomRecipeImage(),
    });
  }

  // Add a vegetarian option
  recipes.push({
    id: "3",
    title: "Vegetarian Jollof Rice with Mixed Vegetables",
    ingredients: [
      "2 cups basmati rice",
      "3 large tomatoes, blended",
      "1 red bell pepper, diced",
      "1 yellow bell pepper, diced",
      "1 medium onion, chopped",
      "3 cloves garlic, minced",
      "2 tbsp vegetable oil",
      "2 cups vegetable stock",
      "1 cup mixed vegetables (carrots, green beans, peas)",
      "1 tsp curry powder",
      "1 tsp thyme",
      "½ tsp turmeric",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Parboil rice until 60% cooked, drain and rinse with cold water.",
      "Heat oil in a heavy-bottomed pot and sauté onions until golden.",
      "Add garlic and cook for 30 seconds until fragrant.",
      "Add blended tomatoes and bell peppers, cook for 12-15 minutes.",
      "Season with curry powder, thyme, turmeric, salt, and pepper.",
      "Add mixed vegetables and cook for 3-4 minutes.",
      "Add the parboiled rice and mix gently with the vegetable sauce.",
      "Pour in vegetable stock, ensuring rice is just covered.",
      "Bring to boil, then reduce heat to lowest setting and cover.",
      "Cook for 20-25 minutes until rice is tender and fluffy.",
      "Fluff with a fork and serve with avocado slices or coleslaw.",
    ],
    imageUrl: getRandomRecipeImage(),
  });

  return recipes.slice(0, 2); // Return 2 recipes for better UX
};

export default function Recipe() {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchMethod, setSearchMethod] = useState<
    "text" | "voice" | "image" | null
  >(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isPantryModalOpen, setIsPantryModalOpen] = useState(false);
  const [pantryItems, setPantryItems] = useState<PantryItemUI[]>([]);
  const [isPantryLoading, setIsPantryLoading] = useState(false);
  const { showToast } = useToast();

  const handleVoiceInput = (text: string) => {
    setIngredients(text);
    setSearchMethod("voice");
    showToast("Voice input detected! Ready to search.", "info");
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIngredients(e.target.value);
  };

  const handleImageScanResult = (result: { type: string; data: any }) => {
    if (result.type === "ingredient") {
      setIngredients((prev) =>
        prev ? `${prev}, ${result.data}` : result.data
      );
      showToast("Ingredients detected from image! Ready to search.", "success");
    }
    setShowScanner(false);
  };

  const handleReset = () => {
    setIngredients("");
    setRecipes([]);

    setSearchMethod(null);
    setShowScanner(false);
    showToast("Form reset successfully", "info");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) {
      showToast("Please enter some ingredients", "warning");
      return;
    }

    // Set search method to text if not already set
    if (!searchMethod) {
      setSearchMethod("text");
    }

    setLoading(true);
    setRecipes([]);

    try {
      // Log the search method for debugging
      console.log(`Search initiated via: ${searchMethod || "text"}`);

      // Use ApiService to get recipes based on ingredients
      const response = await ApiService.getRecipes({
        search: ingredients,
        searchMethod: searchMethod || "text", // Include search method in API call
      });

      if (response.data && response.data.length > 0) {
        setRecipes(response.data);
        const methodText =
          searchMethod === "voice"
            ? "voice input"
            : searchMethod === "image"
            ? "image scanning"
            : "text input";
        showToast(`Recipes found via ${methodText}!`, "success");
      } else {
        // Fallback: Generate mock recipes when no matches found
        const mockRecipes: Recipe[] = generateMockRecipes(ingredients);
        setRecipes(mockRecipes);
        const methodText =
          searchMethod === "voice"
            ? "voice input"
            : searchMethod === "image"
            ? "image scanning"
            : "text input";
        showToast(
          `Generated sample recipes from ${methodText} based on your ingredients!`,
          "success"
        );
      }
    } catch (err) {
      console.error("Recipe generation error:", err);

      // Fallback: Generate mock recipes when API is not available
      const mockRecipes: Recipe[] = generateMockRecipes(ingredients);
      setRecipes(mockRecipes);
      const methodText =
        searchMethod === "voice" ? "voice input" : "text input";
      showToast(
        `Generated sample recipes via ${methodText} (Demo mode)`,
        "success"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch pantry items
  const fetchPantryItems = async () => {
    try {
      setIsPantryLoading(true);
      const response = await ApiService.getPantryItems();
      const availableItems = (response.data || []).filter(
        (item: PantryItemUI) => {
          const quantity =
            typeof item.quantity === "string"
              ? parseFloat(item.quantity)
              : item.quantity;
          return !isNaN(quantity) && quantity > 0;
        }
      );
      setPantryItems(availableItems);
      if (availableItems.length === 0) {
        showToast("No ingredients available in your pantry", "warning");
      }
    } catch (error) {
      console.error("Error fetching pantry items:", error);
      showToast("Failed to load pantry items", "error");
    } finally {
      setIsPantryLoading(false);
    }
  };

  // Use pantry ingredients
  const handleUsePantryIngredients = () => {
    if (pantryItems.length === 0) {
      showToast("Your pantry is empty. Add some ingredients first!", "warning");
      return;
    }
    const pantryIngredients = pantryItems.map((item) => item.name).join(", ");
    setIngredients(pantryIngredients);
    setSearchMethod("text");
    showToast("Pantry ingredients loaded successfully!", "success");
    setIsPantryModalOpen(false);
  };

  useEffect(() => {
    if (isPantryModalOpen) {
      fetchPantryItems();
    }
  }, [isPantryModalOpen]);

  return (
    <div className="container-max px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Recipe Generator
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Enter your ingredients and let AI create delicious Jollof recipes for
          you.
        </p>

        {/* Navigation Buttons */}
        <div className="mb-8 flex justify-center space-x-4">
          <Button
            onClick={() => setIsPantryModalOpen(true)}
            variant="outline"
            className="inline-flex items-center space-x-2"
          >
            <span>🗄️</span>
            <span>Use Ingredients from Pantry</span>
          </Button>
        </div>

        {/* Pantry Modal */}
        {isPantryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">
                Your Pantry Ingredients
              </h3>
              {pantryItems.length > 0 ? (
                <div className="max-h-96 overflow-y-auto mb-4">
                  <ul className="space-y-2">
                    {pantryItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span>{item.name}</span>
                        <span className="text-gray-500">
                          {item.quantity} {item.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 mb-4">
                  No ingredients in your pantry yet.
                </p>
              )}
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => setIsPantryModalOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUsePantryIngredients}
                  disabled={pantryItems.length === 0}
                >
                  Use These Ingredients
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search Method Indicator */}
        {searchMethod && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${
              searchMethod === "voice"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : searchMethod === "image"
                ? "bg-orange-100 text-orange-800 border border-orange-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {searchMethod === "voice" ? (
                <>
                  🎤{" "}
                  <span>
                    Voice input detected - Ready to search with spoken
                    ingredients
                  </span>
                </>
              ) : searchMethod === "image" ? (
                <>
                  📸{" "}
                  <span>
                    Image scanning mode - Use camera to detect ingredients
                  </span>
                </>
              ) : (
                <>
                  ⌨️{" "}
                  <span>Text input mode - Type your ingredients manually</span>
                </>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Method Selection */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              type="button"
              onClick={() => setSearchMethod("text")}
              variant={searchMethod === "text" ? "primary" : "outline"}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-2xl mb-2">⌨️</span>
              <span>Text Input</span>
            </Button>
            <Button
              type="button"
              onClick={() => setSearchMethod("voice")}
              variant={searchMethod === "voice" ? "primary" : "outline"}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-2xl mb-2">🎤</span>
              <span>Voice Input</span>
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSearchMethod("image");
                setShowScanner(true);
              }}
              variant={searchMethod === "image" ? "primary" : "outline"}
              className="flex flex-col items-center p-4 h-auto"
            >
              <span className="text-2xl mb-2">📸</span>
              <span>Image Input</span>
            </Button>
          </div>

          {/* Text Input Section */}
          {searchMethod === "text" && (
            <div>
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type Your Ingredients
              </label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={handleTextInput}
                placeholder="Enter ingredients separated by commas (e.g., rice, tomatoes, chicken, onions)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                rows={4}
                required
              />
            </div>
          )}

          {/* Voice Input Section */}
          {searchMethod === "voice" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Input
              </label>
              <div className="mb-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                💡 <strong>Voice Input Tips:</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Allow microphone permissions when prompted</li>
                  <li>Works best in Chrome/Edge browsers</li>
                  <li>Requires HTTPS or localhost</li>
                  <li>Speak clearly and wait for processing</li>
                </ul>
              </div>
              <VoiceInput
                onTranscript={handleVoiceInput}
                placeholder="Click the microphone and describe your ingredients..."
                className="mb-2"
              />
            </div>
          )}

          {/* Image Input Section */}
          {showScanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="bg-white p-4 rounded-lg w-full max-w-lg">
                <CameraScanner
                  onScanResult={handleImageScanResult}
                  onClose={() => setShowScanner(false)}
                  scanType="ingredient"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(searchMethod || ingredients) && (
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || !ingredients.trim()}
                loading={loading}
                className="flex-1"
                size="lg"
              >
                Generate Recipes
              </Button>
              <Button
                type="button"
                onClick={handleReset}
                variant="secondary"
                disabled={loading}
                className="px-6"
                size="lg"
              >
                Reset
              </Button>
            </div>
          )}
        </form>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center">
            <LoadingSpinner size="lg" message="Creating your recipes..." />
          </div>
        )}

        {/* Recipe Cards */}
        {recipes.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Your Generated Recipes
            </h2>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/rice-image.jpg"; // Fallback to main rice image
                    }}
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{recipe.title}</h3>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Ingredients:
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Instructions:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700">
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
