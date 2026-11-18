const paymentParams = new URLSearchParams(window.location.search);
const bookingInfo = {
  club: paymentParams.get("club") || "",
  pc: paymentParams.get("pc") || "",
  date: paymentParams.get("date") || "",
  start: paymentParams.get("start") || "",
  end: paymentParams.get("end") || "",
  hours: Number(paymentParams.get("hours") || 0),
  price: Number(paymentParams.get("price") || 0)
};

document.getElementById("clubName").textContent = bookingInfo.club || "Not selected";
document.getElementById("pcName").textContent = bookingInfo.pc || "Not selected";
document.getElementById("bookingDate").textContent = bookingInfo.date || "Not selected";
document.getElementById("bookingTime").textContent = bookingInfo.start && bookingInfo.end ? `${bookingInfo.start} - ${bookingInfo.end}` : "Not selected";
document.getElementById("bookingHours").textContent = bookingInfo.hours;
document.getElementById("totalPrice").textContent = bookingInfo.price.toLocaleString();
document.getElementById("deposit").textContent = Math.round(bookingInfo.price * 0.25).toLocaleString();

const paymentMethods = document.querySelectorAll(".payment-method");
const cardFields = document.getElementById("cardFields");
const cashMessage = document.getElementById("cashMessage");
let selectedMethod = "Card";

paymentMethods.forEach(button => {
  button.addEventListener("click", () => {
    paymentMethods.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    selectedMethod = button.dataset.method;
    cardFields.style.display = selectedMethod === "Card" ? "block" : "none";
    cashMessage.style.display = selectedMethod === "Card" ? "none" : "block";
    clearPaymentErrors();
  });
});

function addFieldError(input, message) {
  const field = input.closest(".mb-3") || input.parentElement;
  let error = field.querySelector(".field-error");
  if (!error) {
    error = document.createElement("small");
    error.className = "field-error text-danger d-block mt-1";
    field.appendChild(error);
  }
  error.textContent = message;
  input.classList.add("is-invalid");
}

function clearPaymentErrors() {
  document.querySelectorAll(".field-error").forEach(error => error.remove());
  document.querySelectorAll(".is-invalid").forEach(input => input.classList.remove("is-invalid"));
}

function validateCardFields() {
  clearPaymentErrors();
  let valid = true;
  const name = document.getElementById("cardName");
  const number = document.getElementById("cardNumber");
  const expiry = document.getElementById("cardDate");
  const cvv = document.getElementById("cardCvv");

  if (name.value.trim().length < 2) {
    addFieldError(name, "Enter the card holder name (at least 2 characters).");
    valid = false;
  }
  if (!/^\d{16}$/.test(number.value.replace(/\s/g, ""))) {
    addFieldError(number, "Card number must contain exactly 16 digits.");
    valid = false;
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value.trim())) {
    addFieldError(expiry, "Use MM/YY format, for example 08/28.");
    valid = false;
  } else {
    const [month, year] = expiry.value.split("/").map(Number);
    const now = new Date();
    const expiryDate = new Date(2000 + year, month, 1);
    if (expiryDate <= new Date(now.getFullYear(), now.getMonth(), 1)) {
      addFieldError(expiry, "This card expiry date has passed.");
      valid = false;
    }
  }
  if (!/^\d{3,4}$/.test(cvv.value.trim())) {
    addFieldError(cvv, "CVV must contain 3 or 4 digits.");
    valid = false;
  }
  return valid;
}

document.getElementById("paymentForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const message = document.getElementById("paymentMessage");
  message.textContent = "";
  message.className = "text-center mt-3 mb-0";

  if (!bookingInfo.club || !bookingInfo.pc || !bookingInfo.date || !bookingInfo.start || !bookingInfo.end || bookingInfo.price <= 0) {
    message.textContent = "Booking information is missing. Please start again from the club details page.";
    message.classList.add("text-danger");
    return;
  }

  if (selectedMethod === "Card" && !validateCardFields()) {
    message.textContent = "Please correct the highlighted fields.";
    message.classList.add("text-danger");
    return;
  }

  const bookings = getSavedData("gameHubBookings");
  const toMinutes = time => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };
  const newStart = toMinutes(bookingInfo.start);
  const newEnd = toMinutes(bookingInfo.end);
  const conflict = bookings.some(booking => booking.club === bookingInfo.club &&
    booking.pc === bookingInfo.pc && booking.date === bookingInfo.date &&
    newStart < toMinutes(booking.end) && newEnd > toMinutes(booking.start));

  if (conflict) {
    message.textContent = "This PC is already booked for this time. Please choose another PC or time.";
    message.classList.add("text-danger");
    return;
  }

  bookings.push({
    id: Date.now(), ...bookingInfo,
    deposit: Math.round(bookingInfo.price * 0.25),
    paymentMethod: selectedMethod,
    createdAt: new Date().toISOString()
  });
  saveData("gameHubBookings", bookings);
  message.textContent = "Booking confirmed! Redirecting to My Bookings...";
  message.classList.add("text-success");
  window.setTimeout(() => window.location.href = "bookings.html", 700);
});

document.getElementById("cardNumber")?.addEventListener("input", function() {
  const digits = this.value.replace(/\D/g, "").slice(0, 16);
  this.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
});
