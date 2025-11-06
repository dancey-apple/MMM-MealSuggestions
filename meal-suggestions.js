// === MMM-MealSuggestions.js ===
// API Key (replace with your own or move to MagicMirror config)
const config = {
    apiKey: "87cfc66de7974962a5833c7fc001f12c", // replace with your own
    useLocalBackup: true, // fallback toggle
    hybridMode: true, // mix local + API recipes
    localFile: "recipes.json", // local JSON file path
    count: 3, // how many recipes per meal type
    localRecipeCount: 1, // how many local recipes to use in hybrid
};

const refreshButton = document.getElementById("refresh-meals");

// === Helper Function: Random subset of an array ===
function getRandomSubset(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

// === Core Fetch Logic ===
async function getMeals(mealType, count = config.count) {
    const containerPrefix = mealType.toLowerCase();
    const section = document.getElementById(`${containerPrefix}-recipes`);
    if (!section) return;

    let recipes = [];

    try {
        // === Hybrid Mode: Fetch BOTH ===
        if (config.hybridMode) {
            // Build API query params
            const params = new URLSearchParams();
            params.append("apiKey", config.apiKey);
            params.append("number", count - config.localRecipeCount); // only fetch remaining
            if (config.tags) params.append("tags", config.tags);
            if (config.type) params.append("type", config.type);
            if (config.diet) params.append("diet", config.diet);
            if (config.excludeIngredients) params.append("excludeIngredients", config.excludeIngredients);

            const [apiResponse, localResponse] = await Promise.all([
                fetch(`https://api.spoonacular.com/recipes/random?${params.toString()}`),
                fetch(config.localFile)
            ]);

            const apiData = apiResponse.ok ? await apiResponse.json() : { recipes: [] };
            const localData = await localResponse.json();

            function getRandomSubset(arr, n) {
                const shuffled = arr.sort(() => Math.random() - 0.5);
                return shuffled.slice(0, n);
            }

            const numLocal = Math.min(config.localRecipeCount, localData.recipes.length);
            const numApi = count - numLocal;

            const localSubset = getRandomSubset(localData.recipes, numLocal);
            const apiSubset = apiData.recipes.slice(0, numApi);

            recipes = [...localSubset, ...apiSubset].sort(() => Math.random() - 0.5);


        // === API-only Mode ===
        } else if (!config.useLocalBackup) {
            const apiResponse = await fetch(
                `https://api.spoonacular.com/recipes/random?apiKey=${config.apiKey}&number=${count}`
            );
            if (!apiResponse.ok) throw new Error(`API error ${apiResponse.status}`);
            const apiData = await apiResponse.json();
            recipes = apiData.recipes;

        // === Local-only Mode ===
        } else {
            const localResponse = await fetch(config.localFile);
            const localData = await localResponse.json();
            recipes = getRandomSubset(localData.recipes, count);
        }

        // === Fallback if empty ===
        if ((!recipes || recipes.length === 0) && config.useLocalBackup) {
            const localResponse = await fetch(config.localFile);
            const localData = await localResponse.json();
            recipes = getRandomSubset(localData.recipes, count);
        }

    } catch (err) {
        console.error("Error fetching recipes:", err);
        if (config.useLocalBackup) {
            try {
                const localResponse = await fetch(config.localFile);
                const localData = await localResponse.json();
                recipes = localData.recipes.slice(0, count);
            } catch (e) {
                console.error("Local recipe load failed too:", e);
            }
        }
    }

    // === Render Recipes ===
    renderRecipes(section, recipes);
}

// === Render Function ===
function renderRecipes(container, recipes) {
    container.innerHTML = ""; // clear old content

    recipes.forEach((recipe) => {
        const card = document.createElement("div");
        card.className = "meal-card";

        const imageSrc = recipe.image || "modules/MMM-MealSuggestions/images/default.jpg";
        const title = recipe.title || "Untitled Recipe";

        card.innerHTML = `
            <div class="meal-image-wrapper">
                <img src="${imageSrc}" alt="${title}" />
            </div>
            <p class="meal-title">${title}</p>
            ${recipe.readyInMinutes ? `<p>Ready in ${recipe.readyInMinutes} minutes</p>` : ""}
            ${recipe.sourceUrl ? `<p><a href="${recipe.sourceUrl}" target="_blank">View Recipe</a></p>` : ""}
            ${recipe.source ? `<p>Source: ${recipe.source}</p>` : ""}
        `;
        container.appendChild(card);
    });
}

// === Initialization ===
getMeals("Lunch");
getMeals("Dinner");

// === Refresh on Click ===
if (refreshButton) {
    refreshButton.addEventListener("click", () => {
        getMeals("Lunch");
        getMeals("Dinner");
    });
}
