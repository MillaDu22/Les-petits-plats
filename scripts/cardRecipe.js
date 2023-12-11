
const url = "./data/data.json";
const gallery = document.getElementById('gallery');
let allRecipes = [];



// Version équivalente a forEach //
// Cette version utilise une boucle for pour itérer sur les recettes et une autre boucle for imbriquée pour traiter les ingrédients //
const renderRecipes = (recipes) => {
    gallery.innerHTML = "";  // Effacement du contenu précédent //

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const ingredientsListHTML = [];

        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingredient = recipe.ingredients[j];
            ingredientsListHTML.push(`
                <li class="ingredient">
                    <p class="name-ingredient">${ingredient.ingredient}</p>
                    <p class="quantity">${ingredient.quantity}${ingredient.unit ? ingredient.unit : ''}</p>
                </li>
            `);
        }

        gallery.innerHTML += `
            <figure class="card">
                <img src="./assets/images/${recipe.image}" class="img-recipe" alt="${recipe.name}">
                <span class ="span-time">${recipe.time}min</span>
                <h3 class="title-recipe">${recipe.name}</h3>
                <h4 class="subtitle-recipe">RECETTE</h4>
                <p class="description">${recipe.description}</p>
                <h5 class="subtitle-ingredients">INGREDIENTS</h5>
                <ul class="ingredients-list">${ingredientsListHTML.join('')}</ul>
            </figure>
        `;
    }
};


// Cette version utilise une boucle for pour itérer sur la liste des recettes et une autre boucle for imbriquée pour traiter les ingrédients. //

let filteredRecipes = [];

const filterRecipes = (search) => {
    const searchLower = search.toLowerCase();
    filteredRecipes = [];

    for (let i = 0; i < allRecipes.length; i++) {
        const recipe = allRecipes[i];
        const recipeNameLower = recipe.name.toLowerCase();
        const descriptionLower = recipe.description.toLowerCase();

        let ingredientsLower = "";
        for (let j = 0; j < recipe.ingredients.length; j++) {
            ingredientsLower += recipe.ingredients[j].ingredient.toLowerCase() + ' ';
        }

        if (recipeNameLower.includes(searchLower) || ingredientsLower.includes(searchLower) || descriptionLower.includes(searchLower)) {
            filteredRecipes.push(recipe);
        }
    }
    return filteredRecipes;
};

const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', function () {
    const search = this.value.trim();
    const filteredRecipes = filterRecipes(search);
    renderRecipes(filteredRecipes)
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






