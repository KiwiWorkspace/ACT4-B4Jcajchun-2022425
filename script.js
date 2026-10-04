"use strict";

const API_URL = "https://dummyjson.com/products?limit=30";
const TEMPLATE_ID = "product-template";

const state = {
  products: [],
  search: "",
  category: "all",
  cart: new Map(),
};

const badges = new Map();

const statusBox = document.getElementById("status");
const productsBox = document.getElementById("products");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const reloadButton = document.getElementById("reload");
const template = document.getElementById(TEMPLATE_ID);

const money = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "USD",
});

function setStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.classList.toggle("status--error", isError);
}

function matchesFilter(product) {
  const byCategory =
    state.category === "all" || product.category === state.category;

  const term = state.search.trim().toLowerCase();

  if (!term) {
    return byCategory;
  }

  const haystack = [product.title, product.brand, product.category]
    .join(" ")
    .toLowerCase();

  return byCategory && haystack.includes(term);
}

function updateBadge(productId) {
  const badge = badges.get(productId);
  const quantity = state.cart.get(productId) ?? 0;

  if (!badge) {
    return;
  }

  badge.textContent = quantity > 0 ? `En el carrito: ${quantity}` : "";
  badge.hidden = quantity === 0;
}

function addToCart(productId) {
  const next = (state.cart.get(productId) ?? 0) + 1;
  state.cart.set(productId, next);
  updateBadge(productId);
  setStatus(`Producto agregado. Items en el carrito: ${state.cart.size}`);
}

function createCard(product) {
  const card = template.content.firstElementChild.cloneNode(true);
  const image = card.querySelector(".card__img");
  const button = card.querySelector(".card__add");
  const badge = card.querySelector(".card__count");

  image.src = product.thumbnail;
  image.alt = product.title;
  image.loading = "lazy";
  card.querySelector(".card__title").textContent = product.title;
  card.querySelector(".card__brand").textContent = product.brand ?? "Sin marca";
  card.querySelector(".card__price").textContent = money.format(product.price);
  card.querySelector(".card__rating").textContent =
    `Valoracion: ${product.rating} / 5`;

  button.addEventListener("click", () => addToCart(product.id));
  button.setAttribute("aria-label", `Agregar ${product.title} al carrito`);

  badges.set(product.id, badge);
  updateBadge(product.id);

  return card;
}

function renderProducts() {
  const visible = state.products.filter(matchesFilter);

  productsBox.replaceChildren();
  badges.clear();

  if (visible.length === 0) {
    productsBox.append(
      Object.assign(document.createElement("p"), {
        className: "status",
        textContent: "No hay productos que coincidan con el filtro.",
      }),
    );
    setStatus(`0 de ${state.products.length} productos mostrados`);
    return;
  }

  const fragment = document.createDocumentFragment();
  visible.forEach((product) => fragment.append(createCard(product)));
  productsBox.append(fragment);

  setStatus(
    `Mostrando ${visible.length} de ${state.products.length} productos`,
  );
}

function renderCategories() {
  const categories = [
    ...new Set(state.products.map((product) => product.category)),
  ].sort();

  categorySelect.replaceChildren(
    new Option("Todas", "all"),
    ...categories.map((category) => new Option(category, category)),
  );

  categorySelect.value = "all";
  state.category = "all";
}

async function loadProducts() {
  reloadButton.disabled = true;
  productsBox.replaceChildren();
  setStatus("Cargando productos...");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    state.products = Array.isArray(data.products) ? data.products : [];

    renderCategories();
    renderProducts();
  } catch (error) {
    state.products = [];
    productsBox.replaceChildren();
    setStatus(`No se pudieron cargar los productos: ${error.message}`, true);
  } finally {
    reloadButton.disabled = false;
  }
}

function bindEvents() {
  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProducts();
  });

  categorySelect.addEventListener("change", (event) => {
    state.category = event.target.value;
    renderProducts();
  });

  reloadButton.addEventListener("click", loadProducts);
}

bindEvents();
loadProducts();
