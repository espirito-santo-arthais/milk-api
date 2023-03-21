const messages = require('../messages-for-parameters.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const fazendaGetByFazendeiroSchema = Joi.object({
    fazendeiro: Joi.string().required().min(24, 'utf8').max(24, 'utf8').lowercase(),
});

module.exports = fazendaGetByFazendeiroSchema;