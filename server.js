const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const colors = require("colors");
const dbConnectionString = require("./config/config");
const { errorHandler } = require("./middleware/error-handler");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

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

mongoose.set("strictQuery", false);

// roteador simples
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo a aplicação Milk-API!" });
});

// roteador dos fazendeiros
app.use("/milk/fazendeiros", require("./routes/fazendeiros-routes"));

// roteador das fazendas
app.use("/milk/fazendas", require("./routes/fazendas-routes"));

// roteador das producoes
app.use("/milk/producoes", require("./routes/producoes-routes"));

// roteador das tabelas de precos
app.use("/milk/tabelas-de-precos", require("./routes/tabelasprecos-routes"));

// Manipulador de erros
app.use(errorHandler);

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Milk Production API',
      version: '1.0.0'
    }

  },
  apis: ['./routes/*.js']
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/milk-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));