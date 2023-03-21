const messages = {
    pt: {
        'any.required': 'O parâmetro {{#label}} é requerido!',
        'object.unknown': 'O parâmetro {{#label}} não é permitido!',
        'string.base': 'O parâmetro {{#label}} não contém um string ou não pode ser convertido para um string!',
        'string.empty': 'O parâmetro {{#label}} não pode estar vazio!',
        'string.email': 'O parâmetro {{#label}} não contém um endereço de e-mail válido!',
        'string.min': 'O parâmetro {{#label}} é mais curto que {#limit} caracteres!',
        'string.max': 'O parâmetro {{#label}} é mais comprido que {#limit} caracteres!',
        'number.base': 'O parâmetro {{#label}} não contém um número ou não pode ser convertido para um número!',
        'number.integer': 'O parâmetro {{#label}} não contém um número inteiro ou não pode ser convertido para um número inteiro!',
        'number.min': 'O parâmetro {{#label}} contém um valor menor que {#limit}!',
        'number.max': 'O parâmetro {{#label}} contém um valor maior que {#limit}!',
        'date.base': 'O parâmetro {{#label}} não contém uma data ou não pode ser convertido para uma data!',
        'date.min': 'O parâmetro {{#label}} contém uma data menor que {#limit}!',
        'date.max': 'O parâmetro {{#label}} contém uma data maior que {#limit}!',
    },
    en: {
        'any.required': '{{#label}} parameter is required!',
        'object.unknown': '{{#label}} parameter is not allowed!',
        'string.base': '{{#label}} parameter does not contain a string or could not be cast to a string!',
        'string.empty': '{{#label}} parameter is not allowed to be empty!',
        'string.email': '{{#label}} parameter does not contain a valid email address!',
        'string.min': '{{#label}} parameter is shorter than {#limit} characters!',
        'string.max': '{{#label}} parameter is longer than {#limit} characters!',
        'number.base': '{{#label}} parameter does not contain a number or could not be cast to a number!',
        'number.integer': '{{#label}} parameter does not contain an integer number or could not be cast to an integer number!',
        'number.min': '{{#label}} parameter is less than {#limit}!',
        'number.max': '{{#label}} parameter is greater than {#limit}!',
        'date.base': '{{#label}} parameter does not contain a date or could not be cast to a date!',
        'date.min': '{{#label}} parameter is less than {#limit}!',
        'date.max': '{{#label}} parameter is greater than {#limit}!',
    }
}

module.exports = messages;