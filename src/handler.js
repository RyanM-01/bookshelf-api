/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
/* eslint-disable comma-dangle */
const { nanoid } = require('nanoid');
const books = require('./books');

const AddBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = readPage === pageCount;
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

  // jika client tidak memberi nama buku maka

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // readPage tidak boleh lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  // Jika berhasil maka
  const Sukses = books.filter((book) => book.id === id).length > 0;
  if (Sukses) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  // Jika gagal
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let queryforbooks = books;

  if (name !== undefined) {
    // Filter buku by name (case-insensitive)
    queryforbooks = queryforbooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    // Filter buku  dengan  status reading
    queryforbooks = queryforbooks.filter(
      (book) => book.reading === !!Number(reading)
    );
  }

  if (finished !== undefined) {
    // Filter buku dengan status finished
    queryforbooks = queryforbooks.filter(
      (book) => book.finished === !!Number(finished)
    );
  }

  // dari 3 conditional tersebut maka dapat dirangkai response sebagai berikut
  const response = h.response({
    status: 'success',
    data: {
      books: queryforbooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200); // Set the HTTP status code

  return response;
};

const getById = (request, h) => {
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];
// bila berhasil maka
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
 // bila tidak ditemukan maka
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editById = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  // finished bila pageCount = readPage
  const finished = pageCount === readPage;
  const index = books.findIndex((book) => book.id === id);

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
      finished,
      reading,
      updatedAt,
    };
    // Jika berhasil maka
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // Jika gagal maka 404 buku gagal diperbaharui
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteById = (request, h) => {
  const {id} = request.params;
  const index = books.findIndex((book) => book.id === id);
// jika sukses maka server akan menghapus buku dengan id yang dicari

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
// 404 jika gagal
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  AddBook,
  getAllBooks,
  getById,
  editById,
  deleteById,
};
