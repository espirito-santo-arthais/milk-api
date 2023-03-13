const AssyncHandler = require("express-async-handler");
const TabelaPreco = require("../models/TabelaPreco");

const validade = AssyncHandler(async (req, res) => {
  if (!req.body.ano) {
    res.status(400).json({
      description: "O campo [ano] deve ser preenchido!",
    });
    return;
  }
  const anoTemp = String(req.body.ano).replaceAll(",", ".");
  if (isNaN(anoTemp)) {
    res.status(400).json({
      description: "O campo [ano] deve conter um valor numérico!",
    });
    return;
  }
  if (parseInt(anoTemp) < 1900 || parseInt(anoTemp) > 9999) {
    res.status(400).json({
      description: "O campo [ano] contem um valor fora dos limites esperados: 1900 <= ano <= 9999!",
    });
    return;
  }

  if (!req.body.semestre) {
    res.status(400).json({
      description: "O campo [semestre] deve ser preenchido!",
    });
    return;
  }
  const semestreTemp = String(req.body.semestre).replaceAll(",", ".");
  if (isNaN(semestreTemp)) {
    res.status(400).json({
      description: "O campo [semestre] deve conter um valor numérico!",
    });
    return;
  }
  if (parseInt(semestreTemp) < 1 || parseInt(semestreTemp) > 2) {
    res.status(400).json({
      description: "O campo [semestre] contem um valor fora dos limites esperados: 1 <= semestre <= 2!",
    });
    return;
  }

  if (!req.body.precoBasePorLitro) {
    res.status(400).json({
      description: "O campo [precoBasePorLitro] deve ser preenchido!",
    });
    return;
  }
  const precoBasePorLitroTemp = String(req.body.precoBasePorLitro).replaceAll(",", ".");
  if (isNaN(precoBasePorLitroTemp)) {
    res.status(400).json({
      description: "O campo [precoBasePorLitro] deve conter um valor numérico!",
    });
    return;
  }
  if (parseFloat(precoBasePorLitroTemp) < 0.01 || parseFloat(precoBasePorLitroTemp) > 999999999.99) {
    res.status(400).json({
      description: "O campo [precoBasePorLitro] contem um valor fora dos limites esperados: R$0,01 <= precoBasePorLitro <= R$999.999.999,99!",
    });
    return;
  }

  if (!req.body.custoDeslocamentoPorKmAte50Km) {
    res.status(400).json({
      description: "O campo [custoDeslocamentoPorKmAte50Km] deve ser preenchido!",
    });
    return;
  }
  const custoDeslocamentoPorKmAte50KmTemp = String(req.body.custoDeslocamentoPorKmAte50Km).replaceAll(",", ".");
  if (isNaN(custoDeslocamentoPorKmAte50KmTemp)) {
    res.status(400).json({
      description: "O campo [custoDeslocamentoPorKmAte50Km] deve conter um valor numérico!",
    });
    return;
  }
  if (parseFloat(custoDeslocamentoPorKmAte50KmTemp) < 0 || parseFloat(custoDeslocamentoPorKmAte50KmTemp) > 999999999.99) {
    res.status(400).json({
      description: "O campo [custoDeslocamentoPorKmAte50Km] contem um valor fora dos limites esperados: R$0,01 <= custoDeslocamentoPorKmAte50Km <= R$999.999.999,99!",
    });
    return;
  }

  if (!req.body.custoDeslocamentoPorKmAcimaDe50Km) {
    res.status(400).json({
      description: "O campo [custoDeslocamentoPorKmAcimaDe50Km] deve ser preenchido!",
    });
    return;
  }
  const custoDeslocamentoPorKmAcimaDe50KmTemp = String(req.body.custoDeslocamentoPorKmAcimaDe50Km).replaceAll(",", ".");
  if (isNaN(custoDeslocamentoPorKmAcimaDe50KmTemp)) {
    res.status(400).json({
      description: "O campo [custoDeslocamentoPorKmAcimaDe50Km] deve conter um valor numérico!",
    });
    return;
  }
  if (parseFloat(custoDeslocamentoPorKmAcimaDe50KmTemp) < 0 || parseFloat(custoDeslocamentoPorKmAcimaDe50KmTemp) > 999999999.99) {
    res.status(400).json({
      description: "O campo [custoDeslocamentoPorKmAcimaDe50Km] contem um valor fora dos limites esperados: R$0,01 <= custoDeslocamentoPorKmAcimaDe50Km <= R$999.999.999,99!",
    });
    return;
  }

  if (!req.body.bonusPorProducaoAcimaDe10000L) {
    res.status(400).json({
      description: "O campo [bonusPorProducaoAcimaDe10000L] deve ser preenchido!",
    });
    return;
  }
  const bonusPorProducaoAcimaDe10000LTemp = String(req.body.bonusPorProducaoAcimaDe10000L).replaceAll(",", ".");
  if (isNaN(bonusPorProducaoAcimaDe10000LTemp)) {
    res.status(400).json({
      description: "O campo [bonusPorProducaoAcimaDe10000L] deve conter um valor numérico!",
    });
    return;
  }
  if (parseFloat(bonusPorProducaoAcimaDe10000LTemp) < 0 || parseFloat(bonusPorProducaoAcimaDe10000LTemp) > 999999999.99) {
    res.status(400).json({
      description: "O campo [bonusPorProducaoAcimaDe10000L] contem um valor fora dos limites esperados: R$0,01 <= bonusPorProducaoAcimaDe10000L <= R$999.999.999,99!",
    });
    return;
  }
});

const buildMap = AssyncHandler(async (req) => {
  const tabelaPrecoMap = {
    id: req.body.id ? String(req.body.id) : undefined,
    ano: parseInt(req.body.ano),
    semestre: parseInt(req.body.semestre),
    precoBasePorLitro: parseFloat(req.body.precoBasePorLitro),
    custoDeslocamentoPorKmAte50Km: parseFloat(req.body.custoDeslocamentoPorKmAte50Km),
    custoDeslocamentoPorKmAcimaDe50Km: parseFloat(req.body.custoDeslocamentoPorKmAcimaDe50Km),
    bonusPorProducaoAcimaDe10000L: parseFloat(req.body.bonusPorProducaoAcimaDe10000L),
  };

  return tabelaPrecoMap;
});

const getTabelaPrecoOut = AssyncHandler(async (tabelaPreco) => {
  const tabelaPrecoOut = {
    id: tabelaPreco._id,
    ano: tabelaPreco.ano,
    semestre: tabelaPreco.semestre,
    precoBasePorLitro: tabelaPreco.precoBasePorLitro,
    custoDeslocamentoPorKmAte50Km: tabelaPreco.custoDeslocamentoPorKmAte50Km,
    custoDeslocamentoPorKmAcimaDe50Km: tabelaPreco.custoDeslocamentoPorKmAcimaDe50Km,
    bonusPorProducaoAcimaDe10000L: tabelaPreco.bonusPorProducaoAcimaDe10000L,
    ptBR: {
      precoBasePorLitro: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tabelaPreco.precoBasePorLitro),
      custoDeslocamentoPorKmAte50Km: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tabelaPreco.custoDeslocamentoPorKmAte50Km),
      custoDeslocamentoPorKmAcimaDe50Km: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tabelaPreco.custoDeslocamentoPorKmAcimaDe50Km),
      bonusPorProducaoAcimaDe10000L: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tabelaPreco.bonusPorProducaoAcimaDe10000L),
    },
    enUS: {
      precoBasePorLitro: '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tabelaPreco.precoBasePorLitro),
      custoDeslocamentoPorKmAte50Km: '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tabelaPreco.custoDeslocamentoPorKmAte50Km),
      custoDeslocamentoPorKmAcimaDe50Km: '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tabelaPreco.custoDeslocamentoPorKmAcimaDe50Km),
      bonusPorProducaoAcimaDe10000L: '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tabelaPreco.bonusPorProducaoAcimaDe10000L),
    }
  }

  return tabelaPrecoOut;
});

const summary = AssyncHandler(async (res, tabelaPrecoList) => {
  if (tabelaPrecoList.length > 0) {
    for (let i = 0; i < tabelaPrecoList.length; i++) {
      tabelaPrecoList[i] = await getTabelaPrecoOut(tabelaPrecoList[i]);
    }
    if (tabelaPrecoList.length > 0) {
      res.status(200).json({
        description: "Dados das tabelas de preços obtidos com sucesso!",
        data: tabelaPrecoList,
      });
    } else {
      res.status(404).json({
        description: "Tabelas de preços não encontradas!",
      });
    }
  }
});

const createTabelaPreco = AssyncHandler(async (req, res) => {
  if (req.body.id) {
    res.status(400).json({
      description: "O campo [id] não deve ser preenchido!",
    });
    return;
  }
  await validade(req, res);

  const tabelaPrecoMap = await buildMap(req);

  const tabelaPreco = await TabelaPreco.create(tabelaPrecoMap);

  const tabelaPrecoOut = await getTabelaPrecoOut(tabelaPreco);
  res.status(201).json({
    description: "Dados da tabela de preço salvos com sucesso!",
    data: tabelaPrecoOut,
  });
});

const updateTabelaPreco = AssyncHandler(async (req, res) => {
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
  validade(req, res);

  const tabelaPrecoMap = await buildMap(req);

  const tabelaPreco = await TabelaPreco.findByIdAndUpdate(
    {
      _id: tabelaPrecoMap.id,
    },
    tabelaPrecoMap,
    {
      returnDocument: 'after'
    }
  );

  if (tabelaPreco) {
    const tabelaPrecoOut = await getTabelaPrecoOut(tabelaPreco);
    res.status(200).json({
      description: "Dados da tabela de preço atualizados com sucesso!",
      data: tabelaPrecoOut,
    });
  } else {
    res.status(404).json({
      description: "Tabela de preço não encontrada!",
    });
  }
});

const deleteTabelaPreco = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
    return;
  }

  const id = String(req.params.id);

  const tabelaPreco = await TabelaPreco.findByIdAndDelete(id);

  if (tabelaPreco) {
    const tabelaPrecoOut = await getTabelaPrecoOut(tabelaPreco);
    res.status(200).json({
      description: "Tabela de preço excluída com sucesso!",
      data: tabelaPrecoOut,
    });
  } else {
    res.status(404).json({
      description: "Tabela de preço não encontrada!",
    });
  }
});

const findAllTabelasPrecos = AssyncHandler(async (req, res) => {
  const tabelaPrecoList = await TabelaPreco
    .find({})
    .sort({
      ano: 'asc',
      semestre: 'asc'
    });

  await summary(res, tabelaPrecoList);
});

const findTabelaPrecoById = AssyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      description: "O parâmetro [id] deve ser preenchido!",
    });
    return;
  }

  const id = String(req.params.id);

  const tabelaPreco = await TabelaPreco.findById(id);

  if (tabelaPreco) {
    const tabelaPrecoOut = await getTabelaPrecoOut(tabelaPreco);
    res.status(200).json({
      description: "Tabela de preço obtida com sucesso!",
      data: tabelaPrecoOut,
    });
  } else {
    res.status(404).json({
      description: "Tabela de preço não encontrada!"
    });
  }
});

const findTabelasPrecosByAno = AssyncHandler(async (req, res) => {
  if (!req.query.ano) {
    res.status(400).json({
      description: "O parâmetro [ano] deve ser preenchido!",
    });
    return;
  }
  const anoTemp = String(req.query.ano).replaceAll(",", ".");
  if (isNaN(anoTemp)) {
    res.status(400).json({
      description: "O parâmetro [ano] deve conter um valor numérico!",
    });
    return;
  }
  if (parseInt(anoTemp) < 1900 || parseInt(anoTemp) > 9999) {
    res.status(400).json({
      description: "O parâmetro [ano] contem um valor fora dos limites esperados: 1900 <= ano <= 9999!",
    });
    return;
  }

  const ano = parseInt(req.query.ano);

  const tabelaPrecoList = await TabelaPreco
    .find({
      ano: ano
    })
    .sort({
      ano: 'asc',
      semestre: 'asc'
    });

  await summary(res, tabelaPrecoList);
});

const findTabelaPrecoByAnoAndSemetre = AssyncHandler(async (req, res) => {
  if (!req.query.ano) {
    res.status(400).json({
      description: "O parâmetro [ano] deve ser preenchido!",
    });
    return;
  }
  const anoTemp = String(req.query.ano).replaceAll(",", ".");
  if (isNaN(anoTemp)) {
    res.status(400).json({
      description: "O parâmetro [ano] deve conter um valor numérico!",
    });
    return;
  }
  if (parseInt(anoTemp) < 1900 || parseInt(anoTemp) > 9999) {
    res.status(400).json({
      description: "O parâmetro [ano] contem um valor fora dos limites esperados: 1900 <= ano <= 9999!",
    });
    return;
  }

  if (!req.query.semestre) {
    res.status(400).json({
      description: "O parâmetro [semestre] deve ser preenchido!",
    });
    return;
  }
  const semestreTemp = String(req.query.semestre).replaceAll(",", ".");
  if (isNaN(semestreTemp)) {
    res.status(400).json({
      description: "O parâmetro [semestre] deve conter um valor numérico!",
    });
    return;
  }
  if (parseInt(semestreTemp) < 1 || parseInt(semestreTemp) > 2) {
    res.status(400).json({
      description: "O parâmetro [semestre] contem um valor fora dos limites esperados: 1 <= semestre <= 2!",
    });
    return;
  }

  const ano = parseInt(req.query.ano);
  const semestre = parseInt(req.query.semestre);

  const tabelaPrecoList = await TabelaPreco
    .find({
      ano: ano,
      semestre: semestre
    });

  if (tabelaPrecoList.length > 0) {
    const tabelaPrecoOut = await getTabelaPrecoOut(tabelaPrecoList[0]);
    res.status(200).json({
      description: "Tabela de preço obtida com sucesso!",
      data: tabelaPrecoOut,
    });
  } else {
    res.status(404).json({
      description: "Tabela de preço não encontrada!"
    });
  }
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
