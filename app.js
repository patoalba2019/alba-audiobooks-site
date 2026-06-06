const messages = {
  en: {
    nav_listen: "Listen",
    nav_prosperity: "Prosperity",
    nav_recipes: "Recipes",
    nav_catalog: "Catalog",
    ui_language: "Site",
    audio_language: "Audio",
    hero_eyebrow: "Original bilingual audio catalog",
    play_preview: "Play Preview",
    view_details: "View Details",
    secure_note: "Free previews only. Complete audiobooks unlock as private downloads after payment.",
    stat_titles: "Titles",
    stat_audio: "Previews",
    stat_lines: "Lines",
    search_label: "Search",
    category_label: "Category",
    availability_label: "Availability",
    all_categories: "All categories",
    all_titles: "All titles",
    audio_previews: "Audio previews",
    production_queue: "Production queue",
    listen_eyebrow: "Listen now",
    listen_title: "Browser narration previews ready",
    trending_eyebrow: "Trending themes",
    trending_title: "Spirituality, angels, prosperity and money mindset",
    recipes_eyebrow: "Food collections",
    recipes_title: "Sweet and savory recipe audiobooks",
    stories_eyebrow: "Stories",
    stories_title: "Drama, horror and action",
    browse_eyebrow: "Browse",
    browse_title: "Full production catalog",
    player_title: "Select an audiobook",
    player_subtitle: "Browser narration previews are available for the first production batch.",
    buy_unlock: "Buy & Unlock Download",
    preview: "Preview",
    queue: "Queue",
    in_production: "In Production",
    ready: "Audio preview ready",
    locked: "Full download locked until payment",
    download_note:
      "The public site streams only samples. The complete audiobook download is delivered after payment through the secure checkout or marketplace link.",
    no_preview: "This language preview is in production.",
    browser_preview: "Browser narration preview",
    search_placeholder: "angels, money, recipes, horror...",
    audio_label_en: "English preview",
    audio_label_es: "Spanish preview",
    spanish_generic:
      "Audiolibro original bilingue preparado para compra digital y descarga privada despues del pago."
  },
  es: {
    nav_listen: "Escuchar",
    nav_prosperity: "Prosperidad",
    nav_recipes: "Recetas",
    nav_catalog: "Catalogo",
    ui_language: "Sitio",
    audio_language: "Audio",
    hero_eyebrow: "Catalogo original de audio bilingue",
    play_preview: "Escuchar muestra",
    view_details: "Ver detalles",
    secure_note:
      "Solo hay muestras gratis. Los audiolibros completos se desbloquean como descargas privadas despues del pago.",
    stat_titles: "Titulos",
    stat_audio: "Muestras",
    stat_lines: "Lineas",
    search_label: "Buscar",
    category_label: "Categoria",
    availability_label: "Disponibilidad",
    all_categories: "Todas las categorias",
    all_titles: "Todos los titulos",
    audio_previews: "Muestras de audio",
    production_queue: "En produccion",
    listen_eyebrow: "Escuchar ahora",
    listen_title: "Muestras narradas por navegador listas",
    trending_eyebrow: "Temas populares",
    trending_title: "Espiritualidad, angeles, prosperidad y mentalidad de dinero",
    recipes_eyebrow: "Colecciones de comida",
    recipes_title: "Audiolibros de recetas dulces y saladas",
    stories_eyebrow: "Historias",
    stories_title: "Drama, terror y accion",
    browse_eyebrow: "Explorar",
    browse_title: "Catalogo completo de produccion",
    player_title: "Elige un audiolibro",
    player_subtitle: "Hay muestras narradas por el navegador para el primer lote de produccion.",
    buy_unlock: "Comprar y desbloquear descarga",
    preview: "Muestra",
    queue: "Cola",
    in_production: "En produccion",
    ready: "Muestra de audio lista",
    locked: "Descarga completa bloqueada hasta el pago",
    download_note:
      "El sitio publico reproduce solo muestras. La descarga completa se entrega despues del pago mediante checkout seguro o enlace de marketplace.",
    no_preview: "La muestra en este idioma esta en produccion.",
    browser_preview: "Muestra narrada por el navegador",
    search_placeholder: "angeles, dinero, recetas, terror...",
    audio_label_en: "Muestra en ingles",
    audio_label_es: "Muestra en espanol",
    spanish_generic:
      "Audiolibro original bilingue preparado para compra digital y descarga privada despues del pago."
  }
};

const categoryNames = {
  "sweet-recipes": { en: "Sweet Recipes", es: "Recetas dulces" },
  "savory-recipes": { en: "Savory Recipes", es: "Recetas saladas" },
  drama: { en: "Drama", es: "Drama" },
  horror: { en: "Horror", es: "Terror" },
  action: { en: "Action", es: "Accion" },
  documentary: { en: "Documentary", es: "Documental" },
  instructive: { en: "Instructive", es: "Instructivo" },
  business: { en: "Business", es: "Negocios" },
  wellness: { en: "Wellness", es: "Bienestar" },
  travel: { en: "Travel", es: "Viajes" },
  spirituality: { en: "Spirituality", es: "Espiritualidad" },
  "self-help": { en: "Self-Help", es: "Autoayuda" },
  prosperity: { en: "Prosperity", es: "Prosperidad" },
  "angel-guidance": { en: "Angel Guidance", es: "Guia angelical" },
  "money-mindset": { en: "Money Mindset", es: "Mentalidad de dinero" }
};

const rows = {
  readyRail: (book) => hasAnyPreview(book),
  prosperityRail: (book) =>
    ["spirituality", "self-help", "prosperity", "angel-guidance", "money-mindset"].includes(book.category),
  recipeRail: (book) => ["sweet-recipes", "savory-recipes"].includes(book.category),
  fictionRail: (book) => ["drama", "horror", "action"].includes(book.category)
};

const catalogGrid = document.querySelector("#catalogGrid");
const categorySelect = document.querySelector("#categorySelect");
const availabilitySelect = document.querySelector("#availabilitySelect");
const searchInput = document.querySelector("#searchInput");
const uiLangSelect = document.querySelector("#uiLangSelect");
const audioLangSelect = document.querySelector("#audioLangSelect");
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
const detailBuy = document.querySelector("#detailBuy");
const detailDownloadNote = document.querySelector("#detailDownloadNote");
const closeDetails = document.querySelector("#closeDetails");
const heroCover = document.querySelector("#heroCover");
const heroTitle = document.querySelector("#heroTitle");
const heroSubtitle = document.querySelector("#heroSubtitle");
const heroPlay = document.querySelector("#heroPlay");
const heroDetails = document.querySelector("#heroDetails");

let uiLang = localStorage.getItem("aura-ui-lang") || "en";
let audioLang = localStorage.getItem("aura-audio-lang") || "en";

const featuredBook =
  AUDIOBOOK_CATALOG.find((book) => book.id === "aab-119") ||
  AUDIOBOOK_CATALOG.find((book) => hasAnyPreview(book)) ||
  AUDIOBOOK_CATALOG[0];
let selectedBook = featuredBook;

function t(key) {
  return messages[uiLang][key] || messages.en[key] || key;
}

function unique(values) {
  return [...new Set(values)].sort();
}

function categoryName(category) {
  return categoryNames[category]?.[uiLang] || categoryNames[category]?.en || category;
}

function hasAnyPreview(book) {
  return Boolean(book.audio_preview_en || book.audio_preview_es || book.preview_script_en || book.preview_script_es);
}

function previewUrl(book) {
  return book[`audio_preview_${audioLang}`] || "";
}

function previewScript(book) {
  return book[`preview_script_${audioLang}`] || "";
}

function hasPreview(book) {
  return Boolean(previewUrl(book) || previewScript(book));
}

function bookTitle(book) {
  if (uiLang === "es") return book.title_es || book.title_en;
  return book.title_en;
}

function bookSubtitle(book) {
  if (uiLang === "en") return book.subtitle;
  if (book.subtitle_es) return book.subtitle_es;
  return t("spanish_generic");
}

function readableStatus(book) {
  return hasPreview(book) ? t("ready") : t("in_production");
}

function audioLabel() {
  return audioLang === "es" ? t("audio_label_es") : t("audio_label_en");
}

function preferredVoice() {
  const lang = audioLang === "es" ? "es" : "en";
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const candidates = voices.filter((voice) => voice.lang.toLowerCase().startsWith(lang));
  return (
    candidates.find((voice) => /female|samantha|paulina|monica|sofia|shelley|google/i.test(voice.name)) ||
    candidates[0] ||
    voices[0]
  );
}

async function speakPreview(book) {
  const scriptPath = previewScript(book);
  if (!scriptPath || !window.speechSynthesis) return false;
  const response = await fetch(scriptPath);
  if (!response.ok) return false;
  const text = await response.text();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, " ").trim());
  utterance.lang = audioLang === "es" ? "es-ES" : "en-US";
  utterance.rate = 0.92;
  utterance.pitch = 1.04;
  const voice = preferredVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
  return true;
}

function purchaseUrl(book) {
  const url = book.purchase_url || `checkout.html?book=${encodeURIComponent(book.id)}&audio=${audioLang}`;
  return url;
}

function renderStaticText() {
  document.documentElement.lang = uiLang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  searchInput.placeholder = t("search_placeholder");
  uiLangSelect.value = uiLang;
  audioLangSelect.value = audioLang;
}

function renderCategoryOptions() {
  const current = categorySelect.value;
  categorySelect.replaceChildren();
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = t("all_categories");
  categorySelect.append(allOption);

  for (const category of unique(AUDIOBOOK_CATALOG.map((book) => book.category))) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = categoryName(category);
    categorySelect.append(option);
  }
  categorySelect.value = current;
}

function renderAvailabilityOptions() {
  const current = availabilitySelect.value;
  const options = [
    ["", t("all_titles")],
    ["audio-preview-ready", t("audio_previews")],
    ["catalog-concept", t("production_queue")]
  ];
  availabilitySelect.replaceChildren(
    ...options.map(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      return option;
    })
  );
  availabilitySelect.value = current;
}

function createCard(book) {
  const node = template.content.firstElementChild.cloneNode(true);
  const button = node.querySelector(".book-button");
  const image = node.querySelector(".book-cover");
  const badge = node.querySelector(".play-badge");
  image.src = book.cover;
  image.alt = `${bookTitle(book)} cover`;
  node.querySelector(".book-category").textContent = categoryName(book.category);
  node.querySelector("h3").textContent = bookTitle(book);
  node.querySelector(".book-subtitle").textContent = bookSubtitle(book);
  badge.textContent = hasPreview(book) ? t("preview") : t("queue");
  node.classList.toggle("is-locked", !hasPreview(book));
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
    book.subtitle_es,
    book.category,
    categoryName(book.category),
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
  const url = previewUrl(book);
  if (url) {
    window.speechSynthesis?.cancel?.();
    audioPlayer.src = url;
    playerCover.src = book.cover;
    playerTitle.textContent = bookTitle(book);
    playerSubtitle.textContent = `${categoryName(book.category)} - ${audioLabel()}`;
    audioPlayer.play().catch(() => {});
    return;
  }
  if (previewScript(book)) {
    audioPlayer.removeAttribute("src");
    audioPlayer.load();
    playerCover.src = book.cover;
    playerTitle.textContent = bookTitle(book);
    playerSubtitle.textContent = `${categoryName(book.category)} - ${t("browser_preview")} - ${audioLabel()}`;
    speakPreview(book).catch(() => {
      playerSubtitle.textContent = t("no_preview");
    });
    return;
  }
  if (!url) {
    playerTitle.textContent = bookTitle(book);
    playerSubtitle.textContent = t("no_preview");
    return;
  }
}

function showDetails(book, openPanel) {
  selectedBook = book;
  detailCover.src = book.cover;
  detailCover.alt = `${bookTitle(book)} cover`;
  detailCategory.textContent = categoryName(book.category);
  detailTitle.textContent = bookTitle(book);
  detailSubtitle.textContent = bookSubtitle(book);
  detailMeta.textContent = `${book.language} - ${book.target_length_hours} hours - ${book.format}`;
  detailStatus.textContent = hasAnyPreview(book) ? t("locked") : readableStatus(book);
  detailPlay.disabled = !hasPreview(book);
  detailPlay.textContent = hasPreview(book) ? t("play_preview") : t("in_production");
  detailBuy.textContent = t("buy_unlock");
  detailBuy.href = purchaseUrl(book);
  detailDownloadNote.textContent = t("download_note");
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

function renderHero() {
  heroCover.src = featuredBook.cover;
  heroCover.alt = `${bookTitle(featuredBook)} cover`;
  heroTitle.textContent = bookTitle(featuredBook);
  heroSubtitle.textContent = bookSubtitle(featuredBook);
}

function render() {
  renderStaticText();
  renderCategoryOptions();
  renderAvailabilityOptions();
  renderHero();
  for (const [id, predicate] of Object.entries(rows)) renderRail(id, predicate);
  renderCatalog();
  totalCount.textContent = AUDIOBOOK_CATALOG.length;
  audioCount.textContent = AUDIOBOOK_CATALOG.filter((book) => hasAnyPreview(book)).length;
  showDetails(selectedBook, false);
}

function init() {
  uiLangSelect.addEventListener("change", () => {
    uiLang = uiLangSelect.value;
    localStorage.setItem("aura-ui-lang", uiLang);
    render();
  });
  audioLangSelect.addEventListener("change", () => {
    audioLang = audioLangSelect.value;
    localStorage.setItem("aura-audio-lang", audioLang);
    render();
  });
  heroPlay.addEventListener("click", () => playBook(featuredBook));
  heroDetails.addEventListener("click", () => showDetails(featuredBook, true));
  detailPlay.addEventListener("click", () => playBook(selectedBook));
  closeDetails.addEventListener("click", () => detailPanel.classList.remove("is-open"));
  searchInput.addEventListener("input", renderCatalog);
  categorySelect.addEventListener("change", renderCatalog);
  availabilitySelect.addEventListener("change", renderCatalog);
  render();
}

init();
