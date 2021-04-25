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
    if(!name || name === "") {
        const response = h.response({
           status: `fail`,
            message: `Gagal menambahkan buku. Mohon isi nama buku`,
        });
    response.code(400);
    return response;
    }

    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
    if(readPage > pageCount) {
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
    const isSuccess = books.filter((book)=> book.id === id).length > 0;
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

module.exports = {addBooksHandler};