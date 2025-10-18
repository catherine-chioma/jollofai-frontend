import React, { useState, useEffect } from "react";
import axios from "../config/api";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  location?: string;
  favoriteIngredients?: string[];
  dietaryRestrictions?: string[];
  cookingExperience?: string;
  joinedDate?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const [editForm, setEditForm] = useState({
    fullName: "",
    bio: "",
    location: "",
    favoriteIngredients: "",
    dietaryRestrictions: "",
    cookingExperience: "beginner",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS.PROFILE);
      setProfile(response.data);

      // Populate edit form
      setEditForm({
        fullName: response.data.fullName || "",
        bio: response.data.bio || "",
        location: response.data.location || "",
        favoriteIngredients:
          response.data.favoriteIngredients?.join(", ") || "",
        dietaryRestrictions:
          response.data.dietaryRestrictions?.join(", ") || "",
        cookingExperience: response.data.cookingExperience || "beginner",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);

      // Fallback to user data from AuthContext
      if (user) {
        const fallbackProfile: UserProfile = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          joinedDate: new Date().toISOString(),
        };
        setProfile(fallbackProfile);
        setEditForm({
          fullName: user.fullName,
          bio: "",
          location: "",
          favoriteIngredients: "",
          dietaryRestrictions: "",
          cookingExperience: "beginner",
        });
      }

      showToast(
        "Could not fetch profile from server, showing local data",
        "warning"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updateData = {
        fullName: editForm.fullName,
        bio: editForm.bio,
        location: editForm.location,
        favoriteIngredients: editForm.favoriteIngredients
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        dietaryRestrictions: editForm.dietaryRestrictions
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        cookingExperience: editForm.cookingExperience,
      };

      const response = await axios.put(
        API_ENDPOINTS.USERS.UPDATE_PROFILE,
        updateData
      );
      setProfile(response.data);
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showToast(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" message="Loading profile..." />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Profile Not Found
            </h1>
            <p className="text-gray-600">
              Could not load your profile information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {profile.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                  <p className="text-white/80">{profile.email}</p>
                  {profile.location && (
                    <p className="text-white/80">📍 {profile.location}</p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, fullName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      placeholder="City, Country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cooking Experience
                  </label>
                  <select
                    value={editForm.cookingExperience}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        cookingExperience: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="professional">Professional Chef</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favorite Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.favoriteIngredients}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        favoriteIngredients: e.target.value,
                      })
                    }
                    placeholder="rice, tomatoes, chicken, onions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Restrictions (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.dietaryRestrictions}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        dietaryRestrictions: e.target.value,
                      })
                    }
                    placeholder="vegetarian, gluten-free, dairy-free..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    loading={isSaving}
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {profile.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About
                    </h3>
                    <p className="text-gray-600">{profile.bio}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Cooking Experience
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary capitalize">
                      {profile.cookingExperience || "Beginner"}
                    </span>
                  </div>

                  {profile.favoriteIngredients &&
                    profile.favoriteIngredients.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Favorite Ingredients
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.favoriteIngredients.map(
                            (ingredient, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                              >
                                {ingredient}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {profile.dietaryRestrictions &&
                  profile.dietaryRestrictions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Dietary Restrictions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.dietaryRestrictions.map(
                          (restriction, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                            >
                              {restriction}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {profile.joinedDate && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Member Since
                    </h3>
                    <p className="text-gray-600">
                      {new Date(profile.joinedDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
