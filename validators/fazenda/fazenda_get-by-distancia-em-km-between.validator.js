const messages = require('../messages-for-parameters.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const fazendaGetByDistanciaEmKmBetweenSchema = Joi.object({
    distanciaEmKmInicial: Joi.number().required().min(0.001).max(1000.000).precision(3),
    distanciaEmKmFinal: Joi.number().required().min(0.001).max(1000.000).precision(3),
});

module.exports = fazendaGetByDistanciaEmKmBetweenSchema;