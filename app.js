const views = document.querySelectorAll(".view");

document.querySelectorAll("[data-view]").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

function showView(id) {
  views.forEach(v => v.classList.toggle("active", v.id === id));
  if (id === "vip") loadOdds();
  if (id === "admin") loadAdmin();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("payBtn").addEventListener("click", () => {
  alert("Hii ni prototype. Hatua inayofuata ni kuunganisha payment gateway ya TSh 5,000.");
  showView("vip");
});

async function loadOdds() {
  const res = await fetch("/api/odds");
  const data = await res.json();
  const list = document.getElementById("oddsList");
  const empty = document.getElementById("emptyOdds");
  empty.classList.toggle("hidden", data.length !== 0);
  list.innerHTML = data.map(o => `
    <article class="odd">
      <div><h3>${escapeHtml(o.match)}</h3><p>${escapeHtml(o.pick)} · ${o.status}</p></div>
      <div class="odd-value">${Number(o.odd).toFixed(2)}</div>
    </article>
  `).join("");
}

async function loadAdmin() {
  const res = await fetch("/api/odds");
  const data = await res.json();
  document.getElementById("adminList").innerHTML = data.map(o => `
    <div class="admin-item">
      <span><strong>${escapeHtml(o.match)}</strong> — ${escapeHtml(o.pick)} — ${Number(o.odd).toFixed(2)}</span>
      <button class="delete" onclick="deleteOdd(${o.id})">Futa</button>
    </div>
  `).join("");
}

document.getElementById("oddsForm").addEventListener("submit", async e => {
  e.preventDefault();
  const form = new FormData(e.target);
  const body = Object.fromEntries(form.entries());
  const res = await fetch("/api/odds", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json();
    alert(err.error || "Imeshindikana.");
    return;
  }
  e.target.reset();
  await loadAdmin();
  alert("Odd imeongezwa.");
});

async function deleteOdd(id) {
  if (!confirm("Unataka kufuta odd hii?")) return;
  await fetch(`/api/odds/${id}`, { method: "DELETE" });
  loadAdmin();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

loadOdds();
