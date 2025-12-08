/* ===========
    Listmaker: random Christmas list by rolling the dice. Source: websearch and w3shools.com
   ===========
To Do: ask chatGPT to make a fun dice like this one: https://rolladice.io/ */
const dice = Math.floor(Math.random() * 6) + 1;
console.log("You rolled a " + dice);

if (dice == 1) {
  console.log("Item1","Item2","Item3");
}
else if (dice == 2) {
  console.log("Item4","Item2","Item6");
}
else if (dice == 3) {
  console.log("Item4","Item10","Item6");
}
else if (dice == 4) {
  console.log("Item3","Item5","Item6");
}
else if (dice == 5) {
  console.log("Item7","Item6","Item3");
}
else {
  console.log("Item8","Item9","Item10");
}

button.addEventListener("click", function(){
  let inputName = userName.value;
  let inputAge = userAge.value;
  checkAvail(inputAge);
  createDiv = (input); //Vad ska skrivas här?
})
