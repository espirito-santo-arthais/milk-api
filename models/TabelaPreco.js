const mongoose = require("mongoose");

const tabelaPrecoSchema = new mongoose.Schema({
    precoBasePorLitro: {
      type: Number,
      required: true,
    },
    custoPorKmAte50Km: {
      type: Number,
      required: true,
    },
    custoPorKmAcimaDe50Km: {
      type: Number,
      required: true,
    },
    bonusPorProducaoAcimaDe10000L: {
      type: Number,
      required: true,
    },
  });

  const tabelaPreco = mongoose.model('TabelaPreco', tabelaPrecoSchema);

  module.exports = tabelaPreco;