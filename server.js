const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let odds = [
  { id: 1, match: "Arsenal vs Chelsea", pick: "Over 2.5", odd: 1.85, status: "VIP" },
  { id: 2, match: "Barcelona vs Sevilla", pick: "Barcelona Win", odd: 1.60, status: "VIP" },
  { id: 3, match: "Real Madrid vs Valencia", pick: "Both Teams To Score", odd: 1.75, status: "VIP" }
];

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "YUSUPHU ODDS VIP" });
});

app.get("/api/odds", (req, res) => {
  res.json(odds);
});

app.post("/api/odds", (req, res) => {
  const { match, pick, odd } = req.body;
  if (!match || !pick || !odd) {
    return res.status(400).json({ error: "Jaza match, pick na odd." });
  }
  const item = {
    id: Date.now(),
    match,
    pick,
    odd: Number(odd),
    status: "VIP"
  };
  odds.unshift(item);
  res.status(201).json(item);
});

app.delete("/api/odds/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = odds.length;
  odds = odds.filter(item => item.id !== id);
  if (odds.length === before) return res.status(404).json({ error: "Odd haijapatikana." });
  res.json({ ok: true });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`YUSUPHU ODDS VIP running on port ${PORT}`);
});