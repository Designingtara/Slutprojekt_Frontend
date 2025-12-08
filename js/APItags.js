
async function fetchData() {
  let res = await fetch("https://fakestoreapi.com/products");
  res = await res.json();
  console.log(res);
}
fetchData()

