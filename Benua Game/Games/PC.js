const gamesPerPage = 16;
let games = [];
let filteredGames = [];
let currentPage = 1;

function applyFilters(page = 1) {
  const query = document.getElementById("search").value.toLowerCase().trim();
  const order = document.getElementById("order")?.value || "";
  const genre = document.getElementById("genre")?.value || "";
  const sort = document.getElementById("sort")?.value || "";

  // 🔹 Filter berdasarkan judul
  filteredGames = games.filter(game =>
    game.title && game.title.toLowerCase().includes(query)
  );

  // 🔹 Filter berdasarkan genre
  if (genre) {
    filteredGames = filteredGames.filter(game =>
      JSON.parse(game.genre).includes(genre)
    );
  }

  // 🔹 Urutkan A-Z atau Z-A
  if (order === "az") {
    filteredGames.sort((a, b) => a.title.localeCompare(b.title));
  } else if (order === "za") {
    filteredGames.sort((a, b) => b.title.localeCompare(a.title));
  }

  // 🔹 Urutan tambahan (opsional)
  if (sort === "release_year") {
    filteredGames.sort((a, b) => b.release_year - a.release_year);
  } else if (sort === "rating") {
    filteredGames.sort((a, b) => b.rating - a.rating);
  } else if (sort === "size") {
    filteredGames.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
  }

  renderGames(page);
  renderPagination();
}

function renderGames(page = 1) {
  const start = (page - 1) * gamesPerPage;
  const end = start + gamesPerPage;
  const container = document.getElementById("game-grid");
  container.innerHTML = "";

  const currentGames = filteredGames.slice(start, end);

  currentGames.forEach(game => {
    const genres = JSON.parse(game.genre).join(", ");
    container.innerHTML += `
      <div class="game-card">
        <div class="cover">
          <img src="${game.cover_image_url}" alt="${game.title}">
        </div>
        <h3 class="title">${game.title}</h3>
        <p class="platform">${game.platform}</p>
        <div class="info-row">
          <div class="info-item"><i class="fa fa-calendar"></i><span>${game.release_year}</span></div>
          <div class="info-item"><i class="fa fa-star"></i><span>${game.rating}</span></div>
          <div class="info-item"><i class="fa fa-hdd"></i><span>${game.size} GB</span></div>
        </div>
      </div>
    `;
  });

  if (currentGames.length === 0) {
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align:center;">Game tidak ditemukan.</p>`;
  }
}

// 🔹 PAKAI pagination kamu
function renderPagination() {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  // tombol pertama <<
  if (currentPage > 1) {
    const firstBtn = document.createElement("button");
    firstBtn.textContent = "<<";
    firstBtn.onclick = () => gotoPage(1);
    paginationContainer.appendChild(firstBtn);
  }

  // tombol prev <
  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "<";
    prevBtn.onclick = () => gotoPage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);
  }

  // tentukan range angka yang ditampilkan
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // supaya selalu 5 angka kalau memungkinkan
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + 4);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }
  }

  // generate angka halaman
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) {
      pageBtn.classList.add("active");
    }
    pageBtn.onclick = () => gotoPage(i);
    paginationContainer.appendChild(pageBtn);
  }

  // tombol next >
  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = ">";
    nextBtn.onclick = () => gotoPage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
  }

  // tombol terakhir >>
  if (currentPage < totalPages) {
    const lastBtn = document.createElement("button");
    lastBtn.textContent = ">>";
    lastBtn.onclick = () => gotoPage(totalPages);
    paginationContainer.appendChild(lastBtn);
  }
}

function gotoPage(page) {
  currentPage = page;
  renderGames(page);
  renderPagination();
}

Papa.parse("games.csv", {
  download: true,
  header: true,
  complete: function(results) {
    games = results.data.filter(g => g.title);
    filteredGames = [...games];
    renderGames();
    renderPagination();

    // aktifkan filter saat tekan Enter atau tombol
    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("searchBtn");

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") applyFilters(1);
    });

    if (searchBtn) {
      searchBtn.addEventListener("click", () => applyFilters(1));
    }
  }
});
