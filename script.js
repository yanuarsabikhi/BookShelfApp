const buku = [];
const RENDER_EVENT = "render-bookshelfapp";
const SAVED_EVENT = "saved-bookshelfapp";
const STORAGE_KEY = "BOOKSHELFAPP_KEY";

//fungsi untuk mengecek dukungan local storage
function isStorageExist() {
    if (typeof Storage === undefined) {
        alert("Maaf, Browser Kamu tidak mendukung web storage");
        return false;
    }
    return true;
}

//membuat objek baru
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    };
}

function generateId() {
    return +new Date();
}

function alertMove(){
    alert ('Berhasil Dipindahkan!');
}

function alertDelete(){
    alert ('Berhasil Dihapus!');
}

function addBookItem() {
    //deklarasi konstanta yang diambil dari id
    const titleValue = document.getElementById("judul").value;
    const authorValue = document.getElementById("penulis").value;
    const yearValue = document.getElementById("tahun").value;
    const checkValue = document.getElementById("isReaded").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleValue, authorValue, yearValue, checkValue);
    buku.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeBook(bookObject) {
    const titleBook = document.createElement("h4");
    const yearBook = document.createElement("p");
    const authorBook = document.createElement("p");

    titleBook.innerText = bookObject.title + " ("+ bookObject.year +")";
    authorBook.innerText = "by " + bookObject.author;


    const containerBook = document.createElement("article");
    containerBook.classList.add("book_item");
    containerBook.append(titleBook, authorBook, yearBook);

    const container = document.createElement("div");
    container.classList.add("action");
    container.setAttribute("id", `buku-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const unreadButton = document.createElement("button");
        unreadButton.classList.add("pindahOrange");
        unreadButton.innerText = "Belum dibaca";

        unreadButton.addEventListener("click", function () {
            buttonUnread(bookObject.id);
            alertMove();
        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("hapusBuku");
        removeButton.innerText = "Hapus Buku";

        removeButton.addEventListener("click", function () {
            removeBtnBookItem(bookObject.id);
            alertDelete();
        });

        container.append(unreadButton, removeButton);
        containerBook.append(container);
    } else {
        const readButton = document.createElement("button");
        readButton.classList.add("pindahHijau");
        readButton.innerText = "Sudah dibaca";

        readButton.addEventListener("click", function () {
            buttonRead(bookObject.id);
            alertMove();
        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("hapusBuku");
        removeButton.innerText = "Hapus Buku";

        removeButton.addEventListener("click", function () {
            removeBtnBookItem(bookObject.id);
            alertDelete();
        });

        container.append(readButton, removeButton);
        containerBook.append(container);
    }

    return containerBook;
}

//menampilkan teks di console bahwa data berhasil disimpan
document.addEventListener(SAVED_EVENT, () => {
    console.log("Data saved!");
});

document.addEventListener(RENDER_EVENT, function () {
    const belumSelesai_list = document.getElementById("belumSelesai_list");
    const selesai_list = document.getElementById("selesai_list");
    belumSelesai_list.innerHTML = "";
    selesai_list.innerHTML = "";

    for (const bookItem of buku) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            belumSelesai_list.append(bookElement);
        } else {
            selesai_list.append(bookElement);
        }
    }
});

function findBook(bookId) {
    for (const bookItem of buku) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in buku) {
        if (buku[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

//menyimpan data buku di STORAGE KEY
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(buku);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

//fungsi untuk me-load data yang ada di storage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null)
        for (const bookItem of data) {
            buku.push(bookItem);
        }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function buttonRead(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function buttonUnread(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBtnBookItem(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;

    buku.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener("DOMContentLoaded", function () {
    const inputBook = document.getElementById("inputBuku");
    const searchSubmit = document.getElementById("cariBuku");

    inputBook.addEventListener("submit", function (event) {
        event.preventDefault();
        addBookItem();
    });

    searchSubmit.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBooks();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.getElementById("cariBuku").addEventListener("click", function (event) {
    event.preventDefault();
    const searchBook = document.getElementById("cariJudul").value.toLowerCase();
    const bookList = document.querySelectorAll(".book_item > h4");
    for (book of bookList) {
        if (book.innerText.toLowerCase().includes(searchBook)) {
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
        }
    }
});

