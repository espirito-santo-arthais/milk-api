const AssyncHandler = require("express-async-handler");
const Fazendeiro = require("../models/fazendeiro");
const Fazenda = require("../models/fazenda");
const Producao = require("../models/producao");
const TabelaPreco = require("../models/tabela-preco");

const validade = AssyncHandler(async (req, res) => {
  const fazendaTemp = await Fazenda.findById(String(req.body.fazenda));
  if (!fazendaTemp) {
    res.status(422).json({
      description: "Fazenda não encontrada!",
    });
    return;
  }
});

const buildMap = AssyncHandler(async (req) => {
  const fazendaTemp = await Fazenda.findById(String(req.body.fazenda));

  const producaoMap = {
    id: req.body.id ? String(req.body.id) : undefined,
    fazendeiro: fazendaTemp.fazendeiro,
    fazenda: fazendaTemp._id.toString(),
    dataProducao: new Date(req.body.dataProducao),
    litrosProduzidos: parseFloat(req.body.litrosProduzidos),
  };

  return producaoMap;
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

const getProducaoOut = AssyncHandler(async (producao) => {
  const fazenda = await Fazenda.findById(producao.fazenda);
  const fazendaOut = await getFazendaOut(fazenda);

  const producaoOut = {
    id: producao._id,
    fazenda: fazendaOut,
    dataProducao: producao.dataProducao.toISOString(),
    litrosProduzidos: producao.litrosProduzidos,
    ptBR: {
      dataProducao: producao.dataProducao.toLocaleString("pt-BR"),
      litrosProduzidos: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(producao.litrosProduzidos),
    },
    enUS: {
      dataProducao: producao.dataProducao.toLocaleString('en-US'),
      litrosProduzidos: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(producao.litrosProduzidos),
    },
  }

  return producaoOut;
});

const getProducaoFazendaAnoMesOut = AssyncHandler(async (tabelaPreco, fazenda, ano, mes) => {
  const dataProducaoInicial = new Date();
  dataProducaoInicial.setUTCDate(1);
  dataProducaoInicial.setUTCMonth(mes)
  dataProducaoInicial.setUTCFullYear(ano)
  dataProducaoInicial.setUTCHours(0)
  dataProducaoInicial.setUTCMinutes(0)
  dataProducaoInicial.setUTCSeconds(0)
  dataProducaoInicial.setUTCMilliseconds(0);

  const dataProducaoFinal = new Date(dataProducaoInicial);
  dataProducaoFinal.setMonth(dataProducaoFinal.getMonth() + 1);
  dataProducaoFinal.setDate(dataProducaoFinal.getDate() - 1);

  const producaoList = await Producao
    .find({
      fazenda: fazenda,
      dataProducao: { $gte: dataProducaoInicial, $lte: dataProducaoFinal },
    }).sort({
      dataProducao: 'asc'
    });

  let producaoFazendaAnoMesOut = null;
  let totalDeLitrosProduzidos = 0;
  if (producaoList.length > 0) {
    for (let i = 0; i < producaoList.length; i++) {
      producaoList[i] = await getProducaoOut(producaoList[i]);
      totalDeLitrosProduzidos += producaoList[i].litrosProduzidos;
    }
    totalDeLitrosProduzidos = (Math.round((totalDeLitrosProduzidos + Number.EPSILON) * 10) / 10);
    totalDeDiasDeProducao = producaoList.length;

    const distanciaEmKm = producaoList[0].fazenda.distanciaEmKm;
    const precoBasePorLitro = tabelaPreco.precoBasePorLitro;
    const custoDeslocamentoPorKm = distanciaEmKm <= 50 ? tabelaPreco.custoDeslocamentoPorKmAte50Km : tabelaPreco.custoDeslocamentoPorKmAcimaDe50Km;
    const bonusPorProducaoPorLitro = (totalDeLitrosProduzidos <= 10000 ? 0 : tabelaPreco.bonusPorProducaoAcimaDe10000L);

    const mediaDeLitrosProduzidosPorDia = (Math.round(((totalDeLitrosProduzidos / totalDeDiasDeProducao) + Number.EPSILON) * 10) / 10);
    const valorBaseDaProducao = (Math.round(((totalDeLitrosProduzidos * precoBasePorLitro) + Number.EPSILON) * 100) / 100);
    const custoDeslocamentoTotal = (Math.round(((custoDeslocamentoPorKm * distanciaEmKm) + Number.EPSILON) * 100) / 100);
    const bonusPorProducaoTotal = (Math.round(((totalDeLitrosProduzidos * bonusPorProducaoPorLitro) + Number.EPSILON) * 100) / 100);
    const valorFinalDaProducao = valorBaseDaProducao - custoDeslocamentoTotal + bonusPorProducaoTotal;

    const precoFinalPorLitro = (Math.round(((valorFinalDaProducao / totalDeLitrosProduzidos) + Number.EPSILON) * 100) / 100);

    producaoFazendaAnoMesOut = {
      producaoList: producaoList,
      totalDeDiasDeProducao: totalDeDiasDeProducao,
      totalDeLitrosProduzidos: totalDeLitrosProduzidos,
      mediaDeLitrosProduzidosPorDia: mediaDeLitrosProduzidosPorDia,
      fatores: {
        distanciaEmKm: distanciaEmKm,
        precoBasePorLitro: precoBasePorLitro,
        custoDeslocamentoPorKm: custoDeslocamentoPorKm,
        bonusPorProducaoPorLitro: bonusPorProducaoPorLitro,
        precoFinalPorLitro: precoFinalPorLitro
      },
      totalizacoes: {
        valorBaseDaProducao: valorBaseDaProducao,
        custoDeslocamentoTotal: custoDeslocamentoTotal,
        bonusPorProducaoTotal: bonusPorProducaoTotal,
        valorFinalDaProducao: valorFinalDaProducao,
      },
      ptBR: {
        totalDeLitrosProduzidos: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(totalDeLitrosProduzidos),
        mediaDeLitrosProduzidosPorDia: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(mediaDeLitrosProduzidosPorDia),
        fatores: {
          distanciaEmKm: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(distanciaEmKm),
          precoBasePorLitro: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoBasePorLitro),
          custoDeslocamentoPorKm: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoDeslocamentoPorKm),
          bonusPorProducaoPorLitro: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bonusPorProducaoPorLitro),
          precoFinalPorLitro: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoFinalPorLitro),
        },
        totalizacoes: {
          valorBaseDaProducao: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorBaseDaProducao),
          custoDeslocamentoTotal: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoDeslocamentoTotal),
          bonusPorProducaoTotal: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bonusPorProducaoTotal),
          valorFinalDaProducao: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorFinalDaProducao),
        }
      },
      enUS: {
        totalDeLitrosProduzidos: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(totalDeLitrosProduzidos),
        mediaDeLitrosProduzidosPorDia: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(mediaDeLitrosProduzidosPorDia),
        fatores: {
          distanciaEmKm: new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(distanciaEmKm),
          precoBasePorLitro: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(precoBasePorLitro),
          custoDeslocamentoPorKm: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(custoDeslocamentoPorKm),
          bonusPorProducaoPorLitro: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(bonusPorProducaoPorLitro),
          precoFinalPorLitro: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(precoFinalPorLitro),
        },
        totalizacoes: {
          valorBaseDaProducao: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valorBaseDaProducao),
          custoDeslocamentoTotal: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(custoDeslocamentoTotal),
          bonusPorProducaoTotal: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(bonusPorProducaoTotal),
          valorFinalDaProducao: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valorFinalDaProducao),
        }
      }
    }
  }

  return producaoFazendaAnoMesOut;
});

const summary = AssyncHandler(async (res, producaoList) => {
  if (producaoList.length > 0) {
    for (let i = 0; i < producaoList.length; i++) {
      producaoList[i] = await getProducaoOut(producaoList[i]);
    }
    res.status(200).json({
      description: "Dados das produções de leite obtidos com sucesso!",
      data: producaoList,
    });
  } else {
    res.status(404).json({
      description: "Produções de leite não encontradas!"
    });
  }
});

const createProducao = AssyncHandler(async (req, res) => {
  await validade(req, res);

  const producaoMap = await buildMap(req);

  const producao = await Producao.create(producaoMap);

  const producaoOut = await getProducaoOut(producao);
  res.status(201).json({
    description: "Dados da produção de leite salvos com sucesso!",
    data: producaoOut,
  });
});

const updateProducao = AssyncHandler(async (req, res) => {
  await validade(req, res);

  const producaoMap = await buildMap(req);

  const producao = await Producao.findByIdAndUpdate(
    {
      _id: producaoMap.id
    },
    producaoMap,
    {
      returnDocument: 'after'
    }
  );

  if (producao) {
    const producaoOut = await getProducaoOut(producao);
    res.status(200).json({
      description: "Dados da produção de leite atualizados com sucesso!",
      data: producaoOut,
    });
  } else {
    res.status(404).json({
      description: "Produção de leite não encontrada!",
    });
  }
});

const deleteProducao = AssyncHandler(async (req, res) => {
  const id = String(req.params.id);

  const producao = await Producao.findByIdAndDelete(id);

  if (producao) {
    const producaoOut = await getProducaoOut(producao);
    res.status(200).json({
      description: "Produção de leite excluída com sucesso!",
      data: producaoOut,
    });
  } else {
    res.status(404).json({
      description: "Produção de leite não encontrada!",
    });
  }
});

const findProducaoById = AssyncHandler(async (req, res) => {
  const id = String(req.params.id);

  const producao = await Producao.findById(id);

  if (producao) {
    const producaoOut = await getProducaoOut(producao);
    res.status(200).json({
      description: "Produção de leite obtida com sucesso!",
      data: producaoOut,
    });
  } else {
    res.status(404).json({
      description: "Produção de leite não encontrada!",
    });
  }
});

const findProducoesByDataProducaoBetween = AssyncHandler(async (req, res) => {
  const dataProducaoInicial = new Date(req.query.dataProducaoInicial).toISOString();
  const dataProducaoFinal = new Date(req.query.dataProducaoFinal).toISOString();

  if (new Date(dataProducaoInicial).getTime > new Date(dataProducaoFinal).getTime) {
    res.status(400).json({
      description: "Período inválido: o valor do parâmetro [dataProducaoInicial] não pode ser maior que o valor do parâmetro [dataProducaoFinal]!",
    });
    return;
  }

  const producaoList = await Producao
    .find({
      dataProducao: { $gte: dataProducaoInicial, $lte: dataProducaoFinal },
    })
    .sort({
      dataProducao: 'asc'
    });

  await summary(res, producaoList);
});

const findProducoesByFazendaAndDataProducaoBetween = AssyncHandler(async (req, res) => {
  const fazenda = String(req.query.fazenda);
  const dataProducaoInicial = new Date(req.query.dataProducaoInicial).toISOString();
  const dataProducaoFinal = new Date(req.query.dataProducaoFinal).toISOString();

  if (new Date(dataProducaoInicial).getTime > new Date(dataProducaoFinal).getTime) {
    res.status(400).json({
      description: "Período inválido: o valor do parâmetro [dataProducaoInicial] não pode ser maior que o valor do parâmetro [dataProducaoFinal]!",
    });
    return;
  }

  const producaoList = await Producao
    .find({
      fazenda: fazenda,
      dataProducao: { $gte: dataProducaoInicial, $lte: dataProducaoFinal },
    }).sort({
      fazenda: 'asc',
      dataProducao: 'asc'
    });

  await summary(res, producaoList);
});

const findProducoesByFazendaAndAnoAndMes = AssyncHandler(async (req, res) => {
  const tabelaPrecoList = await TabelaPreco.find({
    ano: parseInt(req.query.ano),
    semestre: (parseInt(req.query.mes) <= 6 ? 1 : 2)
  });

  if (tabelaPrecoList.length === 0) {
    res.status(422).json({
      description: "A tabela de preço correspondente não foi encontrada. Impossível realizar os cálculos!",
    });
    return;
  }

  const tabelaPreco = tabelaPrecoList[0];
  const fazenda = String(req.query.fazenda);
  ano = parseInt(ano);
  mes = parseInt(mes) - 1;
  
  const producaoFazendaAnoMesOut = await getProducaoFazendaAnoMesOut(tabelaPreco, fazenda, ano, mes)

  if (producaoFazendaAnoMesOut) {
    res.status(200).json({
      description: "Dados das produções de leite obtidos com sucesso!",
      data: producaoFazendaAnoMesOut,
    });
  } else {
    res.status(404).json({
      description: "Produções de leite não encontradas!"
    });
  }
});

const findProducoesByFazendaAndAno = AssyncHandler(async (req, res) => {
  const tabelaPrecoList = await TabelaPreco.find({
    ano: parseInt(req.query.ano)
  });

  if (tabelaPrecoList.length < 2) {
    res.status(422).json({
      description: "As tabelas de preços correspondentes não foram encontradas. Impossível realizar os cálculos!",
    });
    return;
  }

  const fazenda = String(req.query.fazenda);
  ano = parseInt(ano);

  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const producaoFazendaAnoOut = {
    fazenda: fazenda,
    ano: ano,
    meses: []
  };

  let totalDeDiasDeProducao = 0;
  let totalDeMesesDeProducao = 0;
  let totalDeLitrosProduzidos = 0;

  let valorBaseDaProducao = 0;
  let custoDeslocamentoTotal = 0;
  let bonusPorProducaoTotal = 0;

  for (let mes = 0; mes < 12; mes++) {
    const tabelaPreco = (mes <= 6) ? tabelaPrecoList[0] : tabelaPrecoList[1];
    const producaoFazendaAnoMesOut = await getProducaoFazendaAnoMesOut(tabelaPreco, fazenda, ano, mes)
    if (producaoFazendaAnoMesOut) {
      producaoFazendaAnoOut.meses.push({
        mes: nomesMeses[mes],
        producao: producaoFazendaAnoMesOut
      });

      totalDeDiasDeProducao += producaoFazendaAnoMesOut.totalDeDiasDeProducao;
      totalDeMesesDeProducao++;
      totalDeLitrosProduzidos += producaoFazendaAnoMesOut.totalDeLitrosProduzidos;

      valorBaseDaProducao += producaoFazendaAnoMesOut.totalizacoes.valorBaseDaProducao;
      custoDeslocamentoTotal += producaoFazendaAnoMesOut.totalizacoes.custoDeslocamentoTotal;
      bonusPorProducaoTotal += producaoFazendaAnoMesOut.totalizacoes.bonusPorProducaoTotal;
    }
  }

  if (totalDeLitrosProduzidos > 0) {
    totalDeLitrosProduzidos = (Math.round((totalDeLitrosProduzidos + Number.EPSILON) * 10) / 10);
    const mediaDeLitrosProduzidosPorDia = (Math.round(((totalDeLitrosProduzidos / totalDeDiasDeProducao) + Number.EPSILON) * 10) / 10);
    const mediaDeLitrosProduzidosPorMes = (Math.round(((totalDeLitrosProduzidos / totalDeMesesDeProducao) + Number.EPSILON) * 10) / 10);

    const valorFinalDaProducao = valorBaseDaProducao - custoDeslocamentoTotal + bonusPorProducaoTotal;

    const distanciaEmKm = producaoFazendaAnoOut.meses[0].producao.fatores.distanciaEmKm;
    const mediaDePrecoBasePorLitro = (Math.round(((valorBaseDaProducao / totalDeLitrosProduzidos) + Number.EPSILON) * 100) / 100);
    const mediaDeCustoDeslocamentoPorKm = (Math.round(((custoDeslocamentoTotal / (distanciaEmKm * totalDeMesesDeProducao)) + Number.EPSILON) * 100) / 100);
    const mediaDeBonusPorProducaoPorLitro = (Math.round(((bonusPorProducaoTotal / totalDeLitrosProduzidos) + Number.EPSILON) * 100) / 100);
    const precoFinalPorLitro = (Math.round(((valorFinalDaProducao / totalDeLitrosProduzidos) + Number.EPSILON) * 100) / 100);

    producaoFazendaAnoOut.totalDeDiasDeProducao = totalDeDiasDeProducao;
    producaoFazendaAnoOut.totalDeMesesDeProducao = totalDeMesesDeProducao;
    producaoFazendaAnoOut.totalDeLitrosProduzidos = totalDeLitrosProduzidos;
    producaoFazendaAnoOut.mediaDeLitrosProduzidosPorDia = mediaDeLitrosProduzidosPorDia;
    producaoFazendaAnoOut.mediaDeLitrosProduzidosPorMes = mediaDeLitrosProduzidosPorMes;

    producaoFazendaAnoOut.fatores = {
      distanciaEmKm: distanciaEmKm,
      mediaDePrecoBasePorLitro: mediaDePrecoBasePorLitro,
      mediaDeCustoDeslocamentoPorKm: mediaDeCustoDeslocamentoPorKm,
      mediaDeBonusPorProducaoPorLitro: mediaDeBonusPorProducaoPorLitro,
      precoFinalPorLitro: precoFinalPorLitro
    }

    producaoFazendaAnoOut.totalizacoes = {
      valorBaseDaProducao: valorBaseDaProducao,
      custoDeslocamentoTotal: custoDeslocamentoTotal,
      bonusPorProducaoTotal: bonusPorProducaoTotal,
      valorFinalDaProducao: valorFinalDaProducao,
    }

    producaoFazendaAnoOut.ptBR = {
      totalDeLitrosProduzidos: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(totalDeLitrosProduzidos),
      mediaDeLitrosProduzidosPorDia: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(mediaDeLitrosProduzidosPorDia),
      mediaDeLitrosProduzidosPorMes: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(mediaDeLitrosProduzidosPorMes),
      fatores: {
        distanciaEmKm: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(distanciaEmKm),
        mediaDePrecoBasePorLitro: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mediaDePrecoBasePorLitro),
        mediaDeCustoDeslocamentoPorKm: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mediaDeCustoDeslocamentoPorKm),
        mediaDeBonusPorProducaoPorLitro: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mediaDeBonusPorProducaoPorLitro),
        precoFinalPorLitro: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoFinalPorLitro),
      },
      totalizacoes: {
        valorBaseDaProducao: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorBaseDaProducao),
        custoDeslocamentoTotal: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custoDeslocamentoTotal),
        bonusPorProducaoTotal: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bonusPorProducaoTotal),
        valorFinalDaProducao: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorFinalDaProducao),
      }
    }

    producaoFazendaAnoOut.enUS = {
      totalDeLitrosProduzidos: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(totalDeLitrosProduzidos),
      mediaDeLitrosProduzidosPorDia: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(mediaDeLitrosProduzidosPorDia),
      mediaDeLitrosProduzidosPorMes: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(mediaDeLitrosProduzidosPorMes),
      fatores: {
        distanciaEmKm: new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(distanciaEmKm),
        mediaDePrecoBasePorLitro: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(mediaDePrecoBasePorLitro),
        mediaDeCustoDeslocamentoPorKm: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(mediaDeCustoDeslocamentoPorKm),
        mediaDeBonusPorProducaoPorLitro: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(mediaDeBonusPorProducaoPorLitro),
        precoFinalPorLitro: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(precoFinalPorLitro),
      },
      totalizacoes: {
        valorBaseDaProducao: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valorBaseDaProducao),
        custoDeslocamentoTotal: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(custoDeslocamentoTotal),
        bonusPorProducaoTotal: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(bonusPorProducaoTotal),
        valorFinalDaProducao: 'R$ ' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valorFinalDaProducao),
      }
    }

    res.status(200).json({
      description: "Dados das produções de leite obtidos com sucesso!",
      data: producaoFazendaAnoOut,
    });
  } else {
    res.status(404).json({
      description: "Produções de leite não encontradas!"
    });
  }
});

const findProducoesByFazendeiroAndDataProducaoBetween = AssyncHandler(async (req, res) => {
  const fazendeiro = String(req.query.fazendeiro);
  const dataProducaoInicial = new Date(req.query.dataProducaoInicial).toISOString();
  const dataProducaoFinal = new Date(req.query.dataProducaoFinal).toISOString();

  if (new Date(dataProducaoInicial).getTime > new Date(dataProducaoFinal).getTime) {
    res.status(400).json({
      description: "Período inválido: o valor do parâmetro [dataProducaoInicial] não pode ser maior que o valor do parâmetro [dataProducaoFinal]!",
    });
    return;
  }

  const producaoList = await Producao.find({
    fazendeiro: fazendeiro,
    dataProducao: { $gte: dataProducaoInicial, $lte: dataProducaoFinal },
  }).sort({
    fazendeiro: 'asc',
    fazenda: 'asc',
    dataProducao: 'asc'
  });

  await summary(res, producaoList);
});

const findProducoesByFazendeiroAndAnoAndMes = AssyncHandler(async (req, res) => {
  const producaoList = [];

  await summary(res, producaoList);
});

const findProducoesByFazendeiroAndAno = AssyncHandler(async (req, res) => {
  const producaoList = [];

  await summary(res, producaoList);
});

const findProducoesByParams = AssyncHandler(async (req, res) => {
  if (req.query.dataProducaoInicial && req.query.dataProducaoFinal && !req.query.fazendeiro && !req.query.fazenda && !req.query.ano && !req.query.mes) {
    findProducoesByDataProducaoBetween(req, res);
  } else if (req.query.dataProducaoInicial && req.query.dataProducaoFinal && !req.query.fazendeiro && req.query.fazenda && !req.query.ano && !req.query.mes) {
    findProducoesByFazendaAndDataProducaoBetween(req, res);
  } else if (!req.query.dataProducaoInicial && !req.query.dataProducaoFinal && !req.query.fazendeiro && req.query.fazenda && req.query.ano && req.query.mes) {
    findProducoesByFazendaAndAnoAndMes(req, res);
  } else if (!req.query.dataProducaoInicial && !req.query.dataProducaoFinal && !req.query.fazendeiro && req.query.fazenda && req.query.ano && !req.query.mes) {
    findProducoesByFazendaAndAno(req, res);
  } else if (req.query.dataProducaoInicial && req.query.dataProducaoFinal && req.query.fazendeiro && !req.query.fazenda && !req.query.ano && !req.query.mes) {
    findProducoesByFazendeiroAndDataProducaoBetween(req, res);
  } else if (!req.query.dataProducaoInicial && !req.query.dataProducaoFinal && req.query.fazendeiro && !req.query.fazenda && req.query.ano && req.query.mes) {
    findProducoesByFazendeiroAndAnoAndMes(req, res);
  } else if (!req.query.dataProducaoInicial && !req.query.dataProducaoFinal && req.query.fazendeiro && !req.query.fazenda && req.query.ano && !req.query.mes) {
    findProducoesByFazendeiroAndAno(req, res);
  } else {
    res.status(400).json({
      description: "Parâmetros inválidos!",
    });
  }
});

module.exports = {
  createProducao,
  updateProducao,
  deleteProducao,
  findProducaoById,
  findProducoesByParams,
};
