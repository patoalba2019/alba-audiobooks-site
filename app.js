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
  travel: "Travel",
  spirituality: "Spirituality",
  "self-help": "Self-Help",
  prosperity: "Prosperity",
  "angel-guidance": "Angel Guidance",
  "money-mindset": "Money Mindset"
};

const rows = {
  readyRail: (book) => Boolean(book.audio_preview),
  prosperityRail: (book) =>
    ["spirituality", "self-help", "prosperity", "angel-guidance", "money-mindset"].includes(book.category),
  recipeRail: (book) => ["sweet-recipes", "savory-recipes"].includes(book.category),
  fictionRail: (book) => ["drama", "horror", "action"].includes(book.category)
};

const catalogGrid = document.querySelector("#catalogGrid");
const categorySelect = document.querySelector("#categorySelect");
const availabilitySelect = document.querySelector("#availabilitySelect");
const searchInput = document.querySelector("#searchInput");
const template = document.querySelector("#bookTemplate");
const totalCount = document.querySelector("#totalCount");
const audioCount = document.querySelector("#audioCount");
const audioPlayer = document.querySelector("#audioPlayer");
const playerCover = document.querySelector("#playerCover");
const playerTitle = document.querySelector("#playerTitle");
const playerSubtitle = document.querySelector("#playerSubtitle");
const detailPanel = document.querySelector("#detailPanel");
const detailCover = document.querySelector("#detailCover");
const detailCategory = document.querySelector("#detailCategory");
const detailTitle = document.querySelector("#detailTitle");
const detailSubtitle = document.querySelector("#detailSubtitle");
const detailMeta = document.querySelector("#detailMeta");
const detailStatus = document.querySelector("#detailStatus");
const detailPlay = document.querySelector("#detailPlay");
const closeDetails = document.querySelector("#closeDetails");
const heroCover = document.querySelector("#heroCover");
const heroTitle = document.querySelector("#heroTitle");
const heroSubtitle = document.querySelector("#heroSubtitle");
const heroPlay = document.querySelector("#heroPlay");
const heroDetails = document.querySelector("#heroDetails");

const featuredBook =
  AUDIOBOOK_CATALOG.find((book) => book.id === "aab-119") ||
  AUDIOBOOK_CATALOG.find((book) => book.audio_preview) ||
  AUDIOBOOK_CATALOG[0];
let selectedBook = featuredBook;

function unique(values) {
  return [...new Set(values)].sort();
}

function readableStatus(book) {
  return book.audio_preview ? "Audio preview ready" : "Production queue";
}

function createCard(book) {
  const node = template.content.firstElementChild.cloneNode(true);
  const button = node.querySelector(".book-button");
  const image = node.querySelector(".book-cover");
  const badge = node.querySelector(".play-badge");
  image.src = book.cover;
  image.alt = `${book.title_en} cover`;
  node.querySelector(".book-category").textContent = categoryNames[book.category] || book.category;
  node.querySelector("h3").textContent = book.title_en;
  node.querySelector(".book-subtitle").textContent = book.subtitle;
  badge.textContent = book.audio_preview ? "Preview" : "Queue";
  node.classList.toggle("is-locked", !book.audio_preview);
  button.addEventListener("click", () => showDetails(book, true));
  return node;
}

function matches(book) {
  const q = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const availability = availabilitySelect.value;
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
  return (
    (!q || text.includes(q)) &&
    (!category || book.category === category) &&
    (!availability || book.production_state === availability)
  );
}

function playBook(book) {
  showDetails(book, false);
  if (!book.audio_preview) return;
  audioPlayer.src = book.audio_preview;
  playerCover.src = book.cover;
  playerTitle.textContent = book.title_en;
  playerSubtitle.textContent = `${categoryNames[book.category] || book.category} - ${book.language}`;
  audioPlayer.play().catch(() => {});
}

function showDetails(book, openPanel) {
  selectedBook = book;
  detailCover.src = book.cover;
  detailCover.alt = `${book.title_en} cover`;
  detailCategory.textContent = categoryNames[book.category] || book.category;
  detailTitle.textContent = book.title_en;
  detailSubtitle.textContent = book.subtitle;
  detailMeta.textContent = `${book.language} - ${book.target_length_hours} - ${book.format}`;
  detailStatus.textContent = readableStatus(book);
  detailPlay.disabled = !book.audio_preview;
  detailPlay.textContent = book.audio_preview ? "Play Preview" : "In Production";
  if (openPanel) detailPanel.classList.add("is-open");
}

function renderRail(id, predicate) {
  const rail = document.querySelector(`#${id}`);
  const books = AUDIOBOOK_CATALOG.filter(predicate);
  rail.replaceChildren(...books.map(createCard));
}

function renderCatalog() {
  const filtered = AUDIOBOOK_CATALOG.filter(matches);
  catalogGrid.replaceChildren(...filtered.map(createCard));
}

function render() {
  for (const [id, predicate] of Object.entries(rows)) renderRail(id, predicate);
  renderCatalog();
  totalCount.textContent = AUDIOBOOK_CATALOG.length;
  audioCount.textContent = AUDIOBOOK_CATALOG.filter((book) => book.audio_preview).length;
}

function init() {
  for (const category of unique(AUDIOBOOK_CATALOG.map((book) => book.category))) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = categoryNames[category] || category;
    categorySelect.append(option);
  }

  heroCover.src = featuredBook.cover;
  heroTitle.textContent = featuredBook.title_en;
  heroSubtitle.textContent = featuredBook.subtitle;
  heroPlay.addEventListener("click", () => playBook(featuredBook));
  heroDetails.addEventListener("click", () => showDetails(featuredBook, true));
  detailPlay.addEventListener("click", () => playBook(selectedBook));
  closeDetails.addEventListener("click", () => detailPanel.classList.remove("is-open"));
  searchInput.addEventListener("input", renderCatalog);
  categorySelect.addEventListener("change", renderCatalog);
  availabilitySelect.addEventListener("change", renderCatalog);
  showDetails(featuredBook, false);
  render();
}

init();
