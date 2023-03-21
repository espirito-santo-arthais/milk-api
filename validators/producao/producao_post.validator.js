const messages = require('../messages-for-attributes.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const producaoPostSchema = Joi.object({
    fazenda: Joi.string().required().min(24, 'utf8').max(24, 'utf8').lowercase(),
    dataProducao: Joi.date().required().min('1-1-1900').max('12-31-9999'),
    litrosProduzidos: Joi.number().integer().required().min(1).max(200000),
});

module.exports = producaoPostSchema;
