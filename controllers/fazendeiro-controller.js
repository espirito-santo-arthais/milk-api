const AssyncHandler = require("express-async-handler");
const Fazendeiro = require("../models/Fazendeiro");

const findAll = AssyncHandler(async (req, res) => {
  const fazendeiroList = await Fazendeiro.find({});

  res.status(200).json({
    description: "Dados dos fazendeiros obtidos com sucesso!",
    data: fazendeiroList,
  });
});

module.exports = { findAll };
