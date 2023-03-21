const AssyncHandler = require("express-async-handler");
const Fazendeiro = require("../models/fazendeiro");
const Fazenda = require("../models/fazenda");
const Producao = require("../models/producao");

const validade = AssyncHandler(async (req, res) => {
  const fazendeiroTemp = await Fazendeiro.findById(String(req.body.fazendeiro));
  if (!fazendeiroTemp) {
    res.status(422).json({
      description: "Fazendeiro não encontrado!",
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
    ptBR: {
      distanciaEmKm: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(fazenda.distanciaEmKm),
    },
    enUS: {
      distanciaEmKm: new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(fazenda.distanciaEmKm),
    }
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

const findFazendasByDistanciaEmKmBetween = AssyncHandler(async (req, res) => {
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

const findFazendasByFazendeiroAndDistanciaEmKmBetween = AssyncHandler(async (req, res) => {
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
    findFazendasByDistanciaEmKmBetween(req, res);
  } else if (!req.query.nome && !req.query.distanciaEmKmInicial && !req.query.distanciaEmKmFinal && req.query.fazendeiro) {
    findFazendasByFazendeiro(req, res);
  } else if (!req.query.nome && req.query.distanciaEmKmInicial && req.query.distanciaEmKmFinal && req.query.fazendeiro) {
    findFazendasByFazendeiroAndDistanciaEmKmBetween(req, res);
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
