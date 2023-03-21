const messages = require('../messages-for-parameters.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const fazendeiroGetByNameSchema = Joi.object({
    nome: Joi.string().required().min(2).max(80),
});

module.exports = fazendeiroGetByNameSchema;