const url = "./data/data.json";
const gallery = document.getElementById('gallery');
let allRecipes = [];
let filteredRecipes = [];
let filteredRecipesByTags = [];

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
                <span class ="span-time">${recipe.time}min</span>
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
    filteredRecipes = allRecipes.filter(recipe => {
        // Recherche dans le nom de la recette ou la description ou les ingredients //
        const recipeNameLower = recipe.name.toLowerCase();
        const descriptionLower = recipe.description.toLowerCase();
        const ingredientsLower = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()).join(' ');

        return recipeNameLower.includes(searchLower) || ingredientsLower.includes(searchLower) || descriptionLower.includes(searchLower);
    });
    return filteredRecipes
};

const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', function () {
    const search = this.value.trim();
    const filteredRecipes = filterRecipes(search);
    renderRecipes(filteredRecipes)
});

// Fonction pour filtrer les recettes en fonction des tags sélectionnés //
const filterRecipesByTags = () => {
    const allSelectedTagsIngredients = document.querySelectorAll('#tag-list-ingredients');
    const allSelectedTagsAppliances = document.querySelectorAll('#tag-list-appliances');
    const allSelectedTagsUstensils = document.querySelectorAll('#tag-list-ustensils');

    const allSelectedTagValuesIngredients = Array.from(allSelectedTagsIngredients).map(tag => tag.innerText.toLowerCase());
    const allSelectedTagValuesAppliances = Array.from(allSelectedTagsAppliances).map(tag => tag.innerText.toLowerCase());
    const allSelectedTagValuesUstensils = Array.from(allSelectedTagsUstensils).map(tag => tag.innerText.toLowerCase());


        filteredRecipesByTags = filteredRecipes ? filteredRecipes : allRecipes;

        filteredRecipesByTags = allRecipes.filter(recipe => {
        const ingredientTags = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
        const applianceTags = [recipe.appliance.toLowerCase()];
        const ustensilTags = recipe.ustensils.map(ustensil => ustensil.toLowerCase());

        return (
            allSelectedTagValuesIngredients.some(tag => ingredientTags.includes(tag)) ||
            allSelectedTagValuesAppliances.some(tag => applianceTags.includes(tag)) ||
            allSelectedTagValuesUstensils.some(tag => ustensilTags.includes(tag))
        );
    });

    // Affichage des recettes filtrées //
    renderRecipes(filteredRecipesByTags);
};

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

/******************Collapses************************ */

// Ajout listes des dropdowns //
const addItemsToDropdown = (sectionId, items) => {
    const listContainer = document.querySelector(`#collapseExemple-${sectionId} .list-drop`);
    
    // Efface le contenu actuel de la liste //
    listContainer.innerHTML = '';

    // Ajoute chaque élément aux listes //
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('dropdown-item', 'filterable-item');
        listItem.setAttribute('tabindex', '0');
        listItem.setAttribute('role', 'button');
        listItem.setAttribute('href', '#');
        listItem.setAttribute('id', `item-${sectionId}-${item}`);
        listItem.setAttribute('data-item', item);
        listItem.innerText = item;
        listContainer.appendChild(listItem);
    });
};
// Pour stocker tous les ingrédients, ustensiles et appareils uniques //
const allIngredientsSet = new Set();
const allAppliancesSet = new Set();
const allUstensilsSet = new Set();

// Fonction pour traiter les données d'une recette et les ajouter aux ensembles //
const processRecipeData = (recipe) => {
    recipe.ingredients.forEach(item => allIngredientsSet.add(item.ingredient));
    allAppliancesSet.add(recipe.appliance);
    recipe.ustensils.forEach(ustensil => allUstensilsSet.add(ustensil));
};

// Fonction pour filtrer les éléments dans les dropdowns //
const filterDropdown = (sectionId, inputId) => {
    const searchInput = document.getElementById(inputId);
    const listItems = document.querySelectorAll(`#collapseExemple-${sectionId} .list-drop .filterable-item`);
    const searchTerm = searchInput.value.toLowerCase();

    listItems.forEach(item => {
        const itemText = item.innerText.toLowerCase();
        const isVisible = itemText.includes(searchTerm);
        item.style.display = isVisible ? 'block' : 'none';
    });
};

// Ajout d'un gestionnaire d'événements à l'élément de recherche des dropdowns //
document.getElementById('search-drop-ingredients').addEventListener('input', () => {
    filterDropdown('ingredients', 'search-drop-ingredients');
});

document.getElementById('search-drop-appliances').addEventListener('input', () => {
    filterDropdown('appliances', 'search-drop-appliances');
});

document.getElementById('search-drop-ustensils').addEventListener('input', () => {
    filterDropdown('ustensils', 'search-drop-ustensils');
});

// Création des containers à tags //
const TagContainer = document.getElementById('container-tag');

const ulTagIngredients = document.createElement('div');
ulTagIngredients.id = 'ulTagIngredients';
ulTagIngredients.classList.add('tag');
TagContainer.appendChild(ulTagIngredients);

const ulTagAppliances = document.createElement('div');
ulTagAppliances.id = 'ulTagAppliances';
ulTagAppliances.classList.add('tag');
TagContainer.appendChild(ulTagAppliances);

const ulTagUstensils = document.createElement('div');
ulTagUstensils.id = 'ulTagUstensils';
ulTagUstensils.classList.add('tag');
TagContainer.appendChild(ulTagUstensils);


// Fonction pour ajouter un nouveau txtTag dans le conteneur approprié //
const addNewTxtTag = (tag, tagType) => {
    // Sélection du conteneur approprié en fonction du type de tag //
    let tagContainer;

    if (tagType === 'Ingredients') {
        tagContainer = document.getElementById('ulTagIngredients');
    } else if (tagType === 'Appareils') {
        tagContainer = document.getElementById('ulTagAppliances');
    } else if (tagType === 'Ustensiles') {
        tagContainer = document.getElementById('ulTagUstensils');
    } else {
        // Gére le cas où le type de tag n'est pas reconnu //
        console.error('Type de tag non reconnu');
        return;
    }

    // Création nouvel élément txtTag //
    const newTxtTag = document.createElement('span');
    newTxtTag.className = 'txt-tag';
    newTxtTag.id = 'txt-tag-${sectionId}';
    newTxtTag.innerHTML = `${tag}<strong class="fa-solid fa-xmark"></strong>`;

    // Ajout du nouvel élément txtTag au conteneur ul //
    tagContainer.appendChild(newTxtTag);

    // Affiche le tag //
    tagContainer.style.display = 'flex';

    // Ajout gestionnaire d'événements pour le clic sur la croix de fermeture du tag hors du collapse //
    const xClose = newTxtTag.querySelector('.fa-xmark');
    xClose.addEventListener('click', () => {
        newTxtTag.style.display = 'none';
    });  
};

// Ajout gestionnaire d'événements aux suggestions d'ingrédients //
document.getElementById('collapseExemple-ingredients').addEventListener('click', (event) => {
    const clickedItem = event.target.closest('.filterable-item');
    if (clickedItem) {
        const selectedIngredient = clickedItem.getAttribute('data-item');
        addNewTxtTag(selectedIngredient, 'Ingredients')
        const tagList = document.getElementById('tag-list-ingredients'); // Met à jour le tagList interieur collapse //
        tagList.innerHTML = `${selectedIngredient}<img src="./assets/icons/XCloseItem.png" alt="Croix de fermeture selection">`;
        tagList.style.display = 'flex'; // Affiche le tagList //
        // Affiche les recettes filtrées //
        filterRecipesByTags();
    }
});


// Ajout un gestionnaire d'événements aux suggestions d'appareils //
document.getElementById('collapseExemple-appliances').addEventListener('click', (event) => {
    const clickedItem = event.target.closest('.filterable-item');
    if (clickedItem) {
        const selectedAppliance = clickedItem.getAttribute('data-item');
        addNewTxtTag(selectedAppliance, 'Appareils')
        const tagList = document.getElementById('tag-list-appliances'); // Met à jour le tagList interieur collapse //
        tagList.innerHTML = `${selectedAppliance}<img src="./assets/icons/XCloseItem.png" alt="Croix de fermeture selection">`;
        tagList.style.display = 'flex'; // Affiche le tagList //
        filterRecipesByTags();
    }
});


// Ajout gestionnaire d'événements aux suggestions d'ustensiles //
document.getElementById('collapseExemple-ustensils').addEventListener('click', (event) => {
    const clickedItem = event.target.closest('.filterable-item');
    if (clickedItem) {
        const selectedUstensil = clickedItem.getAttribute('data-item');
        addNewTxtTag(selectedUstensil, 'Ustensiles')
        const tagList = document.getElementById('tag-list-ustensils'); // Met à jour le tagList interieur collapse //
        tagList.innerHTML = `${selectedUstensil}<img src="./assets/icons/XCloseItem.png" alt="Croix de fermeture selection">`;
        tagList.style.display = 'flex'; // Affiche le tagList //
        filterRecipesByTags();
    }
});


// Charge les données JSON et traiter les données pour chaque collapse //
fetch(url)
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            // Pour chaque recette, traiter les données //
            data.forEach(recipe => {
                processRecipeData(recipe);
            });

            // Convertir les ensembles en tableaux
            const allIngredientsList = Array.from(allIngredientsSet);
            const allAppliancesList = Array.from(allAppliancesSet);
            const allUstensilsList = Array.from(allUstensilsSet);

            // Insérer les listes dans les collapses correspondants
            addItemsToDropdown('ingredients', allIngredientsList);
            addItemsToDropdown('appliances', allAppliancesList);
            addItemsToDropdown('ustensils', allUstensilsList);
        } else {
            console.error('Data is not an array:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching collapse data:', error);
    });




    