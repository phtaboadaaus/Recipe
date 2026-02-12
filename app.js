const DB_NAME = 'recipeAppDB';
const DB_VERSION = 1;
const STORE_RECIPES = 'recipes';
const STORE_SETTINGS = 'settings';
const STORE_SHOPPING = 'shopping';
const STORE_CATEGORIES = 'categories';
let originalIngredientsForRecalc = [];



let db = null;
let currentLanguage = 'es';



const i18n = {
    es: {
        fav:"Solo Favoritos",
        etiqueta:"rápido, horno, vegano...",
        ingredientes:"200 g de pasta; 2 huevos; 1 cebolla...",
        pasos:"1. Paso uno;\n2. Paso dos...",
        buscaingre:"Tortilla, pasta, chocolate...",
        buscagene:"patata, huevo, cebolla",
        select_file: "Seleccionar archivo",
        select_backup: "Seleccionar archivo de respaldo",
        app_title: 'Mi Recetario',
        nav_recipes: 'Recetas',
        nav_search: 'Buscar',
        nav_shopping: 'Lista de compra',
        nav_backup: 'Backup / Importar',
        nav_settings: 'Ajustes',
        recipes_title: 'Recetas',
        btn_new_recipe: 'Nueva receta',
        label_filter_category: 'Categoría:',
        label_sort_by: 'Ordenar por:',
        sort_name: 'Nombre',
        sort_difficulty: 'Dificultad',
        sort_time: 'Tiempo',
        sort_ingredients_count: 'Nº ingredientes',
        search_title: 'Buscar / Sugerencias',
        search_general_title: 'Búsqueda general',
        search_text_label: 'Texto (nombre, etiquetas, ingredientes):',
        btn_search: 'Buscar',
        search_ingredients_title: 'Buscar por ingredientes disponibles',
        search_ingredients_label: 'Ingredientes (separados por coma):',
        search_mode_label: 'Modo:',
        search_mode_all: 'Debe contener todos',
        search_mode_any: 'Debe contener al menos uno',
        sort_relevance: 'Relevancia',
        shopping_title: 'Lista de compra',
        btn_clear_shopping: 'Vaciar lista',
        backup_title: 'Backup / Importar / Exportar',
        backup_export_all_title: 'Exportar recetario completo',
        btn_export_all_json: 'Exportar JSON',
        btn_export_all_pdf: 'Exportar PDF',
        backup_import_all_title: 'Importar recetario completo',
        btn_import_all_json: 'Importar JSON',
        backup_import_single_title: 'Importar receta individual',
        btn_import_recipe_json: 'Importar receta',
        settings_title: 'Ajustes',
        settings_language_title: 'Idioma',
        settings_language_label: 'Idioma de la interfaz:',
        settings_theme_title: 'Tema',
        settings_theme_label: 'Tema:',
        theme_light: 'Claro',
        theme_dark: 'Oscuro',
        modal_new_recipe: 'Nueva receta',
        recipe_name_label: 'Nombre:',
        recipe_category_label: 'Categoría:',
        recipe_servings_label: 'Porciones base:',
        recipe_time_label: 'Tiempo (minutos):',
        recipe_difficulty_label: 'Dificultad:',
        difficulty_easy: 'Fácil',
        difficulty_medium: 'Media',
        difficulty_hard: 'Difícil',
        recipe_tags_label: 'Etiquetas (coma):',
        recipe_image_label: 'Foto:',
        recipe_ingredients_label: 'Ingredientes:',
        recipe_ingredients_help: 'Un ingrediente por línea o separado por punto y coma.',
        recipe_steps_label: 'Pasos:',
        recipe_notes_label: 'Notas:',
        recipe_recalc_label: 'Recalcular porciones:',
        recipe_recalc_help: 'Solo visual, no se guarda.',
        btn_save_recipe: 'Guardar',
        btn_delete_recipe: 'Eliminar',
        btn_add_category: 'Añadir categoría',
        card_edit: 'Editar',
        card_add_to_shopping: 'Añadir a lista',
        card_export_json: 'Exportar JSON',
        card_export_pdf: 'Exportar PDF',
        card_share: 'Compartir',
        confirm_delete_recipe: '¿Seguro que quieres eliminar esta receta?',
        alert_import_ok: 'Importación completada.',
        alert_import_error: 'Error al importar JSON.',
        alert_no_recipes: 'No hay recetas.',
        alert_shopping_cleared: 'Lista de compra vaciada.',
        alert_recipe_saved: 'Receta guardada.',
        alert_recipe_deleted: 'Receta eliminada.',
        alert_backup_export_ok: 'Backup exportado.',
        alert_invalid_file: 'Archivo no válido.',
        alert_no_results: 'Sin resultados.'
    },
    en: {
        fav:"Only Favorites",
        etiqueta:"Quick, Oven, Vegan...",
        ingredientes:"200g of pasta; 2 eggs; 1 onion...",
        pasos:"1. Step one;\n2. Step two...",
        buscaingre:"Tortilla, pasta, chocolate...",
        buscagene:"potato, egg, onion",
        select_file: "Choose file",
        select_backup: "Choose backup file",
        app_title: 'My Cookbook',
        nav_recipes: 'Recipes',
        nav_search: 'Search',
        nav_shopping: 'Shopping list',
        nav_backup: 'Backup / Import',
        nav_settings: 'Settings',
        recipes_title: 'Recipes',
        btn_new_recipe: 'New recipe',
        label_filter_category: 'Category:',
        label_sort_by: 'Sort by:',
        sort_name: 'Name',
        sort_difficulty: 'Difficulty',
        sort_time: 'Time',
        sort_ingredients_count: 'Ingredients count',
        search_title: 'Search / Suggestions',
        search_general_title: 'General search',
        search_text_label: 'Text (name, tags, ingredients):',
        btn_search: 'Search',
        search_ingredients_title: 'Search by available ingredients',
        search_ingredients_label: 'Ingredients (comma separated):',
        search_mode_label: 'Mode:',
        search_mode_all: 'Must contain all',
        search_mode_any: 'Must contain at least one',
        sort_relevance: 'Relevance',
        shopping_title: 'Shopping list',
        btn_clear_shopping: 'Clear list',
        backup_title: 'Backup / Import / Export',
        backup_export_all_title: 'Export full cookbook',
        btn_export_all_json: 'Export JSON',
        btn_export_all_pdf: 'Export PDF',
        backup_import_all_title: 'Import full cookbook',
        btn_import_all_json: 'Import JSON',
        backup_import_single_title: 'Import single recipe',
        btn_import_recipe_json: 'Import recipe',
        settings_title: 'Settings',
        settings_language_title: 'Language',
        settings_language_label: 'Interface language:',
        settings_theme_title: 'Theme',
        settings_theme_label: 'Theme:',
        theme_light: 'Light',
        theme_dark: 'Dark',
        modal_new_recipe: 'New recipe',
        recipe_name_label: 'Name:',
        recipe_category_label: 'Category:',
        recipe_servings_label: 'Base servings:',
        recipe_time_label: 'Time (minutes):',
        recipe_difficulty_label: 'Difficulty:',
        difficulty_easy: 'Easy',
        difficulty_medium: 'Medium',
        difficulty_hard: 'Hard',
        recipe_tags_label: 'Tags (comma):',
        recipe_image_label: 'Photo:',
        recipe_ingredients_label: 'Ingredients:',
        recipe_ingredients_help: 'One ingredient per line or separated by semicolon.',
        recipe_steps_label: 'Steps:',
        recipe_notes_label: 'Notes:',
        recipe_recalc_label: 'Recalculate servings:',
        recipe_recalc_help: 'Visual only, not saved.',
        btn_save_recipe: 'Save',
        btn_delete_recipe: 'Delete',
        btn_add_category: 'Add category',
        card_edit: 'Edit',
        card_add_to_shopping: 'Add to list',
        card_export_json: 'Export JSON',
        card_export_pdf: 'Export PDF',
        card_share: 'Share',
        confirm_delete_recipe: 'Are you sure you want to delete this recipe?',
        alert_import_ok: 'Import completed.',
        alert_import_error: 'Error importing JSON.',
        alert_no_recipes: 'No recipes.',
        alert_shopping_cleared: 'Shopping list cleared.',
        alert_recipe_saved: 'Recipe saved.',
        alert_recipe_deleted: 'Recipe deleted.',
        alert_backup_export_ok: 'Backup exported.',
        alert_invalid_file: 'Invalid file.',
        alert_no_results: 'No results.'
    }
};

const DEFAULT_CATEGORIES = ['Desayunos', 'Comidas', 'Postres', 'Bebidas'];

document.addEventListener('DOMContentLoaded', () => {
    initDB().then(() => {
        initUI();
        loadSettings().then(applySettings);
        loadCategories();
        loadRecipes();
        loadShoppingList();
        registerServiceWorker();
    });
});

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const dbUpgrade = event.target.result;

            if (!dbUpgrade.objectStoreNames.contains(STORE_RECIPES)) {
                const store = dbUpgrade.createObjectStore(STORE_RECIPES, { keyPath: 'id', autoIncrement: true });
                store.createIndex('name', 'name', { unique: false });
                store.createIndex('category', 'category', { unique: false });
            }

            if (!dbUpgrade.objectStoreNames.contains(STORE_SETTINGS)) {
                dbUpgrade.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
            }

            if (!dbUpgrade.objectStoreNames.contains(STORE_SHOPPING)) {
                dbUpgrade.createObjectStore(STORE_SHOPPING, { keyPath: 'id', autoIncrement: true });
            }

            if (!dbUpgrade.objectStoreNames.contains(STORE_CATEGORIES)) {
                dbUpgrade.createObjectStore(STORE_CATEGORIES, { keyPath: 'name' });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve();
        };

        request.onerror = () => reject(request.error);
    });
}

function dbTransaction(storeName, mode = 'readonly') {
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
}

/* Ajustes */

async function loadSettings() {
    const store = dbTransaction(STORE_SETTINGS);
    return new Promise((resolve) => {
        const reqLang = store.get('language');
        const reqTheme = store.get('theme');
        const settings = { language: 'es', theme: 'light' };
        let pending = 2;

        reqLang.onsuccess = () => {
            if (reqLang.result) settings.language = reqLang.result.value;
            if (--pending === 0) resolve(settings);
        };
        reqLang.onerror = () => { if (--pending === 0) resolve(settings); };

        reqTheme.onsuccess = () => {
            if (reqTheme.result) settings.theme = reqTheme.result.value;
            if (--pending === 0) resolve(settings);
        };
        reqTheme.onerror = () => { if (--pending === 0) resolve(settings); };
    });
}

function saveSetting(key, value) {
    const store = dbTransaction(STORE_SETTINGS, 'readwrite');
    store.put({ key, value });
}

function applySettings(settings) {
    currentLanguage = settings.language || 'es';
    document.getElementById('languageSelect').value = currentLanguage;
    document.body.setAttribute('data-theme', settings.theme || 'light');
    document.getElementById('themeSelect').value = settings.theme || 'light';
    applyTranslations();
}

/* Traducciones */

function applyTranslations() {
    const dict = i18n[currentLanguage];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });
}


/* UI */

function initUI() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const viewId = btn.getAttribute('data-view');
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(viewId).classList.add('active');
        });
    });

    document.getElementById('toggleSidebar').onclick = () => {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    };

    document.getElementById('filterFavorites').onchange = loadRecipes;

    document.getElementById('btnNewRecipe').addEventListener('click', () => openRecipeModal());
    document.getElementById('btnCloseModal').addEventListener('click', closeRecipeModal);
    document.getElementById('btnAddCategory').addEventListener('click', addNewCategoryFromForm);
    document.getElementById('recipeForm').addEventListener('submit', saveRecipeFromForm);
    document.getElementById('btnDeleteRecipe').addEventListener('click', deleteCurrentRecipe);
    document.getElementById('categoryFilter').addEventListener('change', loadRecipes);
    document.getElementById('sortRecipes').addEventListener('change', loadRecipes);
    document.getElementById('recipeRecalcServings').addEventListener('input', updateRecalcHint);
    document.getElementById('btnSearchText').addEventListener('click', handleTextSearch);
    document.getElementById('btnSearchIngredients').addEventListener('click', handleIngredientSearch);
    document.getElementById('btnClearShopping').addEventListener('click', clearShoppingList);
    document.getElementById('btnExportAllJson').addEventListener('click', exportAllToJson);
    document.getElementById('btnExportAllPdf').addEventListener('click', exportAllToPdf);
    document.getElementById('btnImportAllJson').addEventListener('click', importAllFromJson);
    document.getElementById('btnImportRecipeJson').addEventListener('click', importSingleRecipeFromJson);

    document.getElementById('languageSelect').addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        saveSetting('language', currentLanguage);
        applyTranslations();
    });

    document.getElementById('themeSelect').addEventListener('change', (e) => {
        const theme = e.target.value;
        document.body.setAttribute('data-theme', theme);
        saveSetting('theme', theme);
    });
}

/* Categorías */

function loadCategories() {
    const store = dbTransaction(STORE_CATEGORIES, 'readwrite');

    DEFAULT_CATEGORIES.forEach(cat => {
        const req = store.get(cat);
        req.onsuccess = () => {
            if (!req.result) store.put({ name: cat });
        };
    });

    const categories = [];
    const cursorReq = store.openCursor();
    cursorReq.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            categories.push(cursor.value.name);
            cursor.continue();
        } else {
            populateCategorySelects(categories);
        }
    };
}

function populateCategorySelects(categories) {
    const filterSelect = document.getElementById('categoryFilter');
    const recipeSelect = document.getElementById('recipeCategory');

    filterSelect.innerHTML = '';
    const optAll = document.createElement('option');
    optAll.value = '';
    optAll.textContent = 'Todas';
    filterSelect.appendChild(optAll);

    recipeSelect.innerHTML = '';

    categories.forEach(cat => {
        const opt1 = document.createElement('option');
        opt1.value = cat;
        opt1.textContent = cat;
        filterSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = cat;
        opt2.textContent = cat;
        recipeSelect.appendChild(opt2);
    });
}

function addNewCategoryFromForm() {
    const input = document.getElementById('newCategoryName');
    const name = input.value.trim();
    if (!name) return;

    const store = dbTransaction(STORE_CATEGORIES, 'readwrite');
    const req = store.put({ name });
    req.onsuccess = () => {
        input.value = '';
        loadCategories();
    };
}

/* Recetas */

function loadRecipes() {
    const store = dbTransaction(STORE_RECIPES);
    const recipes = [];

    store.openCursor().onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
            const r = cursor.value;

            // 🔥 FIX: asegurar que favorite exista
            if (r.favorite === undefined) {
                r.favorite = false;
                updateRecipe(r);
            }

            recipes.push(r);
            cursor.continue();
        } else {
            renderRecipeList(recipes);
        }
    };
}


function renderRecipeList(recipes) {
    const container = document.getElementById('recipesList');
    container.innerHTML = '';

    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortRecipes').value;
    const favOnly = document.getElementById('filterFavorites').checked;

    // 🔥 PRIMERO declarar filtered
    let filtered = recipes;

    // 🔥 Luego aplicar filtros
    if (categoryFilter) {
        filtered = filtered.filter(r => r.category === categoryFilter);
    }

    if (favOnly) {
        filtered = filtered.filter(r => r.favorite === true);
    }

    // 🔥 Luego ordenar
    filtered.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        } else if (sortBy === 'difficulty') {
            const order = { easy: 1, medium: 2, hard: 3 };
            return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
        } else if (sortBy === 'time') {
            return (a.time || 0) - (b.time || 0);
        } else if (sortBy === 'ingredientsCount') {
            return (a.ingredients?.length || 0) - (b.ingredients?.length || 0);
        }
        return 0;
    });

    if (!filtered.length) {
        const p = document.createElement('p');
        p.textContent = i18n[currentLanguage].alert_no_recipes;
        container.appendChild(p);
        return;
    }

    filtered.forEach(recipe => {
        const card = createRecipeCard(recipe);
        container.appendChild(card);
    });
}


function openViewRecipeModal(recipe) {
    const modal = document.getElementById('viewRecipeModal');
    const title = document.getElementById('viewRecipeTitle');
    const body = document.getElementById('viewRecipeBody');

    title.textContent = recipe.name;

    let html = "";

    if (recipe.imageBase64) {
        html += `<img src="${recipe.imageBase64}" style="width:100%;border-radius:8px;margin-bottom:10px;">`;
    }

    html += `<p><strong>Categoría:</strong> ${recipe.category}</p>`;
    html += `<p><strong>Dificultad:</strong> ${recipe.difficulty}</p>`;
    html += `<p><strong>Tiempo:</strong> ${recipe.time} min</p>`;
    html += `<p><strong>Porciones base:</strong> ${recipe.servings}</p>`;

    html += `<h3>Ingredientes</h3>`;
    html += `<ul>`;
    recipe.ingredients.forEach(i => html += `<li>${i}</li>`);
    html += `</ul>`;

    html += `<h3>Pasos</h3>`;
    html += `<p>${recipe.steps.replace(/\n/g, "<br>")}</p>`;

    if (recipe.notes) {
        html += `<h3>Notas</h3>`;
        html += `<p>${recipe.notes.replace(/\n/g, "<br>")}</p>`;
    }

    // Recalculo dentro del modal
    html += `
        <h3>Recalcular porciones</h3>
        <input type="number" id="viewRecalcInput" value="${recipe.servings}" min="1" style="width:80px;">
        <button id="btnApplyRecalc" class="primary">Aplicar</button>
        <div id="viewRecalcResult"></div>
    `;

    body.innerHTML = html;

    // Activar recalculo
    document.getElementById('btnApplyRecalc').onclick = () => {
        applyRecalcInView(recipe);
    };

    document.getElementById('btnCloseViewRecipe').onclick = () => {
        modal.classList.add('hidden');
    };

    modal.classList.remove('hidden');
}

function applyRecalcInView(recipe) {
    const newServings = Number(document.getElementById('viewRecalcInput').value);
    const factor = newServings / recipe.servings;

    const recalculated = recipe.ingredients.map(line => {
        const match = line.match(/([\d.,]+)/);
        if (!match) return line;
        const number = parseFloat(match[1].replace(',', '.'));
        const newNumber = (number * factor).toFixed(2).replace('.00', '');
        return line.replace(match[1], newNumber);
    });

    const resultDiv = document.getElementById('viewRecalcResult');
    resultDiv.innerHTML = `
        <h4>Ingredientes para ${newServings} porciones:</h4>
        <ul>${recalculated.map(i => `<li>${i}</li>`).join("")}</ul>
    `;
}


function toggleFavorite(recipe) {
    recipe.favorite = !recipe.favorite;
    updateRecipe(recipe);
}


function createRecipeCard(recipe) {
    const dict = i18n[currentLanguage];
    const card = document.createElement('div');
    card.className = 'card';

    const header = document.createElement('div');
    header.className = 'card-header';

    const img = document.createElement('img');
    img.className = 'card-image';
    if (recipe.imageBase64) img.src = recipe.imageBase64;
    else img.alt = 'No image';

    const main = document.createElement('div');
    main.className = 'card-main';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = recipe.name;

    // 🔥 LISTENERS CORRECTOS (después de crear los elementos) 
    img.addEventListener('click', () => openViewRecipeModal(recipe));
    title.addEventListener('click', () => openViewRecipeModal(recipe));

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    const difficultyLabel = dict['difficulty_' + (recipe.difficulty || 'easy')] || recipe.difficulty;
    meta.textContent = `${recipe.category || ''} · ${difficultyLabel || ''} · ${recipe.time || 0} min`;

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'card-tags';
    (recipe.tags || []).forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsDiv.appendChild(span);
    });

    main.appendChild(title);
    main.appendChild(meta);
    main.appendChild(tagsDiv);

    header.appendChild(img);
    header.appendChild(main);

    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const left = document.createElement('div');
    const btnEdit = document.createElement('button');
    btnEdit.className = 'secondary';
    btnEdit.textContent = dict.card_edit;
    btnEdit.addEventListener('click', () => openRecipeModal(recipe));

    const btnShopping = document.createElement('button');
    btnShopping.className = 'secondary';
    btnShopping.textContent = dict.card_add_to_shopping;
    btnShopping.addEventListener('click', () => addRecipeToShoppingList(recipe));

    left.appendChild(btnEdit);
    left.appendChild(btnShopping);

    const right = document.createElement('div');
    const btnJson = document.createElement('button');
    btnJson.className = 'secondary';
    btnJson.textContent = dict.card_export_json;
    btnJson.addEventListener('click', () => exportRecipeToJson(recipe));

    const btnPdf = document.createElement('button');
    btnPdf.className = 'secondary';
    btnPdf.textContent = dict.card_export_pdf;
    btnPdf.addEventListener('click', () => exportRecipeToPdf(recipe));

    const btnShare = document.createElement('button');
    btnShare.className = 'secondary';
    btnShare.textContent = dict.card_share;
    btnShare.addEventListener('click', () => shareRecipe(recipe));

    const btnFav = document.createElement('button');
btnFav.className = 'secondary';
btnFav.innerHTML = recipe.favorite ? "❤️" : "🤍";
btnFav.onclick = () => toggleFavorite(recipe);

right.appendChild(btnFav);


    right.appendChild(btnJson);
    right.appendChild(btnPdf);
    right.appendChild(btnShare);

    footer.appendChild(left);
    footer.appendChild(right);

    card.appendChild(header);
    card.appendChild(footer);

    return card;
}

function openRecipeModal(recipe = null) {
    // Guardamos la receta actual para conservar la foto si no se sube una nueva 
    currentEditingRecipe = recipe;
    const dict = i18n[currentLanguage];
    const modal = document.getElementById('recipeModal');
    const title = document.getElementById('recipeModalTitle');
    const form = document.getElementById('recipeForm');

    // IMPORTANTE: recargar categorías aquí para evitar el bug de la primera receta 
    loadCategories();

    form.reset();
    document.getElementById('recipeId').value = recipe ? recipe.id : '';
    document.getElementById('recipeRecalcServings').value = recipe ? recipe.servings || 4 : 4;
if (recipe) {
    originalIngredientsForRecalc = [...recipe.ingredients];
} else {
    originalIngredientsForRecalc = [];
}



    if (recipe) {
        title.textContent = dict.modal_new_recipe.replace('Nueva', 'Editar').replace('New', 'Edit');
        document.getElementById('recipeName').value = recipe.name || '';
        document.getElementById('recipeCategory').value = recipe.category || '';
        document.getElementById('recipeServings').value = recipe.servings || 4;
        document.getElementById('recipeTime').value = recipe.time || '';
        document.getElementById('recipeDifficulty').value = recipe.difficulty || 'easy';
        document.getElementById('recipeTags').value = (recipe.tags || []).join(', ');
        document.getElementById('recipeIngredients').value = (recipe.ingredients || []).join(';\n');
        document.getElementById('recipeSteps').value = recipe.steps || '';
        document.getElementById('recipeNotes').value = recipe.notes || '';
        document.getElementById('btnDeleteRecipe').style.display = 'inline-block';
    } else {
        title.textContent = dict.modal_new_recipe;
        document.getElementById('btnDeleteRecipe').style.display = 'none';
    }

    modal.classList.remove('hidden');
}
function showSavedModal() {
    const modal = document.getElementById('savedModal');
    modal.classList.remove('hidden');
    document.getElementById('btnCloseSaved').onclick = () => {
        modal.classList.add('hidden');
    };
}
function closeRecipeModal() {
    document.getElementById('recipeModal').classList.add('hidden');
}

function saveRecipeFromForm(event) {
    event.preventDefault();

    const id = document.getElementById('recipeId').value;
    const name = document.getElementById('recipeName').value.trim();
    const category = document.getElementById('recipeCategory').value;
    const servings = Number(document.getElementById('recipeServings').value);
    const time = Number(document.getElementById('recipeTime').value);
    const difficulty = document.getElementById('recipeDifficulty').value;
    const tags = document.getElementById('recipeTags').value.split(',').map(t => t.trim()).filter(Boolean);
    const ingredients = document.getElementById('recipeIngredients').value.split(/[\n;]+/).map(t => t.trim()).filter(Boolean);
    const steps = document.getElementById('recipeSteps').value;
    const notes = document.getElementById('recipeNotes').value;

    const file = document.getElementById('recipeImage').files[0];

    const recipeData = {
        name,
        category,
        servings,
        time,
        difficulty,
        tags,
        ingredients,
        steps,
        notes,
        favorite: currentEditingRecipe?.favorite || false

    };

    function finalizeSave() {
        if (id) {
            recipeData.id = Number(id);
            updateRecipe(recipeData);   // ← GUARDA EDICIÓN
        } else {
            addRecipe(recipeData);      // ← GUARDA NUEVA RECETA
        }

        showSavedModal();               // ← MUESTRA MODAL
        closeRecipeModal();             // ← CIERRA MODAL DE EDICIÓN
        loadRecipes();                  // ← REFRESCA LISTA
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            recipeData.imageBase64 = reader.result;
            finalizeSave();
        };
        reader.readAsDataURL(file);
    } else {
        if (id && currentEditingRecipe?.imageBase64) {
            recipeData.imageBase64 = currentEditingRecipe.imageBase64;
        }
        finalizeSave();
    }
}




function addRecipe(recipe) {
    const store = dbTransaction(STORE_RECIPES, 'readwrite');
    store.add(recipe).onsuccess = () => loadRecipes();
}

function updateRecipe(recipe) {
    const store = dbTransaction(STORE_RECIPES, 'readwrite');
    store.put(recipe).onsuccess = () => loadRecipes();
}

function deleteCurrentRecipe() {
    const dict = i18n[currentLanguage];
    if (!confirm(dict.confirm_delete_recipe)) return;

    const id = Number(document.getElementById('recipeId').value);
    if (!id) return;

    const store = dbTransaction(STORE_RECIPES, 'readwrite');
    store.delete(id).onsuccess = () => {
        alert(dict.alert_recipe_deleted);
        closeRecipeModal();
        loadRecipes();
    };
}

/* Recalcular porciones (hook visual) */

function updateRecalcHint() {
    const baseServings = Number(document.getElementById('recipeServings').value);
    const newServings = Number(document.getElementById('recipeRecalcServings').value);

    if (!baseServings || !newServings || originalIngredientsForRecalc.length === 0) return;

    const factor = newServings / baseServings;

    const recalculated = originalIngredientsForRecalc.map(line => {
        // Buscar número en el ingrediente
        const match = line.match(/([\d.,]+)/);
        if (!match) return line; // si no hay número, no se modifica

        const number = parseFloat(match[1].replace(',', '.'));
        const newNumber = (number * factor).toFixed(2).replace('.00', '');

        // Reemplazar solo el primer número encontrado
        return line.replace(match[1], newNumber);
    });

    document.getElementById('recipeIngredients').value = recalculated.join(';\n');
}


/* Búsqueda */

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function handleTextSearch() {
    const query = normalizeText(document.getElementById('searchText').value.trim());
    const store = dbTransaction(STORE_RECIPES);
    const results = [];
    const cursorReq = store.openCursor();

    cursorReq.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const r = cursor.value;
            const haystack = [
                r.name,
                (r.tags || []).join(' '),
                (r.ingredients || []).join(' ')
            ].join(' ');
            if (normalizeText(haystack).includes(query)) results.push(r);
            cursor.continue();
        } else {
            renderSearchResults(results);
        }
    };
}

function handleIngredientSearch() {
    const input = document.getElementById('searchIngredients').value;
    const mode = document.getElementById('searchMode').value;
    const sortBy = document.getElementById('searchSort').value;

    const ingredients = input.split(',').map(t => normalizeText(t.trim())).filter(Boolean);
    if (!ingredients.length) {
        renderSearchResults([]);
        return;
    }

    const store = dbTransaction(STORE_RECIPES);
    const results = [];
    const cursorReq = store.openCursor();

    cursorReq.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const r = cursor.value;
            const recipeIngs = (r.ingredients || []).map(normalizeText);
            let matches = 0;
            ingredients.forEach(ing => {
                if (recipeIngs.some(ri => ri.includes(ing))) matches++;
            });

            let ok = false;
            if (mode === 'all') ok = matches === ingredients.length;
            else ok = matches > 0;

            if (ok) {
                r._matches = matches;
                results.push(r);
            }

            cursor.continue();
        } else {
            results.sort((a, b) => {
                if (sortBy === 'relevance') {
                    return (b._matches || 0) - (a._matches || 0);
                } else if (sortBy === 'difficulty') {
                    const order = { easy: 1, medium: 2, hard: 3 };
                    return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
                } else if (sortBy === 'time') {
                    return (a.time || 0) - (b.time || 0);
                } else if (sortBy === 'ingredientsCount') {
                    return (a.ingredients?.length || 0) - (b.ingredients?.length || 0);
                }
                return 0;
            });

            renderSearchResults(results);
        }
    };
}

function renderSearchResults(recipes) {
    const dict = i18n[currentLanguage];
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (!recipes.length) {
        const p = document.createElement('p');
        p.textContent = dict.alert_no_results;
        container.appendChild(p);
        return;
    }

    recipes.forEach(r => {
        const card = createRecipeCard(r);
        container.appendChild(card);
    });
}

/* Lista de compra */

function addRecipeToShoppingList(recipe) {
    const store = dbTransaction(STORE_SHOPPING, 'readwrite');
    (recipe.ingredients || []).forEach(ing => {
        store.add({ text: ing, completed: false });
    });
    loadShoppingList();
}

function loadShoppingList() {
    const store = dbTransaction(STORE_SHOPPING);
    const items = [];
    const cursorReq = store.openCursor();

    cursorReq.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            items.push(cursor.value);
            cursor.continue();
        } else {
            renderShoppingList(items);
        }
    };
}

function renderShoppingList(items) {
    const list = document.getElementById('shoppingList');
    list.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'shopping-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.completed;
        checkbox.addEventListener('change', () => toggleShoppingItem(item.id, checkbox.checked));

        const span = document.createElement('span');
        span.textContent = item.text;
        if (item.completed) span.classList.add('completed');

        const btnDelete = document.createElement('button');
        btnDelete.className = 'icon-btn';
        btnDelete.textContent = '✕';
        btnDelete.addEventListener('click', () => deleteShoppingItem(item.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(btnDelete);

        list.appendChild(li);
    });
}

function toggleShoppingItem(id, completed) {
    const store = dbTransaction(STORE_SHOPPING, 'readwrite');
    const req = store.get(id);
    req.onsuccess = () => {
        const item = req.result;
        if (!item) return;
        item.completed = completed;
        store.put(item).onsuccess = () => loadShoppingList();
    };
}

function deleteShoppingItem(id) {
    const store = dbTransaction(STORE_SHOPPING, 'readwrite');
    store.delete(id).onsuccess = () => loadShoppingList();
}

function clearShoppingList() {
    const dict = i18n[currentLanguage];
    const store = dbTransaction(STORE_SHOPPING, 'readwrite');
    store.clear().onsuccess = () => {
        alert(dict.alert_shopping_cleared);
        loadShoppingList();
    };
}

/* JSON export/import */

function exportAllToJson() {
    const store = dbTransaction(STORE_RECIPES);
    const recipes = [];
    const cursorReq = store.openCursor();

    cursorReq.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            recipes.push(cursor.value);
            cursor.continue();
        } else {
            const data = { type: 'recipeBackup', version: 1, recipes };
            downloadJson(data, 'recetario.json');
        }
    };
}

function exportRecipeToJson(recipe) {
    const data = { type: 'singleRecipe', version: 1, recipe };
    const safeName = recipe.name.replace(/[^\w\d]+/g, '_').toLowerCase();
    downloadJson(data, `receta_${safeName}.json`);
}

function downloadJson(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function importAllFromJson() {
    const dict = i18n[currentLanguage];
    const input = document.getElementById('inputImportAllJson');
    const file = input.files[0];
    if (!file) {
        alert(dict.alert_invalid_file);
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            if (data.type !== 'recipeBackup' || !Array.isArray(data.recipes)) throw new Error('Invalid backup');
            const store = dbTransaction(STORE_RECIPES, 'readwrite');
            store.clear().onsuccess = () => {
                data.recipes.forEach(r => store.add(r));
                loadRecipes();
                alert(dict.alert_import_ok);
            };
        } catch (e) {
            console.error(e);
            alert(dict.alert_import_error);
        }
    };
    reader.readAsText(file);
}

function importSingleRecipeFromJson() {
    const dict = i18n[currentLanguage];
    const input = document.getElementById('inputImportRecipeJson');
    const file = input.files[0];
    if (!file) {
        alert(dict.alert_invalid_file);
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            if (data.type !== 'singleRecipe' || !data.recipe) throw new Error('Invalid recipe');
            const store = dbTransaction(STORE_RECIPES, 'readwrite');
            const recipe = data.recipe;
            delete recipe.id;
            store.add(recipe).onsuccess = () => {
                loadRecipes();
                alert(dict.alert_import_ok);
            };
        } catch (e) {
            console.error(e);
            alert(dict.alert_import_error);
        }
    };
    reader.readAsText(file);
}

/* PDF */

function exportAllToPdf() {
    const store = dbTransaction(STORE_RECIPES);
    const recipes = [];
    const cursorReq = store.openCursor();

    cursorReq.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            recipes.push(cursor.value);
            cursor.continue();
        } else {
            generatePdfForRecipes(recipes, 'recetario.pdf');
        }
    };
}

function exportRecipeToPdf(recipe) {
    generatePdfForRecipes([recipe], `receta_${recipe.name.replace(/[^\w\d]+/g, '_').toLowerCase()}.pdf`);
}

function generatePdfForRecipes(recipes, filename) {
    const doc = new jsPDF();
    const dict = i18n[currentLanguage];

    let y = 10;

    recipes.forEach((r, index) => {
        if (index > 0) {
            doc.addPage();
            y = 10;
        }

        // FOTO (si existe)
        if (r.imageBase64) {
            try {
                // Tamaño recomendado: 60x60
                doc.addImage(r.imageBase64, 'JPEG', 10, y, 60, 60);
                y += 70; // espacio debajo de la foto
            } catch (e) {
                console.error("Error insertando imagen en PDF:", e);
            }
        }

        // TÍTULO
        doc.setFontSize(16);
        doc.text(r.name || '', 10, y);
        y += 8;

        // META
        doc.setFontSize(10);
        const difficultyLabel = dict['difficulty_' + (r.difficulty || 'easy')] || r.difficulty;
        doc.text(`${r.category || ''} · ${difficultyLabel || ''} · ${r.time || 0} min`, 10, y);
        y += 6;

        // INGREDIENTES
        doc.setFontSize(12);
        doc.text(dict.recipe_ingredients_label.replace(':', ''), 10, y);
        y += 5;

        doc.setFontSize(10);
        (r.ingredients || []).forEach(ing => {
            const lines = doc.splitTextToSize('- ' + ing, 180);
            doc.text(lines, 10, y);
            y += lines.length * 5;
            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        });

        // PASOS
        y += 4;
        doc.setFontSize(12);
        doc.text(dict.recipe_steps_label.replace(':', ''), 10, y);
        y += 5;

        doc.setFontSize(10);
        const stepsLines = doc.splitTextToSize(r.steps || '', 180);
        stepsLines.forEach(line => {
            doc.text(line, 10, y);
            y += 5;
            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        });

        // NOTAS
        if (r.notes) {
            y += 4;
            doc.setFontSize(12);
            doc.text(dict.recipe_notes_label.replace(':', ''), 10, y);
            y += 5;

            doc.setFontSize(10);
            const notesLines = doc.splitTextToSize(r.notes, 180);
            notesLines.forEach(line => {
                doc.text(line, 10, y);
                y += 5;
                if (y > 270) {
                    doc.addPage();
                    y = 10;
                }
            });
        }
    });

    doc.save(filename);
}



/* Compartir */

function shareRecipe(recipe) {
    const dict = i18n[currentLanguage];
    let text = `${recipe.name}\n`;
    text += `${recipe.category || ''} · ${dict['difficulty_' + (recipe.difficulty || 'easy')] || recipe.difficulty} · ${recipe.time || 0} min\n\n`;
    text += dict.recipe_ingredients_label + '\n';
    (recipe.ingredients || []).forEach(ing => {
        text += `- ${ing}\n`;
    });
    text += '\n' + dict.recipe_steps_label + '\n';
    text += (recipe.steps || '') + '\n';

    if (navigator.share) {
        navigator.share({ title: recipe.name, text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Receta copiada al portapapeles.');
        });
    }
}

/* PWA */

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').catch(console.error);
    }
}
