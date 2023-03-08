const Express = require("express");

const routes = Express.Router();

const {
    createTabelaPreco,
    updateTabelaPreco,
    deleteTabelaPreco,
    findTabelaPrecoById,
    findTabelasPrecosByParams,
} = require("../controllers/tabelapreco-controller");

routes.get("/", createTabelaPreco);
routes.patch("/:id", updateTabelaPreco);
routes.delete("/:id", deleteTabelaPreco);
routes.get("/:id", findTabelaPrecoById);
routes.get("/", findTabelasPrecosByParams);

module.exports = routes;