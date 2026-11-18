function getBookings() {
    return JSON.parse(localStorage.getItem("gameHubBookings") || "[]");
  }

  function saveBookings(bookings) {
    localStorage.setItem(
      "gameHubBookings",
      JSON.stringify(bookings)
    );
  }

  function renderBookings() {

    const container = document.getElementById("bookingsContainer");

    const bookings = getBookings();

    container.innerHTML = "";

    if (bookings.length === 0) {

      container.innerHTML = `
            <div class="empty-state">
                <h2>No bookings yet</h2>
                <p>You have not booked any gaming sessions.</p>
                <a href="clubs.html" class="btn btn-primary">
                    Find a Club
                </a>
            </div>
        `;

      return;
    }

    bookings
      .slice()
      .reverse()
      .forEach(booking => {

        const item = document.createElement("article");

        item.className = "booking-item";

        item.innerHTML = `
                <div class="booking-item-header">
                    <div>
                        <h2>${booking.club}</h2>
                        <p class="text-muted mb-0">${booking.pc}</p>
                    </div>

                    <button
                        class="btn btn-outline-danger btn-sm cancel-button"
                        data-id="${booking.id}"
                    >
                        Cancel
                    </button>
                </div>

                <div class="booking-info">

                    <div>
                        <span>Date</span>
                        <strong>${booking.date}</strong>
                    </div>

                    <div>
                        <span>Time</span>
                        <strong>${booking.start} - ${booking.end}</strong>
                    </div>

                    <div>
                        <span>Duration</span>
                        <strong>${booking.hours} hour(s)</strong>
                    </div>

                    <div>
                        <span>Total</span>
                        <strong>${Number(booking.price).toLocaleString()} ₸</strong>
                    </div>

                    <div>
                        <span>Deposit</span>
                        <strong>${Number(booking.deposit).toLocaleString()} ₸</strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong class="text-success">Confirmed</strong>
                    </div>

                </div>
            `;

        container.appendChild(item);
      });

    document.querySelectorAll(".cancel-button").forEach(button => {

      button.addEventListener("click", function() {

        const id = Number(button.dataset.id);

        const updated =
          getBookings().filter(booking => booking.id !== id);

        saveBookings(updated);

        renderBookings();
      });

    });
  }

  renderBookings();
