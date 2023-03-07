const Express = require("express");

const routes = Express.Router();
const { findAll } = require("../controllers/tabelapreco-controller");

routes.get("/", findAll);

module.exports = routes;