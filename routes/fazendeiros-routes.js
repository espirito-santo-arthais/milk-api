const Express = require("express");

const routes = Express.Router();
const { findAll } = require("../controllers/fazendeiro-controller");

routes.get("/", findAll);

module.exports = routes;