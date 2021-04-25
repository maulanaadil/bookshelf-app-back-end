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
            message: `Gagal menambahkan buku. Readpage tidak boleh lebih besar dari pageCount`,
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
            books.filter((book) => book.realm === true);
            books.map((book) => ({
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
            books.filter((book) => book.finished === false);
            books.map((book) => ({
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
module.exports = {addBooksHandler, getAllBooksHandler, getBooksByIdHandler};