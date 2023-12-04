const url = "./data/data.json";
const gallery = document.getElementById('gallery');
let allRecipes = [];

const renderRecipes = (recipes) => {
    gallery.innerHTML = "";  // retrait contenu //
    recipes.forEach(recipe => {
        const ingredientsListHTML = recipe.ingredients.map(ingredient => `
            <li class="ingredient">
                <p class="name-ingredient">${ingredient.ingredient}</p>
                <p class="quantity">${ingredient.quantity}${ingredient.unit ? ingredient.unit : ''}</p>
            </li>
        `).join('');
        gallery.innerHTML += `
            <figure class="card">
                <img src="./assets/images/${recipe.image}" class="img-recipe" alt="${recipe.name}">
                <h3 class="title-recipe">${recipe.name}</h3>
                <h4 class="subtitle-recipe">RECETTE</h4>
                <p class="description">${recipe.description}</p>
                <h5 class="subtitle-ingredients">INGREDIENTS</h5>
                <ul class="ingredients-list">${ingredientsListHTML}</ul>
            </figure>
        `;
    });
};

const filterRecipes = (search) => {
    const searchLower = search.toLowerCase();
    const filteredRecipes = allRecipes.filter(recipe => {
        // Recherche dans le nom de la recette et les ingrédients //
        const recipeNameLower = recipe.name.toLowerCase();
        const descriptionLower = recipe.description.toLowerCase();
        const ingredientsLower = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()).join(' ');

        return recipeNameLower.includes(searchLower) || ingredientsLower.includes(searchLower) || descriptionLower.includes(searchLower);
    });
    renderRecipes(filteredRecipes);
};

const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', function () {
    const search = this.value.trim();
    filterRecipes(search);
});

// Chargement de toutes les recettes au démarrage //
fetch(url)
.then(response => response.json())
.then(data => {
    if (Array.isArray(data)) {
        allRecipes = data;
        renderRecipes(allRecipes);
    } else {
        console.error('Data is not an array:', data);
    }
})
.catch(error => {
    console.error('Error fetching recipes:', error);
});







