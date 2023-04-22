// Importamos la biblioteca Express
const express = require("express");
const fetch = require("node-fetch");
const csv = require('csv-parser');
const fs = require('fs');

// Importamos el archivo language-codes.csv que contiene la información sobre los lenguajes.
const data = "./data/language-codes.csv";

// Creamos un router de Express
const router = express.Router();

// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Languages Service: ${message}`);

router.get("/", async (req, res) => {
  const results = {};
  const arregloDeObjetos = [];
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(data)
        .pipe(csv())
        .on("data", (data) => {
          results[data.alpha2] = data.English;
        })
        .on("end", () => {
          for (const key in results) {
            const objetoNuevo = {};
            objetoNuevo[key] = results[key];
            arregloDeObjetos.push(objetoNuevo);
          }
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    });
    const response = {
      service: "Languages",
      architecture: "microservices",
      arregloDeObjetos,
    };
    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al procesar el archivo CSV");
  }
});

router.get("/countries/:lenguaje", async(req, res) => {
  const lenguaje = req.params.lenguaje;
  const data = await fetch("http://languages:7000/api/v2/languages").then(resolve => resolve.json());
  
  const languageArray = data.arregloDeObjetos.filter(language => Object.values(language).includes(lenguaje));
  const language = (languageArray.map(language => Object.keys(language)[0]))[0];

  const country = await fetch(`http://countries:5000/api/v2/countries/language/${language}`).then(resolve => resolve.json());
  const response = {
    respuesta: country
  };
  return res.send(response);
});

router.get("/authors/:lenguaje", async(req, res) => {
  const lenguaje = req.params.lenguaje;
  const data = await fetch("http://languages:7000/api/v2/languages").then(resolve => resolve.json());

  const languageArray = data.arregloDeObjetos.filter(language => Object.values(language).includes(lenguaje));
  const language = (languageArray.map(language => Object.keys(language)[0]))[0];

  const countries = await fetch(`http://countries:5000/api/v2/countries/language/${language}`).then(resolve => resolve.json());

  const countryArray = countries.respuesta.map(country => country.name);

  const authors = await fetch(`http://authors:3000/api/v2/authors/country/${countryArray.join(',')}`).then(resolve => resolve.json());

  const response = {
    authors
  };
  return res.send(response);
});

router.get("/books/:lenguaje", async(req, res) => {
  const lenguaje = req.params.lenguaje;
  const data = await fetch("http://languages:7000/api/v2/languages").then(resolve => resolve.json());

  const languageArray = data.arregloDeObjetos.filter(language => Object.values(language).includes(lenguaje));
  const language = (languageArray.map(language => Object.keys(language)[0]))[0];

  const countries = await fetch(`http://countries:5000/api/v2/countries/language/${language}`).then(resolve => resolve.json());
  const countryArray = countries.respuesta.map(country => country.name);

  const books = await fetch(`http://books:4000/api/v2/books/country/${countryArray.join(",")}`).then(resolve => resolve.json());

  const response = {
    books
  };
  return res.send(response);
})

// Exportamos el router
module.exports = router;
