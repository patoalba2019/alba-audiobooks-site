const categoryNames = {
  "sweet-recipes": "Sweet Recipes",
  "savory-recipes": "Savory Recipes",
  drama: "Drama",
  horror: "Horror",
  action: "Action",
  documentary: "Documentary",
  instructive: "Instructive",
  business: "Business",
  wellness: "Wellness",
  travel: "Travel"
};

const statusNames = {
  "priority-production": "Priority",
  "catalog-blueprint": "Blueprint"
};

const catalogGrid = document.querySelector("#catalogGrid");
const priorityGrid = document.querySelector("#priorityGrid");
const categorySelect = document.querySelector("#categorySelect");
const statusSelect = document.querySelector("#statusSelect");
const searchInput = document.querySelector("#searchInput");
const template = document.querySelector("#bookTemplate");
const totalCount = document.querySelector("#totalCount");

function unique(values) {
  return [...new Set(values)].sort();
}

function createCard(book) {
  const node = template.content.firstElementChild.cloneNode(true);
  const image = node.querySelector(".book-cover");
  image.src = book.cover;
  image.alt = `${book.title_en} cover`;
  node.querySelector(".book-category").textContent = categoryNames[book.category] || book.category;
  node.querySelector(".book-status").textContent = statusNames[book.status] || book.status;
  node.querySelector("h3").textContent = book.title_en;
  node.querySelector(".book-subtitle").textContent = book.subtitle;
  node.querySelector(".book-format").textContent = book.format;
  node.querySelector(".book-length").textContent = book.target_length_hours;
  return node;
}

function matches(book) {
  const q = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const status = statusSelect.value;
  const text = [
    book.title_en,
    book.title_es,
    book.subtitle,
    book.category,
    book.format,
    book.language
  ]
    .join(" ")
    .toLowerCase();
  return (!q || text.includes(q)) && (!category || book.category === category) && (!status || book.status === status);
}

function render() {
  const priority = AUDIOBOOK_CATALOG.filter((book) => book.status === "priority-production");
  const filtered = AUDIOBOOK_CATALOG.filter(matches).filter(
    (book) => book.status !== "priority-production"
  );
  priorityGrid.replaceChildren(...priority.map(createCard));
  catalogGrid.replaceChildren(...filtered.map(createCard));
  totalCount.textContent = AUDIOBOOK_CATALOG.length;
}

function init() {
  for (const category of unique(AUDIOBOOK_CATALOG.map((book) => book.category))) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = categoryNames[category] || category;
    categorySelect.append(option);
  }

  searchInput.addEventListener("input", render);
  categorySelect.addEventListener("change", render);
  statusSelect.addEventListener("change", render);
  render();
}

init();
