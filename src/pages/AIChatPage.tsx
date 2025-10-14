import React from "react";
import AIChat from "../components/AIChat";

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl h-screen flex flex-col">
        {/* Page Header */}
        <div className="flex-shrink-0 bg-white shadow-sm border-b">
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Cooking Assistant
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get instant help with African recipes, cooking techniques,
                ingredient substitutions, and culinary advice from our
                AI-powered cooking assistant.
              </p>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span>🍛</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Recipe Help
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Get cooking guidance
                </p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span>🌶️</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Ingredient Tips
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Substitutions & uses
                </p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span>⏱️</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Cooking Times
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Perfect timing advice
                </p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span>🎯</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Techniques
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Traditional methods
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 bg-white shadow-lg rounded-t-2xl mt-4 mx-4 mb-4 overflow-hidden">
          <AIChat
            context={{
              type: "general",
              data: {
                page: "ai-chat",
                timestamp: new Date().toISOString(),
              },
            }}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
