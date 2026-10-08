/* Runs before the page first paints: works out the sales stage so the right
   buttons are shown from the start (no jump when the page finishes loading). */
(function () {
  var cfg = window.BW_CONFIG || { dates: {} };
  var t = function (k) { return new Date(cfg.dates[k]).getTime(); };
  var now = Date.now();
  var forced = new URLSearchParams(location.search).get("state");
  var state = forced || (now <= t("preRegCloses") ? "prereg"
    : now < t("loyaltyOnSale") ? "closed"
    : now < t("publicOnSale") ? "loyalty" : "onsale");
  if (!forced && !cfg.dates.loyaltyOnSale) {
    state = "closed";                                   // on-sale date not set yet
    document.documentElement.classList.add("sale-tbc"); // hides countdowns and dates
  }
  document.documentElement.setAttribute("data-state", state);
})();
