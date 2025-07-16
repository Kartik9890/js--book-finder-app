function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");
  const loader = document.getElementById("loader");

  resultsDiv.innerHTML = "";
  document.getElementById("resultCount").textContent = "";
  loader.style.display = "block"; // Show loader

  if (query === "") {
    alert("Please enter a search term");
    loader.style.display = "none";
    return;
  }

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}`;
  console.log("Searching books for:", query);

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      loader.style.display = "none"; // Hide loader

      if (!data.items || data.items.length === 0) {
        resultsDiv.innerHTML = "<p>No books found.</p>";
        return;
      }

      document.getElementById(
        "resultCount"
      ).textContent = `Showing ${data.items.length} results for "${query}"`;

      data.items.forEach((item) => {
        const book = item.volumeInfo;
        const title = book.title || "No Title";
        const authors = book.authors
          ? book.authors.join(", ")
          : "Unknown Author";
        const thumbnail =
          book.imageLinks?.thumbnail ||
          "https://via.placeholder.com/128x200?text=No+Image";
        const previewLink = book.previewLink || "#";

        const bookEl = document.createElement("div");
        bookEl.className = "book";
        bookEl.innerHTML = `
          <img src="${thumbnail}" alt="${title}">
          <h3>${title}</h3>
          <p>${authors}</p>
          <a href="${previewLink}" target="_blank">Preview</a>
          <button class="fav-btn">❤️</button>
          
        `;

        bookEl.querySelector(".fav-btn").addEventListener("click", () => {
          const bookData = {
            id: item.id,
            title,
            authors,
            thumbnail,
            previewLink,
          };
          saveToFavorites(bookData);
        });

        resultsDiv.appendChild(bookEl);
      });

      document.getElementById("searchInput").value = "";
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error("Error fetching books:", error);
      resultsDiv.innerHTML =
        "<p>Something went wrong. Please try again later.</p>";
    });
}

// 🔁 Add toggleFavorites listener only once — outside the search loop
// document.getElementById("toggleFavorites").addEventListener("click", () => {
//   const resultsDiv = document.getElementById("results");
//   const favs = JSON.parse(localStorage.getItem("favorites")) || [];

//   document.getElementById("resultCount").textContent = "Showing favorites";

//   resultsDiv.innerHTML = "";
//   if (favs.length === 0) {
//     resultsDiv.innerHTML = "<p>No favorites yet.</p>";
//     return;
//   }

//   favs.forEach((book) => {
//     const bookEl = document.createElement("div");
//     bookEl.className = "book";
//     bookEl.innerHTML = `
//       <img src="${book.thumbnail}" alt="${book.title}">
//       <h3>${book.title}</h3>
//       <p>${book.authors}</p>
//       <a href="${book.previewLink}" target="_blank">Preview</a>
//       <button class="remove-btn">❌ Remove</button>
//     `;
//     resultsDiv.appendChild(bookEl);
//   });
// });
document.getElementById('toggleFavorites').addEventListener('click', showFavorites);

// 🔁 Trigger search on Enter key
document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchBooks();
    }
  });

// 🌗 Theme toggle logic
const themeSwitch = document.getElementById("themeSwitch");
const themeLabel = document.getElementById("themeLabel");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeSwitch.checked = true;
  themeLabel.textContent = "🌙 Dark Mode";
}

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeLabel.textContent = isDark ? "🌙 Dark Mode" : "🌞 Light Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ❤️ Save to favorites
function saveToFavorites(book) {
  const existing = JSON.parse(localStorage.getItem("favorites")) || [];
  const alreadyExists = existing.some((b) => b.id === book.id);
  if (alreadyExists) return;
  existing.push(book);
  localStorage.setItem("favorites", JSON.stringify(existing));
}

function removeFavorite(bookId) {
  const existing = JSON.parse(localStorage.getItem('favorites')) || [];
  const updated = existing.filter(book => book.id !== bookId);
  localStorage.setItem('favorites', JSON.stringify(updated));
}

function showFavorites() {
  const resultsDiv = document.getElementById('results');
  const favs = JSON.parse(localStorage.getItem('favorites')) || [];

  document.getElementById('resultCount').textContent = 'Showing favorites';
  resultsDiv.innerHTML = '';

  if (favs.length === 0) {
    resultsDiv.innerHTML = '<p>No favorites yet.</p>';
    return;
  }

  favs.forEach(book => {
    const bookEl = document.createElement('div');
    bookEl.className = 'book';
    bookEl.innerHTML = `
      <img src="${book.thumbnail}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>${book.authors}</p>
      <a href="${book.previewLink}" target="_blank">Preview</a>
      <button class="remove-btn">❌ Remove</button>
    `;

    bookEl.querySelector('.remove-btn').addEventListener('click', () => {
      removeFavorite(book.id);
      showFavorites(); // re-render
    });

    resultsDiv.appendChild(bookEl);
  });
}
