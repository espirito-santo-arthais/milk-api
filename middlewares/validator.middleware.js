const createHttpError = require('http-errors');
const Joi = require('joi');
const Validators = require('../validators');

const LANGUAGE = 'pt';

module.exports = function (validator) {
  if (!Validators.hasOwnProperty(validator)) {
    throw new Error(`Validador '${validator}' não existe.`);
  }

  const validParams = async function (req, res, next) {
    const validatedParams = await Validators[validator].validateAsync(
      req.params,
      {
        // pt ou en
        errors: { language: LANGUAGE }
      }
    );

    return validatedParams;
  }

  const validQuery = async function (req, res, next) {
    if (Object.keys(req.query).length === 0) {
      return req.query;
    }

    let verify = false;

    // /fazendeiros GET
    if (!verify) {
      verify = (validator.includes('fazendeiroGetByName') && (
        ('nome' in req.query) &&
        !('email' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('fazendeiroGetByEmail') && (
        !('nome' in req.query) &&
        ('email' in req.query)
      ));
    }

    // /fazendas GET
    if (!verify) {
      verify = (validator.includes('fazendaGetByNome') && (
        ('nome' in req.query) &&
        !('distanciaEmKmInicial' in req.query) &&
        !('distanciaEmKmFinal' in req.query) &&
        !('fazendeiro' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('fazendaGetByDistanciaEmKmBetween') && (
        !('nome' in req.query) &&
        ('distanciaEmKmInicial' in req.query) &&
        ('distanciaEmKmFinal' in req.query) &&
        !('fazendeiro' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('fazendaByFazendeiro') && (
        !('nome' in req.query) &&
        !('distanciaEmKmInicial' in req.query) &&
        !('distanciaEmKmFinal' in req.query) &&
        ('fazendeiro' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('fazendaGetByFazendeiroAndDistanciaEmKmBetween') && (
        !('nome' in req.query) &&
        ('distanciaEmKmInicial' in req.query) &&
        ('distanciaEmKmFinal' in req.query) &&
        ('fazendeiro' in req.query)
      ));
    }

    // producoes GET
    if (!verify) {
      verify = (validator.includes('producaoByFazendaAndDataProducaoBetween') && (
        ('dataProducaoInicial' in req.query) &&
        ('dataProducaoFinal' in req.query) &&
        !('fazendeiro' in req.query) &&
        !('fazenda' in req.query) &&
        !('ano' in req.query) &&
        !('mes' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('producaoByFazendaAndAnoAndMes') && (
        !('dataProducaoInicial' in req.query) &&
        !('dataProducaoFinal' in req.query) &&
        !('fazendeiro' in req.query) &&
        ('fazenda' in req.query) &&
        ('ano' in req.query) &&
        ('mes' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('producaoByFazendaAndAno') && (
        !('dataProducaoInicial' in req.query) &&
        !('dataProducaoFinal' in req.query) &&
        !('fazendeiro' in req.query) &&
        ('fazenda' in req.query) &&
        ('ano' in req.query) &&
        !('mes' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('producaoByFazendeiroAndDataProducaoBetween') && (
        ('dataProducaoInicial' in req.query) &&
        ('dataProducaoFinal' in req.query) &&
        ('fazendeiro' in req.query) &&
        !('fazenda' in req.query) &&
        !('ano' in req.query) &&
        !('mes' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('producaoByFazendeiroAndAnoAndMes') && (
        !('dataProducaoInicial' in req.query) &&
        !('dataProducaoFinal' in req.query) &&
        ('fazendeiro' in req.query) &&
        !('fazenda' in req.query) &&
        ('ano' in req.query) &&
        ('mes' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('producaoByFazendeiroAndAno') && (
        !('dataProducaoInicial' in req.query) &&
        !('dataProducaoFinal' in req.query) &&
        ('fazendeiro' in req.query) &&
        !('fazenda' in req.query) &&
        ('ano' in req.query) &&
        !('mes' in req.query)
      ));
    }

    // tabelas-precos GET
    if (!verify) {
      verify = (validator.includes('tabelaPrecoGetByAno') && (
        ('ano' in req.query) &&
        !('semestre' in req.query)
      ));
    }
    if (!verify) {
      verify = (validator.includes('tabelaPrecoGetByAnoAndSemetre') && (
        ('ano' in req.query) &&
        ('semestre' in req.query)
      ));
    }

    if (!verify) {
      return req.query;
    }

    const validatedQuery = await Validators[validator].validateAsync(
      req.query,
      {
        // pt ou en
        errors: { language: LANGUAGE }
      }
    );
    return validatedQuery;
  }

  const validBody = async function (req, res, next) {
    const validatedBody = await Validators[validator].validateAsync(
      req.body,
      {
        // pt ou en
        errors: { language: LANGUAGE }
      }
    );
    return validatedBody;
  }

  return async function (req, res, next) {

    try {
      //const validatedHeaders = await Validators[validator].validateAsync(
      //  req.headers,
      //  {
      //    // pt ou en
      //    errors: { language: LANGUAGE }
      //  }
      //);
      //req.headers = validatedHeaders;

      // POST
      if (validator.includes('Post')) {
        req.body = await validBody(req, res, next);
      }

      // PATCH
      if (validator.includes('PatchParams')) {
        req.params = await validParams(req, res, next);
      }
      if (validator.includes('PatchBody')) {
        req.body = await validBody(req, res, next);

        if (req.params.id !== req.body.id) {
          const message = `O parâmetro [id] não pode ser diferente do campo [id]: ${req.params.id} !== ${req.body.id}`;
          next(createHttpError(422, { message: message }));
        }
      }

      // DELETE
      if (validator.includes('Delete')) {
        req.params = await validParams(req, res, next);
      }

      // GET
      if (validator.includes('Get')) {
        if (validator.includes('GetById')) {
          req.params = await validParams(req, res, next);
        } else {
          req.query = await validQuery(req, res, next);
        }
      }

      next();
    } catch (err) {
      if (err.isJoi) {
        const message = err.message.replace('"', '[').replace('"', ']');
        return next(createHttpError(422, { message: message }));
      }
      next(createHttpError(500, { message: err.message }));
    }
  }
}