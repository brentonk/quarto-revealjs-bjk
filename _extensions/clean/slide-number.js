// Exclude the title slide from slide numbering: it shows no number, and
// counting starts at 1 on the following slide (displayed as "n/total" to
// match Quarto's slide-number: true -> 'c/t' behavior).
//
// Reveal's slideNumber option accepts a function, which Quarto's YAML
// config can't express, so it is applied here after initialization.
window.addEventListener("load", function () {
  var deck = window.Reveal;
  if (!deck || typeof deck.configure !== "function") return;

  deck.configure({
    slideNumber: function (slide) {
      var slides = deck.getSlides();
      var idx = slides.indexOf(slide);
      // formatNumber() renders `undefined` for an empty array, so blank
      // the title slide with an empty string instead
      return idx < 1 ? [""] : [idx, "/", slides.length - 1];
    },
  });

  var el = deck.getRevealElement().querySelector(".slide-number");
  function refresh() {
    if (el) {
      var onTitle = deck.getSlides().indexOf(deck.getCurrentSlide()) < 1;
      el.style.visibility = onTitle ? "hidden" : "visible";
    }
  }
  deck.on("slidechanged", refresh);

  // configure() alone doesn't repaint the currently displayed number
  deck.sync();
  refresh();
});
