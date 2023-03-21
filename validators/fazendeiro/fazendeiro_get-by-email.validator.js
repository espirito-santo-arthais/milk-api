const messages = require('../messages-for-parameters.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const fazendeiroGetByEmailSchema = Joi.object({
    email: Joi.string().required().empty().lowercase(),
});

module.exports = fazendeiroGetByEmailSchema;