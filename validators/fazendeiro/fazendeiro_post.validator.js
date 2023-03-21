const messages = require('../messages-for-attributes.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const fazendeiroPostSchema = Joi.object({
    nome: Joi.string().required().min(2).max(80),
    email: Joi.string().required().empty().email().lowercase(),
});

module.exports = fazendeiroPostSchema;