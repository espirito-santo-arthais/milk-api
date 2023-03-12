const mongoose = require("mongoose");

const producaoSchema = new mongoose.Schema({
  fazendeiro: {
    type: String,
  },
  fazenda: {
    type: String,
  },
  dataProducao: {
    type: Date,
  },
  litrosProduzidos: {
    type: Number,
  },
});

const producao = mongoose.model("Producao", producaoSchema);

module.exports = producao;