document.addEventListener("DOMContentLoaded", () => {
  const submit = document.getElementById("inputBook");
  submit.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Buku baru telah ditambahkan`);
    addBook();
  });

  // initialize variable
  const books = [];
  const RENDER_EVENT = "render-books";
  const SAVE_EVENT = "save-book";
  const STORAGE_KEY = "BOOKS";

  // generate ID
  const generateID = () => +new Date();

  // generate all books
  const generateBooksObject = (id, title, author, year, isComplete) => {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  };

  // add new book
  const addBook = () => {
    const id = generateID();
    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const numberYear = parseInt(document.getElementById("inputBookYear").value);
    const isCompleteChecked = document.getElementById(
      "inputBookIsComplete"
    ).checked;

    const bookObject = generateBooksObject(
      id,
      textTitle,
      textAuthor,
      numberYear,
      isCompleteChecked
    );
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToStorage();
  };

  // make book layout
  const makeBooks = (bookObject) => {
    // create elements for displaying book information
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;
    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Author: " + bookObject.author;
    const numberYear = document.createElement("p");
    numberYear.innerText = "Tahun terbit: " + bookObject.year;

    const containerText = document.createElement("div");
    containerText.append(textTitle, textAuthor, numberYear);
    const containerAction = document.createElement("div");
    containerAction.classList.add("action");

    // validation is completed read
    if (bookObject.isComplete === true) {
      const completeBookButton = document.createElement("button");
      completeBookButton.classList.add("green");
      completeBookButton.innerText = "Belum dibaca";
      completeBookButton.addEventListener("click", () => {
        alert(
          `Buku "${bookObject.title}" Sudah dipindahkan ke rak buku "Belum dibaca"`
        );
        inCompleteBooks(bookObject.id);
      });

      const editBookButton = document.createElement("button");
      editBookButton.classList.add("blue");
      editBookButton.innerText = "Edit";
      editBookButton.addEventListener("click", () => {
        editBook(bookObject.id);
      });

      const deleteBookButton = document.createElement("button");
      deleteBookButton.classList.add("red");
      deleteBookButton.innerText = "Hapus Buku";
      deleteBookButton.addEventListener("click", () => {
        alert(`Buku "${bookObject.title}" telah dihapus`);
        deletedBooks(bookObject.id);
      });

      containerAction.append(
        completeBookButton,
        editBookButton,
        deleteBookButton
      );
    } else {
      const inCompleteBookButton = document.createElement("button");
      inCompleteBookButton.classList.add("green");
      inCompleteBookButton.innerText = "Selesai dibaca";
      inCompleteBookButton.addEventListener("click", () => {
        alert(
          `Buku "${bookObject.title}" Sudah dipindahkan ke rak buku "Selesai dibaca"`
        );
        completeBooks(bookObject.id);
      });

      const editBookButton = document.createElement("button");
      editBookButton.classList.add("blue");
      editBookButton.innerText = "Edit";
      editBookButton.addEventListener("click", () => {
        editBook(bookObject.id);
      });

      const deleteBookButton = document.createElement("button");
      deleteBookButton.classList.add("red");
      deleteBookButton.innerText = "Hapus Buku";
      deleteBookButton.addEventListener("click", () => {
        alert(`Buku "${bookObject.title}" telah dihapus`);
        deletedBooks(bookObject.id);
      });

      containerAction.append(
        inCompleteBookButton,
        editBookButton,
        deleteBookButton
      );
    }

    // make container
    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(containerText, containerAction);
    container.setAttribute("id", `book-${bookObject.id}`);

    // Function to edit book
    const editBook = (bookId) => {
      const book = findBook(bookId);
      if (!book) return;

      const newTitle = prompt("Masukkan judul baru:", book.title);
      const newAuthor = prompt("Masukkan penulis baru:", book.author);
      const newYear = prompt("Masukkan tahun terbit baru:", book.year);
      const newIsComplete = confirm("Buku sudah selesai dibaca?");

      book.title = newTitle || book.title;
      book.author = newAuthor || book.author;
      book.year = newYear || book.year;
      book.isComplete = newIsComplete;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveDataToStorage();
    };

    // function for button completeBookButton
    const completeBooks = (bookId) => {
      const bookTarget = findBook(bookId);
      if (bookTarget === null) return;

      bookTarget.isComplete = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveDataToStorage();
    };

    // function for button inCompleteBookButton
    const inCompleteBooks = (bookId) => {
      const bookTarget = findBook(bookId);
      if (bookTarget === null) return;

      bookTarget.isComplete = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveDataToStorage();
    };

    // function for button deleteBookButton
    const deletedBooks = (bookId) => {
      const bookTarget = findBookByIndex(bookId);
      if (bookTarget === -1) return;

      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveDataToStorage();
    };

    // function for finding a book by id
    const findBook = (bookId) => {
      for (const bookItem of books) {
        if (bookItem.id === bookId) return bookItem;
      }

      return null;
    };

    // function for finding a book by index
    const findBookByIndex = (bookId) => {
      for (const index in books) {
        if (books[index].id === bookId) return index;
      }

      return -1;
    };

    return container;
  };

  // LOCAL STORAGE VALIDATION
  const isStorageExist = () => {
    if (typeof Storage === undefined) {
      alert("Browser anda tidak mendukung local storage");
      return false;
    }
    return true;
  };
  const saveDataToStorage = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVE_EVENT));
    }
  };
  const localDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  // SEARCH FORM
  const searchForm = document.getElementById("searchBook");
  const searchInput = document.getElementById("searchBookTitle");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchInput = document.getElementById("searchBookTitle").value;
    const searchResult = searchBook(searchInput);
    renderSearchResult(searchResult);
  });
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const searchResult = searchBook(searchInput.value);
      renderSearchResult(searchResult);
    }
  });
  // search by book
  const searchBook = (query) => {
    const searchResult = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    return searchResult;
  };
  // render search results
  const renderSearchResult = (results) => {
    const searchResultContainer = document.getElementById(
      "display-search-results"
    );
    const searchResultsH2 = document.getElementById("title_render_search");
    const searchResults = document.getElementById("searchResults");

    searchResultContainer.style.display = "block";
    searchResultsH2.style.display = "block";

    searchResults.style.display = "block";
    searchResults.innerHTML = "";

    if (results.length === 0) {
      const noResultMessage = document.createElement("p");
      noResultMessage.textContent = "No results found.";
      searchResults.appendChild(noResultMessage);
    } else {
      results.forEach((result) => {
        const bookElement = makeBooks(result);
        searchResults.appendChild(bookElement);
      });
    }
  };

  // custom event
  document.addEventListener(SAVE_EVENT, () => {
    console.log(books);
  });

  document.addEventListener(RENDER_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
    try {
      const incompleteBooksList = document.getElementById(
        "incompleteBookshelfList"
      );
      incompleteBooksList.innerHTML = "";
      const completeBooksList = document.getElementById(
        "completeBookshelfList"
      );
      completeBooksList.innerHTML = "";

      for (const bookItem of books) {
        const bookElement = makeBooks(bookItem);
        if (!bookItem.isComplete) {
          incompleteBooksList.append(bookElement);
        } else {
          completeBooksList.append(bookElement);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  if (isStorageExist()) {
    localDataFromStorage();
  }
});
