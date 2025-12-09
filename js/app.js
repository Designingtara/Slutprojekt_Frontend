/* =========================
   Responsive Navigation
   ========================= */
function myFunction() {
  const nav = document.getElementById("myTopnav");
  nav.classList.toggle("responsive");
}

/* =========================
   Globals & DOM refs
   ========================= */
const btn = document.getElementById('btn');
const searchbar = document.getElementById('searchbar');
const productContainer = document.getElementById("product-container");

let allProducts = []; // sparar alla produkter efter fetch

/* =========================
   Event listeners
   ========================= */

// Klick på sökknapp
btn.addEventListener('click', () => {
  const query = searchbar.value.trim();
  handleSearch(query);
});

// Enter i input
searchbar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = searchbar.value.trim();
    handleSearch(query);
  }
});

//Visar preliminärt sökresultat medan man skriver
searchbar.addEventListener('input', (e) => {
  handleSearch(e.target.value.trim());
});

/* =========================
   Fetch Products from API
   ========================= */

async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    allProducts = Array.isArray(data) ? data : [];
    displayProducts(allProducts); // visa alla initialt
  } catch (err) {
    console.error('Error fetching products:', err);
    productContainer.innerHTML = '<p>Det gick inte att hämta produkter.</p>';
  }
}

/* =========================
   Search handler
   ========================= */

function handleSearch(query) {
  if (!query) {
    // om tomt: visa alla produkter
    displayProducts(allProducts);
    return;
  }

  const q = query.toLowerCase();
  const filtered = allProducts.filter(p => {
    const title = (p.title || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const category = (p.category || '').toLowerCase();
    return title.includes(q) || desc.includes(q) || category.includes(q);
  });

  displayProducts(filtered);
}

/* =========================
   Display Products
   ========================= */

function displayProducts(products) {
  productContainer.innerHTML = ""; // Clear the container

  if (!products || products.length === 0) {
    productContainer.innerHTML = '<p>Inga produkter hittades.</p>';
    return;
  }

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <img src="${product.image}" alt="${escapeHtml(product.title)}">
      <h3>${escapeHtml(product.title)}</h3>
      <p>${parseInt(product.price * 10)} kr</p>
      <button class="add-to-favorites" data-id="${product.id}">Lägg till i önskelista</button>
    `;
    productContainer.appendChild(productCard);
  });

  // Add event listeners for buttons
  const buttons = productContainer.querySelectorAll('.add-to-favorites');
  buttons.forEach(button => {
    button.addEventListener('click', addToFavorites);
  });
}

/* =========================
   Add to Favorites Function
   ========================= */

function addToFavorites(event) {
  const productId = event.target.getAttribute('data-id');
  console.log(`Added product ${productId} to favorites.`);
  // Implementera logik för att spara önskelista här (localStorage eller backend)
}

/* =========================
   Utility
   ========================= */

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* =========================
   Init
   ========================= */

fetchProducts();


/* =========================
   Listmaker Function: Random List Generation
   =========================
function rollDice() {
  const dice = Math.floor(Math.random() * 6) + 1;
  let items = [];

  switch (dice) {
    case 1:
      items = ["Item1", "Item2", "Item3"];
      break;
    case 2:
      items = ["Item4", "Item5", "Item6"];
      break;
    case 3:
      items = ["Item7", "Item8", "Item9"];
      break;
    case 4:
      items = ["Item10", "Item11", "Item12"];
      break;
    case 5:
      items = ["Item13", "Item14", "Item15"];
      break;
    default:
      items = ["Item16", "Item17", "Item18"];
      break;
  }
  console.log("You rolled a " + dice + ": ", items);
}*/

