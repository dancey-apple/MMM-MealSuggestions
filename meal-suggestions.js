const apiKey = "87cfc66de7974962a5833c7fc001f12c"; // Replace with your actual API key
const refreshButton = document.getElementById("refresh-meals");

//Fetch random meals and render them
async function getMeals(mealType, count = 3) {
    const containerPrefix = mealType.toLowerCase(); // 'lunch' or 'dinner'

    for (let i = 0; i < count; i++) {
        const mealDiv = document.getElementById(`${containerPrefix}-${i}`);

        try {
            const response = await fetch("recipes.json");
            // SPOONACULAR REQUEST const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=${count}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const recipe = data.recipes[0];

            data.recipes.forEach((recipe, i) => {
                const mealDiv = document.getElementById(`${containerPrefix}-${i}`);
                if (mealDiv) {
                    mealDiv.innerHTML = `
                        <div class="meal-card">
                            <h3>${recipe.title}</h3>
                            <img src="${recipe.image}" alt="${recipe.title}" />
                            <p>Ready in ${recipe.readyInMinutes} minutes</p>
                            <p><a href="${recipe.sourceUrl}" target="_blank">View Recipe</a></p>
                        </div>
                    `;
                }
            });
        } catch (error) {
            console.error("Error fetching meal data:", error);
            mealDiv.innerHTML = `<p style="color: red;">Error loading recipe.</p>`;
        }
    }
}

// Load Initial Meals
getMeals("Lunch");
getMeals("Dinner");

// Refresh Meals on Button Click
refreshButton.addEventListener("click", () => {
    getMeals("Lunch");
    getMeals("Dinner");
});