const Express = require("express");

const routes = Express.Router();

const {
  createProducao,
  updateProducao,
  deleteProducao,
  findProducaoById,
  findProducoesByParams,
} = require("../controllers/producao-controller");

routes.post("/", createProducao);
routes.patch("/:id", updateProducao);
routes.delete("/:id", deleteProducao);
routes.get("/:id", findProducaoById);
routes.get("/", findProducoesByParams);

module.exports = routes;
