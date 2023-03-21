const messages = require('../messages-for-parameters.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const tabelaPrecoGetByAnoSchema = Joi.object({
    ano: Joi.number().integer().required().min(1900).max(9999),
});

module.exports = tabelaPrecoGetByAnoSchema;
