/* =========================
   Responsive Navigation
   ========================= */
function myFunction() {
  const nav = document.getElementById("myTopnav");
  nav.classList.toggle("responsive"); // Toggle class for responsive menu
}

/* =========================
   Fetch Products from API
   ========================= */
async function fetchData() {
  let res = await fetch("https://fakestoreapi.com/products");
  res = await res.json();
  //console.log(res);
  displayProducts(res);
}
fetchData()

/* =========================
   Display Products
   ========================= */
function displayProducts(products) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; // Clear the container

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Price: ${product.price}</p>
            <button class="add-to-favorites" data-id="${product.id}">Lägg till i önskelista</button>
        `;
    productContainer.appendChild(productCard);
  });

  // Add event listeners for buttons
  const buttons = document.querySelectorAll('.add-to-favorites');
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
  // Implement your logic to save to favorites here
}

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



// Fetch products initially
fetchProducts(); // Call function to load products
