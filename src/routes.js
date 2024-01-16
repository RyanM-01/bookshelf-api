/* eslint-disable linebreak-style */

const handler = require('./handler');
// required function untuk route
const {
  AddBook, getAllBooks, getById, editById, deleteById,
} = handler;

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: AddBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getById,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editById,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteById,
  },
];

module.exports = routes;
