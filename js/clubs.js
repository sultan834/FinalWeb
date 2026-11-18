const map = L.map("map").setView([51.128, 71.435], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const cards = Array.from(document.querySelectorAll(".club-item"));

  const markers = [];

  cards.forEach(card => {

    const name = card.dataset.name;
    const lat = Number(card.dataset.lat);
    const lng = Number(card.dataset.lng);

    const marker = L.marker([lat, lng]).addTo(map);

    marker.bindPopup(`
        <strong>${name}</strong><br>
        <a href="details.html?club=${encodeURIComponent(name)}">
            View details
        </a>
    `);

    markers.push({
      card: card,
      marker: marker
    });
  });

  function filterClubs() {

    const search = document.getElementById("searchInput").value.toLowerCase().trim();
    const price = document.getElementById("priceFilter").value;
    const rating = document.getElementById("ratingFilter").value;

    const visibleMarkers = [];

    cards.forEach((card, index) => {

      const name = card.dataset.name.toLowerCase();
      const location = card.dataset.location.toLowerCase();
      const cardPrice = card.dataset.price;
      const cardRating = Number(card.dataset.rating);

      const searchMatch =
        !search ||
        name.includes(search) ||
        location.includes(search);

      const priceMatch =
        price === "all" ||
        cardPrice === price;

      const ratingMatch =
        rating === "all" ||
        cardRating >= Number(rating);

      const visible =
        searchMatch &&
        priceMatch &&
        ratingMatch;

      card.style.display = visible ? "" : "none";

      if (visible) {
        markers[index].marker.addTo(map);
        visibleMarkers.push(markers[index].marker);
      } else {
        map.removeLayer(markers[index].marker);
      }
    });

    if (visibleMarkers.length > 0) {
      const group = L.featureGroup(visibleMarkers);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  document.getElementById("searchButton").addEventListener("click", filterClubs);

  document.getElementById("clearButton").addEventListener("click", () => {

    document.getElementById("searchInput").value = "";
    document.getElementById("priceFilter").value = "all";
    document.getElementById("ratingFilter").value = "all";

    filterClubs();
  });

  document.getElementById("searchInput").addEventListener("input", filterClubs);
  document.getElementById("priceFilter").addEventListener("change", filterClubs);
  document.getElementById("ratingFilter").addEventListener("change", filterClubs);

  document.querySelectorAll(".show-map").forEach((button, index) => {

    button.addEventListener("click", () => {

      const marker = markers[index].marker;

      map.setView(marker.getLatLng(), 15);
      marker.openPopup();
    });

  });

  const urlParams = new URLSearchParams(window.location.search);
  const urlSearch = urlParams.get("search");

  if (urlSearch) {
    document.getElementById("searchInput").value = urlSearch;
    filterClubs();
  }
