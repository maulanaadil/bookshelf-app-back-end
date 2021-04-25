const {nanoid} = require("nanoid");
const books = require("./books");

const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    // Client tidak melampirkan properti namepada request body.
    if (!name || name === "") {
        const response = h.response({
            status: `fail`,
            message: `Gagal menambahkan buku. Mohon isi nama buku`,
        });
        response.code(400);
        return response;
    }

    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
    if (readPage > pageCount) {
        const response = h.response({
            status: `fail`,
            message: `Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount`,
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };
    books.push(newBook);

    // Ngecek Jika success ditambahkan
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: `success`,
            message: `Buku berhasil ditambahkan`,
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    // Server gagal memasukkan buku karena alasan umum (generic error).
    const response = h.response({
        status: `error`,
        message: `Buku gagal ditambahkan`,
    });
    response.code(500);
    return response;

};

const getAllBooksHandler = (request, h) => {
    const {name, reading, finished} = request.query;

    /*
    Tampilkan seluruh buku yang mengandung nama berdasarkan nilai yang diberikan pada query ini.
    Contoh /books?name=”dicoding”, maka akan menampilkan daftar buku yang mengandung nama “dicoding”
    secara non-case sensitive (tidak peduli besar dan kecil huruf).
     */

    if (name) {
        const getAllBooksDicoding = books
            .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
            .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }));
        const response = h.response({
            status: `success`,
            data: {
                books: getAllBooksDicoding,
            },
        });
        response.code(200);
        return response;
    }

    /*
    Bernilai 0 atau 1. Bila 0, maka tampilkan buku yang sedang tidak dibaca (reading: false).
    Bila 1, maka tampilkan buku yang sedang dibaca (reading: true).
    Selain itu, tampilkan buku baik sedang dibaca atau tidak.
     */
    if (reading) {
        let getAllReadBooks;
        if (reading === `0`) {
            getAllReadBooks = books
                .filter((book) => book.reading === false)
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }));
        } else {
            getAllReadBooks = books
                .filter((book) => book.reading === true)
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }));
        }
        const response = h.response({
            status: `success`,
            data: {
                books: getAllReadBooks,
            }
        });
        response.code(200);
        return response;
    }

    /*
    Bernilai 0 atau 1. Bila 0, maka tampilkan buku yang sudah belum selesai dibaca (finished: false).
    Bila 1, maka tampilkan buku yang sudah selesai dibaca (finished: true).
    Selain itu, tampilkan buku baik yang sudah selesai atau belum dibaca.
     */

    if (finished) {
        let getAllFinishedBook;
        if (finished === `1`) {
            getAllFinishedBook = books
                .filter((book) => book.finished === true)
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }));
        } else {
            getAllFinishedBook = books
                .filter((book) => book.finished === false)
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }));
        }
        const response = h.response({
            status: `success`,
            data: {
                books: getAllFinishedBook,
            }
        });
        response.code(200);
        return response;
    }

    /*
    Getting all book yang sudah di filter
     */
    const getAllBooks = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const response = h.response({
        status: `success`,
        data: {
            books: getAllBooks,
        }
    });
    response.code(200);
    return response;

};

/*
    Mendapat data dari id book
 */
const getBooksByIdHandler = (request, h) => {
    const {bookId} = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book) {
        const response = h.response({
            status: `success`,
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: `fail`,
        message: `Buku tidak ditemukan`,
    });
    response.code(404);
    return response;
};

/*
    Mengubah data dari id book
 */
const editBookByHandler = (request, h) => {
    const {bookId} = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const index = books.findIndex((book) => book.id === bookId);
    const updatedAt = new Date().toISOString();

    /*
    Jika tidak memasukan properti name
     */
    if (!name || name === "") {
        const response = h.response({
            status: `fail`,
            message: `Gagal memperbarui buku. Mohon isi nama buku`,
        });
        response.code(400);
        return response;
    }

    /*
    Jika melampirkan nilai properti readPage lebih besar dari pageCount
     */
    if (readPage > pageCount) {
        const response = h.response({
            status: `fail`,
            message: `Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount`,
        });
        response.code(400);
        return response;
    }

    /*
    Jika berhasil menemukan id
     */
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: `success`,
            message: `Buku berhasil diperbarui`,
        });
        response.code(200);
        return response;
    }

    /*
    Jika gagal menemukan id
     */
    const response = h.response({
        status: `fail`,
        message: `Gagal memperbarui buku. Id tidak ditemukan`,
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: `success`,
            message: `Buku berhasil dihapus`,
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: `fail`,
        message: `Buku gagal dihapus. Id tidak ditemukan`,
    });
    response.code(404);
    return response;
};
module.exports = {addBooksHandler, getAllBooksHandler, getBooksByIdHandler, editBookByHandler, deleteBookByIdHandler};