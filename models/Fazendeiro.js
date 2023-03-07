const mongoose = require("mongoose");

const fazendeiroSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  });

  const fazendeiro = mongoose.model('Fazendeiro', fazendeiroSchema);

  module.exports = fazendeiro;