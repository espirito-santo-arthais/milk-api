const Express = require("express");

const routes = Express.Router();

const {
  createFazenda,
  updateFazenda,
  deleteFazenda,
  findFazendaById,
  findFazendasByParams,
} = require("../controllers/fazenda-controller");

routes.post("/", createFazenda);
routes.patch("/:id", updateFazenda);
routes.delete("/:id", deleteFazenda);
routes.get("/:id", findFazendaById);
routes.get("/", findFazendasByParams);

module.exports = routes;
