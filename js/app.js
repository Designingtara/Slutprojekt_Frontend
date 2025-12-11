/* =========================
   General note to reader: These functions could probably be simplified,
   but I daren't meddle with the code once I got everything working.
   I understand most of the code, or what it does, in broad strokes.
   At times, my comments are a bit thin, or I will outright admit to not being sure.
   ========================= */

/* =========================
   Responsive Navigation (top menu)
   ========================= */

function myFunction() {
  const nav = document.getElementById("myTopnav");
  nav.classList.toggle("responsive");
  const btn = document.getElementById('menu-btn');
  if (btn) btn.setAttribute('aria-expanded', String(nav.classList.contains('responsive')));
}

/* Attach click listener to hamburger menu after DOM loaded. Closes hamburger menu after click. Not entirely sure what DOM means, as I ran into it on the last day of coding and haven't had time to understand it properly*/
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('menu-btn')?.addEventListener('click', myFunction);
});

/* =========================
   Globals & DOM refs - stores ID's for btn, searchbar and product-container in variables.
   ========================= */
const btn = document.getElementById('btn');
const searchbar = document.getElementById('searchbar');
const productContainer = document.getElementById("product-container");

let allProducts = []; // Saves products in a variable after fetch, I think this is for the addToFavorites-function

/* =========================
    Favorites: localStorage helpers. Saves products locally to aid favorite function Min önskelista.
  ========================= */

const FAVORITES_KEY = 'santas_favorites';

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function isFavorite(id) {
  return loadFavorites().some(p => String(p.id) === String(id));
}


/* =========================
   Event listeners
   ========================= */

/* Filters products when user inputs search term or clicks one of filter buttons. */
if (btn) btn.addEventListener('click', () => applyFiltersAndRender());
if (searchbar) {
  searchbar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyFiltersAndRender();
  });
  searchbar.addEventListener('input', () => applyFiltersAndRender());
}

//Displays preliminary search result while user types
if (searchbar) {
  searchbar.addEventListener('input', (e) => {
    handleSearch(e.target.value.trim());
  });
}

/* =========================
   Fetch Products from API
   ========================= */

async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    allProducts = Array.isArray(data) ? data : [];
    displayProducts(allProducts); // Shows all products on inital launch (upon visiting the home page)
    renderCategoryButtons(allProducts); // Displays category buttons
  } catch (err) {
    console.error('Error fetching products:', err);
    if (productContainer) productContainer.innerHTML = '<p>Det gick inte att hämta produkter.</p>';
  }
}

/* =========================
    Filter function
   ========================*/
// Category filter helpers.
const filterContainer = document.getElementById('filter-products');
let activeCategory = null; //"Alla" is default active filter.
function renderCategoryButtons(products) {
  if (!filterContainer) return;
  const categories = Array.from(new Set((products || allProducts).map(p => p.category))).filter(Boolean);
  filterContainer.innerHTML = '';
  const wrapper = document.createElement('div'); //Creates the buttons so they can be used in HTML.
  wrapper.className = 'category-buttons';

  // Activates the filter "Alla" initially
  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'category-btn';
  allBtn.dataset.category = '';
  allBtn.textContent = 'Alla';
  if (!activeCategory) allBtn.classList.add('active');
  wrapper.appendChild(allBtn);
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'category-btn';
    btn.dataset.category = cat;
    btn.textContent = cat;
    if (activeCategory === cat) btn.classList.add('active');
    wrapper.appendChild(btn);
  });
  filterContainer.appendChild(wrapper);

  // Event listeners for the category buttons
  wrapper.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;
    const cat = btn.dataset.category || null;
    activeCategory = cat;

    // Updates active class
    wrapper.querySelectorAll('.category-btn').forEach(b => b.classList.toggle('active', b === btn));
    applyFiltersAndRender(); // Combines category + input in searchbar
  });
}
//Shows products for activated filter
function applyFiltersAndRender() {
  const q = (searchbar?.value || '').trim().toLowerCase();
  let filtered = allProducts.slice();
  if (activeCategory) {
    filtered = filtered.filter(p => String(p.category) === String(activeCategory));
  }
  if (q) {
    filtered = filtered.filter(p => {
      const title = (p.title || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const category = (p.category || '').toLowerCase();
      return title.includes(q) || desc.includes(q) || category.includes(q);
    });
  }
  displayProducts(filtered);
}



/* =========================
   Search handler - I think this makes it so that when you search the products are rendered using the filter "Alla" by default.
   ========================= */
function handleSearch(query) {
  applyFiltersAndRender();
}

/* =========================
   Display Products
   ========================= */

function displayProducts(products) {
  if (!productContainer) return;
  productContainer.innerHTML = ""; // Clear the container

  if (!products || products.length === 0) {
    productContainer.innerHTML = '<p>Inga produkter hittades.</p>';
    return;
  }
//Displays each product on a separate product card. I have assigned some additional classes here to have more control over the layout of the content. I'm sure there is a more efficient way of doing it, but there we are.
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
  <a href="product.html?id=${product.id}" class="product-link">
    <img class="product-card--img" src="${product.image}" alt="${escapeHtml(product.title)}">
    </a><h2 class="product-card--title">${escapeHtml(product.title)}</h2>

  <h2 class="product-card--price">${parseInt(product.price * 10)} kr</h2>
  <button class="add-to-favorites" data-id="${product.id}">${isFavorite(product.id) ? 'Tillagd i önskelista' : 'Lägg till i önskelista'}</button>
`;
    productContainer.appendChild(productCard);
  });

  // Event listener for favorite-button
  const buttons = productContainer.querySelectorAll('.add-to-favorites');
  buttons.forEach(button => {
    button.addEventListener('click', addToFavorites);
  });
}

/* =========================
   Favorites Function adding selected products to "Min önskelista"
   ========================= */

function addToFavorites(event) {
  const id = event.currentTarget?.getAttribute('data-id');
  if (!id) return;

  // Find product in allProducts (if available locally), otherwise fetch from API
  let product = allProducts.find(p => String(p.id) === String(id));


  const persistAndNotify = async (prod) => {
    const list = loadFavorites();
    if (list.some(p => String(p.id) === String(prod.id))) {

      // Remove a product from favorites list
      const newList = list.filter(p => String(p.id) !== String(prod.id));
      saveFavorites(newList);
      console.log(`${prod.id} is removed from favorites.`);

      // Updates the button text back to original?
      document.querySelectorAll(`.add-to-favorites[data-id="${prod.id}"]`).forEach(b => b.textContent = 'Lägg till i önskelista');
      renderFavoritesList();
      return;
    }
    // Changes button text when selected
    list.push(prod);
    saveFavorites(list);
    console.log(`Added product ${prod.id} to favorites.`);
    document.querySelectorAll(`.add-to-favorites[data-id="${prod.id}"]`).forEach(b => b.textContent = 'Tillagd i önskelista');
    renderFavoritesList();
  };

  if (product) {
    persistAndNotify(product);
    return;
  }

  // Fetch from API if products are not available locally
  (async () => {
    try {
      const res = await fetch(`http://fakestoreapi.com/products/${id}`);
      if (!res.ok) throw new Error('Fetch failed');
      product = await res.json();
      persistAndNotify(product);
    } catch (err) {
      console.error('Could not fetch product for favorites:', err);
    }
  })();
}


/* =========================
   Utility
   ========================= */

/* Simple HTML-escape  - "translates" characters that are typically used in code, but the program needs to identify it as user input instead  */
function escapeHtml(text) {
  if (!text) return '' ;
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

/* =========================
   Init
   ========================= */

fetchProducts();

// For small screens: Closes hamburger menu when a nav link is selected (på mobil)
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('myTopnav');
  if (!nav) return;
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('responsive')) {
        nav.classList.remove('responsive');
        document.getElementById('menu-btn')?.setAttribute('aria-expanded', 'false');
      }
    });
  });
});

// Read product id from query string (this part of the URL: ${id}), fetch product and display details.
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
/* ========================
  Some error handling (I think)
  ========================= */

async function fetchProductById(id) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function renderProduct(product) {
  const container = document.getElementById('product-detail');
  if (!container) return;
  if (!product) {
    container.innerHTML = '<p>Produkten kunde inte hittas.</p>';
    return;
  }
// Structure for detailed view. Has toggle add / added to favorites and a link back to previous home page.
  container.innerHTML = `
    <div class="product-card product-card--detail">
      <img src="${product.image}" alt="${escapeHtml(product.title)}">
      <h2>${escapeHtml(product.title)}</h2>
      <p class="product-description">${escapeHtml(product.description)}</p>
      <p class="product-price">${parseInt(product.price * 10)} kr</p>
      <button class="add-to-favorites" data-id="${product.id}">${isFavorite(product.id) ? 'Tillagd i önskelista' : 'Lägg till i önskelista'}</button>
      <p><a href="index.html">← Tillbaka till sök</a></p>
    </div>
  `;
// Favorite button is selected
  const favBtn = container.querySelector('.add-to-favorites');
  if (favBtn) favBtn.addEventListener('click', addToFavorites);
}


document.addEventListener('DOMContentLoaded', async () => {
  const id = getQueryParam('id');
  const container = document.getElementById('product-detail');
  if (!container) return;
  if (!id) {
    // Only render favorites list on favorites.html etc.
    // If product.html is loaded without id we show message but don't block other pages
    if (container) container.innerHTML = '<p>Ingen produkt vald.</p>';
    return;
  }

  container.innerHTML = '<p>Laddar produkt...</p>';
  const product = await fetchProductById(id);
  renderProduct(product);
});

/* =========================
   Favorites list rendering. How the favorited products are displayed on the page.
   ========================= */

//When favorites list is empty.
function renderFavoritesList() {
  const container = document.getElementById('favorites-list');
  if (!container) return;

  const list = loadFavorites();
  container.innerHTML = '';
  if (!list || list.length === 0) {
    container.innerHTML = '<p>Din önskelista är tom. Gå tillbaka till sök för att hitta dina favoriter att lägga till i önskelistan. </p><br><p><a href="index.html">← Tillbaka till sök</a></p>';
    return;
  }
//When favorites list contains products
  list.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-link">
        <img class="product-card--img" src="${product.image}" alt="${escapeHtml(product.title)}"></a>
        <h2 class="product-card--title">${escapeHtml(product.title)}</h2>
      <h2 class="product-card--price">${parseInt(product.price * 10)} kr</h2>
      <button class="add-to-favorites" data-id="${product.id}">Ta bort från önskelista</button>
    `;
    container.appendChild(card);
  });


  // Event listeners for remove buttons
  container.querySelectorAll('.add-to-favorites').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const newList = loadFavorites().filter(p => String(p.id) !== String(id));
      saveFavorites(newList);
      renderFavoritesList(); // uppdatera vyn
      // Also update list view on index/listmaker if present
      displayProducts(allProducts);
    });
  });
}
/* Runs renderFavoritesList automatically when page loads */
document.addEventListener('DOMContentLoaded', () => {
  renderFavoritesList();
});
