const AssyncHandler = require("express-async-handler");
const TabelaPreco = require("../models/tabela-preco");

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
  const ano = parseInt(req.body.ano);
  const semestre = parseInt(req.body.semestre);

  const tabelaPrecoTemp = await TabelaPreco.find({
    ano: ano,
    semestre: semestre
  });
  if (tabelaPrecoTemp) {
    res.status(400).json({
      description: `Tabela de preço para ${ano}/${semestre} já existe!`,
    });
    return;
  }

  const tabelaPrecoMap = await buildMap(req);

  const tabelaPreco = await TabelaPreco.create(tabelaPrecoMap);

  const tabelaPrecoOut = await getTabelaPrecoOut(tabelaPreco);
  res.status(201).json({
    description: "Dados da tabela de preço salvos com sucesso!",
    data: tabelaPrecoOut,
  });
});

const updateTabelaPreco = AssyncHandler(async (req, res) => {
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
