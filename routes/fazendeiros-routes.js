const Express = require("express");

const routes = Express.Router();

const {
  createFazendeiro,
  updateFazendeiro,
  deleteFazendeiro,
  findFazendeiroById,
  findFazendeirosByParams,
} = require("../controllers/fazendeiro-controller");

routes.get("/", createFazendeiro);
routes.patch("/:id", updateFazendeiro);
routes.delete("/:id", deleteFazendeiro);
routes.get("/:id", findFazendeiroById);
routes.get("/", findFazendeirosByParams);

module.exports = routes;
