document.getElementById("homeSearchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const search = document.getElementById("homeSearch").value.trim();

    if (search) {
      window.location.href = "clubs.html?search=" + encodeURIComponent(search);
    } else {
      window.location.href = "clubs.html";
    }
  });
