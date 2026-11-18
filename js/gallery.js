$(function() {
  // jQuery ID and class selectors are used for search and filtering.
  $("#gallerySearch").on("input", function() {
    const query = $(this).val().toLowerCase();
    $(".gallery-item").each(function() {
      const caption = $(this).find(".gallery-caption").text().toLowerCase();
      if (caption.includes(query)) {
        $(this).fadeIn(180);
      } else {
        $(this).fadeOut(180);
      }
    });
  });

  $(".gallery-filter").on("click", function() {
    const filter = $(this).attr("data-filter");
    $(".gallery-filter").removeClass("active");
    $(this).addClass("active");
    $(".gallery-item").each(function() {
      const category = $(this).attr("data-category");
      const matches = filter === "all" || category === filter;
      if (matches) $(this).fadeIn(180);
      else $(this).fadeOut(180);
    });
  });

  // Delegated event + traversal methods: closest(), find(), parent().
  $(document).on("click", ".gallery-item img", function() {
    const image = $(this);
    const source = image.attr("src");
    const alt = image.attr("alt");
    image.closest(".gallery-item").find(".gallery-caption").parent().addClass("caption-open");
    $("#lightboxImage").attr("src", source).attr("alt", alt);
    $("#galleryLightbox").fadeIn(180).css("display", "flex").attr("aria-hidden", "false");
  });

  $(".gallery-caption").on("click", function() {
    $(this).parent().find("img").slideToggle(180);
  });

  $("#closeLightbox").on("click", function() {
    $("#galleryLightbox").fadeOut(180).attr("aria-hidden", "true");
  });
});
