const AssyncHandler = require("express-async-handler");
const Fazendeiro = require("../models/Fazendeiro");
const Fazenda = require("../models/Fazenda");

function validade(req, res) {
  if (!req.body.name) {
    res.status(400).json({
      description: "O campo [name] deve ser preenchido!",
    });
  }

  if (!req.body.fazendeiro) {
    res.status(400).json({
      description: "O campo [fazendeiro] deve ser preenchido!",
    });
  }

  const fazendeiroTemp = Fazendeiro.findByPk(String(req.body.fazendeiro));
  if (!fazendeiroTemp) {
    res.status(400).json({
      description: "Fazendeiro não encontrado!",
    });
  }

  if (!req.body.distanciaEmKm) {
    res.status(400).json({
      description: "O campo [distanciaEmKm] deve ser preenchido!",
    });
  }

  if (!isNumeric(String(req.body.distanciaEmKm).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [distanciaEmKm] deve conter um valor numérico!",
    });
  }

  if (parseFloat(req.body.distanciaEmKm) < 1 || parseFloat(req.body.distanciaEmKm) > 1000) {
    res.status(400).json({
      description:
        "O campo [distanciaEmKm] contem um valor fora dos limites esperados: 1 <= distanciaEmKm <= 1000!",
    });
  }
}

function buildMap(req) {
  const fazendaMap = {
    _id: req.body.id ? String(req.body.id) : undefined,
    name: String(req.body.name),
    fazendeiro: String(req.body.fazendeiro),
    distanciaEmKm: parseFloat(req.body.distanciaEmKm),
  };

  return fazendaMap;
}

const createFazenda = AssyncHandler(async (req, res) => {
  if (req.body.id) {
    res.status(400).json({
      description: "O campo [id] não deve ser preenchido!",
    });
  }
  validade(req, res);

  const fazendaMap = buildMap(req);

  const fazenda = await Fazenda.create(fazendaMap, { new: true });

  res.status(200).json({
    description: "Dados da fazenda salvos com sucesso!",
    data: fazenda,
  });
});

const updateFazenda = AssyncHandler(async (req, res) => {
  if (!req.body.id) {
    res.status(400).json({
      description: "O campo [id] deve ser preenchido!",
    });
  }
  validade(req, res);

  const fazendaMap = buildMap(req);

  // TODO: verificar qual o valor retornado quando não existe um registro com o _id especificado.
  const fazenda = await Fazenda.update(
    fazendaMap,
    {
      where: { id: fazendaMap._id },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    description: "Dados da fazenda atualizados com sucesso!",
    data: fazenda,
  });
});

const deleteFazenda = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
  }

  const id = String(req.params.id);

  // TODO: verificar qual o valor retornado quando não existe um registro com o _id especificado.
  const fazenda = await Fazenda.destroy({
    where: { id: id },
  });

  res.status(200).json({
    description: "Fazenda excluída com sucesso!",
    data: fazenda,
  });
});

const findAllFazendas = AssyncHandler(async (req, res) => {
  const fazendaList = await Fazenda.find({});

  res.status(200).json({
    description: "Dados das fazendas obtidos com sucesso!",
    data: fazendaList,
  });
});

const findFazendaById = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
  }

  const id = String(req.params.id);

  // TODO: verificar qual o valor retornado quando não existe um registro com o _id especificado.
  const fazenda = await Fazenda.findByPk(id);

  res.status(200).json({
    description: "Fazenda obtida com sucesso!",
    data: fazenda,
  });
});

const findFazendaByName = AssyncHandler(async (req, res) => {
  if (!req.params.name) {
    res.status(400).json({
      description: "O parâmetro [name] deve ser preenchido!",
    });
  }

  const name = String(req.params.name);

  // TODO: verificar qual o valor retornado quando não existirem registros que satisfaçam a seleção.
  const fazendaList = await Fazenda.find({ name: new RegExp('^' + name + '$', "i") });

  res.status(200).json({
    description: "Dados das fazendas obtidos com sucesso!",
    data: fazendaList,
  });
});

const findFazendasByDistanciaEmKmInicialAndDistanciaEmKmFinal = AssyncHandler(async (req, res) => {
  if (!req.params.distanciaEmKmInicial) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmInicial] deve ser preenchido!",
    });
  }
  if (
    !isNumeric(String(req.body.distanciaEmKmInicial).replaceAll(",", "."))
  ) {
    res.status(400).json({
      description: "O campo [distanciaEmKmInicial] deve conter um valor numérico!",
    });
  }
  if (!req.params.distanciaEmKmFinal) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmFinal] deve ser preenchido!",
    });
  }
  if (!isNumeric(String(req.body.distanciaEmKmFinal).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [distanciaEmKmFinal] deve conter um valor numérico!",
    });
  }

  const distanciaEmKmInicial = parseFloat(req.params.distanciaEmKmInicial);
  const distanciaEmKmFinal = parseFloat(req.params.distanciaEmKmFinal);

  if (distanciaEmKmInicial > distanciaEmKmFinal) {
    res.status(400).json({
      description: "Intervalo inválido: o valor do parâmetro [distanciaEmKmInicial] não pode ser maior que o valor do parâmetro [distanciaEmKmFinal]!",
    });
  }

  // TODO: verificar qual o valor retornado quando não existem registros que atandam a seleção.
  const fazendaList = await Fazenda.find({
    distanciaEmKm: { $gte: distanciaEmKmInicial, $lte: distanciaEmKmFinal },
  });

  res.status(200).json({
    description: "Dados das fazendas obtidos com sucesso!",
    data: fazendaList,
  });
});

const findFazendasByFazendeiro = AssyncHandler(async (req, res) => {
  if (!req.params.fazendeiro) {
    res.status(400).json({
      description: "O parâmetro [fazendeiro] deve ser preenchido!",
    });
  }

  const fazendeiro = String(req.params.fazendeiro);

  // TODO: verificar qual o valor retornado quando não existem registros que atandam a seleção.
  const fazendaList = await Fazenda.find({
    fazendeiro: fazendeiro,
  });

  res.status(200).json({
    description: "Dados das fazendas obtidos com sucesso!",
    data: fazendaList,
  });
});

const findFazendasByFazendeiroAndDistanciaEmKmInicialAndDistanciaEmKmFinal = AssyncHandler(async (req, res) => {
  if (!req.params.fazendeiro) {
    res.status(400).json({
      description: "O parâmetro [fazendeiro] deve ser preenchido!",
    });
  }
  if (!req.params.distanciaEmKmInicial) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmInicial] deve ser preenchido!",
    });
  }
  if (
    !isNumeric(String(req.body.distanciaEmKmInicial).replaceAll(",", "."))
  ) {
    res.status(400).json({
      description: "O campo [distanciaEmKmInicial] deve conter um valor numérico!",
    });
  }
  if (!req.params.distanciaEmKmFinal) {
    res.status(400).json({
      description: "O parâmetro [distanciaEmKmFinal] deve ser preenchido!",
    });
  }
  if (!isNumeric(String(req.body.distanciaEmKmFinal).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [distanciaEmKmFinal] deve conter um valor numérico!",
    });
  }

  const fazendeiro = String(req.params.fazendeiro);
  const distanciaEmKmInicial = parseFloat(req.params.distanciaEmKmInicial);
  const distanciaEmKmFinal = parseFloat(req.params.distanciaEmKmFinal);

  if (distanciaEmKmInicial > distanciaEmKmFinal) {
    res.status(400).json({
      description: "Intervalo inválido: o valor do parâmetro [distanciaEmKmInicial] não pode ser maior que o valor do parâmetro [distanciaEmKmFinal]!",
    });
  }

  // TODO: verificar qual o valor retornado quando não existem registros que atandam a seleção.
  const fazendaList = await Fazenda.find({
    fazendeiro: fazendeiro,
    distanciaEmKm: { $gte: distanciaEmKmInicial, $lte: distanciaEmKmFinal },
  });

  res.status(200).json({
    description: "Dados das fazendas obtidos com sucesso!",
    data: fazendaList,
  });
});

const findFazendasByParams = AssyncHandler(async (req, res) => {
});

module.exports = {
  createFazenda,
  updateFazenda,
  deleteFazenda,
  findFazendaById,
  findFazendasByParams,
};
