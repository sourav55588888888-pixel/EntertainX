// EntertainX demo frontend. Data is illustrative and stored locally in this browser.
const entertainment = [
  {id:1,name:"Interstellar",type:"Movie",genre:"Sci-Fi",rating:8.7,year:2014,symbol:"✦",colors:["#48326e","#171426"],desc:"A cosmic journey through time and space."},
  {id:2,name:"Inception",type:"Movie",genre:"Thriller",rating:8.8,year:2010,symbol:"◈",colors:["#24616a","#111d30"],desc:"A mind-bending heist inside dreams."},
  {id:3,name:"The Dark Knight",type:"Movie",genre:"Action",rating:9.0,year:2008,symbol:"◢",colors:["#444957","#151923"],desc:"A city faces its greatest test."},
  {id:4,name:"Dangal",type:"Movie",genre:"Drama",rating:8.3,year:2016,symbol:"◎",colors:["#98613b","#3b2023"],desc:"A family story set in wrestling."},
  {id:5,name:"Spider-Verse",type:"Movie",genre:"Animation",rating:8.6,year:2023,symbol:"✳",colors:["#a43863","#291b4a"],desc:"A colourful multiverse adventure."},
  {id:6,name:"3 Idiots",type:"Movie",genre:"Comedy",rating:8.4,year:2009,symbol:"✎",colors:["#4e8d72","#1d3c40"],desc:"Friendship, learning and finding your way."},
  {id:7,name:"Breaking Bad",type:"Series",genre:"Crime",rating:9.5,year:2008,symbol:"⚗",colors:["#ba7838","#34251c"],desc:"A chemistry teacher enters a dangerous world."},
  {id:8,name:"Dark",type:"Series",genre:"Sci-Fi",rating:8.7,year:2017,symbol:"◉",colors:["#334c69","#151725"],desc:"A mystery connects four families."},
  {id:9,name:"Stranger Things",type:"Series",genre:"Sci-Fi",rating:8.7,year:2016,symbol:"ϟ",colors:["#a33942","#25172e"],desc:"Small-town mysteries and supernatural secrets."},
  {id:10,name:"The Office",type:"Series",genre:"Comedy",rating:9.0,year:2005,symbol:"▤",colors:["#b5a36b","#39372b"],desc:"Everyday office life, with plenty of awkwardness."},
  {id:11,name:"Panchayat",type:"Series",genre:"Comedy",rating:8.9,year:2020,symbol:"⌂",colors:["#7e9c58","#263b2b"],desc:"Life and surprises in a village."},
  {id:12,name:"Planet Earth",type:"Series",genre:"Documentary",rating:9.4,year:2006,symbol:"♧",colors:["#2e7e7b","#142e3b"],desc:"Explore the natural world."},
  {id:13,name:"Football",type:"Sports",genre:"Team Sport",rating:9.0,year:2026,symbol:"⚽",colors:["#43875e","#1b392b"],desc:"Tactics, rivalries and the beautiful game."},
  {id:14,name:"Cricket",type:"Sports",genre:"Team Sport",rating:9.2,year:2026,symbol:"🏏",colors:["#3e709a","#172b4a"],desc:"Follow matches, teams and iconic moments."},
  {id:15,name:"Formula 1",type:"Sports",genre:"Motorsport",rating:8.8,year:2026,symbol:"🏎",colors:["#aa3d42","#341a2a"],desc:"Speed, strategy and race-day drama."},
  {id:16,name:"Lo-fi Focus",type:"Music",genre:"Lo-fi",rating:8.5,year:2026,symbol:"♫",colors:["#7b68a6","#29213e"],desc:"A mellow soundtrack for study or downtime."},
  {id:17,name:"Indie Discoveries",type:"Music",genre:"Indie",rating:8.4,year:2026,symbol:"♪",colors:["#c17956","#402738"],desc:"Fresh sounds from independent artists."},
  {id:18,name:"Minecraft",type:"Gaming",genre:"Sandbox",rating:9.0,year:2011,symbol:"▦",colors:["#64854c","#243b2d"],desc:"Build, explore and create your own world."},
  {id:19,name:"Rocket League",type:"Gaming",genre:"Sports",rating:8.5,year:2015,symbol:"⚡",colors:["#3e72a9","#172b4d"],desc:"Fast cars meet football-style action."},
  {id:20,name:"Chess",type:"Gaming",genre:"Strategy",rating:8.7,year:2026,symbol:"♞",colors:["#7e7199","#29223d"],desc:"A timeless strategy game of skill."}
];

const cards = document.getElementById("cards");
const categorySelect = document.getElementById("categorySelect");
const genreSelect = document.getElementById("genreSelect");
const ratingRange = document.getElementById("ratingRange");
const ratingValue = document.getElementById("ratingValue");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const listCount = document.getElementById("listCount");
const watchlistItems = document.getElementById("watchlistItems");
let activeCategory = "All";
let toastTimer;

function getSaved() {
  try { return JSON.parse(localStorage.getItem("entertainx-watchlist") || "[]"); }
  catch { return []; }
}
let savedIds = getSaved();

function saveList() {
  try { localStorage.setItem("entertainx-watchlist", JSON.stringify(savedIds)); }
  catch { /* Browser storage may be disabled; list still works for this page session. */ }
  renderWatchlist();
  updateCount();
}
function updateCount() { listCount.textContent = savedIds.length; }

function genresFor(category) {
  const pool = entertainment.filter(item => category === "All" || item.type === category);
  return [...new Set(pool.map(item => item.genre))].sort();
}
function updateGenreOptions() {
  const previous = genreSelect.value;
  const genres = genresFor(categorySelect.value);
  genreSelect.innerHTML = '<option value="All">All genres</option>' +
    genres.map(g => `<option value="${escapeHTML(g)}">${escapeHTML(g)}</option>`).join("");
  if (genres.includes(previous)) genreSelect.value = previous;
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
}
function cardHTML(item) {
  const isSaved = savedIds.includes(item.id);
  return `<article class="card">
    <div class="art" style="background:linear-gradient(145deg,${item.colors[0]},${item.colors[1]})">
      <span class="kind">${escapeHTML(item.type.toUpperCase())}</span>
      <span class="rating">★ ${item.rating.toFixed(1)}</span>
      <span class="symbol">${item.symbol}</span>
    </div>
    <div class="card-body">
      <div class="card-title-row"><h3>${escapeHTML(item.name)}</h3>
        <button class="add-btn ${isSaved ? "saved" : ""}" data-save="${item.id}" aria-label="${isSaved ? "Remove from" : "Add to"} watchlist">${isSaved ? "✓" : "+"}</button>
      </div>
      <p>${escapeHTML(item.desc)}</p>
      <div class="card-footer"><span>${item.year}</span><span class="genre-tag">${escapeHTML(item.genre)}</span></div>
    </div>
  </article>`;
}
function renderCards() {
  const category = categorySelect.value;
  const genre = genreSelect.value;
  const minRating = Number(ratingRange.value);
  const query = searchInput.value.trim().toLowerCase();
  const filtered = entertainment.filter(item => {
    const categoryMatch = category === "All" || item.type === category;
    const genreMatch = genre === "All" || item.genre === genre;
    const ratingMatch = item.rating >= minRating;
    const searchMatch = `${item.name} ${item.genre} ${item.type} ${item.desc}`.toLowerCase().includes(query);
    const chipMatch = activeCategory === "All" || item.type === activeCategory;
    return categoryMatch && genreMatch && ratingMatch && searchMatch && chipMatch;
  }).sort((a,b) => b.rating - a.rating);
  cards.innerHTML = filtered.map(cardHTML).join("");
  emptyState.classList.toggle("hidden", filtered.length !== 0);
  document.getElementById("resultsTitle").textContent = query ? `Search results (${filtered.length})` : "Trending discoveries";
}
function renderWatchlist() {
  const items = entertainment.filter(item => savedIds.includes(item.id));
  if (!items.length) {
    watchlistItems.innerHTML = '<p class="muted">Save a card with the + button and it will show up here.</p>';
    return;
  }
  watchlistItems.innerHTML = items.map(item => `<div class="saved-item">
    <span class="mini" style="background:linear-gradient(145deg,${item.colors[0]},${item.colors[1]})">${item.symbol}</span>
    <span><b>${escapeHTML(item.name)}</b><small>${escapeHTML(item.type)} · ★ ${item.rating.toFixed(1)}</small></span>
    <button data-remove="${item.id}" aria-label="Remove ${escapeHTML(item.name)}">×</button>
  </div>`).join("");
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}
function setCategory(category) {
  activeCategory = category;
  categorySelect.value = category;
  updateGenreOptions();
  document.querySelectorAll(".filter-chip").forEach(button =>
    button.classList.toggle("active", button.dataset.category === category));
  renderCards();
}
document.getElementById("quickFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});
document.querySelectorAll(".category-tile").forEach(button => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
    document.getElementById("discover").scrollIntoView({behavior:"smooth"});
  });
});
cards.addEventListener("click", event => {
  const button = event.target.closest("[data-save]");
  if (!button) return;
  const id = Number(button.dataset.save);
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter(savedId => savedId !== id);
    showToast("Removed from your list");
  } else {
    savedIds.push(id);
    showToast("Added to your list");
  }
  saveList();
  renderCards();
});
watchlistItems.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  savedIds = savedIds.filter(id => id !== Number(button.dataset.remove));
  saveList(); renderCards(); showToast("Removed from your list");
});
categorySelect.addEventListener("change", () => {
  activeCategory = "All";
  document.querySelectorAll(".filter-chip").forEach(button =>
    button.classList.toggle("active", button.dataset.category === "All"));
  updateGenreOptions(); renderCards();
});
genreSelect.addEventListener("change", renderCards);
ratingRange.addEventListener("input", () => {
  ratingValue.textContent = `${Number(ratingRange.value).toFixed(1)}+`;
  renderCards();
});
searchInput.addEventListener("input", renderCards);
document.getElementById("recommendBtn").addEventListener("click", () => {
  renderCards();
  document.getElementById("discover").scrollIntoView({behavior:"smooth"});
  showToast("Recommendations updated for your preferences");
});
document.getElementById("resetBtn").addEventListener("click", () => {
  categorySelect.value = "All"; genreSelect.value = "All"; ratingRange.value = 0;
  ratingValue.textContent = "0.0+"; searchInput.value = ""; setCategory("All");
});
document.getElementById("clearListBtn").addEventListener("click", () => {
  savedIds = []; saveList(); renderCards(); showToast("Your list has been cleared");
});

document.getElementById("totalCount").textContent = entertainment.length;
updateGenreOptions(); updateCount(); renderCards(); renderWatchlist();
