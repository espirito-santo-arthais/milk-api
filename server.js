const express = require("express");
const cors = require("cors");

const app = express();

// set port, listen for requests
const PORT = process.env.PORT | 8080;

app.listen(PORT, () => {
  console.log(`O servidor está escutando na porta ${PORT}.`);
});

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

// simple router
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo a aplicação Milk-API!" });
});
