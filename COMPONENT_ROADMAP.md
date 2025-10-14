// Additional components needed for full JollofAI feature set

// 1. Onboarding Flow
components/
onboarding/
WelcomeScreen.tsx
DietaryPreferences.tsx  
 AllergiesSetup.tsx
BudgetPreferences.tsx
LocationSetup.tsx

// 2. Enhanced Home Feed
pages/
HomeFeed.tsx // Dynamic recipe + vendor feed

components/
feed/
RecipeCard.tsx // Enhanced recipe cards
VendorCard.tsx // Local vendor suggestions
TrendingMeals.tsx // Trending section
PersonalizedFeed.tsx // AI-curated content

// 3. Ingredient Input Enhancements
components/
input/
VoiceInput.tsx // Voice-to-text ingredient input
CameraScanner.tsx // AI visual ingredient recognition
IngredientAutocomplete.tsx // Smart ingredient suggestions

// 4. Recipe Discovery & Detail
pages/
RecipeDiscovery.tsx // Grid with advanced filters
RecipeDetail.tsx // Detailed recipe view

components/
recipe/
RecipeFilters.tsx // Time, cuisine, budget filters
IngredientChecker.tsx // Available vs missing ingredients
NutritionInfo.tsx // Health insights
RecipeRating.tsx // Community ratings

// 5. Cooking Assistant
pages/
CookingAssistant.tsx // Voice-guided cooking mode

components/
cooking/
VoiceGuide.tsx // Step-by-step voice instructions
TimerWidget.tsx // Multiple cooking timers
SubstitutionHelper.tsx // AI ingredient substitutions

// 6. Vendor Marketplace
pages/
VendorMarketplace.tsx // Local vendor discovery
VendorDetail.tsx // Individual vendor page

components/
vendor/
VendorMap.tsx // Google Maps integration
VendorList.tsx // List view of vendors
OrderButton.tsx // Order ingredients/meals
DeliveryTracker.tsx // Order tracking

// 7. Pantry Tracker
pages/
PantryTracker.tsx // Personal pantry management

components/
pantry/
IngredientGrid.tsx // Visual pantry layout
ExpiryAlerts.tsx // Expiration notifications
Pantrysuggestions.tsx // Recipe suggestions from pantry
ShoppingList.tsx // Auto-generated shopping lists

// 8. AI Chat Assistant
components/
chat/
ChatInterface.tsx // Conversational cooking help
ChatBubble.tsx // Message components
QuickReplies.tsx // Suggested responses
ChatHistory.tsx // Conversation history

// 9. Community Features
pages/
Community.tsx // Social recipe sharing
CookAlong.tsx // Live cooking sessions

components/
social/
RecipeShare.tsx // Share recipes
UserReviews.tsx // Recipe reviews
CookAlongRoom.tsx // Live cooking rooms
FollowButton.tsx // User connections

// 10. Health & Lifestyle
pages/
NutritionDashboard.tsx // Health insights
MealPlanner.tsx // Weekly meal planning

components/
health/
CalorieTracker.tsx // Nutrition tracking
DietaryModeToggle.tsx // Vegan, keto, etc.
HealthGoals.tsx // Personal health targets
MealPlanCalendar.tsx // Calendar view

// 11. Gamification
components/
gamification/
AchievementBadges.tsx // Cooking achievements
StreakCounter.tsx // Daily cooking streaks
ChallengeCard.tsx // Cooking challenges
Leaderboard.tsx // Community rankings
ProgressBar.tsx // Goal progress

// 12. Enhanced Profile
pages/
ProfileDashboard.tsx // Comprehensive user profile

components/
profile/
SavedRecipes.tsx // Bookmarked recipes
OrderHistory.tsx // Past orders
CookingStats.tsx // Personal cooking analytics
SettingsPanel.tsx // App preferences
