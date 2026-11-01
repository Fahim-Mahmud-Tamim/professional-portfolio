const $ = (id) => document.getElementById(id);
// Escape text so it is always safe to place inside HTML
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ========== 1. Identity ========== */
document.title = PROFILE.name + " | Portfolio";
$("brand").textContent = PROFILE.name.split(" ")[0] + ".";
$("hello").textContent = PROFILE.hello;
$("headline").textContent = PROFILE.headline;
$("motive").textContent = PROFILE.motive;
$("location").textContent = PROFILE.location;
$("university").textContent = PROFILE.university;
$("degree").textContent = PROFILE.degree;
$("footer").textContent = "© " + new Date().getFullYear() + " " + PROFILE.name;

// Photo: shows your initials if the image file is missing
const photo = $("photo");
photo.onerror = () => {
  photo.hidden = true;
  $("initials").hidden = false;
  $("initials").textContent = PROFILE.initials;
};
photo.src = PROFILE.photo;

["heroResume", "resumeDl", "resumeOpen"].forEach((id) => ($(id).href = PROFILE.resume));
$("resumeFrame").src = PROFILE.resume;
$("socials").innerHTML = PROFILE.socials
  .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`)
  .join("");

const stripHtml = STRIP.map((t) => `<span>${esc(t)}</span><i>✳</i>`).join("");
$("strip").innerHTML = stripHtml + stripHtml;

$("aboutText").innerHTML = ABOUT.map((p) => `<p>${esc(p)}</p>`).join("");
$("stats").innerHTML = STATS.map((s) => `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`).join("");
$("skillGrid").innerHTML = SKILLS.map(
  (g) => `<div class="skill"><h3>${esc(g.title)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`
).join("");
$("timeline").innerHTML = EDUCATION.map(
  (e) => `<li><time>${esc(e.when)}</time><h3>${esc(e.title)}</h3><p>${esc(e.place)}</p></li>`
).join("");

/* ========== 2. Theme toggle ========== */
function setTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("theme", t); } catch (e) {}
  $("themeBtn").textContent = t === "dark" ? "Light mode" : "Dark mode";
}
setTheme(document.documentElement.getAttribute("data-theme") || "dark");
$("themeBtn").addEventListener("click", () =>
  setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark")
);

/* ========== 3. Mobile menu ========== */
const menu = $("menu"), menuBtn = $("menuBtn");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) { menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
});

/* ========== 4. Typing animation ========== */
(function typing() {
  const el = $("typed"), roles = PROFILE.roles;
  if (!roles || !roles.length) return;
  if (reduceMotion) { el.textContent = roles[0]; return; }
  let r = 0, c = 0, deleting = false;
  (function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, c);
    if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1400); }
    if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; }
    c += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 40 : 80);
  })();
})();

/* ========== 5. Scroll progress + active nav link ========== */
const bar = $("progress");
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const links = [...menu.querySelectorAll('a[href^="#"]')];
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));

/* ========== 6. Projects: manual + GitHub, with filter and search ========== */
let allProjects = PROJECTS.map((p) => ({ ...p, source: "manual" }));
let activeTag = "All";
let query = "";

function tagsList() { return ["All", ...new Set(allProjects.flatMap((p) => p.tags))]; }

function renderFilters() {
  $("filters").innerHTML = tagsList()
    .map((t) => `<button type="button" data-tag="${esc(t)}" aria-pressed="${t === activeTag}">${esc(t)}</button>`)
    .join("");
}

function renderProjects() {
  const q = query.trim().toLowerCase();
  const list = allProjects.filter((p) => {
    const tagOk = activeTag === "All" || p.tags.includes(activeTag);
    const text = (p.title + " " + p.desc + " " + p.tags.join(" ")).toLowerCase();
    return tagOk && (!q || text.includes(q));
  });
  $("projectGrid").innerHTML = list
    .map(
      (p) => `
    <article class="card">
      ${p.image ? `<img src="${esc(p.image)}" alt="Screenshot of ${esc(p.title)}" loading="lazy">` : ""}
      <div class="card-top"><span>${p.source === "github" ? "From GitHub" : "Featured"}</span>${p.stars ? `<span>★ ${p.stars}</span>` : ""}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <div class="links">
        <a href="${esc(p.repo)}" target="_blank" rel="noopener">Git repository ↗</a>
        ${p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener">Live demo ↗</a>` : ""}
      </div>
    </article>`
    )
    .join("");
  $("projectNote").textContent = list.length ? "" : "No projects match. Try another word or tag.";
}

$("filters").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-tag]");
  if (!b) return;
  activeTag = b.dataset.tag;
  renderFilters();
  renderProjects();
});
$("search").addEventListener("input", (e) => { query = e.target.value; renderProjects(); });

renderFilters();
renderProjects();

// Load public repos from GitHub (silently skipped if offline or username not set)
async function loadGithub() {
  const user = PROFILE.githubUser;
  if (!user || user === "your-username") return;
  try {
    const res = await fetch("https://api.github.com/users/" + encodeURIComponent(user) + "/repos?per_page=100&sort=updated");
    if (!res.ok) return;
    const repos = await res.json();
    const known = new Set(allProjects.map((p) => p.repo.toLowerCase()));
    const fresh = repos
      .filter((r) => !r.fork && !known.has(r.html_url.toLowerCase()))
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, PROFILE.githubMax || 6)
      .map((r) => ({
        title: r.name,
        desc: r.description || "No description added yet.",
        tags: [r.language || "Code"],
        repo: r.html_url,
        live: r.homepage || "",
        image: "",
        stars: r.stargazers_count,
        source: "github"
      }));
    allProjects = allProjects.concat(fresh);
    renderFilters();
    renderProjects();
  } catch (err) { /* offline or rate limited: keep the manual projects */ }
}
loadGithub();

/* ========== 7. Contact form: save on server, fall back to email app ========== */
const form = $("contactForm"), status = $("formStatus");
function say(text, kind) { status.textContent = text; status.className = "form-status full " + (kind || ""); }

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (!data.name.trim() || !data.message.trim() || !form.email.checkValidity()) {
    return say("Please fill in your name, a valid email, and a message.", "err");
  }
  $("sendBtn").disabled = true;
  say("Sending...");
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (!res.ok || !out.ok) throw new Error(out.error || "Failed");
    form.reset();
    say("Message sent. Thank you, I will reply soon.", "ok");
  } catch (err) {
    // Server not reachable (for example on static hosting): open the email app instead
    say("Could not reach the server. Opening your email app instead.", "err");
    const subject = encodeURIComponent("Portfolio message from " + data.name);
    const body = encodeURIComponent(data.message + "\n\nFrom: " + data.name + " (" + data.email + ")");
    window.location.href = "mailto:" + PROFILE.email + "?subject=" + subject + "&body=" + body;
  } finally {
    $("sendBtn").disabled = false;
  }
});

$("copyMail").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(PROFILE.email); say("Email copied: " + PROFILE.email, "ok"); }
  catch (e) { say("Copy failed. My email is " + PROFILE.email, "err"); }
});