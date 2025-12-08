//Animation snöflingor
const snowContainer = document.querySelector('.snow-container');

function createSnowflake() {
  const snowflake = document.createElement('div');
  const size = Math.random() * 5 + 3; // Storlek mellan 3 och 8 px
  snowflake.classList.add('snowflake');
  snowflake.style.width = `${size}px`;
  snowflake.style.height = `${size}px`;
  snowflake.style.left = `${Math.random() * 100}vw`; // Slumpar horisontell position

  // Slumpar falltiden
  const fallDuration = Math.random() * 3 + 4; // Varierar mellan 4 och 7 sekunder
  snowflake.style.animationDuration = `${fallDuration}s`;

  snowContainer.appendChild(snowflake);

  // Ta bort snöflingan efter animationen
  snowflake.addEventListener('animationend', () => {
    snowflake.remove();
  });
}

// Skapa snöflingor regelbundet
const interval = setInterval(createSnowflake, 150);

setTimeout(() => {
  clearInterval(interval);
}, 5000); // Sluta skapa snöflingor efter 5 sekunder

