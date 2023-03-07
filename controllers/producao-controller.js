const AssyncHandler = require("express-async-handler");
const Producao = require("../models/Producao");

const findAll = AssyncHandler(async (req, res) => {
  const producaoList = await Producao.find({});

  res.status(200).json({
    description: "Dados das produções obtidos com sucesso!",
    data: producaoList,
  });
});

module.exports = { findAll };
