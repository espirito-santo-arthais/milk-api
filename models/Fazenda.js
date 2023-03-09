const mongoose = require("mongoose");

const fazendaSchema = new mongoose.Schema({
  nome: {
    type: String,
  },
  fazendeiro: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fazendeiro",
    }
  },
  distanciaEmKm: {
    type: Number,
  },
});

const fazenda = mongoose.model("Fazenda", fazendaSchema);

module.exports = fazenda;