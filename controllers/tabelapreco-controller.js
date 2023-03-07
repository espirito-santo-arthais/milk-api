const AssyncHandler = require("express-async-handler");
const TabelaPreco = require("../models/TabelaPreco");

const findAll = AssyncHandler(async (req, res) => {
  const tabelaPrecoList = await TabelaPreco.find({});

  res.status(200).json({
    description: "Dados das tabelas de preços obtidos com sucesso!",
    data: tabelaPrecoList,
  });
});

module.exports = { findAll };
