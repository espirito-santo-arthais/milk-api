const AssyncHandler = require("express-async-handler");
const TabelaPreco = require("../models/TabelaPreco");

function validade(req, res) {
  if (!req.body.ano) {
    res.status(400).json({
      description: "O campo [ano] deve ser preenchido!",
    });
  }

  if (isNaN(String(req.body.ano).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [ano] deve conter um valor numérico!",
    });
  }

  if (Number.isInteger(req.body.ano).replaceAll(",", ".")) {
    res.status(400).json({
      description: "O campo [ano] deve conter um valor numérico inteiro!",
    });
  }

  if (parseInt(req.body.ano) < 1900 || parseInt(req.body.ano) > 9999) {
    res.status(400).json({
      description: "O campo [ano] contem um valor fora dos limites esperados: 1900 <= ano <= 9999!",
    });
  }

  if (!req.body.semestre) {
    res.status(400).json({
      description: "O campo [semestre] deve ser preenchido!",
    });
  }

  if (isNaN(String(req.body.semestre).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [semestre] deve conter um valor numérico!",
    });
  }

  if (Number.isInteger(req.body.mes).replaceAll(",", ".")) {
    res.status(400).json({
      description: "O campo [semestre] deve conter um valor numérico inteiro!",
    });
  }

  if (parseInt(req.body.semestre) < 1 || parseInt(req.body.semestre) > 2) {
    res.status(400).json({
      description: "O campo [semestre] contem um valor fora dos limites esperados: 1 <= semestre <= 2!",
    });
  }

  if (!req.body.precoBasePorLitro) {
    res.status(400).json({
      description: "O campo [precoBasePorLitro] deve ser preenchido!",
    });
  }

  if (isNaN(String(req.body.precoBasePorLitro).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [precoBasePorLitro] deve conter um valor numérico!",
    });
  }

  if (
    parseFloat(req.body.precoBasePorLitro) < 0.01 ||
    parseFloat(req.body.precoBasePorLitro) > 999999999.99
  ) {
    res.status(400).json({
      description: "O campo [precoBasePorLitro] contem um valor fora dos limites esperados: R$0,01 <= precoBasePorLitro <= R$999.999.999,99!",
    });
  }

  if (!req.body.custoPorKmAte50Km) {
    res.status(400).json({
      description: "O campo [custoPorKmAte50Km] deve ser preenchido!",
    });
  }

  if (isNaN(String(req.body.custoPorKmAte50Km).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [custoPorKmAte50Km] deve conter um valor numérico!",
    });
  }

  if (
    parseFloat(req.body.custoPorKmAte50Km) < 0.01 ||
    parseFloat(req.body.custoPorKmAte50Km) > 999999999.99
  ) {
    res.status(400).json({
      description: "O campo [custoPorKmAte50Km] contem um valor fora dos limites esperados: R$0,01 <= custoPorKmAte50Km <= R$999.999.999,99!",
    });
  }

  if (!req.body.custoPorKmAcimaDe50Km) {
    res.status(400).json({
      description: "O campo [custoPorKmAcimaDe50Km] deve ser preenchido!",
    });
  }

  if (isNaN(String(req.body.custoPorKmAcimaDe50Km).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [custoPorKmAcimaDe50Km] deve conter um valor numérico!",
    });
  }

  if (
    parseFloat(req.body.custoPorKmAcimaDe50Km) < 0.01 ||
    parseFloat(req.body.custoPorKmAcimaDe50Km) > 999999999.99
  ) {
    res.status(400).json({
      description: "O campo [custoPorKmAcimaDe50Km] contem um valor fora dos limites esperados: R$0,01 <= custoPorKmAcimaDe50Km <= R$999.999.999,99!",
    });
  }

  if (!req.body.bonusPorProducaoAcimaDe10000L) {
    res.status(400).json({
      description: "O campo [bonusPorProducaoAcimaDe10000L] deve ser preenchido!",
    });
  }

  if (isNaN(String(req.body.bonusPorProducaoAcimaDe10000L).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O campo [bonusPorProducaoAcimaDe10000L] deve conter um valor numérico!",
    });
  }

  if (
    parseFloat(req.body.bonusPorProducaoAcimaDe10000L) < 0.01 ||
    parseFloat(req.body.bonusPorProducaoAcimaDe10000L) > 999999999.99
  ) {
    res.status(400).json({
      description: "O campo [bonusPorProducaoAcimaDe10000L] contem um valor fora dos limites esperados: R$0,01 <= bonusPorProducaoAcimaDe10000L <= R$999.999.999,99!",
    });
  }
}

function buildMap(req) {
  const tabelaPrecoMap = {
    _id: req.body.id ? String(req.body.id) : undefined,
    ano: parseInt(req.body.ano),
    mes: parseInt(req.body.mes),
    precoBasePorLitro: parseFloat(req.body.precoBasePorLitro),
    custoPorKmAte50Km: parseFloat(req.body.custoPorKmAte50Km),
    custoPorKmAcimaDe50Km: parseFloat(req.body.custoPorKmAcimaDe50Km),
    bonusPorProducaoAcimaDe10000L: parseFloat(req.body.bonusPorProducaoAcimaDe10000L),
  };

  return tabelaPrecoMap;
}

const createTabelaPreco = AssyncHandler(async (req, res) => {
  if (req.body.id) {
    res.status(400).json({
      description: "O campo [id] não deve ser preenchido!",
    });
  }
  validade(req, res);

  const tabelaPrecoMap = buildMap(req);

  const tabelaPreco = await TabelaPreco.create(tabelaPrecoMap, { new: true });

  res.status(200).json({
    description: "Dados da tabela de preço salvos com sucesso!",
    data: tabelaPreco,
  });
});

const updateTabelaPreco = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
  }
  if (!req.body.id) {
    res.status(400).json({
      description: "O campo [id] deve ser preenchido!",
    });
  }
  if (req.params.id !== req.body.id) {
    res.status(400).json({
      description: `O parâmetro [id] não pode ser diferente do campo [id]: ${req.params.id} !== ${req.body.id}`,
    });
  }
  validade(req, res);

  const tabelaPrecoMap = buildMap(req);

  // TODO: verificar qual o valor retornado quando não existe um registro com o _id especificado.
  const tabelaPreco = await TabelaPreco.findByIdAndUpdate(
    {
      where: { id: tabelaPrecoMap._id },
    },
    tabelaPrecoMap,
    {
      returnDocument: 'after'
    }
  );

  res.status(200).json({
    description: "Dados da tabela de preço atualizados com sucesso!",
    data: tabelaPreco,
  });
});

const deleteTabelaPreco = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
  }

  const id = String(req.params.id);

  // TODO: verificar qual o valor retornado quando não existe um registro com o _id especificado.
  const tabelaPreco = await TabelaPreco.destroy({
    where: { id: id },
  });

  res.status(200).json({
    description: "Tabela de preço excluída com sucesso!",
    data: tabelaPreco,
  });
});

const findAllTabelasPrecos = AssyncHandler(async (req, res) => {
  const tabelaPrecoList = await TabelaPreco.find({});

  res.status(200).json({
    description: "Dados das tabelas de preços obtidos com sucesso!",
    data: tabelaPrecoList,
  });
});

const findTabelaPrecoById = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
  }

  const id = String(req.params.id);

  try {
    const tabelaPreco = await TabelaPreco.findById(id);

    if (producao) {
      res.status(200).json({
        description: "Tabela de preço obtida com sucesso!",
        data: tabelaPreco,
      });
    } else {
      res.status(404).json({
        description: "Tabela de preço não encontrada!",
        data: fazenda,
      });
    }
  } catch (e) {
    console.log(e); // Logs the error
  }
});

const findTabelasPrecosByAno = AssyncHandler(async (req, res) => {
  if (!req.query.ano) {
    res.status(400).json({
      description: "O parâmetro [ano] deve ser preenchido!",
    });
  }
  if (isNaN(String(req.query.ano).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O parâmetro [ano] deve conter um valor numérico!",
    });
  }
  if (Number.isInteger(req.query.ano).replaceAll(",", ".")) {
    res.status(400).json({
      description: "O parâmetro [ano] deve conter um valor numérico inteiro!",
    });
  }
  if (parseInt(req.query.ano) < 1900 || parseInt(req.query.ano) > 9999) {
    res.status(400).json({
      description: "O parâmetro [ano] contem um valor fora dos limites esperados: 1900 <= ano <= 9999!",
    });
  }

  const ano = parseInt(req.query.ano);

  const tabelaPrecoList = await TabelaPreco.find({ ano: ano });

  res.status(200).json({
    description: "Dados das tabelas de preços obtidos com sucesso!",
    data: tabelaPrecoList,
  });
});

const findTabelaPrecoByAnoAndSemetre = AssyncHandler(async (req, res) => {
  if (!req.query.ano) {
    res.status(400).json({
      description: "O parâmetro [ano] deve ser preenchido!",
    });
  }
  if (isNaN(String(req.query.ano).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O parâmetro [ano] deve conter um valor numérico!",
    });
  }
  if (Number.isInteger(req.query.ano).replaceAll(",", ".")) {
    res.status(400).json({
      description: "O parâmetro [ano] deve conter um valor numérico inteiro!",
    });
  }
  if (parseInt(req.query.ano) < 1900 || parseInt(req.query.ano) > 9999) {
    res.status(400).json({
      description: "O parâmetro [ano] contem um valor fora dos limites esperados: 1900 <= ano <= 9999!",
    });
  }
  if (!req.query.semestre) {
    res.status(400).json({
      description: "O parâmetro [semestre] deve ser preenchido!",
    });
  }
  if (isNaN(String(req.query.semestre).replaceAll(",", "."))) {
    res.status(400).json({
      description: "O parâmetro [semestre] deve conter um valor numérico!",
    });
  }
  if (Number.isInteger(req.query.semestre).replaceAll(",", ".")) {
    res.status(400).json({
      description: "O parâmetro [semestre] deve conter um valor numérico inteiro!",
    });
  }
  if (parseInt(req.query.semestre) < 1 || parseInt(req.query.semestre) > 2) {
    res.status(400).json({
      description: "O parâmetro [semestre] contem um valor fora dos limites esperados: 1 <= semestre <= 12!",
    });
  }

  const ano = parseInt(req.query.ano);
  const semestre = parseInt(req.query.semestre);

  const tabelaPrecoList = await TabelaPreco.find({ ano: ano, semestre: semestre });

  res.status(200).json({
    description: "Dados das tabelas de preços obtidos com sucesso!",
    data: tabelaPrecoList,
  });
});

const findTabelasPrecosByParams = AssyncHandler(async (req, res) => {
  if (!req.query.ano && !req.query.semestre) {
    findAllTabelasPrecos(req, res);
  } else if (req.query.ano && !req.query.semestre) {
    findTabelasPrecosByAno(req, res);
  } else if (req.query.ano && req.query.semestre) {
    findTabelaPrecoByAnoAndSemetre(req, res);
  } else {
    res.status(400).json({
      description: "Parâmetros inválidos!",
    });
  }
});

module.exports = {
  createTabelaPreco,
  updateTabelaPreco,
  deleteTabelaPreco,
  findTabelaPrecoById,
  findTabelasPrecosByParams,
};
