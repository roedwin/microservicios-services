const express = require("express"); // importa Express
const router = express.Router(); // crea un nuevo enrutador de Express
const data = require("../../data/data-library"); // importa los datos de data-library
const fetch = require("node-fetch");

const logger = (message) => console.log(`Author Services: ${message}`);

// define un controlador para la ruta raíz ("/")
router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "books",
    architecture: "microservices",
    length: data.dataLibrary.books.length,
    data: data.dataLibrary.books,
  };
  logger("Get book data"); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

// define un controlador para la ruta "/title/:title"
router.get("/title/:title", (req, res) => {
  // busca los libros que contengan el título buscado
  const titles = data.dataLibrary.books.filter((title) => {
    return title.title.includes(req.params.title);
  });
  // crea una respuesta con información sobre los libros que coinciden con el título buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: titles.length,
    data: titles,
  };
  return res.send(response); // devuelve la respuesta al cliente
});

router.get("/distributedCountries/:country", (req, res) => {
  const country = req.params.country;
  const filteredBooks = data.dataLibrary.books.filter((book) =>
    book.distributedCountries.includes(country)
  );
  const response = {
    respuesta: filteredBooks
  };
  return res.send(response);
});
//localhost:8080/api/v2/books/author/parametro
router.get("/author/:author", async(req, res) => {
  const author = await fetch(`http://authors:3000/api/v2/authors/${req.params.author}/`).then(response => response.json());

  const filtroLibros = data.dataLibrary.books.filter(book => book.authorid === author.data[0].id);

  const response = {
    respuesta: filtroLibros
  };
  return res.send(response);
});
//localhost:8080/api/v2/books/betYears?variable1=parametro1&variable2=parametro2
router.get("/betYears", async(req, res) => {
  const { primerAnnio, ultimoAnnio } = req.query;

  const books = data.dataLibrary.books.filter(book => book.year >= primerAnnio && book.year <= ultimoAnnio);

  const response = {
    respuesta: books
  };
  return res.send(response);
});
router.get("/minusYears", async(req, res) => {
  const { annio } = req.query;
  
  const books = data.dataLibrary.books.filter(book => {
    return book.year <= annio
  });

  const response = {
    respuesta: books
  };
  return res.send(response);
});

router.get("/plusYears", async(req, res) => {
  const { annio } = req.query;
  
  const books = data.dataLibrary.books.filter(book => {
    return book.year >= annio
  });

  const response = {
    respuesta: books
  };
  return res.send(response);
});

router.get("/equalYears", async(req, res) => {
  const { annio } = req.query;
  
  const books = data.dataLibrary.books.filter(book => {
    return book.year === parseInt(annio)
  });

  const response = {
    respuesta: books
  };
  return res.send(response);
});

router.get("/country/:countries", (req, res) => {
  const countries = req.params.countries.split(",");
  const books = data.dataLibrary.books.filter(book => {
    return countries.some(country => book.distributedCountries.includes(country));
  });

  const response = {
    data: books,
  };
  return res.send(response);
});



module.exports = router; // exporta el enrutador de Express para su uso en otras partes de la aplicación

/*
Este código es un ejemplo de cómo crear una API de servicios utilizando Express y un enrutador. El enrutador define dos rutas: una para obtener todos los libros y otra para obtener libros por título. También utiliza una función simple de registro para registrar mensajes en los registros.
*/
