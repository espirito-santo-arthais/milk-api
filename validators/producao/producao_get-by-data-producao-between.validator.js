const messages = require('../messages-for-parameters.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const producaoGetByDataProducaoBetweenSchema = Joi.object({
    dataProducaoInicial: Joi.date().required().min('1-1-1900').max('12-31-9999'),
    dataProducaoFinal: Joi.date().required().min('1-1-1900').max('12-31-9999'),
});

module.exports = producaoGetByDataProducaoBetweenSchema;
