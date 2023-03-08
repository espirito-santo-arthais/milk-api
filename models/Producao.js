const mongoose = require("mongoose");
const fazenda = require("./Fazenda");

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
    required: true,
  },
  litrosProduzidos: {
    type: Number,
    required: true,
  },
});

const producao = mongoose.model("Producao", producaoSchema);

module.exports = producao;