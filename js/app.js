
/* Responsive layout - Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

async function fetchMeals(){
  try{
    let res = await fetch('https://fakestoreapi.com/products');
    let json = await res.json();
    console.log(json);
    return json;
}
  fetchData()

/*catch (error){ //Errorhantering?
    console.error("error: "+ error);
  }*/
}
