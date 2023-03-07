const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const colors = require("colors");
const dbConnectionString = require("./config/config");

const app = express();

// enable Cross-Origin Requests CORS
const corsOptions = {
  origin: "http://localhost:8081",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// parse requests of content-type: application/json
app.use(express.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// config MongoDB connection
mongoose
  .connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao servidor de banco de dados!".blue);

    // set port, listen for requests
    const PORT = process.env.PORT | 8080;

    app.listen(PORT, () => {
      console.log(`O servidor está escutando na porta ${PORT}.`.green);
    });
  })
  .catch((error) =>
    console.log("Não foi possível conectar ao servidor de banco de dados!".red)
  );

// roteador simples
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo a aplicação Milk-API!" });
});
