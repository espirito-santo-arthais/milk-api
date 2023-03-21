const messages = {
    pt: {
        'any.required': 'O atributo {{#label}} é requerido!',
        'object.unknown': 'O atributo {{#label}} não é permitido!',
        'string.base': 'O atributo {{#label}} não contém um string ou não pode ser convertido para um string!',
        'string.empty': 'O atributo {{#label}} não pode estar vazio!',
        'string.email': 'O atributo {{#label}} não contém um endereço de e-mail válido!',
        'string.min': 'O atributo {{#label}} é mais curto que {#limit} caracteres!',
        'string.max': 'O atributo {{#label}} é mais comprido que {#limit} caracteres!',
        'number.base': 'O atributo {{#label}} não contém um número ou não pode ser convertido para um número!',
        'number.integer': 'O atributo {{#label}} não contém um número inteiro ou não pode ser convertido para um número inteiro!',
        'number.min': 'O atributo {{#label}} contém um valor menor que {#limit}!',
        'number.max': 'O atributo {{#label}} contém um valor maior que {#limit}!',
        'date.base': 'O atributo {{#label}} não contém uma data ou não pode ser convertido para uma data!',
        'date.min': 'O atributo {{#label}} contém uma data menor que {#limit}!',
        'date.max': 'O atributo {{#label}} contém uma data maior que {#limit}!',
    },
    en: {
        'any.required': '{{#label}} attribute is required!',
        'object.unknown': '{{#label}} attribute is not allowed!',
        'string.base': '{{#label}} attribute does not contain a string or could not be cast to a string!',
        'string.empty': '{{#label}} attribute is not allowed to be empty!',
        'string.email': '{{#label}} attribute does not contain a valid email address!',
        'string.min': '{{#label}} attribute is shorter than {#limit} characters!',
        'string.max': '{{#label}} attribute is longer than {#limit} characters!',
        'number.base': '{{#label}} attribute does not contain a number or could not be cast to a number!',
        'number.integer': '{{#label}} attribute does not contain an integer number or could not be cast to an integer number!',
        'number.min': '{{#label}} attribute is less than {#limit}!',
        'number.max': '{{#label}} attribute is greater than {#limit}!',
        'date.base': '{{#label}} attribute does not contain a date or could not be cast to a date!',
        'date.min': '{{#label}} attribute is less than {#limit}!',
        'date.max': '{{#label}} attribute is greater than {#limit}!',
    }
}

module.exports = messages;