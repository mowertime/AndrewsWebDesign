/* Olivier WoodWorks — interactions */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  if (burger) {
    burger.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
      var open = document.body.classList.contains("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll(".mobile-menu a").forEach(function (a) {
    a.addEventListener("click", function () {
      document.body.classList.remove("menu-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Shop rendering ---------- */
  var grid = document.getElementById("productGrid");
  var empty = document.getElementById("emptyState");
  var count = document.getElementById("shopCount");

  function renderProducts(filter) {
    if (!grid) return;
    var list = window.PRODUCTS.filter(function (p) {
      return !filter || filter === "All" || p.cat === filter;
    });
    grid.innerHTML = list
      .map(function (p) {
        var price = p.from ? "From " + p.price : p.price;
        return (
          '<article class="product-card" data-slug="' + p.slug + '" tabindex="0" role="button" aria-label="View ' + p.name + '">' +
            '<div class="card-media">' +
              '<span class="card-tag">' + p.cat + "</span>" +
              '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
            "</div>" +
            '<div class="card-body">' +
              '<span class="card-cat">' + p.cat + "</span>" +
              "<h3>" + p.name + "</h3>" +
              '<span class="card-price"><strong>' + price + "</strong></span>" +
            "</div>" +
          "</article>"
        );
      })
      .join("");

    if (empty) empty.style.display = list.length ? "none" : "block";
    if (count) count.textContent = list.length + (list.length === 1 ? " piece" : " pieces");
    grid.querySelectorAll(".product-card").forEach(function (card) {
      card.addEventListener("click", function () { openModal(card.getAttribute("data-slug")); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(card.getAttribute("data-slug"));
        }
      });
    });
  }

  /* ---------- Filters ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      renderProducts(btn.getAttribute("data-filter"));
    });
  });

  /* ---------- Product modal ---------- */
  var modal = document.getElementById("productModal");
  var modalBackdrop = document.getElementById("modalBackdrop");
  var modalClose = document.getElementById("modalClose");

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openModal(slug) {
    if (!modal) return;
    var p = window.PRODUCTS.find(function (x) { return x.slug === slug; });
    if (!p) return;
    var price = p.from ? "From " + p.price : p.price;
    var specs = (p.specs && p.specs.length)
      ? '<div class="modal-specs"><h4>Specifications</h4><ul>' +
        p.specs.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") +
        "</ul></div>"
      : "";
    var deposit = p.deposit
      ? '<div class="modal-note">Shown price is the deposit required to initiate your order. We will contact you to confirm all details, finish, and the full price of your piece.</div>'
      : "";
    var body = [
      '<div class="modal-media"><img src="' + p.img + '" alt="' + esc(p.name) + '"></div>',
      '<div class="modal-body">',
        '<span class="modal-cat">' + esc(p.cat) + "</span>",
        "<h3>" + esc(p.name) + "</h3>",
        '<div class="modal-price"><strong>' + esc(price) + "</strong></div>",
        '<p class="modal-desc">' + esc(p.desc) + "</p>",
        specs,
        deposit,
        '<div class="modal-actions">',
          '<a class="btn btn--solid" href="contact.html?piece=' + encodeURIComponent(p.name) + '">Enquire about this piece</a>',
          '<button class="btn btn--outline-dark" id="modalClose2" type="button">Close</button>',
        "</div>",
      "</div>"
    ].join("");

    modal.querySelector(".modal-panel").innerHTML = body.join("");
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    modal.querySelector("#modalClose2").addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", escKey);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", escKey);
  }

  function escKey(e) {
    if (e.key === "Escape") closeModal();
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);
  }

  /* Prefill contact form with piece name from query string */
  var pieceField = document.getElementById("fieldPiece");
  if (pieceField) {
    var params = new URLSearchParams(window.location.search);
    var piece = params.get("piece");
    if (piece) {
      pieceField.value = piece;
      var msg = document.getElementById("fieldMessage");
      if (msg) msg.focus();
    }
  }

  /* ---------- Featured carousel (home) ---------- */
  var featuredTrack = document.getElementById("featuredTrack");
  if (featuredTrack) {
    var FEATURED = [
      "louisiana-bayou-bed",
      "octagonal-empire-bed",
      "turned-leg-s242c",
      "empire-rocking-chair",
      "benches",
      "turned-leg-88dxx",
      "chest-of-drawers",
      "chest-of-drawers-7mra7",
      "bookcases",
      "single-drawer-one-door-cabinet-tdrsm",
      "shaker-style-end-table",
      "candle-holders"
    ];
    var fItems = window.PRODUCTS.filter(function (p) { return FEATURED.indexOf(p.slug) !== -1; });
    var fIndex = 0;
    var fTimer = null;

    function fPerView() {
      if (window.matchMedia("(max-width: 720px)").matches) return 1;
      if (window.matchMedia("(max-width: 960px)").matches) return 2;
      return 3;
    }

    function fRender() {
      var n = fPerView();
      var total = fItems.length;
      var slice = [];
      for (var i = 0; i < n; i++) {
        slice.push(fItems[(fIndex + i) % total]);
      }
      featuredTrack.innerHTML = slice
        .map(function (p) {
          var price = p.from ? "From " + p.price : p.price;
          return (
            '<article class="product-card" data-slug="' + p.slug + '" tabindex="0" role="button" aria-label="View ' + p.name + '">' +
              '<div class="card-media">' +
                '<span class="card-tag">' + p.cat + "</span>" +
                '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
              "</div>" +
              '<div class="card-body">' +
                '<span class="card-cat">' + p.cat + "</span>" +
                "<h3>" + p.name + "</h3>" +
                '<span class="card-price"><strong>' + price + "</strong></span>" +
              "</div>" +
            "</article>"
          );
        })
        .join("");

      featuredTrack.querySelectorAll(".product-card").forEach(function (card) {
        card.addEventListener("click", function () { openModal(card.getAttribute("data-slug")); });
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(card.getAttribute("data-slug"));
          }
        });
      });

      var dots = document.getElementById("featuredDots");
      if (dots) {
        dots.innerHTML = "";
        for (var d = 0; d < total; d++) {
          (function (idx) {
            var dot = document.createElement("button");
            dot.className = "featured-dot" + (idx === fIndex ? " is-active" : "");
            dot.setAttribute("aria-label", "Show piece " + (idx + 1));
            dot.addEventListener("click", function () {
              fIndex = idx;
              fRestart();
              fRender();
            });
            dots.appendChild(dot);
          })(d);
        }
      }
    }

    function fAdvance() {
      fIndex = (fIndex + 1) % fItems.length;
      fRender();
    }

    function fRestart() {
      if (fTimer) clearInterval(fTimer);
      fTimer = setInterval(fAdvance, 5000);
    }

    var fPrev = document.getElementById("featuredPrev");
    var fNext = document.getElementById("featuredNext");
    if (fPrev) {
      fPrev.addEventListener("click", function () {
        fIndex = (fIndex - 1 + fItems.length) % fItems.length;
        fRestart();
        fRender();
      });
    }
    if (fNext) {
      fNext.addEventListener("click", function () {
        fAdvance();
        fRestart();
      });
    }

    var featuredCarousel = document.getElementById("featuredCarousel");
    if (featuredCarousel) {
      featuredCarousel.addEventListener("mouseenter", function () { if (fTimer) clearInterval(fTimer); });
      featuredCarousel.addEventListener("mouseleave", fRestart);
    }

    window.addEventListener("resize", function () { fRestart(); fRender(); });

    fRender();
    fRestart();
  }

  renderProducts("All");
})();
