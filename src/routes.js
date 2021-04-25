const {addBooksHandler, getAllBooksHandler, getBooksByIdHandler, editBookByHandler, deleteBookByIdHandler} = require("./handler");
const routes = [
    {
        method: `POST`,
        path: `/books`,
        handler: addBooksHandler,
    },
    {
        method: `GET`,
        path: `/books`,
        handler: getAllBooksHandler,
    },
    {
        method: `GET`,
        path: `/books/{bookId}`,
        handler: getBooksByIdHandler,
    },
    {
        method: `PUT`,
        path: `/books/{bookId}`,
        handler: editBookByHandler,
    },
    {
        method: `DELETE`,
        path: `/books/{bookId}`,
        handler: deleteBookByIdHandler,
    }
];

module.exports = routes;