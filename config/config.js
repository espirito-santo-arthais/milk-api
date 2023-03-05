const dotenv = require("dotenv");
const path = require("path");
const colors = require("colors");

dotenv.config({
    path: path.resolve(__dirname, `../${process.env.NODE_ENV}.trim.env`)
})

console.log(`NODE_ENV=${process.env.NODE_ENV}`.yellow);

const db = "Testando exportação da configuração do MongoDB...";

module.exports = db;