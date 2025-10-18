import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";
import axios, { API_ENDPOINTS } from "../config/api";

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string;
  addedDate: string;
  lowStockThreshold?: number;
}

interface PantryCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export default function Pantry() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    unit: "pieces",
    category: "vegetables",
    expiryDate: "",
    lowStockThreshold: 5,
  });

  const categories: PantryCategory[] = [
    { id: "vegetables", name: "Vegetables", icon: "🥕", count: 0 },
    { id: "fruits", name: "Fruits", icon: "🍎", count: 0 },
    { id: "grains", name: "Grains & Rice", icon: "🌾", count: 0 },
    { id: "proteins", name: "Proteins", icon: "🥩", count: 0 },
    { id: "dairy", name: "Dairy", icon: "🥛", count: 0 },
    { id: "spices", name: "Spices", icon: "🌶️", count: 0 },
    { id: "oils", name: "Oils & Fats", icon: "🫒", count: 0 },
    { id: "pantry", name: "Pantry Staples", icon: "🥫", count: 0 },
    { id: "frozen", name: "Frozen", icon: "🧊", count: 0 },
    { id: "other", name: "Other", icon: "📦", count: 0 },
  ];

  const units = [
    "pieces",
    "kg",
    "g",
    "lbs",
    "oz",
    "cups",
    "tbsp",
    "tsp",
    "liters",
    "ml",
    "bottles",
    "cans",
    "packets",
    "bunches",
  ];

  useEffect(() => {
    if (user) {
      fetchPantryItems();
    }
  }, [user]);

  const fetchPantryItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_ENDPOINTS.PANTRY.GET_ITEMS);
      setPantryItems(response.data);
    } catch (error) {
      console.error("Error fetching pantry items:", error);
      showToast("Failed to load pantry items", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast("You must be logged in to manage pantry", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemData = {
        name: newItem.name.trim(),
        quantity: newItem.quantity,
        unit: newItem.unit,
        category: newItem.category,
        expiryDate: newItem.expiryDate || undefined,
        lowStockThreshold: newItem.lowStockThreshold,
      };

      const response = await axios.post(
        API_ENDPOINTS.PANTRY.ADD_ITEM,
        itemData
      );
      setPantryItems([...pantryItems, response.data]);

      setShowAddModal(false);
      setNewItem({
        name: "",
        quantity: 1,
        unit: "pieces",
        category: "vegetables",
        expiryDate: "",
        lowStockThreshold: 5,
      });

      showToast("Item added to pantry!", "success");
    } catch (error: any) {
      console.error("Error adding pantry item:", error);
      showToast(error.response?.data?.message || "Failed to add item", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;

    try {
      await axios.put(API_ENDPOINTS.PANTRY.UPDATE_ITEM(itemId), {
        quantity: newQuantity,
      });

      setPantryItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      if (newQuantity === 0) {
        showToast("Item removed from pantry", "success");
      }
    } catch (error: any) {
      console.error("Error updating item:", error);
      showToast("Failed to update item", "error");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await axios.delete(API_ENDPOINTS.PANTRY.DELETE_ITEM(itemId));
      setPantryItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      showToast("Item removed from pantry", "success");
    } catch (error: any) {
      console.error("Error deleting item:", error);
      showToast("Failed to remove item", "error");
    }
  };

  const filteredItems = pantryItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getItemsInCategory = (categoryId: string) => {
    return pantryItems.filter((item) => item.category === categoryId).length;
  };

  const getLowStockItems = () => {
    return pantryItems.filter(
      (item) =>
        item.lowStockThreshold && item.quantity <= item.lowStockThreshold
    );
  };

  const getExpiringItems = () => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    return pantryItems.filter((item) => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= threeDaysFromNow;
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pantry Management
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to manage your pantry.
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Pantry</h1>
          <p className="text-lg text-gray-600">
            Keep track of your ingredients and never run out of essentials.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {pantryItems.length}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-red-600">
                  {getLowStockItems().length}
                </div>
                <div className="text-sm text-gray-600">Low Stock</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {getExpiringItems().length}
                </div>
                <div className="text-sm text-gray-600">Expiring Soon</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-green-600">
                  {getLowStockItems().length + getExpiringItems().length}
                </div>
                <div className="text-sm text-gray-600">Shopping List</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search pantry items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                ➕ Add Item
              </Button>
              <Button variant="outline">📋 Shopping List</Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>

              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>📁</span>
                  <span>All Items</span>
                </div>
                <span className="text-sm">{pantryItems.length}</span>
              </button>

              {categories.map((category) => {
                const count = getItemsInCategory(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Items Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" message="Loading pantry items..." />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🥫</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No items found" : "Your pantry is empty"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms or browse different categories."
                    : "Start by adding some ingredients to keep track of your pantry inventory."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Add Your First Item
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const isLowStock =
                    item.lowStockThreshold &&
                    item.quantity <= item.lowStockThreshold;
                  const isExpiring =
                    item.expiryDate &&
                    new Date(item.expiryDate) <=
                      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
                        isExpiring
                          ? "border-red-500"
                          : isLowStock
                          ? "border-yellow-500"
                          : "border-green-500"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {categories.find((c) => c.id === item.category)
                              ?.icon || "📦"}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {item.category}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
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
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="font-bold text-xl min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <span className="text-gray-600">{item.unit}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {(isLowStock || isExpiring) && (
                        <div className="mb-3">
                          {isExpiring && (
                            <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
                              <span>⏰</span>
                              <span>
                                Expires{" "}
                                {new Date(
                                  item.expiryDate!
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {isLowStock && (
                            <div className="flex items-center gap-2 text-yellow-600 text-sm">
                              <span>⚠️</span>
                              <span>
                                Low stock (threshold: {item.lowStockThreshold})
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Added {new Date(item.addedDate).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Pantry Item
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

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Tomatoes"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) =>
                      setNewItem({ ...newItem, expiryDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={newItem.lowStockThreshold}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        lowStockThreshold: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Alert when quantity is below this number"
                    min="0"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    Add Item
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
}
