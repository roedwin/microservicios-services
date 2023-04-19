// Importamos la biblioteca Express
const express = require("express");
const fetch = require("node-fetch");

// Importamos el archivo data-library.js que contiene la información sobre los países.
const data = require("../../data/data-library");

// Creamos un router de Express
const router = express.Router();

// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Countries Service: ${message}`);

// Creamos una ruta GET en la raíz del router que devuelve todos los países
router.get("/", (req, res) => {
  // Creamos un objeto de respuesta con información sobre el servicio y los datos de los países
  const response = {
    service: "countries",
    architecture: "microservices",
    length: data.dataLibrary.countries.length,
    data: data.dataLibrary.countries,
  };
  // Registramos un mensaje en la consola
  logger("Get countries data");
  // Enviamos la respuesta al cliente
  return res.send(response);
});

router.get("/country", (req, res) => {
  const { capital } = req.query;
  const country = Object.values(data.dataLibrary.countries).find(obj => obj.capital === capital);
  const response = {
    respuesta: country
  }
  return res.send(response);
});

router.get("/authorCountry/:capital", async(req, res) => {
  const capital = req.params.capital;
  const country = Object.values(data.dataLibrary.countries).find(obj => obj.capital === capital);
  const authors = await fetch(`http://authors:3000/api/v2/authors/country/${country.name}`).then(respon => respon.json());
  
  const response = {
    authors
  }
  return res.send(response);
});


router.get("/distributedBooks/:capital", async(req, res) => {
  const capital = req.params.capital;
  const country = Object.values(data.dataLibrary.countries).find(obj => obj.capital === capital);
  const books = await fetch(`http://books:4000/api/v2/books/country/${country.name}`).then(response => response.json());

  const response = {
    respuesta: books
  }
  return res.send(response);
});

// Exportamos el router
module.exports = router;
