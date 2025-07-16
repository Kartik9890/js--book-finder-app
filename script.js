function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");
  const loader = document.getElementById("loader");

  resultsDiv.innerHTML = "";
  loader.style.display = "block"; // ⬅️ Show loader

  if (query === "") {
    alert("Please enter a search term");
    loader.style.display = "none"; // ⬅️ Hide loader
    return;
  }

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}`;

  console.log("Searching books for:", query);

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      loader.style.display = "none"; // ⬅️ Hide loader when done

      if (!data.items || data.items.length === 0) {
        resultsDiv.innerHTML = "<p>No books found.</p>";
        return;
      }

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
        `;
        resultsDiv.appendChild(bookEl);
      });
      document.getElementById("searchInput").value = "";
    })
    .catch((error) => {
      loader.style.display = "none"; // ⬅️ Hide loader on error too
      console.error("Error fetching books:", error);
      resultsDiv.innerHTML =
        "<p>Something went wrong. Please try again later.</p>";
    });
}
document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchBooks();
    }
  });

const toggleBtn = document.getElementById('toggleTheme');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  // Update button text based on mode
  if (document.body.classList.contains('dark')) {
    toggleBtn.textContent = '☀️ Light Mode';
  } else {
    toggleBtn.textContent = '🌙 Dark Mode';
  }
});

