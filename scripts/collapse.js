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
const handleItemClick = (item, sectionId) => {
    const tagList = document.getElementById(`tag-list-${sectionId}`);
    tagList.innerHTML = `${item}<img src="./assets/icons/XCloseItem.png" class="x-selection" id="x-selection-${sectionId}" alt="Croix de fermeture selection">`;
    tagList.style.display = item ? 'flex' : 'none';

    addNewTxtTag(item, sectionId);

    const xLi = document.getElementById(`x-selection-${sectionId}`);
    xLi.addEventListener('click', () => {
        tagList.style.display = 'none';
        renderRecipes(filteredRecipes);
    });

     // Filtre les recettes en fonction des tags sélectionnés //
    const allSelectedTags = document.querySelectorAll('.filterable-tag');
    const allSelectedTagValues = Array.from(allSelectedTags).map(tag => tag.innerText.toLowerCase());

    // Création copie de la liste complète des recettes déjà filtrée //
    const originalRecipes = [...filteredRecipes];

    // Applique le deuxième niveau de filtrage directement sur filteredRecipes //
    const doublyFilteredRecipes = [];
    for (let i = 0; i < originalRecipes.length; i++) {
        const recipe = originalRecipes[i];

        // Déclaration des tableaux de base //
        const ingredientTags = [];
        const applianceTags = [];
        const ustensilTags = [];

        // Remplissage des tableaux avec les valeurs correspondantes //
        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingredient = recipe.ingredients[j];
            ingredientTags.push(ingredient.ingredient.toLowerCase());
        }

        applianceTags.push(recipe.appliance.toLowerCase());

        for (let k = 0; k < recipe.ustensils.length; k++) {
            const ustensil = recipe.ustensils[k];
            ustensilTags.push(ustensil.toLowerCase());
        }

        // Logique de filtrage //
        if (
            allSelectedTagValues.some(tag => ingredientTags.includes(tag)) ||
            allSelectedTagValues.includes(applianceTags) ||
            allSelectedTagValues.some(tag => ustensilTags.includes(tag))
        ) {
            doublyFilteredRecipes.push(recipe);
        }
    }

    // Affiche les recettes filtrées après les deux niveaux de filtrage //
    renderRecipes(doublyFilteredRecipes);
};


// Fonction pour ajouter un nouveau txtTag dans le conteneur approprié //
const addNewTxtTag = (item, tagType) => {
    // Sélection du conteneur approprié en fonction du type de tag //
    let tagContainer;

    // Utilisation d'une boucle for pour éviter une répétition de code //
    const tagContainerIds = {
        'Ingredients': 'ulTagIngredients',
        'Appareils': 'ulTagAppliances',
        'Ustensiles': 'ulTagUstensils',
    };

    for (const type in tagContainerIds) {
        if (tagContainerIds.hasOwnProperty(type) && type === tagType) {
            tagContainer = document.getElementById(tagContainerIds[type]);
            break;
        }
    }

    if (!tagContainer) {
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


// Les éléments collapses //
const createDropdown = (data, sectionId) => {
    // Fonction pour ouvrir un collapse spécifique //
    function openCollapse(sectionId) {
        // Fermer tous les autres collapses //
        const allCollapseElements = document.querySelectorAll('.collapse');
        for (let i = 0; i < allCollapseElements.length; i++) {
            const collapseElement = allCollapseElements[i];
            const bsCollapse = new bootstrap.Collapse(collapseElement);
            bsCollapse.hide();
        }


        // Ouvrir le collapse spécifique //
        const specificCollapseElement = document.getElementById(`collapseExemple-${sectionId}`);
        const specificBsCollapse = new bootstrap.Collapse(specificCollapseElement);
        specificBsCollapse.show();
    }

    // Ajout événement pour chaque bouton //
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
        const listItem = `<li class="dropdown-item filterable-item" href="#" id="item-${sectionId}-${item}" data-item="${item}" onclick="handleItemClick('${item}', '${sectionId}')">${item}</li>`;
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








