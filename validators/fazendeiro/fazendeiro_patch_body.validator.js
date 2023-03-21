const messages = require('../messages-for-attributes.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const fazendeiroSchema = Joi.object({
    id: Joi.string().required().min(24, 'utf8').max(24, 'utf8').lowercase(),
    nome: Joi.string().required().min(2).max(80),
    email: Joi.string().required().empty().email().lowercase(),
});

module.exports = fazendeiroSchema;