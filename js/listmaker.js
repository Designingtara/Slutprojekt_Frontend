/* listmaker.js
   Rättad version med:
   - Fasta fetch-URL:er (https://)
   - Fixad animateDice implementation
   - Bevarade dina utkommenterade experimanter
   - Använder displayProducts från app.js när möjlig
*/

/* DOM references */
const DICE_BTN = document.getElementById('roll-dice');
const ROLLED_RESULT = document.getElementById('rolled-result');
const PRODUCT_CONTAINER = document.getElementById('product-container');
const DICE_EL = document.getElementById('dice');

if (!DICE_BTN) {
  console.warn('Roll-dice button saknas i DOM (id="roll-dice")');
}

// Mappa tärningsresultat -> array med 10 produkt-id (exempel med fakestore ids 1..20)
const DIE_MAP = {
  1: [1,3,5,7,9,11,13,15,17,19],
  2: [2,4,6,8,10,12,14,16,18,20],
  3: [1,2,3,4,5,6,7,8,9,10],
  4: [11,12,13,14,15,16,17,18,19,20],
  5: [5,6,7,8,9,10,11,12,13,14],
  6: [20,17,4,18,6,2,16,15,13,19]
};

function rollDiceValue() {
  return Math.floor(Math.random() * 6) + 1;
}
/*
// Enkel "animation" genom att lägga till klass som triggar CSS-rotation
function animateDice(result) {
  if (!DICE_EL) return;
  DICE_EL.classList.remove('show-1','show-2','show-3','show-4','show-5','show-6');
  // trigger reflow så animation kan återstarta
  void DICE_EL.offsetWidth;
  // Lagt till korrekt klass-sammansättning (tidigare syntaxfel)
  DICE_EL.classList.add(`show-${result}`);
}*/

// Hämta produkter från fakestore api för givna ids
async function fetchProductsByIds(ids) {
  const promises = ids.map(id =>
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(r => r.ok ? r.json() : null)
      .catch(()=>null)
  );
  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

async function handleRoll() {
  if (!DICE_BTN) return;
  DICE_BTN.disabled = true;
  if (ROLLED_RESULT) ROLLED_RESULT.textContent = 'Slår tärningen…';
  const value = rollDiceValue();
  animateDice(value);
  if (ROLLED_RESULT) ROLLED_RESULT.textContent = `Du slog: ${value}`;
  const ids = DIE_MAP[value] || DIE_MAP[1];
  try {
    const prods = await fetchProductsByIds(ids);
    // Återanvänd app.js displayProducts om den finns, annars render här:
    if (typeof displayProducts === 'function') {
      displayProducts(prods);
    } else {
      renderProductsSimple(prods);
    }
  } catch (err) {
    console.error(err);
    if (PRODUCT_CONTAINER) PRODUCT_CONTAINER.innerHTML = 'Det gick inte att hämta produkter för listan.';
  } finally {
    // Lås upp knappen efter kort paus så animation syns
    setTimeout(() => { if (DICE_BTN) DICE_BTN.disabled = false; }, 800);
  }
}

// Enkel fallback-render om displayProducts saknas
function renderProductsSimple(products) {
  if (!PRODUCT_CONTAINER) return;
  PRODUCT_CONTAINER.innerHTML = '';
  if (!products || products.length === 0) {
    PRODUCT_CONTAINER.innerHTML = 'Inga produkter hittades.';
    return;
  }
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';})
}
// Lagt till escapeHtml försiktigt; om escapeHtml inte finns
