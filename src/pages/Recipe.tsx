import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import VoiceInput from "../components/VoiceInput";
import { useToast } from "../components/Toast";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
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
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { showToast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) {
      showToast("Please enter some ingredients", "warning");
      return;
    }

    setLoading(true);
    setRecipes([]);

    try {
      const formData = new FormData();
      formData.append("ingredients", ingredients);
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.RECIPES.MATCH_INGREDIENTS}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setRecipes(response.data.recipes || []);
      showToast("Recipes generated successfully!", "success");
    } catch (err) {
      console.error("Recipe generation error:", err);

      // Fallback: Generate mock recipes when API is not available
      const mockRecipes: Recipe[] = generateMockRecipes(ingredients);
      setRecipes(mockRecipes);
      showToast("Recipes generated successfully! (Demo mode)", "success");
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredients Input */}
          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ingredients
            </label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter ingredients separated by commas (e.g., rice, tomatoes, chicken, onions)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              rows={4}
              required
            />
          </div>

          {/* Voice Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice Input (Alternative)
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
              onTranscript={(text) => setIngredients(text)}
              placeholder="Click the microphone and describe your ingredients..."
              className="mb-2"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Images (Optional)
            </label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {images.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {images.length} image{images.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !ingredients.trim()}
            loading={loading}
            className="w-full"
            size="lg"
          >
            Generate Recipes
          </Button>
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
