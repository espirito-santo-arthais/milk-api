const mongoose = require("mongoose");

const tabelaPrecoSchema = new mongoose.Schema({
    ano: {
      type: Number,
    },
    semestre: {
      type: Number,
    },
    precoBasePorLitro: {
      type: Number,
    },
    custoDeslocamentoPorKmAte50Km: {
      type: Number,
    },
    custoDeslocamentoPorKmAcimaDe50Km: {
      type: Number,
    },
    bonusPorProducaoAcimaDe10000L: {
      type: Number,
    },
  });

  const tabelaPreco = mongoose.model('TabelaPreco', tabelaPrecoSchema);

  module.exports = tabelaPreco;