# MMM-MealSuggestions
**MagicMirror²** module that suggests 6 random recipes (3 for lunch and 3 for dinner) to choose from.
It utlizes the [Spoonacular](https://spoonacular.com/food-api) API as well as a local json db for personal/family favorites that may not be online.

## Screenshot
TBD

## Dependanies/Requirements
You'll need to set up an (free) account at [Spoonacular](https://spoonacular.com/food-api) and generate an API key. 
**NOTE:** The free plan has a daily limit of 50 requests/day, so if you change the refreshInterval or find yourself hitting the refresh button a lot throughout the day, you may hit that limit. 

## Installation
To install the module, clone the repository into the `~/MagicMirror/modules/` directory:
```bash
cd ~/MagicMirror/modules/
git clone https://github.com/dancey-apple/MMM-MealSuggestions
```
## Configuration
### MagicMirror config.js:
Add the module to the modules array in the `config/config.js` file:
```javascript
{
    module: "MMM-MealSuggestions",
    position: "bottom_right", // or choose any position you like
    config: {
        apiKey: "YOUR_SPOONACULAR_API_KEY", // required if you are using Spoonacular
        tags: "kid-friendly,dinner", // optional tags. 
        excludeIngredients: "fish,pork,onions", // optional exclusions. 
        diet: "vegan, vegetarian", // optional diet filters
        type: "breakfast, dessert", // optional meal type filters
        refreshInterval: 0, // 0 disables auto-refresh and will only update if the button is clicked
        useLocalBackup: true, // fallback or hybrid toggle
        hybridMode: false, // if true, mixes local and Spoonacular recipes
        localRecipeCount: 3 // how many local recipes to use in hybrid mode
    }
}
```
### recipes.json:
You'll need to add your own images to the `~/MagicMirror/modules/MMM-MealSuggestions/images/` folder and reference them here for images to show.
```json
{
  "recipes": [
    {
      "title": "Grilled Chicken Wrap",
      "summary": "A simple and delicious grilled chicken wrap with lettuce, tomato, and ranch dressing.",
      "image": "modules/MMM-MealSuggestions/images/grilled-chicken-wrap.jpg"
    },
    {
      "title": "Pasta Primavera",
      "summary": "A light pasta dish packed with colorful vegetables and a hint of parmesan.",
      "image": "modules/MMM-MealSuggestions/images/pasta-primavera.jpg"
    },
    {
      "title": "Turkey Quesadilla",
      "summary": "A cheesy turkey quesadilla with a crispy tortilla shell and salsa on the side.",
      "image": "modules/MMM-MealSuggestions/images/turkey-quesadilla.jpg"
    }
  ]
}
```
## Update
To update the module, go to the module directory, pull the latest changes:
```bash
cd ~/MagicMirror/modules/MMM-MealSuggestions
git pull
```
## Configuration Options
The following properties can be configured:
| Option | Default | Description|
|--- | --- | --- |
| `apiKey` | `""` | *Your* Spoonacular API key (required for online recipes) |
| `tags` | `""` | Comma-separated recipe tags for filtering (optional). see [Spoonacular Docs](https://spoonacular.com/food-api/docs#Search-Recipes-Complex) for a list of possible tags. |
| `excludeIngredients` | `""` | Comma-separated ingredients to exclude for filtering (optional). see [Spoonacular Docs](https://spoonacular.com/food-api/docs#Search-Recipes-Complex) for a list of ingredients. |
| `diet` | `""` | Comma-separated diet types for filtering (optional). See [Spoonacular Docs](https://spoonacular.com/food-api/docs#Search-Recipes-Complex) for a list of possible diets |
| `type` | `""` | Comma-separated Meal Types for filtering (optional). See [Spoonacular Docs](https://spoonacular.com/food-api/docs#Search-Recipes-Complex) for a list of possible types.
| `refreshInterval` | `0` | Interval in milliseconds for auto-refresh (optional, if you are using the free API plan, it's best to leave this set to 0 so as not to exceed your quota) |
| `useLocalBackup` | `true` | `true` will use the `~/MagicMirror/modules/MMM-MealSuggestions/recipes.json` file for your personal/family recipes when there is an issuue connecting to the API endpoint. `false` will only use Spoonacular. |
| `hybridMode` | `false` | if `true` you will see a mix of both local and Spoonacular recipes. if `false` only Spoonacular will be shown, unless there is a network error, or you've reached your API call quota |
| `localRecipeCount` | `1` | how many local recipes to use in hybrid mode |
## Credits
Inspired by [MagicMirror²](https://github.com/MichMich/MagicMirror) and powered by the [Spoonacular API](https://spoonacular.com/food-api).
## License
MIT License © Dancey Apple 2025