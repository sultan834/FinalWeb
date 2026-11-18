/* Game Hub Endterm - shared interactions */
const clubCatalog = [
  { name: "Arena One", location: "Astana", price: 1800, rating: 4.9, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80", description: "Powerful PCs, 240Hz monitors and VIP rooms." },
  { name: "Cyber Zone", location: "Astana", price: 2000, rating: 4.7, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80", description: "RTX graphics, fast internet and comfortable gaming." },
  { name: "Pixel Club", location: "Astana", price: 2200, rating: 4.6, image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&w=900&q=80", description: "Premium PCs and a streaming-ready setup." },
  { name: "GOAT Gaming Club", location: "Astana", price: 2000, rating: 4.8, image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=900&q=80", description: "A great place for team gaming and tournaments." }
];

const gamingTips = [
  "Compare ratings before choosing a club.",
  "Book your PC early for popular evening hours.",
  "Check the booking time before confirming payment."
];

// Reusable function 1: safely read data from localStorage.
function getSavedData(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    return fallback;
  }
}

// Reusable function 2: save data in localStorage.
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Reusable function 3: show a temporary message and return its element.
function showToast(message) {
  let toast = document.getElementById("gameHubToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "gameHubToast";
    toast.className = "gamehub-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
  return toast;
}

// Reusable function 4: calculate a session total and return a number.
function calculateSessionPrice(hourlyRate, hours) {
  return Number(hourlyRate) * Number(hours);
}

function renderDynamicClubCards() {
  const host = document.getElementById("dynamicClubGrid");
  if (!host) return;

  // for...of processes the project data array and creates cards dynamically.
  for (const club of clubCatalog) {
    const card = document.createElement("article");
    card.className = "club-card dynamic-club-card";
    card.innerHTML = `
      <img src="${club.image}" alt="${club.name}">
      <div class="club-card-content">
        <div class="card-top"><h3>${club.name}</h3><span class="rating-box">★ ${club.rating}</span></div>
        <p>${club.description}</p>
        <div class="card-bottom"><span class="price">${club.price.toLocaleString()} ₸ / hour</span>
        <a class="btn btn-primary btn-sm" href="details.html?club=${encodeURIComponent(club.name)}">Book</a></div>
      </div>`;
    host.appendChild(card);
  }
}

function addGlobalControls() {
  // Restore saved theme before displaying controls.
  const savedTheme = localStorage.getItem("gameHubTheme");
  document.body.classList.toggle("light-theme", savedTheme === "light");

  // Small, discreet theme switch in the bottom-right corner.
  let themeButton = document.getElementById("themeToggle");
  if (!themeButton) {
    themeButton = document.createElement("button");
    themeButton.id = "themeToggle";
    themeButton.type = "button";
    themeButton.className = "theme-toggle-button";
    themeButton.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light-theme");
      localStorage.setItem("gameHubTheme", isLight ? "light" : "dark");
      updateThemeButton(themeButton);
    });
    document.body.appendChild(themeButton);
  }
  updateThemeButton(themeButton);

  const navList = document.querySelector(".nav-links");
  if (navList && !document.getElementById("favoritesNavLink")) {
    const item = document.createElement("li");
    item.id = "favoritesNavLink";
    item.innerHTML = '<a href="profile.html#favorites">Favorites <span id="favoriteCount">0</span></a>';
    navList.appendChild(item);
  }
  updateFavoriteCount();
}

function updateThemeButton(button) {
  const isLight = document.body.classList.contains("light-theme");
  button.textContent = isLight ? "☾ Dark mode" : "☀ Light mode";
  button.title = isLight ? "Switch to dark mode" : "Switch to light mode";
  button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  button.classList.toggle("is-light", isLight);
}

function updateFavoriteCount() {
  const count = document.getElementById("favoriteCount");
  if (count) count.textContent = getSavedData("gameHubFavorites").length;
}

function addFavoriteButtons() {
  // forEach is the second loop style used to process page elements.
  document.querySelectorAll(".club-item, .cards-grid .club-card, .dynamic-club-card").forEach(card => {
    if (card.querySelector(".favorite-button")) return;
    const heading = card.querySelector("h2, h3");
    if (!heading) return;
    const name = heading.textContent.trim();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "favorite-button btn btn-sm btn-outline-light";
    button.textContent = getSavedData("gameHubFavorites").includes(name) ? "♥ Saved" : "♡ Favorite";
    button.setAttribute("aria-label", `Toggle ${name} favorite`);
    button.addEventListener("click", () => {
      const favorites = getSavedData("gameHubFavorites");
      const index = favorites.indexOf(name);
      if (index >= 0) {
        favorites.splice(index, 1);
        button.textContent = "♡ Favorite";
        showToast(`${name} removed from favorites`);
      } else {
        favorites.push(name);
        button.textContent = "♥ Saved";
        showToast(`${name} added to favorites`);
      }
      saveData("gameHubFavorites", favorites);
      updateFavoriteCount();
      renderFavorites();
    });
    const actions = card.querySelector(".card-actions, .card-bottom");
    (actions || card.querySelector(".club-card-content") || card).appendChild(button);
  });
}

function renderFavorites() {
  const host = document.getElementById("favoritesList");
  if (!host) return;
  const favorites = getSavedData("gameHubFavorites");
  host.innerHTML = "";
  if (favorites.length === 0) {
    host.innerHTML = '<p class="text-muted">No favorite clubs yet. Open Clubs & Map and press Favorite.</p>';
    return;
  }
  favorites.forEach(name => {
    const club = clubCatalog.find(item => item.name === name);
    if (!club) return;
    const item = document.createElement("div");
    item.className = "favorite-row";
    item.innerHTML = `<strong>${club.name}</strong><span>${club.price.toLocaleString()} ₸ / hour</span>
      <a class="btn btn-sm btn-primary" href="details.html?club=${encodeURIComponent(club.name)}">View</a>
      <button class="btn btn-sm btn-outline-danger remove-favorite" type="button">Remove</button>`;
    item.querySelector(".remove-favorite").addEventListener("click", () => {
      saveData("gameHubFavorites", getSavedData("gameHubFavorites").filter(value => value !== name));
      renderFavorites();
      updateFavoriteCount();
      showToast("Favorite removed");
    });
    host.appendChild(item);
  });
}

function renderGamingTip() {
  const host = document.getElementById("gamingTip");
  if (!host) return;
  const tip = gamingTips[Math.floor(Math.random() * gamingTips.length)];
  host.textContent = tip;
}

document.addEventListener("DOMContentLoaded", () => {
  addGlobalControls();
  renderDynamicClubCards();
  addFavoriteButtons();
  renderFavorites();
  renderGamingTip();
});
