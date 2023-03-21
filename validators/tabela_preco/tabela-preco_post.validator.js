const messages = require('../messages-for-attributes.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const tabelaPrecoPostSchema = Joi.object({
    ano: Joi.number().integer().required().min(1900).max(9999),
    semestre: Joi.number().integer().required().min(1).max(2),
    precoBasePorLitro: Joi.number().required().min(0.01).max(999.99).precision(2),
    custoDeslocamentoPorKmAte50Km: Joi.number().required().min(0.01).max(999.99).precision(2),
    custoDeslocamentoPorKmAcimaDe50Km: Joi.number().required().min(0.01).max(999.99).precision(2),
    bonusPorProducaoAcimaDe10000L: Joi.number().required().min(0.01).max(999.99).precision(2),
});

module.exports = tabelaPrecoPostSchema;
