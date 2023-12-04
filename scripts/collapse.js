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
                renderSection('ingredients', allIngredients);
                renderSection('appareils', allAppareils);
                renderSection('ustensiles', allUstensils);
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
const getAllValues = (data, key) => {
    const itemsSet = new Set();
    data.forEach(item => {
        if (Array.isArray(item[key])) {
            item[key].forEach(value => itemsSet.add(value));
        } else if (typeof item[key] === 'string') {
            itemsSet.add(item[key]);
        }
    });
    return Array.from(itemsSet);
};

// Data listes des collapses par id //
const renderSection = (sectionId, sectionData) => {
    const dropdownHTML = createDropdown(sectionData, sectionId);
    collapseContainer.innerHTML += dropdownHTML;
};


// Fonction pour gérer le clic sur un élément li de la liste de chaque collapse affichage des tags//
const handleItemClick = (item, sectionId) => {
    const tagList = document.getElementById(`tag-list-${sectionId}`); // Met à jour le tagList interieur collapse //
    tagList.innerHTML = `${item}<img src="./assets/icons/XCloseItem.png" class="x-selection" id="x-selection-${sectionId}" alt="Croix de fermeture selection">`;
    tagList.style.display = item ? 'flex' : 'none'; // Affiche le tagList //
    // Ajout nouveau txtTag hors collapse pour chaque élément liste sélectionné //
    addNewTxtTag(item);
    // Pour disparition tagList interieur collapse, click X //
    const xLi = document.getElementById(`x-selection-${sectionId}`);
    xLi.addEventListener('click', () => {    
        tagList.style.display = item ? 'none' : 'flex';
    });
};


// Fonction pour ajouter un nouveau txtTag hors du collapse //
const addNewTxtTag = (item) => {
    const txtTagContainer = document.querySelector('.tag'); // Mettez à jour le sélecteur //

    // Création nouvel élément txtTag //
    const newTxtTag = document.createElement('li');
    newTxtTag.className = 'txt-tag';
    newTxtTag.innerHTML = `${item}<strong class ="fa-solid fa-xmark"></strong>`;

    // Ajout du nouvel élément txtTag au conteneur ul //
    txtTagContainer.appendChild(newTxtTag);

    // Affiche le tag //
    txtTagContainer.style.display = 'flex';
    // Ajout gestionnaire d'événements pour le clic sur la croix de fermeture tu teg hors collapse //
    const xClose = newTxtTag.querySelector('.fa-xmark');
    xClose.addEventListener('click', () => {    
        newTxtTag.style.display="none";
    });
};

const createDropdown = (data, sectionId) => {
    const itemsArray = data.map(item => `<li class="dropdown-item" href="#" id="item-${sectionId}-${item}" data-item="${item}" onclick="handleItemClick('${item}', '${sectionId}')">${item}</li>`);
    console.log(itemsArray)
    return `
    <div class="dropdown">
        <a href="#" role="button" class="nav-link dropdown-toggle" type="button" id="dropdownMenuButton-${sectionId}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="Bouton${sectionId}">
            ${sectionId}
            <strong class ="fa-solid fa-chevron-down"></strong>
        </a>
        <div class="dropdown-menu">
            <div class="form-group">
                <input type="text" class="form-control" id="search-drop-${sectionId}" aria-label="Champs de recherche">
                <strong class="fa-solid fa-magnifying-glass"></strong>
            </div>
            <span class="dropdown-item tag-list" id="tag-list-${sectionId}" href="#">Lait de coco<img src="./assets/icons/XCloseItem.png" class  "x-selection" alt ="Croix de fermeture selection"></span>
            <ul class="list-drop" data-section-data='${JSON.stringify(data)}'>
                ${itemsArray.join('')}
            </ul>
        </div>
    </div>`;
};

// rendu initial //
renderCollapse();











