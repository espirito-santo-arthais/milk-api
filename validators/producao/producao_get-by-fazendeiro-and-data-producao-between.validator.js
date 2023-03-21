const messages = require('../messages-for-parameters.js');

const Joi = require('joi').defaults(schema => schema.options({ messages: messages }));

const producaoGetByFazendeiroAndDataProducaoBetweenSchema = Joi.object({
    fazendeiro: Joi.string().required().min(24, 'utf8').max(24, 'utf8').lowercase(),
    dataProducaoInicial: Joi.date().required().min('1-1-1900').max('12-31-9999'),
    dataProducaoFinal: Joi.date().required().min('1-1-1900').max('12-31-9999'),
});

module.exports = producaoGetByFazendeiroAndDataProducaoBetweenSchema;
