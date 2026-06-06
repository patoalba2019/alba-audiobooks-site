const params = new URLSearchParams(window.location.search);
const requestedId = params.get("book") || "aab-119";
const book = AUDIOBOOK_CATALOG.find((item) => item.id === requestedId) || AUDIOBOOK_CATALOG[0];

const cover = document.querySelector("#checkoutCover");
const title = document.querySelector("#checkoutTitle");
const subtitle = document.querySelector("#checkoutSubtitle");
const price = document.querySelector("#checkoutPrice");
const marketplaceButton = document.querySelector("#marketplaceButton");
const sampleButton = document.querySelector("#sampleButton");
const notice = document.querySelector("#checkoutNotice");

const marketplaceUrl = book.marketplace_url || "";
const checkoutGateway = (window.AURA_CHECKOUT_GATEWAY || "").replace(/\/$/, "");

cover.src = book.cover;
cover.alt = `${book.title_en} cover`;
title.textContent = book.title_en;
subtitle.textContent = book.subtitle;
price.textContent = `$${book.price_usd}`;
sampleButton.href = `index.html#listen`;

async function startGatewayCheckout(event) {
  event.preventDefault();
  marketplaceButton.textContent = "Opening secure checkout...";
  marketplaceButton.setAttribute("aria-busy", "true");
  try {
    const response = await fetch(`${checkoutGateway}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: book.id, lang: params.get("audio") === "es" ? "es" : "en" })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Checkout is not available");
    window.location.href = data.checkout_url;
  } catch (error) {
    marketplaceButton.removeAttribute("aria-busy");
    marketplaceButton.textContent = "Request Paid Download";
    notice.textContent = error.message;
  }
}

if (checkoutGateway) {
  marketplaceButton.href = "#checkout";
  marketplaceButton.textContent = "Buy & Unlock Download";
  marketplaceButton.addEventListener("click", startGatewayCheckout);
  notice.textContent =
    "After payment, the secure gateway verifies the order and enables a private download link for the buyer.";
} else if (marketplaceUrl) {
  marketplaceButton.href = marketplaceUrl;
  marketplaceButton.textContent = "Buy & Unlock Download";
  notice.textContent =
    "After payment, the marketplace unlocks the complete audiobook download for the buyer. The public site never exposes the full file.";
} else {
  marketplaceButton.href = `mailto:patoalba2019@gmail.com?subject=Aura%20Audio%20Club%20checkout%20${encodeURIComponent(
    book.id
  )}`;
  marketplaceButton.textContent = "Request Paid Download";
  notice.textContent =
    "The secure checkout link for this title is prepared but not connected to a live marketplace yet. Full downloads should not be uploaded publicly before the payment link is active.";
}
