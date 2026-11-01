// Portfolio server: serves /public and saves contact messages.
// Uses only Node.js built-in modules, so no "npm install" is needed.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

// Security headers sent with every response
const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; " +
    "font-src https://fonts.gstatic.com; img-src 'self' data: https:; " +
    "connect-src 'self' https://api.github.com; frame-src 'self'; object-src 'self'",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY, ...headers });
  res.end(body);
}
function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj), { "Content-Type": "application/json" });
}

// ---- Simple rate limit: 5 messages per IP every 10 minutes ----
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// ---- POST /api/contact ----
function handleContact(req, res) {
  const ip = req.socket.remoteAddress || "unknown";
  if (limited(ip)) return sendJson(res, 429, { ok: false, error: "Too many messages. Try again later." });

  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 10000) { req.destroy(); }   // refuse huge bodies
  });
  req.on("end", () => {
    let data;
    try { data = JSON.parse(raw); } catch { return sendJson(res, 400, { ok: false, error: "Invalid data." }); }

    const name = String(data.name || "").trim().slice(0, 100);
    const email = String(data.email || "").trim().slice(0, 150);
    const message = String(data.message || "").trim().slice(0, 3000);
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendJson(res, 400, { ok: false, error: "Please fill in name, a valid email, and message." });
    }

    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      let list = [];
      if (fs.existsSync(MESSAGES_FILE)) list = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8") || "[]");
      list.push({ name, email, message, date: new Date().toISOString() });
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(list, null, 2));
      console.log("New message from " + name);
      sendJson(res, 200, { ok: true });
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { ok: false, error: "Could not save the message." });
    }
  });
}

// ---- Static files ----
function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, "Forbidden");

  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, "404 - File not found: " + urlPath, { "Content-Type": "text/plain; charset=utf-8" });
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    });
  });
}

http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/contact") return handleContact(req, res);
  if (req.method === "GET" && req.url === "/api/health") return sendJson(res, 200, { ok: true });
  if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method not allowed");
  serveStatic(req, res);
}).listen(PORT, () => console.log("Portfolio running at http://localhost:" + PORT));