const messages = require('../messages-for-parameters.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const tabelaPrecoGetByAnoAndSemestreSchema = Joi.object({
    ano: Joi.number().integer().required().min(1900).max(9999),
    semestre: Joi.number().integer().required().min(1).max(2),
});

module.exports = tabelaPrecoGetByAnoAndSemestreSchema;
