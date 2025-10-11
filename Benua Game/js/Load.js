<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

const gamesPerPage = 16;
let games = [];
let currentPage = 1;

function renderGames(page = 1) {
  const start = (page - 1) * gamesPerPage;
  const end = start + gamesPerPage;
  const container = document.getElementById("game-grid");
  container.innerHTML = "";

  games.slice(start, end).forEach(game => {
    const genres = JSON.parse(game.genre).join(", "); // karena array
    container.innerHTML += `
      <div class="game-card">
        <img src="${game.cover_image_url}" alt="${game.title}">
        <h3>${game.title}</h3>
        <p class="genre">${genres}</p>
        <p class="size">${game.size} GB</p>
        <p class="year">${game.release_year}</p>
      </div>
    `;
  });
}

function renderPagination() {
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `<button onclick="gotoPage(${i})">${i}</button>`;
  }
}

function gotoPage(page) {
  currentPage = page;
  renderGames(page);
}

Papa.parse("games.csv", {
  download: true,
  header: true,
  complete: function(results) {
    games = results.data;
    renderGames();
    renderPagination();
  }
});

