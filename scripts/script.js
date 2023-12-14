/************************************* Cartes recettes et premier filtrage****************************** */
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

/************************************* Collapses et second filtrage****************************** */

// Function fetch JSON data //
const collapseUrl = "./data/data.json";
const collapseContainer = document.getElementById('box-drop');

const renderCollapse = () => {
    fetch(collapseUrl)
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            // Extraction valeur unique pour chaque section dans toutes recettes //
            const allIngredients = getAllIngredients(data);
            const allAppareils = getAllValues(data, 'appliance');
            const allUstensils = getAllValues(data, 'ustensils');

            // Render section des 3 collapses //
            renderSection('Ingredients', allIngredients);
            renderSection('Appareils', allAppareils);
            renderSection('Ustensiles', allUstensils);
        } else {
            console.error('Data is not an array:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching collapse data:', error);
    });
};
// Obtention list ingrédients //
const getAllIngredients = (data) => {
    const itemsSet = new Set();

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (Array.isArray(item.ingredients)) {
            for (let j = 0; j < item.ingredients.length; j++) {
                const ingredient = item.ingredients[j];
                itemsSet.add(ingredient.ingredient);
            }
        }
    }
    return Array.from(itemsSet);
};

// Obtention lists Ustensils et Appareils //
const getAllValues = (data, type) => {
    const itemsSet = new Set();

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (Array.isArray(item[type])) {
            for (let j = 0; j < item[type].length; j++) {
                const value = item[type][j];
                itemsSet.add(value);
            }
        } else if (typeof item[type] === 'string') {
            itemsSet.add(item[type]);
        }
    }
    return Array.from(itemsSet);
};


// Data listes des collapses par id //
const renderSection = (sectionId, sectionData) => {
    const dropdownHTML = createDropdown(sectionData, sectionId);
    collapseContainer.innerHTML += dropdownHTML;
};


// Fonction pour gérer le clic sur un élément li de la liste de chaque collapse affichage des tags //
// eslint-disable-next-line no-unused-vars
const listCollapseClick = (tag, sectionId) => {
    const tagList = document.getElementById(`tag-list-${sectionId}`);
    tagList.innerHTML = `${tag}<img src="./assets/icons/XCloseItem.png" class="x-selection" id="x-selection-${sectionId}" alt="Croix de fermeture selection">`;
    tagList.style.display = 'flex';

    addNewTxtTag(tag, sectionId);

    const xLi = document.getElementById(`x-selection-${sectionId}`);
    xLi.addEventListener('click', () => {
        tagList.style.display = 'none';
    });

     // Filtre les recettes en fonction des tags sélectionnés //
    const filterRecipesByTags = (sectionId) => {
        // Sélection des tags //
        const allSelectedTags = document.querySelectorAll(`#tag-list-${sectionId}`);
        const allSelectedTagValues = Array.from(allSelectedTags).map(tag => tag.innerText.toLowerCase());
    
        // Filtrage des recettes //
        const doublyFilteredRecipes = filteredRecipes.filter(recipe => {
            const ingredientTags = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
            const applianceTags = [recipe.appliance.toLowerCase()];
            const ustensilTags = recipe.ustensils.map(ustensil => ustensil.toLowerCase());
    
            for (let i = 0; i < allSelectedTagValues.length; i++) {
                const tag = allSelectedTagValues[i];
                if (
                    ingredientTags.includes(tag) ||
                    applianceTags.includes(tag) ||
                    ustensilTags.includes(tag)
                ) {
                    return true; // Si au moins un tag est trouvé, retourne true //
                }
            }
            return false; // Si aucun tag n'est trouvé, retourne false //
        });
    
        // Affichage des recettes filtrées //
        renderRecipes(doublyFilteredRecipes);
    };
    // Appel de la fonction pour filtrer les recettes //
    filterRecipesByTags(sectionId);
};

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

    // Utilisation d'une boucle for pour éviter une répétition de code //
    const tagContainerIds = {
        'Ingredients': 'ulTagIngredients',
        'Appareils': 'ulTagAppliances',
        'Ustensiles': 'ulTagUstensils',
    };

    tagContainer = tagContainerIds[tagType] && document.getElementById(tagContainerIds[tagType]);

    if (!tagContainer) {
        console.error('Type de tag non reconnu');
        return;
    }

    // Création nouvel élément txtTag //
    const newTxtTag = document.createElement('span');
    newTxtTag.className = 'txt-tag';
    newTxtTag.innerHTML = `${tag}<strong class="fa-solid fa-xmark"></strong>`;

    // Ajout du nouvel élément txtTag au conteneur ul //
    tagContainer.appendChild(newTxtTag);

    // Affiche le tag //
    tagContainer.style.display = 'flex';

    const removeRecipesByTag = (sectionId, tag) => {
        const allSelectedTags = document.querySelectorAll(`#tag-list-${sectionId}`);
        const allSelectedTagValues = Array.from(allSelectedTags).map(tag => tag.innerText.toLowerCase());
        
        // Utilisation filteredRecipes et modifie pour exclure les recettes associées au tag //
        filteredRecipes = filteredRecipes.filter(recipe => {
            const ingredientTags = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
            const applianceTags = [recipe.appliance.toLowerCase()];
            const ustensilTags = recipe.ustensils.map(ustensil => ustensil.toLowerCase());
    
            for (let i = 0; i < allSelectedTagValues.length; i++) {
                const selectedTag = allSelectedTagValues[i];
    
                if (
                    (selectedTag === 'ingredients' && ingredientTags.includes(tag.toLowerCase())) ||
                    (selectedTag === 'appareils' && applianceTags.includes(tag.toLowerCase())) ||
                    (selectedTag === 'ustensiles' && ustensilTags.includes(tag.toLowerCase()))
                ) {
                    return false; // Si le tag correspond, n'inclut pas la recette //
                }
            }
    
            return true; // Si aucun tag correspond, inclut la recette //
        });
    
        // Met à jour l'affichage des recettes //
        renderRecipes(filteredRecipes);
    };
    
    // Ajout gestionnaire d'événements pour le clic sur la croix de fermeture du tag hors du collapse //
    const xClose = newTxtTag.querySelector('.fa-xmark');
    xClose.addEventListener('click', () => {
        newTxtTag.style.display = 'none';
        removeRecipesByTag(tagType, tag);
    });
};

// Filtrage input collapse //
const filterDropdown = (sectionId) => {
    const searchInput = document.getElementById(`search-drop-${sectionId}`);
    const listItems = document.querySelectorAll(`#collapseExemple-${sectionId} .list-drop .filterable-item`);

    const searchTerm = searchInput.value.toLowerCase();

    for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i];
        const itemText = item.innerText.toLowerCase();
        const isVisible = itemText.includes(searchTerm);
        item.style.display = isVisible ? 'block' : 'none';
    }
};
filterDropdown;

// Les éléments collapses //
const createDropdown = (data, sectionId) => {
    // Fonction pour ouvrir un collapse spécifique //
    function openCollapse(sectionId) {
        // Ferme tous les autres collapses //
        const allCollapseElements = document.querySelectorAll('.collapse');
        for (let i = 0; i < allCollapseElements.length; i++) {
            const collapseElement = allCollapseElements[i];
            // eslint-disable-next-line no-undef
            const bsCollapse = new bootstrap.Collapse(collapseElement);
            bsCollapse.hide();
        }

        // Ouvre le collapse spécifique //
        const specificCollapseElement = document.getElementById(`collapseExemple-${sectionId}`);
        // eslint-disable-next-line no-undef
        const specificBsCollapse = new bootstrap.Collapse(specificCollapseElement);
        specificBsCollapse.show();
    }

    // Ajout événement pour chaque bouton collapse //
    const buttons = document.querySelectorAll('.btn-primary');
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section-id');
            openCollapse(sectionId);
        });
    }

    const itemsArray = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const listItem = `<li tabindex="0" class="dropdown-item filterable-item" href="#" id="item-${sectionId}-${item}" data-item="${item}" onclick="listCollapseClick('${item}', '${sectionId}')">${item}</li>`;
        itemsArray.push(listItem);
    }
    
    return `
        <p class="dropdown">
            <button class="btn btn-primary" type="button id="dropdownMenuButton-${sectionId}" data-bs-toggle="collapse" href="#collapseExemple-${sectionId}" role="button" aria-expanded="false" aria-controls="collapseExample"  aria-label="Bouton${sectionId}">
                ${sectionId}
                <strong class ="fa-solid fa-chevron-down"></strong>
            </button>
        </p>
        <div class="dropdown-menu collapse" id="collapseExemple-${sectionId}">
            <div class="form-group">
                <input type="text" class="form-control" id="search-drop-${sectionId}" aria-label="Champs de recherche" oninput="filterDropdown('${sectionId}')">
                <strong class="fa-solid fa-magnifying-glass"></strong>
            </div>
            <span class="dropdown-item tag-list filterable-tag" id="tag-list-${sectionId}" href="#"><img src="./assets/icons/XCloseItem.png"  alt ="Croix de fermeture selection"></span>
            <ul class="list-drop" data-section-data='${JSON.stringify(data)}'>
                ${itemsArray.join('')}
            </ul>
        </div>`;
    };
// rendu initial avec listes complètes //
renderCollapse();








