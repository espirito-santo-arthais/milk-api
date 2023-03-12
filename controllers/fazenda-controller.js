const AssyncHandler = require("express-async-handler");
const Fazendeiro = require("../models/Fazendeiro");
const Fazenda = require("../models/Fazenda");
const Producao = require("../models/Producao");

const validade = AssyncHandler(async (req, res) => {
  if (!req.body.nome) {
    res.status(400).json({
      description: "O campo [nome] deve ser preenchido!",
    });
    return;
  }

  if (!req.body.fazendeiro) {
    res.status(400).json({
      description: "O campo [fazendeiro] deve ser preenchido!",
    });
    return;
  }

  const fazendeiroTemp = await Fazendeiro.findById(String(req.body.fazendeiro));
  if (!fazendeiroTemp) {
    res.status(400).json({
      description: "Fazendeiro não encontrado!",
    });
    return;
  }

  if (!req.body.distanciaEmKm) {
    res.status(400).json({
      description: "O campo [distanciaEmKm] deve ser preenchido!",
    });
    return;
  }

  if (isNaN(String(req.body.distanciaEmKm).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [distanciaEmKm] deve conter um valor numérico!",
    });
    return;
  }

  if (parseFloat(req.body.distanciaEmKm) < 1 || parseFloat(req.body.distanciaEmKm) > 1000) {
    res.status(400).json({
      description: "O campo [distanciaEmKm] contem um valor fora dos limites esperados: 1 <= distanciaEmKm <= 1000!",
    });
    return;
  }
});

const buildMap = AssyncHandler(async (req) => {
  const fazendaMap = {
    id: req.body.id ? String(req.body.id) : undefined,
    nome: String(req.body.nome),
    fazendeiro: String(req.body.fazendeiro),
    distanciaEmKm: parseFloat(req.body.distanciaEmKm),
  };

  return fazendaMap;
});

const getFazendaOut = AssyncHandler(async (fazenda) => {
  const fazendeiro = await Fazendeiro.findById(fazenda.fazendeiro);

  const fazendeiroOut = {
    id: fazendeiro._id,
    nome: fazendeiro.nome,
    email: fazendeiro.email,
  }

  const fazendaOut = {
    id: fazenda._id,
    nome: fazenda.nome,
    fazendeiro: fazendeiroOut,
    distanciaEmKm: fazenda.distanciaEmKm,
    distanciaEmKmFormatted: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(fazenda.distanciaEmKm),
  }

  return fazendaOut;
});

const summary = AssyncHandler(async (res, fazendaList) => {
  if (fazendaList.length > 0) {
    for (let i = 0; i < fazendaList.length; i++) {
      fazendaList[i] = await getFazendaOut(fazendaList[i]);
    }
    res.status(200).json({
      description: "Dados das fazendas obtidos com sucesso!",
      data: fazendaList,
    });
  } else {
    res.status(404).json({
      description: "Fazendas não encontradas!"
    });
  }
});

const createFazenda = AssyncHandler(async (req, res) => {
  if (req.body.id) {
    res.status(400).json({
      description: "O campo [id] não deve ser preenchido!",
    });
    return;
  }
  await validade(req, res);

  const fazendaMap = await buildMap(req);

  const fazenda = await Fazenda.create(fazendaMap);

  const fazendaOut = await getFazendaOut(fazenda);
  res.status(201).json({
    description: "Dados da fazenda salvos com sucesso!",
    data: fazendaOut,
  });
});

const updateFazenda = AssyncHandler(async (req, res) => {
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

  const fazendaMap = await buildMap(req);

  const fazenda = await Fazenda.findByIdAndUpdate(
    {
      _id: fazendaMap.id,
    },
    fazendaMap,
    {
      returnDocument: 'after'
    }
  );

  if (fazenda) {
    const fazendaOut = await getFazendaOut(fazenda);
    res.status(200).json({
      description: "Dados da fazenda atualizados com sucesso!",
      data: fazendaOut,
    });
  } else {
    res.status(404).json({
      description: "Fazenda não encontrada!",
    });
  }
});

const deleteFazenda = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
    return;
  }
  const producaoList = await Producao.find({ fazenda: req.params.id, });
  if (producaoList.length > 0) {
    res.status(400).json({
      description: `Fazenda possui ${producaoList.length} produções de leite, não pode ser excluída!`,
    });
    return;
  }

  const id = String(req.params.id);

  const fazenda = await Fazenda.findByIdAndDelete(id);

  if (fazenda) {
    const fazendaOut = await getFazendaOut(fazenda);
    res.status(200).json({
      description: "Fazenda excluída com sucesso!",
      data: fazendaOut,
    });
  } else {
    res.status(404).json({
      description: "Fazenda não encontrada!",
    });
  }
});

const findAllFazendas = AssyncHandler(async (req, res) => {
  const fazendaList = await Fazenda
    .find({})
    .sort({
      nome: 'asc'
    });

  await summary(res, fazendaList);
});

const findFazendaById = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
    return;
  }

  const id = String(req.params.id);

  const fazenda = await Fazenda.findById(id);

  if (fazenda) {
    const fazendaOut = await getFazendaOut(fazenda);
    res.status(200).json({
      description: "Fazenda obtida com sucesso!",
      data: fazendaOut,
    });
  } else {
    res.status(404).json({
      description: "Fazenda não encontrada!"
    });
  }
});

const findFazendasByNome = AssyncHandler(async (req, res) => {
  if (!req.query.nome) {
    res.status(400).json({
      description: "O parâmetro [nome] deve ser preenchido!",
    });
    return;
  }

  const nome = String(req.query.nome);

  const fazendaList = await Fazenda
    .find({
      nome: { $regex: '.*' + nome + '.*', $options: 'i' }
    })
    .sort({
      nome: 'asc'
    });

  await summary(res, fazendaList);
});

const findFazendasByDistanciaEmKmInicialAndDistanciaEmKmFinal = AssyncHandler(async (req, res) => {
  if (!req.query.distanciaEmKmInicial) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmInicial] deve ser preenchido!",
    });
    return;
  }
  if (isNaN(String(req.query.distanciaEmKmInicial).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmInicial] deve conter um valor numérico!",
    });
    return;
  }
  if (!req.query.distanciaEmKmFinal) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmFinal] deve ser preenchido!",
    });
    return;
  }
  if (isNaN(String(req.query.distanciaEmKmFinal).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmFinal] deve conter um valor numérico!",
    });
    return;
  }

  const distanciaEmKmInicial = parseFloat(req.query.distanciaEmKmInicial);
  const distanciaEmKmFinal = parseFloat(req.query.distanciaEmKmFinal);

  if (distanciaEmKmInicial > distanciaEmKmFinal) {
    res.status(400).json({
      description: "Intervalo inválido: o valor do parâmetro [distanciaEmKmInicial] não pode ser maior que o valor do parâmetro [distanciaEmKmFinal]!",
    });
    return;
  }

  const fazendaList = await Fazenda
    .find({
      distanciaEmKm: { $gte: distanciaEmKmInicial, $lte: distanciaEmKmFinal },
    })
    .sort({
      distanciaEmKm: 'asc'
    });

  await summary(res, fazendaList);
});

const findFazendasByFazendeiro = AssyncHandler(async (req, res) => {
  if (!req.query.fazendeiro) {
    res.status(400).json({
      description: "O parâmetro [fazendeiro] deve ser preenchido!",
    });
    return;
  }

  const fazendeiro = String(req.query.fazendeiro);

  const fazendaList = await Fazenda
    .find({
      fazendeiro: fazendeiro,
    })
    .sort({
      fazendeiro: 'asc',
      nome: 'asc'
    });

  await summary(res, fazendaList);
});

const findFazendasByFazendeiroAndDistanciaEmKmInicialAndDistanciaEmKmFinal = AssyncHandler(async (req, res) => {
  if (!req.query.fazendeiro) {
    res.status(400).json({
      description: "O parâmetro [fazendeiro] deve ser preenchido!",
    });
    return;
  }
  if (!req.query.distanciaEmKmInicial) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmInicial] deve ser preenchido!",
    });
    return;
  }
  if (isNaN(String(req.query.distanciaEmKmInicial).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [distanciaEmKmInicial] deve conter um valor numérico!",
    });
    return;
  }
  if (!req.query.distanciaEmKmFinal) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmFinal] deve ser preenchido!",
    });
    return;
  }
  if (isNaN(String(req.query.distanciaEmKmFinal).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [distanciaEmKmFinal] deve conter um valor numérico!",
    });
    return;
  }

  const fazendeiro = String(req.query.fazendeiro);
  const distanciaEmKmInicial = parseFloat(req.query.distanciaEmKmInicial);
  const distanciaEmKmFinal = parseFloat(req.query.distanciaEmKmFinal);

  if (distanciaEmKmInicial > distanciaEmKmFinal) {
    res.status(400).json({
      description: "Intervalo inválido: o valor do parâmetro [distanciaEmKmInicial] não pode ser maior que o valor do parâmetro [distanciaEmKmFinal]!",
    });
    return;
  }

  const fazendaList = await Fazenda
    .find({
      fazendeiro: fazendeiro,
      distanciaEmKm: { $gte: distanciaEmKmInicial, $lte: distanciaEmKmFinal },
    })
    .sort({
      fazendeiro: 'asc',
      distanciaEmKm: 'asc'
    });

  await summary(res, fazendaList);
});

const findFazendasByParams = AssyncHandler(async (req, res) => {
  if (!req.query.nome && !req.query.distanciaEmKmInicial && !req.query.distanciaEmKmFinal && !req.query.fazendeiro) {
    findAllFazendas(req, res);
  } else if (req.query.nome && !req.query.distanciaEmKmInicial && !req.query.distanciaEmKmFinal && !req.query.fazendeiro) {
    findFazendasByNome(req, res);
  } else if (!req.query.nome && req.query.distanciaEmKmInicial && req.query.distanciaEmKmFinal && !req.query.fazendeiro) {
    findFazendasByDistanciaEmKmInicialAndDistanciaEmKmFinal(req, res);
  } else if (!req.query.nome && !req.query.distanciaEmKmInicial && !req.query.distanciaEmKmFinal && req.query.fazendeiro) {
    findFazendasByFazendeiro(req, res);
  } else if (!req.query.nome && req.query.distanciaEmKmInicial && req.query.distanciaEmKmFinal && req.query.fazendeiro) {
    findFazendasByFazendeiroAndDistanciaEmKmInicialAndDistanciaEmKmFinal(req, res);
  } else {
    res.status(400).json({
      description: "Parâmetros inválidos!",
    });
  }
});

module.exports = {
  createFazenda,
  updateFazenda,
  deleteFazenda,
  findFazendaById,
  findFazendasByParams,
};
