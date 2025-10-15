import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  replies: number;
  likes: number;
  timestamp: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  postCount: number;
  color: string;
}

export default function Community() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
    tags: "",
  });

  const categories: Category[] = [
    {
      id: "general",
      name: "General Discussion",
      description: "General cooking topics",
      postCount: 124,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "recipes",
      name: "Recipe Sharing",
      description: "Share your favorite recipes",
      postCount: 89,
      color: "bg-green-100 text-green-800",
    },
    {
      id: "tips",
      name: "Cooking Tips",
      description: "Tips and techniques",
      postCount: 67,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "ingredients",
      name: "Ingredients",
      description: "Ingredient discussions",
      postCount: 45,
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: "cultural",
      name: "Cultural Dishes",
      description: "Traditional African cuisine",
      postCount: 78,
      color: "bg-red-100 text-red-800",
    },
    {
      id: "help",
      name: "Help & Support",
      description: "Get help with cooking",
      postCount: 34,
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  const posts: Post[] = [
    {
      id: 1,
      title: "Perfect Jollof Rice: What's your secret ingredient?",
      content:
        "I've been trying to perfect my jollof rice recipe. What's that one secret ingredient that makes all the difference?",
      author: "ChefAisha",
      category: "recipes",
      replies: 23,
      likes: 45,
      timestamp: "2 hours ago",
      tags: ["jollof", "rice", "nigerian"],
    },
    {
      id: 2,
      title: "Best places to buy authentic African spices?",
      content:
        "Looking for reliable sources for authentic African spices. Any recommendations for online stores or local markets?",
      author: "SpiceLover123",
      category: "ingredients",
      replies: 18,
      likes: 32,
      timestamp: "4 hours ago",
      tags: ["spices", "shopping", "authentic"],
    },
    {
      id: 3,
      title: "Egusi soup: Palm oil vs vegetable oil debate",
      content:
        "What are your thoughts on using palm oil vs vegetable oil in egusi soup? Does it really make a difference in taste?",
      author: "NigerianFoodie",
      category: "cultural",
      replies: 31,
      likes: 67,
      timestamp: "6 hours ago",
      tags: ["egusi", "palm-oil", "traditional"],
    },
    {
      id: 4,
      title: "Meal prep ideas for busy weekdays",
      content:
        "I'm looking for African meal prep ideas that can last throughout the week. What are your go-to recipes?",
      author: "BusyMom2Kids",
      category: "tips",
      replies: 15,
      likes: 28,
      timestamp: "8 hours ago",
      tags: ["meal-prep", "busy", "weekday"],
    },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log("New post:", newPost);
    setShowNewPost(false);
    setNewPost({ title: "", content: "", category: "general", tags: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Forum
          </h1>
          <p className="text-lg text-gray-600">
            Connect with fellow African food enthusiasts, share recipes, and
            learn from each other.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-primary">1,247</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600">3,456</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">892</div>
            <div className="text-sm text-gray-600">Recipes Shared</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-gray-600">Online Now</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === "all"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  All Posts
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs opacity-70">
                        {category.postCount}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
              <div className="space-y-3">
                {categories.slice(0, 3).map((category) => (
                  <div
                    key={category.id}
                    className="border-l-4 border-primary pl-3"
                  >
                    <h4 className="font-medium text-gray-900">
                      {category.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${category.color} mt-1`}
                    >
                      {category.postCount} posts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* New Post Button */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    Community Discussions
                  </h2>
                  <p className="text-gray-600">
                    Share your thoughts and connect with others
                  </p>
                </div>
                {user ? (
                  <Button
                    onClick={() => setShowNewPost(!showNewPost)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    + New Post
                  </Button>
                ) : (
                  <div className="text-sm text-gray-500">
                    <a href="/signin" className="text-primary hover:underline">
                      Sign in
                    </a>{" "}
                    to post
                  </div>
                )}
              </div>
            </div>

            {/* New Post Form */}
            {showNewPost && user && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Post title..."
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={newPost.category}
                      onChange={(e) =>
                        setNewPost({ ...newPost, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <textarea
                      placeholder="Share your thoughts..."
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      value={newPost.tags}
                      onChange={(e) =>
                        setNewPost({ ...newPost, tags: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Post
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewPost(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{post.content}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Post Meta */}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-primary">
                        {post.author}
                      </span>
                      <span>{post.timestamp}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          categories.find((c) => c.id === post.category)?.color
                        }`}
                      >
                        {categories.find((c) => c.id === post.category)?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {post.replies}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
