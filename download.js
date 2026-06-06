const gateway = (window.AURA_CHECKOUT_GATEWAY || "").replace(/\/$/, "");
const params = new URLSearchParams(window.location.search);
const sessionId = params.get("session_id");
const downloadTitle = document.querySelector("#downloadTitle");
const downloadMessage = document.querySelector("#downloadMessage");
const downloadButton = document.querySelector("#downloadButton");

function decodePayload(token) {
  const base64 = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return JSON.parse(atob(padded));
}

async function claim() {
  if (!gateway) {
    downloadTitle.textContent = "Download gateway is not connected yet.";
    downloadMessage.textContent =
      "The public catalog is online, but private paid downloads require the secure gateway URL in checkout-config.js.";
    return;
  }
  if (!sessionId) {
    downloadTitle.textContent = "Missing payment session.";
    downloadMessage.textContent = "Open this page from the checkout success link after payment.";
    return;
  }
  try {
    const response = await fetch(`${gateway}/claim?session_id=${encodeURIComponent(sessionId)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Payment could not be confirmed");
    const tokenPayload = decodePayload(data.download_token);
    downloadTitle.textContent = "Your download is unlocked.";
    downloadMessage.textContent = "This private link expires automatically. Save the audiobook after downloading it.";
    downloadButton.hidden = false;
    downloadButton.href = `${gateway}/download/${encodeURIComponent(tokenPayload.bookId)}?token=${encodeURIComponent(
      data.download_token
    )}`;
  } catch (error) {
    downloadTitle.textContent = "Payment confirmation failed.";
    downloadMessage.textContent = error.message;
  }
}

claim();
