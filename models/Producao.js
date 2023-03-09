const mongoose = require("mongoose");

const producaoSchema = new mongoose.Schema({
  fazendeiro: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fazendeiro",
    }
  },
  fazenda: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fazenda",
    }
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