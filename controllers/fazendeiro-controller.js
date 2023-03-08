const AssyncHandler = require("express-async-handler");
const Fazendeiro = require("../models/Fazendeiro");

function validade(req, res) {
  if (!req.body.name) {
    res.status(400).json({
      description: "O campo [name] deve ser preenchido!",
    });
  }

  if (!req.body.email) {
    res.status(400).json({
      description: "O campo [email] deve ser preenchido!",
    });
  }

  if (
    String(req.body.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  ) {
    res.status(400).json({
      description: `O campo [email] possui um conteúdo inválido: ${req.body.email}!`,
    });
  }
}

function buildMap(req) {
  const fazendeiroMap = {
    _id: req.body.id ? String(req.body.id) : undefined,
    name: String(req.body.name),
    email: String(req.body.email),
  };

  return fazendeiroMap;
}

const createFazendeiro = AssyncHandler(async (req, res) => {
  if (req.body.id) {
    res.status(400).json({
      description: "O campo [id] não deve ser preenchido!",
    });
  }
  validade(req, res);

  const fazendeiroMap = buildMap(req);

  const fazendeiro = await Fazendeiro.create(fazendeiroMap, { new: true });

  res.status(200).json({
    description: "Dados do fazendeiro salvos com sucesso!",
    data: fazendeiro,
  });
});

const updateFazendeiro = AssyncHandler(async (req, res) => {
  if (!req.body.id) {
    res.status(400).json({
      description: "O campo [id] deve ser preenchido!",
    });
  }
  validade(req, res);

  const fazendeiroMap = buildMap(req);

  // TODO: verificar qual o valor retornado quando não existe um registro com o _id especificado.
  const fazendeiro = await Fazendeiro.update(
    fazendeiroMap,
    {
      where: { id: fazendeiroMap._id },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    description: "Dados do fazendeiro atualizados com sucesso!",
    data: fazendeiro,
  });
});

const deleteFazendeiro = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
  }

  const id = String(req.params.id);

  // TODO: verificar qual o valor retornado quando não existe um registro com o _id especificado.
  const fazendeiro = await Fazendeiro.destroy({
    where: { id: id },
  });

  res.status(200).json({
    description: "Fazendeiro excluído com sucesso!",
    data: fazendeiro,
  });
});

const findAllFazendeiros = AssyncHandler(async (req, res) => {
  const fazendeiroList = await Fazendeiro.find({});

  res.status(200).json({
    description: "Dados dos fazendeiros obtidos com sucesso!",
    data: fazendeiroList,
  });
});

const findFazendeiroById = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
  }

  const id = String(req.params.id);

  const fazendeiro = await Fazendeiro.findByPk(id);

  res.status(200).json({
    description: "Fazendeiro obtido com sucesso!",
    data: fazendeiro,
  });
});

const findFazendeiroByName = AssyncHandler(async (req, res) => {
  if (!req.params.name) {
    res.status(400).json({
      description: "O parâmetro [name] deve ser preenchido!",
    });
  }

  const name = String(req.params.name);

  // TODO: verificar qual o valor retornado quando não existirem registros que satisfaçam a seleção.
  const fazendeiroList = await Fazendeiro.find({ name: new RegExp('^' + name + '$', "i") });

  res.status(200).json({
    description: "Dados dos fazendeiros obtidos com sucesso!",
    data: fazendeiroList,
  });
});

const findFazendeiroByEmail = AssyncHandler(async (req, res) => {
  if (!req.params.email) {
    res.status(400).json({
      description: "O parâmetro [email] deve ser preenchido!",
    });
  }

  const email = String(req.params.email);

  // TODO: verificar qual o valor retornado quando não existirem registros que satisfaçam a seleção.
  const fazendeiroList = await Fazendeiro.find({ email: new RegExp('^' + email + '$', "i") });

  res.status(200).json({
    description: "Dados dos fazendeiros obtidos com sucesso!",
    data: fazendeiroList,
  });
});

const findFazendeirosByParams = AssyncHandler(async (req, res) => {
});

module.exports = {
  createFazendeiro,
  updateFazendeiro,
  deleteFazendeiro,
  findFazendeiroById,
  findFazendeirosByParams,
};
