const mongoose = require("mongoose");

const fazendeiroSchema = new mongoose.Schema({
  nome: {
    type: String,
  },
  email: {
    type: String,
  },
});

const fazendeiro = mongoose.model('Fazendeiro', fazendeiroSchema);

module.exports = fazendeiro;