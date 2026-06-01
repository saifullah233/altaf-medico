/* =============================================
   ALTAF MEDICAL — Main JavaScript
   ============================================= */

"use strict";

// ── Cart State ──────────────────────────────────
const cart = { items: [], total: 0 };

function addToCart(name, price, category) {
  const existing = cart.items.find((i) => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.items.push({ name, price, category, qty: 1 });
  }
  cart.total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  updateCartUI();
  showToast(`${name} added to cart`, "success");
  openCart();
}

function removeFromCart(name) {
  cart.items = cart.items.filter((i) => i.name !== name);
  cart.total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.items.reduce((s, i) => s + i.qty, 0);
  // Badges
  document.querySelectorAll(".cart-badge, .mob-badge").forEach((el) => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
  // Cart body
  const body = document.querySelector(".cart-body");
  if (!body) return;
  if (cart.items.length === 0) {
    body.innerHTML = `<div class="cart-empty">
      <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
      <p>Your cart is empty</p><p style="font-size:.8rem;margin-top:6px">Add medicines to get started</p>
    </div>`;
  } else {
    body.innerHTML = cart.items
      .map(
        (item) => `
      <div class="cart-item">
        <div class="cart-item-img">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"/></svg>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
          <div class="cart-item-qty">Qty: ${item.qty}</div>
          <span class="cart-item-remove" onclick="removeFromCart('${item.name}')">✕ Remove</span>
        </div>
      </div>
    `,
      )
      .join("");
  }
  // Total
  const totalEl = document.querySelector(".cart-total-amount");
  if (totalEl) totalEl.textContent = `₹${cart.total.toFixed(2)}`;
}

function openCart() {
  document.querySelector(".cart-overlay")?.classList.add("open");
  document.querySelector(".cart-drawer")?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.querySelector(".cart-overlay")?.classList.remove("open");
  document.querySelector(".cart-drawer")?.classList.remove("open");
  document.body.style.overflow = "";
}

// ── WhatsApp Order ──────────────────────────────
function orderViaWhatsApp() {
  if (cart.items.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  const lines = cart.items
    .map((i) => `• ${i.name} x${i.qty} — ₹${(i.price * i.qty).toFixed(2)}`)
    .join("\n");
  const msg = `Hello Altaf Medical! I would like to order:\n\n${lines}\n\nTotal: ₹${cart.total.toFixed(2)}\n\nPlease confirm availability.`;
  window.open(
    `https://wa.me/918210692437?text=${encodeURIComponent(msg)}`,
    "_blank",
  );
}

// ── Toast ───────────────────────────────────────
function showToast(message, type = "") {
  const container =
    document.querySelector(".toast-container") ||
    (() => {
      const el = document.createElement("div");
      el.className = "toast-container";
      document.body.appendChild(el);
      return el;
    })();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── FAQ ─────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");
      document
        .querySelectorAll(".faq-item")
        .forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

// ── Navbar ──────────────────────────────────────
function initNavbar() {
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle("open");
    });

    // Close menu when a link is clicked
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove("open");
      }
    });
  }

  // Active link
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // Sticky shadow
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// ── Search ──────────────────────────────────────
function initSearch() {
  const input = document.querySelector(".search-input");
  const btn = document.querySelector(".search-btn");
  if (!input) return;
  const go = () => {
    const q = input.value.trim();
    if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
  };
  btn?.addEventListener("click", go);
  input.addEventListener("keydown", (e) => e.key === "Enter" && go());
}

// ── Category Filter ─────────────────────────────
function initCategoryFilter() {
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      document
        .querySelectorAll(".category-card")
        .forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      const cat = card.dataset.cat;
      filterProducts(cat);
    });
  });
}

function filterProducts(cat) {
  document.querySelectorAll(".product-card[data-cat]").forEach((card) => {
    if (cat === "all" || !cat) {
      card.style.display = "";
    } else {
      card.style.display = card.dataset.cat === cat ? "" : "none";
    }
  });
}

// ── Shop Page Filters ───────────────────────────
// Map ?cat= URL values (from index.html category cards) → data-cat values on shop cards
const SHOP_CAT_ALIAS = {
  rx: "prescription",
  vitamins: "vitamins",
  otc: "otc",
  diabetes: "diabetes",
  baby: "baby",
  surgical: "surgical",
  personal: "personal",
};

function initShopFilters() {
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  const catRaw = params.get("cat");

  if (q) {
    const searchInput = document.querySelector("#shopSearch");
    if (searchInput) searchInput.value = q;
  }

  if (catRaw) {
    const resolved = SHOP_CAT_ALIAS[catRaw] || catRaw;
    // Activate matching pill if present
    document.querySelectorAll(".cat-pill").forEach((p) => {
      const isMatch = p.dataset.cat === resolved;
      p.classList.toggle("active", isMatch);
      if (isMatch && typeof setPillFilter !== "undefined") {
        // update currentCat on shop page
        window._shopCurrentCat = resolved;
      }
    });
  }

  if (q || catRaw) applyShopFilters();

  document.querySelectorAll(".filter-check input").forEach((cb) => {
    cb.addEventListener("change", applyShopFilters);
  });

  document
    .querySelector("#sortSelect")
    ?.addEventListener("change", applyShopFilters);
  document
    .querySelector("#shopSearch")
    ?.addEventListener("input", applyShopFilters);
}

function applyShopFilters() {
  const q = document.querySelector("#shopSearch")?.value.toLowerCase() || "";
  const selectedCats = [
    ...document.querySelectorAll(".filter-check input:checked"),
  ].map((i) => i.value);
  let cards = document.querySelectorAll(".shop-product-card");
  let visible = 0;
  cards.forEach((card) => {
    const name =
      card.querySelector(".product-name")?.textContent.toLowerCase() || "";
    const cat = card.dataset.cat || "";
    const matchQ = !q || name.includes(q);
    const matchCat = selectedCats.length === 0 || selectedCats.includes(cat);
    if (matchQ && matchCat) {
      card.style.display = "";
      visible++;
    } else {
      card.style.display = "none";
    }
  });
  const countEl = document.querySelector(".results-count");
  if (countEl) countEl.textContent = `${visible} products found`;
}

function filterShopProducts(q, cat) {
  document.querySelectorAll(".shop-product-card").forEach((card) => {
    const name =
      card.querySelector(".product-name")?.textContent.toLowerCase() || "";
    card.style.display = !q || name.includes(q.toLowerCase()) ? "" : "none";
  });
}

// ── Tabs (global helper — used on product.html) ──
function switchTab(tabId, btn) {
  const scope = btn?.closest(".pd-tabs-nav")?.parentElement || document;
  scope
    .querySelectorAll(".pd-tab-btn, .tab-btn")
    .forEach((b) => b.classList.remove("active"));
  scope
    .querySelectorAll(".pd-tab-pane, .tab-pane")
    .forEach((p) => p.classList.remove("active"));
  btn?.classList.add("active");
  (
    scope.querySelector(`#tab-${tabId}`) ||
    document.querySelector(`#tab-${tabId}`)
  )?.classList.add("active");
}

// ── Tabs (legacy — class-based) ─────────────────
function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-pane")
        .forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector(`#tab-${tab}`)?.classList.add("active");
    });
  });
}

// ── Medicine Request Form ────────────────────────
function initRequestForm() {
  const form = document.querySelector("#requestForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("[name=name]")?.value || "";
    const phone = form.querySelector("[name=phone]")?.value || "";
    const medicine = form.querySelector("[name=medicine]")?.value || "";
    const msg = form.querySelector("[name=message]")?.value || "";
    const waMsg = `Hello Altaf Medical!\n\nMedicine Request:\nName: ${name}\nPhone: ${phone}\nMedicine: ${medicine}\n${msg ? "Note: " + msg : ""}\n\nPlease check availability.`;
    window.open(
      `https://wa.me/918210692437?text=${encodeURIComponent(waMsg)}`,
      "_blank",
    );
    showToast("Redirecting to WhatsApp…", "success");
  });
}

// ── Prescription Upload ─────────────────────────
function initPrescriptionForm() {
  const form = document.querySelector("#prescriptionForm");
  if (!form) return;
  // prescription.html uses id attrs; support both name and id
  const get = (selector) => form.querySelector(selector)?.value?.trim() || "";
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = get("[name=rxName]") || get("#rxName");
    const phone = get("[name=rxPhone]") || get("#rxPhone");
    const age = get("[name=rxAge]") || get("#rxAge");
    const urgency =
      form.querySelector("[name=rxUrgency], #rxUrgency")?.value || "Normal";
    const note = get("[name=rxNote]") || get("#rxNote");
    if (!name || !phone) {
      showToast("Please enter your name and phone number.");
      return;
    }
    const waMsg = `Hello Altaf Medical!\n\n📋 PRESCRIPTION ORDER\nName: ${name}\nPhone: ${phone}${age ? "\nAge: " + age : ""}\nUrgency: ${urgency}${note ? "\nNotes: " + note : ""}\n\nI will share the prescription image on WhatsApp. Kindly confirm.`;
    window.open(
      `https://wa.me/918210692437?text=${encodeURIComponent(waMsg)}`,
      "_blank",
    );
    showToast("Redirecting to WhatsApp…", "success");
  });
}

// ── Special Order Form ───────────────────────────
function initSpecialOrderForm() {
  const form = document.querySelector("#specialOrderForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("soName")?.value.trim() || "";
    const phone = document.getElementById("soPhone")?.value.trim() || "";
    const medicine = document.getElementById("soMedicine")?.value.trim() || "";
    const strength = document.getElementById("soStrength")?.value.trim() || "";
    const qty = document.getElementById("soQty")?.value.trim() || "";
    const urgency = document.getElementById("soUrgency")?.value || "";
    const doctor = document.getElementById("soDoctor")?.value.trim() || "";
    const msg = document.getElementById("soMessage")?.value.trim() || "";
    const hasPrescription = document.getElementById("hasPrescription")?.checked;
    if (!name || !phone || !medicine) {
      showToast("Please fill in name, phone and medicine name.");
      return;
    }
    const waMsg = `Hello Altaf Medical!\n\n🔍 SPECIAL MEDICINE REQUEST\nName: ${name}\nPhone: ${phone}\nMedicine: ${medicine}${strength ? "\nStrength: " + strength : ""}${qty ? "\nQuantity: " + qty : ""}\nUrgency: ${urgency}${doctor ? "\nDoctor: " + doctor : ""}\nHas Prescription: ${hasPrescription ? "Yes" : "No"}${msg ? "\n\nDetails:\n" + msg : ""}\n\nKindly check availability and revert. Thank you!`;
    window.open(
      `https://wa.me/918210692437?text=${encodeURIComponent(waMsg)}`,
      "_blank",
    );
    showToast("Request sent on WhatsApp!", "success");
  });
}

// ── Product Qty Handler ──────────────────────────
function initProductQty() {
  window.changeQty = function (delta) {
    const input = document.getElementById("pdQty");
    if (!input) return;
    input.value = Math.max(1, Math.min(99, parseInt(input.value || 1) + delta));
  };
  window.addToCartFromProduct = function () {
    const qty = parseInt(document.getElementById("pdQty")?.value || 1);
    const name =
      document.querySelector(".pd-title")?.textContent?.trim() || "Medicine";
    const priceEl = document.querySelector(".pd-price-current");
    const price = parseFloat(priceEl?.textContent?.replace("₹", "") || 0);
    for (let i = 0; i < qty; i++) addToCart(name, price, "Medicine");
  };
}

// ── Cart Events ─────────────────────────────────
function initCartEvents() {
  document.querySelector(".cart-overlay")?.addEventListener("click", closeCart);
  document.querySelector(".cart-close")?.addEventListener("click", closeCart);
  document.querySelectorAll(".nav-cart, .mob-btn.cart-mob").forEach((el) => {
    el.addEventListener("click", openCart);
  });
  document
    .querySelector(".checkout-whatsapp")
    ?.addEventListener("click", orderViaWhatsApp);
}

// ── Init ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initFAQ();
  initSearch();
  initCategoryFilter();
  initShopFilters();
  initTabs();
  initRequestForm();
  initPrescriptionForm();
  initSpecialOrderForm();
  initProductQty();
  initCartEvents();
  updateCartUI();

  // Animate on scroll (simple IntersectionObserver)
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(".why-card, .review-card, .category-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
      obs.observe(el);
    });
});
