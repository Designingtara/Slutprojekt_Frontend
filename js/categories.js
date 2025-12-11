//To do: fråga AI hur man gör den här sidan
async function fetchData() {
  let res = await  fetch('https://fakestoreapi.com/products')
  res = await res.json()
  console.log("Kategorier A-Ö")
  res.meals.forEach(title => console.log(title.category)) //Listar varje måltid per namn, som finns inom objektet
  console.log("Category")
/*  res.meals.forEach(title => console.log(meal.strCategory))
  res.meals.forEach(meal => console.log(meal)) //listar varje måltid som ett objekt

//  console.log(res.meals) Ger en lista på måltider
}

fetchData();
