/************************************* Cartes recettes premier filtrage ******************************/
const url = "./data/data.json";
const gallery = document.getElementById('gallery');
let allRecipes = [];
let filteredRecipes = [];
let allSelectedTags =[];
let allSelectedTagValues = [];
let filteredRecipesByTags =[];
let recipesToFilter =[]

const renderRecipes = (recipes) => {
    // Retire le contenu existant de la galerie
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }

    // Ajoute chaque recette à la galerie //
    recipes.forEach(recipe => {
        // Crée la figure //
        const figure = document.createElement('figure');
        figure.classList.add('card');

        // Crée l'image //
        const image = document.createElement('img');
        image.src = `./assets/images/${recipe.image}`;
        image.classList.add('img-recipe');
        image.alt = `Image de la recette : ${recipe.name}`;

        // Crée la durée de la recette //
        const spanTime = document.createElement('span');
        spanTime.classList.add('span-time');
        spanTime.textContent = `${recipe.time}min`;

        // Crée le titre de la recette //
        const titleRecipe = document.createElement('h3');
        titleRecipe.classList.add('title-recipe');
        titleRecipe.textContent = recipe.name;

        // Crée le sous-titre RECETTE //
        const subtitleRecipe = document.createElement('h4');
        subtitleRecipe.classList.add('subtitle-recipe');
        subtitleRecipe.textContent = 'RECETTE';

        // Crée la description de la recette //
        const description = document.createElement('p');
        description.classList.add('description');
        description.textContent = recipe.description;

        // Crée le sous-titre INGREDIENTS //
        const subtitleIngredients = document.createElement('h5');
        subtitleIngredients.classList.add('subtitle-ingredients');
        subtitleIngredients.textContent = 'INGREDIENTS';

        // Crée la liste des ingrédients //
        const ingredientsList = document.createElement('ul');
        ingredientsList.classList.add('ingredients-list');

        // Ajoute chaque ingrédient à la liste //
        recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            ingredientItem.classList.add('ingredient');

            const nameIngredient = document.createElement('p');
            nameIngredient.classList.add('name-ingredient');
            nameIngredient.textContent = ingredient.ingredient;

            const quantity = document.createElement('p');
            quantity.classList.add('quantity');
            quantity.textContent = `${ingredient.quantity}${ingredient.unit ? ingredient.unit : ''}`;

            // Ajoute les éléments à l'élément d'ingrédient //
            ingredientItem.appendChild(nameIngredient);
            ingredientItem.appendChild(quantity);

            // Ajoute l'élément d'ingrédient à la liste des ingrédients //
            ingredientsList.appendChild(ingredientItem);
        });

        // Ajoute tous les éléments à la figure //
        figure.appendChild(image);
        figure.appendChild(spanTime);
        figure.appendChild(titleRecipe);
        figure.appendChild(subtitleRecipe);
        figure.appendChild(description);
        figure.appendChild(subtitleIngredients);
        figure.appendChild(ingredientsList);

        // Ajoute la figure à la galerie //
        gallery.appendChild(figure);
    });
};

const filterRecipes = (search) => {
    filteredRecipes= [...allRecipes]
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

// Changement de loop au survol //
// Récupére l'élément avec la classe 'black' //
const blackLoop = document.querySelector('.black');

// Ajout gestionnaire d'événements pour le survol //
blackLoop.addEventListener('mouseover', function () {
    // Change la source de l'image lors du survol //
    blackLoop.src = "./assets/icons/yellowloop.png";
});

// Ajout gestionnaire d'événements pour la sortie du survol //
blackLoop.addEventListener('mouseout', function () {
    // Retour à loop noire lors de la sortie du survol //
    blackLoop.src = "./assets/icons/Blackloop.png";
});

// pour afficher l'icone xmark au survol de l'input //
// Récupére l'élément container de l'input //
var searchBarContainer = document.querySelector('.box-input-loop');

// Ajout gestionnaire d'événements pour le survol du container de l'input //
searchBarContainer.addEventListener('mouseover', function () {
    // Affiche l'icône X lors du survol //
    document.getElementById('clear-input').style.display = 'inline-block';
});

// Ajout gestionnaire d'événements pour la sortie du survol du container de l'input //
searchBarContainer.addEventListener('mouseout', function () {
    // Cache l'icône X à la sortie du survol //
    document.getElementById('clear-input').style.display = 'none';
});

// Pour vider le champs input et réafficher toutes les recettes //
// Récupére l'élément avec l'ID 'clear-input' //
const clearInput = document.getElementById('clear-input');

// Récupére l'élément input //
const searchBar = document.getElementById('search-bar');

// Ajout gestionnaire d'événements pour le clic sur l'icône xmark //
clearInput.addEventListener('click', function () {
    // Vide le contenu de l'input //
    searchBar.value = '';
    renderRecipes(allRecipes);
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

/************************************* Collapses second filtrage *****************************************/

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
            const ingredientsDropdown = createDropdown(allIngredients, 'Ingredients');
            const appareilsDropdown = createDropdown(allAppareils, 'Appareils');
            const ustensilsDropdown = createDropdown(allUstensils, 'Ustensiles');

            // Append 3 dropdowns dans leur container //
            collapseContainer.appendChild(ingredientsDropdown);
            collapseContainer.appendChild(appareilsDropdown);
            collapseContainer.appendChild(ustensilsDropdown);

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

// Fonction pour gérer le clic sur un élément li de la liste de chaque collapse affichage des tags //
// eslint-disable-next-line no-unused-vars
const listCollapseClick = (tag, sectionId, tagType) => {
    // Fonction pour réinitialiser le champ de recherche //
    function resetSearchInput(sectionId) {
        const inputField = document.getElementById(`search-drop-${sectionId}`);
        if (inputField) {
            inputField.value = '';
        }
    }
    const tagList = document.getElementById(`tag-list-${sectionId}`); // Met à jour le tagList interieur collapse //
    tagList.innerHTML = `${tag}<img src="./assets/icons/XCloseItem.png" class="x-selection" id="x-selection-${sectionId}" alt="Croix de fermeture selection" tabindex=0>`;
    tagList.style.display = 'flex'; // Affiche le tagList //
    // Appel fonction nouveau txtTag hors collapse pour chaque élément liste sélectionné dans son container aproprié //
    addNewTxtTag(tag, sectionId, tagType);
    // Pour disparition tagList interieur collapse, click X //
    const xLi = document.getElementById(`x-selection-${sectionId}`);
    xLi.addEventListener('click', () => {    
        tagList.style.display ='none';
        // Réinitialise la valeur de l'input à une chaîne vide //
        resetSearchInput(sectionId);
        // Rechargement des listes initiales dans les collapses //
        filterDropdown(sectionId)
    }); 
    
    const filterRecipesByTags = () => {
        // Sélection des tags //
        allSelectedTags = document.querySelectorAll('.txt-tag');
        allSelectedTagValues = Array.from(allSelectedTags).map(tag => tag.textContent.toLowerCase());
        // Utilisation de filteredRecipes comme base pour le filtrage si déjà filtré depuis la première barre de recherche sinon allRecipes //
        recipesToFilter = filteredRecipes.length > 0 ? [...filteredRecipes] : [...allRecipes];
        // Applique chaque filtre successivement //
        allSelectedTagValues.forEach(tag => {
            recipesToFilter = recipesToFilter.filter(recipe => {
                const ingredientTags = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
                const applianceTags = [recipe.appliance.toLowerCase()];
                const ustensilTags = recipe.ustensils.map(ustensil => ustensil.toLowerCase());
                return (
                    ingredientTags.includes(tag) ||
                    applianceTags.includes(tag) ||
                    ustensilTags.includes(tag)
                );
            });
        });
        // Mets à jour filteredRecipesByTags //
        filteredRecipesByTags = recipesToFilter;
        // Affichage des recettes filtrées //
        renderRecipes(filteredRecipesByTags);
    };
    // Appel de la fonction pour filtrer les recettes par tags //
    filterRecipesByTags();
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
    newTxtTag.id = `txt-tag-${tagType}`;
    newTxtTag.innerHTML = `${tag}<strong class="fa-solid fa-xmark" tabindex = 0></strong>`;
    // Ajout du nouvel élément txtTag au conteneur ul //
    tagContainer.appendChild(newTxtTag);
    // Affiche le tag //
    tagContainer.style.display = 'flex';
    // Ajout gestionnaire d'événements pour le clic sur la croix de fermeture du tag hors du collapse //
    let xClose = newTxtTag.querySelector('.fa-xmark');

    xClose.addEventListener('click', () => {
        // Retire le tag du tableau allSelectedTagValues //
        const removedTag = newTxtTag.textContent.toLowerCase();
        allSelectedTagValues = allSelectedTagValues.filter(tag => tag !== removedTag);
        // Appel de removeRecipesByTags //
        removeRecipesByTags()
        newTxtTag.style.display = 'none';

        const tagListElements = document.getElementsByClassName('tag-list');        
        // Vérifie si des éléments avec la classe spécifiée existent //
        if (tagListElements.length > 0) {
            // Masque l élément avec la classe spécifiée //
            for (const tagListElement of tagListElements) {
                if (tagListElement.textContent.toLowerCase() === removedTag) {
                    tagListElement.style.display = 'none';
                    break; // Sort de la boucle une fois que l'élément est trouvé et masqué //
                }
            }
        } else {
            console.error(`No elements found with class 'tag-list'.`);
        }
    });
};

const removeRecipesByTags = () => {
    // Obtention de la liste des tags restants après la suppression //
    let removeAllSelectedTagValues = Array.from(allSelectedTags).map(tag => tag.textContent.toLowerCase());
    removeAllSelectedTagValues = [...allSelectedTagValues]
    // Utilisation soit allRecipes soit filteredRecipes comme base pour le filtrage //
    recipesToFilter = filteredRecipes.length > 0 ? [...filteredRecipes] : [...allRecipes];
    // Applique chaque filtre successivement pour retirer les recettes //
    recipesToFilter = recipesToFilter.filter(recipe => {
        const ingredientTags = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
        const applianceTags = [recipe.appliance.toLowerCase()];
        const ustensilTags = recipe.ustensils.map(ustensil => ustensil.toLowerCase());
        // Retourne true si le tag est présent, false sinon (inverse du filtrageByTags) //
        const isRecipeValid = removeAllSelectedTagValues.some(tag => 
            !ingredientTags.includes(tag) &&
            !applianceTags.includes(tag) &&
            !ustensilTags.includes(tag)
        );
        return !isRecipeValid;
    });
    // Met à jour filteredRecipesByTags //
    filteredRecipesByTags = recipesToFilter;
    // Affichage des recettes refiltrées //
    renderRecipes(filteredRecipesByTags);
}

// Filtrage input collapse //
const filterDropdown = (sectionId) => {
    const searchInput = document.getElementById(`search-drop-${sectionId}`);
    const listItems = document.querySelectorAll(`#collapseExemple-${sectionId} .list-drop .filterable-item`);
    const searchTerm = searchInput.value.toLowerCase();

    listItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        const isVisible = itemText.includes(searchTerm);
        item.style.display = isVisible ? 'block' : 'none';
    });
};
filterDropdown;

// Les éléments collapses //
const createDropdown = (data, sectionId) => {
    // Fonction pour ouvrir un collapse spécifique //
    function openCollapse(sectionId) {
        // Ferme tous les autres collapses //
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
    // Creation des elements collapses //
    const dropdownContainer = document.createElement('p');
    dropdownContainer.classList.add('dropdown');
    // Le bouton //
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('type', 'button');
    button.setAttribute('id', `dropdownMenuButton-${sectionId}`);
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#collapseExemple-${sectionId}`);
    button.setAttribute('role', 'button');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `collapseExemple-${sectionId}`);
    button.setAttribute('aria-label', `Bouton${sectionId}`);
    button.setAttribute('data-section-id', sectionId);

    const buttonText = document.createTextNode(sectionId);
    const chevronIcon = document.createElement('strong');
    chevronIcon.classList.add('fa-solid', 'fa-chevron-down');
    chevronIcon.setAttribute('id', `chevron-${sectionId}`);

    button.appendChild(buttonText);
    button.appendChild(chevronIcon);

    dropdownContainer.appendChild(button);

    const collapseDiv = document.createElement('div');
    collapseDiv.classList.add('dropdown-menu', 'collapse');
    collapseDiv.setAttribute('id', `collapseExemple-${sectionId}`);
    // Champs de recherche du collapse //
    const formGroup = document.createElement('div');
    formGroup.classList.add('form-group');

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.classList.add('form-control');
    input.setAttribute('id', `search-drop-${sectionId}`);
    input.setAttribute('aria-label', 'Champs de recherche');
    input.addEventListener('input', () => filterDropdown(sectionId));

    const magnifyingGlass = document.createElement('strong');
    magnifyingGlass.classList.add('fa-solid', 'fa-magnifying-glass');

    formGroup.appendChild(input);
    formGroup.appendChild(magnifyingGlass);

    collapseDiv.appendChild(formGroup);
    // Tag de selectiob interne au collapse //
    const tagList = document.createElement('span');
    tagList.classList.add('dropdown-item', 'tag-list', 'filterable-tag');
    tagList.setAttribute('id', `tag-list-${sectionId}`);
    tagList.setAttribute('tabindex', '0');
    // X de fermeture de selection //
    const closeItemImage = document.createElement('img');
    closeItemImage.setAttribute('src', './assets/icons/XCloseItem.png');
    closeItemImage.setAttribute('alt', 'Croix de fermeture selection');
    closeItemImage.setAttribute('tabindex', '0');

    tagList.appendChild(closeItemImage);
    collapseDiv.appendChild(tagList);
    // Liste //
    const itemList = document.createElement('ul');
    itemList.classList.add('list-drop');
    itemList.setAttribute('data-section-data', JSON.stringify(data));
    // Elements de liste clickable, selection //
    data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('dropdown-item', 'filterable-item');
        listItem.setAttribute('tabindex', '0');
        listItem.setAttribute('role', 'button');
        listItem.setAttribute('href', '#');
        listItem.setAttribute('id', `item-${sectionId}-${item}`);
        listItem.setAttribute('data-item', item);
        listItem.addEventListener('click', () => listCollapseClick(item, sectionId));
        listItem.textContent = item;

        itemList.appendChild(listItem);
    });

    collapseDiv.appendChild(itemList);
    dropdownContainer.appendChild(collapseDiv);

    return dropdownContainer;
};
// rendu initial avec listes complètes //
renderCollapse();


