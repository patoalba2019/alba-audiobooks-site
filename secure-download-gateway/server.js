const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const port = Number(process.env.PORT || 8091);
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const signingSecret = process.env.DOWNLOAD_SIGNING_SECRET || "change-me-before-production";
const publicSiteUrl = (process.env.PUBLIC_SITE_URL || "http://localhost:8088").replace(/\/$/, "");
const privateAudioDir = process.env.PRIVATE_AUDIO_DIR || path.join(__dirname, "private-audio");
const productsPath = process.env.PRODUCTS_JSON || path.join(__dirname, "products.json");
const adminToken = process.env.ADMIN_TOKEN || "";
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": publicSiteUrl,
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) reject(new Error("Request body too large"));
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function productFor(id) {
  return products.find((product) => product.id === id);
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", signingSecret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token) {
  const [body, sig] = String(token || "").split(".");
  if (!body || !sig) throw new Error("Invalid token");
  const expected = crypto.createHmac("sha256", signingSecret).update(body).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error("Invalid signature");
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.exp < Date.now()) throw new Error("Expired token");
  return payload;
}

async function createStripeSession(product, lang) {
  if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is not configured");
  const cents = Math.round(Number(product.price_usd) * 100);
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${publicSiteUrl}/download.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${publicSiteUrl}/checkout.html?book=${encodeURIComponent(product.id)}`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(cents),
    "line_items[0][price_data][product_data][name]": `${product.title_en} - ${lang.toUpperCase()} download`,
    "metadata[book_id]": product.id,
    "metadata[lang]": lang
  });
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Stripe checkout error");
  return data.url;
}

async function claimStripeSession(sessionId) {
  if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is not configured");
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${stripeSecretKey}` }
  });
  const session = await response.json();
  if (!response.ok) throw new Error(session.error?.message || "Stripe session error");
  if (session.payment_status !== "paid") throw new Error("Payment is not confirmed");
  const product = productFor(session.metadata?.book_id);
  if (!product) throw new Error("Product not found");
  return sign({
    bookId: product.id,
    lang: session.metadata?.lang || "en",
    email: session.customer_details?.email || "",
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7
  });
}

function audioPath(bookId, lang) {
  const safeBook = String(bookId).replace(/[^a-z0-9-]/gi, "");
  const safeLang = lang === "es" ? "es" : "en";
  return path.join(privateAudioDir, safeBook, `${safeLang}.m4a`);
}

function streamDownload(res, payload) {
  const file = audioPath(payload.bookId, payload.lang);
  if (!fs.existsSync(file)) {
    json(res, 404, { error: "Complete audio file is not uploaded to private storage yet" });
    return;
  }
  const product = productFor(payload.bookId);
  const name = `${payload.bookId}-${payload.lang}-${(product?.title_en || "audiobook")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.m4a`;
  res.writeHead(200, {
    "Content-Type": "audio/mp4",
    "Content-Disposition": `attachment; filename="${name}"`,
    "X-Content-Type-Options": "nosniff"
  });
  fs.createReadStream(file).pipe(res);
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "OPTIONS") return json(res, 204, {});
  if (req.method === "GET" && url.pathname === "/health") {
    return json(res, 200, { ok: true, products: products.length, privateAudioDir });
  }
  if (req.method === "POST" && url.pathname === "/create-checkout-session") {
    const body = JSON.parse(await readBody(req));
    const product = productFor(body.bookId);
    if (!product) return json(res, 404, { error: "Product not found" });
    const checkoutUrl = await createStripeSession(product, body.lang === "es" ? "es" : "en");
    return json(res, 200, { checkout_url: checkoutUrl });
  }
  if (req.method === "GET" && url.pathname === "/claim") {
    const token = await claimStripeSession(url.searchParams.get("session_id"));
    return json(res, 200, { download_token: token });
  }
  if (req.method === "POST" && url.pathname === "/manual-token") {
    if (!adminToken || req.headers.authorization !== `Bearer ${adminToken}`) {
      return json(res, 401, { error: "Unauthorized" });
    }
    const body = JSON.parse(await readBody(req));
    const product = productFor(body.bookId);
    if (!product) return json(res, 404, { error: "Product not found" });
    return json(res, 200, {
      download_token: sign({
        bookId: product.id,
        lang: body.lang === "es" ? "es" : "en",
        email: body.email || "",
        exp: Date.now() + 1000 * 60 * 60 * 24 * 7
      })
    });
  }
  if (req.method === "GET" && url.pathname.startsWith("/download/")) {
    const bookId = decodeURIComponent(url.pathname.replace("/download/", ""));
    const payload = verify(url.searchParams.get("token"));
    if (payload.bookId !== bookId) return json(res, 403, { error: "Token does not match this product" });
    return streamDownload(res, payload);
  }
  return json(res, 404, { error: "Not found" });
}

http
  .createServer((req, res) => {
    route(req, res).catch((error) => json(res, 500, { error: error.message }));
  })
  .listen(port, () => {
    console.log(`Secure download gateway listening on :${port}`);
  });
