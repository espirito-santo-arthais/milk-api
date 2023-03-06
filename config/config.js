const dotenv = require("dotenv");
const path = require("path");
const colors = require("colors");

dotenv.config({
    path: path.resolve(__dirname, `../${process.env.NODE_ENV.trim()}.env`)
})

console.log(`NODE_ENV=${process.env.NODE_ENV.trim()}`.yellow);

const dbConnectionString = `mongodb://${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

module.exports = dbConnectionString;