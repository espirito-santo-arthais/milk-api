const AssyncHandler = require("express-async-handler");
const Fazendeiro = require("../models/Fazendeiro");
const Fazenda = require("../models/Fazenda");

const validade = AssyncHandler(async (req, res) => {
  if (!req.body.nome) {
    res.status(400).json({
      description: "O campo [nome] deve ser preenchido!",
    });
    return;
  }

  if (!req.body.email) {
    res.status(400).json({
      description: "O campo [email] deve ser preenchido!",
    });
    return;
  }

  if (
    !String(req.body.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  ) {
    res.status(400).json({
      description: `O campo [email] possui um conteúdo inválido: ${req.body.email}!`,
    });
    return;
  }
});

const buildMap = AssyncHandler(async (req) => {
  const fazendeiroMap = {
    id: req.body.id ? String(req.body.id) : undefined,
    nome: String(req.body.nome),
    email: String(req.body.email),
  };

  return fazendeiroMap;
});

const getFazendeiroOut = AssyncHandler(async (fazendeiro) => {
  const fazendeiroOut = {
    id: fazendeiro._id,
    nome: fazendeiro.nome,
    email: fazendeiro.email,
  }

  return fazendeiroOut;
});

const summary = AssyncHandler(async (res, fazendeiroList) => {
  if (fazendeiroList.length > 0) {
    for (let i = 0; i < fazendeiroList.length; i++) {
      fazendeiroList[i] = await getFazendeiroOut(fazendeiroList[i]);
    }
    res.status(200).json({
      description: "Dados dos fazendeiros obtidos com sucesso!",
      data: fazendeiroList,
    });
  } else {
    res.status(404).json({
      description: "Fazendeiros não encontrados!"
    });
  }
});

const createFazendeiro = AssyncHandler(async (req, res) => {
  if (req.body.id) {
    res.status(400).json({
      description: "O campo [id] não deve ser preenchido!",
    });
    return;
  }
  await validade(req, res);

  const fazendeiroMap = await buildMap(req);

  const fazendeiro = await Fazendeiro.create(fazendeiroMap);

  const fazendeiroOut = await getFazendeiroOut(fazendeiro);
  res.status(201).json({
    description: "Dados do fazendeiro salvos com sucesso!",
    data: fazendeiroOut,
  });
});

const updateFazendeiro = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
    return;
  }
  if (!req.body.id) {
    res.status(400).json({
      description: "O campo [id] deve ser preenchido!",
    });
    return;
  }
  if (req.params.id !== req.body.id) {
    res.status(400).json({
      description: `O parâmetro [id] não pode ser diferente do campo [id]: ${req.params.id} !== ${req.body.id}`,
    });
    return;
  }
  await validade(req, res);

  const fazendeiroMap = await buildMap(req);

  const fazendeiro = await Fazendeiro.findByIdAndUpdate(
    {
      _id: fazendeiroMap.id,
    },
    fazendeiroMap,
    {
      returnDocument: 'after'
    }
  );

  if (fazendeiro) {
    const fazendeiroOut = await getFazendeiroOut(fazendeiro);
    res.status(200).json({
      description: "Dados do fazendeiro atualizados com sucesso!",
      data: fazendeiroOut,
    });
  } else {
    res.status(404).json({
      description: "Fazendeiro não encontrado!",
    });
  }
});

const deleteFazendeiro = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
    return;
  }
  const fazendaList = await Fazenda.find({ fazendeiro: req.params.id, });
  if (fazendaList.length > 0) {
    res.status(400).json({
      description: `Fazendeiro possui ${fazendaList.length} fazendas, não pode ser excluído!`,
    });
    return;
  }

  const id = String(req.params.id);

  const fazendeiro = await Fazendeiro.findByIdAndDelete(id);

  if (fazendeiro) {
    const fazendeiroOut = await getFazendeiroOut(fazendeiro);
    res.status(200).json({
      description: "Fazendeiro excluído com sucesso!",
      data: fazendeiroOut,
    });
  } else {
    res.status(404).json({
      description: "Fazendeiro não encontrado!",
    });
  }
});

const findAllFazendeiros = AssyncHandler(async (req, res) => {
  const fazendeiroList = await Fazendeiro
    .find({})
    .sort({
      nome: 'asc'
    });

  await summary(res, fazendeiroList);
});

const findFazendeiroById = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
    return;
  }

  const id = String(req.params.id);

  const fazendeiro = await Fazendeiro.findById(id);

  if (fazendeiro) {
    const fazendeiroOut = await getFazendeiroOut(fazendeiro);
    res.status(200).json({
      description: "Fazendeiro obtido com sucesso!",
      data: fazendeiroOut,
    });
  } else {
    res.status(404).json({
      description: "Fazendeiro não encontrado!"
    });
  }
});

const findFazendeirosByNome = AssyncHandler(async (req, res) => {
  if (!req.query.nome) {
    res.status(400).json({
      description: "O parâmetro [nome] deve ser preenchido!",
    });
    return;
  }

  const nome = String(req.query.nome);

  const fazendeiroList = await Fazendeiro
    .find({
      nome: { $regex: '.*' + nome + '.*', $options: 'i' }
    }).sort({
      nome: 'asc'
    });

  await summary(res, fazendeiroList);
});

const findFazendeirosByEmail = AssyncHandler(async (req, res) => {
  if (!req.query.email) {
    res.status(400).json({
      description: "O parâmetro [email] deve ser preenchido!",
    });
    return;
  }

  const email = String(req.query.email);

  const fazendeiroList = await Fazendeiro
    .find({
      email: { $regex: '.*' + email + '.*', $options: 'i' }
    })
    .sort({
      nome: 'asc'
    });

  await summary(res, fazendeiroList);
});

const findFazendeirosByParams = AssyncHandler(async (req, res) => {
  if (!req.query.nome && !req.query.email) {
    findAllFazendeiros(req, res);
  } else if (req.query.nome && !req.query.email) {
    findFazendeirosByNome(req, res);
  } else if (!req.query.nome && req.query.email) {
    findFazendeirosByEmail(req, res);
  } else {
    res.status(400).json({
      description: "Parâmetros inválidos!",
    });
  }
});

module.exports = {
  createFazendeiro,
  updateFazendeiro,
  deleteFazendeiro,
  findFazendeiroById,
  findFazendeirosByParams,
};
