/*
async function fetchData() {
  let res = await fetch("https://fakestoreapi.com/products");
  res = await res.json();
  console.log(res);
}
fetchData()*/

/*async function fetchProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products: ", error); // Error handling
  }
}
fetchData()*/

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
