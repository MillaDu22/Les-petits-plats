/************************************* Cartes recettes premier filtrage ******************************/
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

let filteredRecipes = [];
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


/************************************* Collapses second filtrage ******************************/

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
    data.forEach(item => {
        if (Array.isArray(item.ingredients)) {
            item.ingredients.forEach(ingredient => {
                itemsSet.add(ingredient.ingredient);
            });
        }
    });
    return Array.from(itemsSet);
};

// Obtention lists Ustensils et Appareils //
const getAllValues = (data, type) => {
    const itemsSet = new Set();
    data.forEach(item => {
        if (Array.isArray(item[type])) {
            item[type].forEach(value => itemsSet.add(value));
        } else if (typeof item[type] === 'string') {
            itemsSet.add(item[type]);
        }
    });
    return Array.from(itemsSet);
};


// Data listes des collapses par id //
const renderSection = (sectionId, sectionData) => {
    const dropdownHTML = createDropdown(sectionData, sectionId);
    collapseContainer.innerHTML += dropdownHTML;
};

// Fonction pour gérer le clic sur un élément li de la liste de chaque collapse affichage des tags //
// eslint-disable-next-line no-unused-vars
const listCollapseClick = (item, sectionId) => {
    const tagList = document.getElementById(`tag-list-${sectionId}`); // Met à jour le tagList interieur collapse //
    tagList.innerHTML = `${item}<img src="./assets/icons/XCloseItem.png" class="x-selection" id="x-selection-${sectionId}" alt="Croix de fermeture selection">`;
    tagList.style.display = 'flex'; // Affiche le tagList //
    // Appel fonction nouveau txtTag hors collapse pour chaque élément liste sélectionné dans son container aproprié //
    addNewTxtTag(item, sectionId);

    // Pour disparition tagList interieur collapse, click X //
    const xLi = document.getElementById(`x-selection-${sectionId}`);
    xLi.addEventListener('click', () => {    
        tagList.style.display ='none';
        renderRecipes(filteredRecipes);
    });

    xLi.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            tagList.style.display = 'none';
            renderRecipes(filteredRecipes);
        }
    });
    xLi.tabIndex = 0;

    // Creation tableau après premier filtrage //
    const originalRecipes = [...filteredRecipes];
     // Filtre les recettes en fonction des tags sélectionnés //
    const allSelectedTags = document.querySelectorAll('.filterable-tag');
    const allSelectedTagValues = Array.from(allSelectedTags).map(tag => tag.innerText.toLowerCase());
    // Création copie de la liste complète des recettes déja filtrée //
    const currentRecipes = [...originalRecipes];
    // Applique le deuxième niveau de filtrage directement sur filteredRecipes //
    const doublyFilteredRecipes = currentRecipes.filter(recipe => {
        // Déclaration des tableaux de base //
        const ingredientTags = [];
        const applianceTags = [];
        const ustensilTags = [];

        // Remplissage des tableaux avec les valeurs correspondantes //
        recipe.ingredients.forEach(ingredient => {
            ingredientTags.push(ingredient.ingredient.toLowerCase());
        });
        applianceTags.push(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(ustensil => {
            ustensilTags.push(ustensil.toLowerCase());
        });

        // Logique de filtrage //
        return allSelectedTagValues.some(tag => ingredientTags.includes(tag)) ||
            allSelectedTagValues.includes(applianceTags) ||
            allSelectedTagValues.some(tag => ustensilTags.includes(tag));
    });
    // Affiche les recettes filtrées après les deux niveaux de filtrage //
    renderRecipes(doublyFilteredRecipes);
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
const addNewTxtTag = (item, tagType) => {
    // Sélection du conteneur approprié en fonction du type de tag //
    let tagContainer;

    if (tagType === 'Ingredients') {
        tagContainer = document.getElementById('ulTagIngredients');
    } else if (tagType === 'Appareils') {
        tagContainer = document.getElementById('ulTagAppliances');
    } else if (tagType === 'Ustensiles') {
        tagContainer = document.getElementById('ulTagUstensils');
    } else {
        // Gérer le cas où le type de tag n'est pas reconnu
        console.error('Type de tag non reconnu');
        return;
    }

    // Création nouvel élément txtTag //
    const newTxtTag = document.createElement('span');
    newTxtTag.className = 'txt-tag';
    newTxtTag.innerHTML = `${item}<strong class="fa-solid fa-xmark"></strong>`;

    // Ajout du nouvel élément txtTag au conteneur ul //
    tagContainer.appendChild(newTxtTag);

    // Affiche le tag //
    tagContainer.style.display = 'flex';

    // Ajout gestionnaire d'événements pour le clic sur la croix de fermeture du tag hors du collapse //
    const xClose = newTxtTag.querySelector('.fa-xmark');
    xClose.addEventListener('click', () => {
        newTxtTag.style.display = 'none';
        renderRecipes(filteredRecipes);
    });

    xClose.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            newTxtTag.style.display = 'none';
            renderRecipes(filteredRecipes);
        }
    });
    xClose.tabIndex = 0;
};

// Filtrage input collapse //
const filterDropdown = (sectionId) => {
    const searchInput = document.getElementById(`search-drop-${sectionId}`);
    const listItems = document.querySelectorAll(`#collapseExemple-${sectionId} .list-drop .filterable-item`);

    const searchTerm = searchInput.value.toLowerCase();

    listItems.forEach(item => {
        const itemText = item.innerText.toLowerCase();
        const isVisible = itemText.includes(searchTerm);
        item.style.display = isVisible ? 'block' : 'none';
    });
};
filterDropdown;

// Les éléments collapses //
const createDropdown = (data, sectionId) => {
    // Fonction pour ouvrir un collapse spécifique //
    function openCollapse(sectionId) {
        // Fermer tous les autres collapses
        const allCollapseElements = document.querySelectorAll('.collapse');
        allCollapseElements.forEach(collapseElement => {
            // eslint-disable-next-line no-undef
            const bsCollapse = new bootstrap.Collapse(collapseElement);
            bsCollapse.hide();
        });

        // Ouvrir le collapse spécifique //
        const specificCollapseElement = document.getElementById(`collapseExemple-${sectionId}`);
        // eslint-disable-next-line no-undef
        const specificBsCollapse = new bootstrap.Collapse(specificCollapseElement);
        specificBsCollapse.show();
    }

    // Ajout événement pour chaque bouton //
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section-id');
            openCollapse(sectionId);
        });
    });

    const itemsArray = data.map(item => `<li class="dropdown-item filterable-item" href="#" id="item-${sectionId}-${item}" data-item="${item}" onclick="listCollapseClick('${item}', '${sectionId}')">${item}</li>`);
    return `
    <p class="dropdown">
        <button class="btn btn-primary" type="button id="dropdownMenuButton-${sectionId}" data-bs-toggle="collapse" href="#collapseExemple-${sectionId}" role="button" aria-expanded="false" aria-controls="collapseExample"  aria-label="Bouton${sectionId}">
            ${sectionId}
            <strong class ="fa-solid fa-chevron-down" id="chevron-${sectionId}"></strong>
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











