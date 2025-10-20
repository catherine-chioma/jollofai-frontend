# Recipe Search Method Detection

## Overview

The Recipe Generator now differentiates between text-based and voice-based search inputs, allowing for different search behaviors and user feedback.

## Features

### 1. Search Method Detection

- **Text Input**: When user types ingredients manually in the textarea
- **Voice Input**: When user uses the microphone/voice input feature
- **Visual Feedback**: Search method indicator shows current input mode

### 2. Different Search Behaviors

#### Text Search ("test")

- Standard text matching
- Exact word matching in titles and descriptions
- More precise filtering

#### Voice Search ("voice")

- More lenient matching algorithm
- Includes ingredient-level matching
- Accounts for potential voice-to-text errors
- Enhanced phonetic tolerance

### 3. Implementation Details

#### Frontend Components

```typescript
// State tracking
const [searchMethod, setSearchMethod] = useState<"text" | "voice" | null>(null);

// Handlers
const handleTextInput = (e) => {
  setIngredients(e.target.value);
  setSearchMethod("text");
};

const handleVoiceInput = (text) => {
  setIngredients(text);
  setSearchMethod("voice");
};
```

#### API Integration

```typescript
// API calls include search method
const response = await ApiService.getRecipes({
  search: ingredients,
  matchIngredients: true,
  searchMethod: searchMethod || "text",
});
```

### 4. User Experience

#### Visual Indicators

- 🎤 **Voice Input**: Blue indicator when voice input is detected
- ⌨️ **Text Input**: Green indicator when typing manually
- Toast notifications specify the search method used

#### Search Results

- Success messages indicate which input method was used
- Different filtering algorithms based on input method
- Enhanced matching for voice input to account for speech recognition

### 5. Backend Processing

#### Mock API Server

```javascript
// Enhanced filtering based on search method
if (searchMethod === "voice") {
  // More lenient matching for voice input
  filteredRecipes = recipes.filter((recipe) =>
    // Includes ingredient-level matching
    recipe.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(search.toLowerCase())
    )
  );
}
```

### 6. Testing

#### Test Scenarios

1. **Text Search**: Type "rice, tomato" in textarea

   - Should show green text input indicator
   - Standard matching algorithm

2. **Voice Search**: Use microphone to say "rice and tomato"

   - Should show blue voice input indicator
   - Enhanced matching including ingredients

3. **Method Switching**: Switch between text and voice input
   - Indicators should update appropriately
   - Search method should be preserved until next input

### 7. Future Enhancements

#### Planned Features

1. **Voice Command Processing**: Natural language parsing
2. **Search History**: Track search methods and preferences
3. **Personalization**: Adapt search based on user's preferred method
4. **Analytics**: Track usage patterns for text vs voice search
5. **Improved Voice Matching**: Machine learning for better voice search results

#### Backend Integration

1. **Search Analytics**: Track which method produces better results
2. **Personalized Algorithms**: Different ranking for voice vs text
3. **Voice Training**: Improve recognition for cooking terminology
4. **Multilingual Support**: Voice search in different languages

### 8. Technical Notes

#### Browser Support

- Voice input requires modern browser with Web Speech API
- Fallback to text input if voice not supported
- HTTPS required for microphone access

#### Performance

- Search method detection is instantaneous
- No performance impact on search results
- Minimal additional data sent to backend

#### Accessibility

- Clear visual indicators for search method
- Voice input provides alternative to typing
- Toast notifications for screen readers
