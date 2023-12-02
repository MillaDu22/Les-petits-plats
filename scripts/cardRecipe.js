// Function fetch JSON data //
const url  = "./data/data.json";
const gallery =document.getElementById('gallery');
const renderRecipes = () => {
    fetch(url)
    .then(function (response) {
        return response.json()
    })
    .then( function (data) {
        //console.log(data)
        if (Array.isArray(data)) {
            data.forEach(recipe => {
                const ingredientsListHTML = recipe.ingredients.map(ingredient => `
                <li class="ingredient">
                    <p class="name-ingredient">${ingredient.ingredient}</p>
                    <p class="quantity">${ingredient.quantity}${ingredient.unit ? ingredient.unit : ''}</p>
                </li>
                `).join('');
            gallery.innerHTML +=`
            <figure class ="card">
                <img src="./assets/images/${recipe.image}" class="img-recipe" alt="${recipe.name}">
                <h3 class="title-recipe">${recipe.name}</h3>
                <h4 class=" subtitle-recipe">RECETTE</h4>
                <p class="description">${recipe.description}</p>
                <h5 class = "subtitle-ingredients">INGREDIENTS</h5>
                <ul class ="ingredients-list">${ingredientsListHTML}</ul>
            </figure>`
            })
        } else {
        console.error('Data is not an array:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
    });
}
renderRecipes()

