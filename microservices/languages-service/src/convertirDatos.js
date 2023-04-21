const fs = require("fs");
const csv = require("csv-parser");

const convertirDatos = (csvFilePath) => {    
    return new Promise((resolve, reject) => {
        const results = {};
        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (data) => {
            results[data.alpha2] = data.English;
        })
        .on("end", () => {
            const arregloDeObjetos = [];
            for (const key in results) {
            const objetoNuevo = {};
            objetoNuevo[key] = results[key];
            arregloDeObjetos.push(objetoNuevo);
            }
            resolve(arregloDeObjetos);
        })
        .on("error", (error) => {
            reject(error);
        });        
    });  
};


module.exports = convertirDatos;