const mongoose = require("mongoose");
const fazendeiro = require("./Fazendeiro");

const fazendaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fazendeiro: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fazendeiro",
    }
  },
  distanciaEmKm: {
    type: Number,
    required: true,
  },
});

const fazenda = mongoose.model("Fazenda", fazendaSchema);

module.exports = fazenda;