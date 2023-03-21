const messages = require('../messages-for-attributes.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const fazendaPatchSchema = Joi.object({
    id: Joi.string().required().min(24, 'utf8').max(24, 'utf8').lowercase(),
    nome: Joi.string().required().min(2).max(80),
    fazendeiro: Joi.string().required().min(24, 'utf8').max(24, 'utf8').lowercase(),
    distanciaEmKm: Joi.number().required().min(0.001).max(1000.000).precision(3),
});

module.exports = fazendaPatchSchema;