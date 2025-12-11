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
/*
Fetch Products from API
========================= */
async function fetchData() {
  let res = await fetch("https://fakestoreapi.com/products");
  res = await res.json();
  console.log(res);
  //displayProducts(res);
}
fetchData()


