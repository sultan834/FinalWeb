# Game Hub — Endterm Project

## Project continuation
Game Hub is a responsive website for finding computer gaming clubs, comparing prices and ratings, selecting a PC, and booking a gaming session. This Endterm version continues the same Midterm topic and group project.

**Group members**
- Sultan Nurlybek
- Amur Kudaibergen

## Pages
1. `index.html` — home page and dynamically generated club recommendations
2. `clubs.html` — club search, price/rating filters and Leaflet map
3. `details.html` — club details, PC selection, time checks and price calculation
4. `payment.html` — booking summary and form validation
5. `bookings.html` — saved reservations and cancellation
6. `profile.html` — profile and favorites list
7. `gallery.html` — searchable/filterable image gallery with jQuery effects
8. `sitemap.html` — website structure

## Endterm features
- JavaScript arrays (`clubCatalog`, `gamingTips`) store project-related data.
- Loops (`for...of`, `forEach`) process club data and page elements.
- Reusable functions include `getSavedData`, `saveData`, `showToast`, and `calculateSessionPrice`.
- DOM content is generated dynamically from JavaScript arrays.
- Search, filters, PC availability, booking calculations, favorites, theme switcher, gallery search/filter, image lightbox, and booking cancellation.
- Event handling uses `click`, `input`, `change`, and `submit`, with `preventDefault()` for controlled form submission.
- Payment form validation checks card holder name, 16-digit card number, expiry date, CVV, and missing booking data. Field-specific messages are displayed next to invalid fields.
- jQuery uses ID and class selectors, `closest()`, `find()`, and `parent()` traversal, click/input events, and `fadeIn()`, `fadeOut()`, and `slideToggle()` effects.
- JavaScript is organized in external files in `js/`.

## How to run
1. Download or clone this repository.
2. Open the folder in VS Code.
3. Start a local server (for example, Live Server) or open `index.html`.
4. Internet access is required for Bootstrap, jQuery, Leaflet and map tiles loaded from CDNs.

## How to test the features
1. Open `clubs.html`, search for a club and change the price/rating filters.
2. Press **Favorite** on a club card. Open **Profile → My Favorite Clubs** to view or remove it.
3. Use the theme button in the navigation to switch between dark and light themes.
4. Open a club's details, choose a date, PC and time range. Confirm that the total price updates.
5. Continue to the payment page. Try invalid card details to see field-level validation; then use correctly formatted demo values to test the confirmation flow.
6. Open **My Bookings** and cancel a reservation.
7. Open `gallery.html`, search images, filter by category, click an image to open the lightbox, or click a caption to collapse/expand its image.

## Important note
This is an educational front-end demonstration. It does not process real payments and must not be used to submit real bank card information. Use fictional test values only.

## Technologies
HTML5, CSS3, JavaScript, jQuery 3.7.1, Bootstrap 5, Leaflet.js, OpenStreetMap and browser LocalStorage.
