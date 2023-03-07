const AssyncHandler = require("express-async-handler");
const Fazenda = require("../models/Fazenda");

const findAll = AssyncHandler(async (req, res) => {
  const fazendaList = await Fazenda.find({});

  res.status(200).json({
    description: "Dados das fazendas obtidos com sucesso!",
    data: fazendaList,
  });
});

module.exports = { findAll };
