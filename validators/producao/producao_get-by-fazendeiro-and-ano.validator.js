const messages = require('../messages-for-parameters.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const producaoGetByFazendeiroAndAnoSchema = Joi.object({
    fazendeiro: Joi.string().required().min(24, 'utf8').max(24, 'utf8').lowercase(),
    ano: Joi.number().integer().required().min(1900).max(9999),
});

module.exports = producaoGetByFazendeiroAndAnoSchema;
