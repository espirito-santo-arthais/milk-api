const Express = require("express");
const Validator = require('../middlewares/validator.middleware');

const routes = Express.Router();

const {
  createProducao,
  updateProducao,
  deleteProducao,
  findProducaoById,
  findProducoesByParams,
} = require("../controllers/producao.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     ProducaoAbstract:
 *       type: object
 *       description: Dados de uma produção de leite abstrata
 *       properties:
 *         id:
 *           type: string
 *           description: Id da produção de leite no banco de dados
 *           example: 6409e75d2566fed5d36fa2c2
 *         litrosProduzidos:
 *           type: number
 *           description: Quantidade de litros produzidos na data
 *           example: 40000
 *     Producao:
 *       allOf:
 *         - $ref: '#/components/schemas/ProducaoAbstract'
 *         - type: object
 *           description: Dados de uma produção de leite para serem usados nas operações POST ou PATCH
 *           properties:
 *             dataProducao:
 *               type: string
 *               description: Data da produção de leite
 *               example: 2020-01-01
 *             fazenda:
 *               type: string
 *               description: Id da fazenda
 *               example: 6409e75d2566fed5d36fa2c2
 *     ProducaoOut:
 *       allOf:
 *         - $ref: '#/components/schemas/ProducaoAbstract'
 *         - type: object
 *           description: Dados de uma produção de leite para serem usados nas respostas das operações
 *           properties:
 *             dataProducao:
 *               type: string
 *               description: Data da produção de leite em formato ISO 8601
 *               example: 2020-01-01T00:00:00.000Z
 *             fazenda:
 *               type: object
 *               $ref: '#/components/schemas/FazendaOut'
 *             ptBR:
 *               type: object
 *               description: Valores localizados para os formatos brasileiros
 *               properties:
 *                 litrosProduzidos:
 *                   type: string
 *                   description: Quantidade de litros produzidos na data
 *                   example: 40.000,0
 *             enUS:
 *               type: object
 *               description: Valores localizados para os formatos norte americanos
 *               properties:
 *                 litrosProduzidos:
 *                   type: string
 *                   description: Quantidade de litros produzidos na data
 *                   example: 40,000.0
 */

/**
 * @swagger
 * /milk/producoes:
 *   post:
 *     tag:
 *       - producoes
 *     summary: Criar uma produção de leite
 *     description: Criar uma produção de leite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Producao'
 *     responses:
 *       201:
 *         description: Produção de leite criada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da produção de leite salvos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/ProducaoOut'
 */
routes.post("/", Validator('producaoPost'), createProducao);

/**
 * @swagger
 * /milk/producoes/{id}:
 *   patch:
 *     tag:
 *       - producoes
 *     summary: Atualizar uma produção de leite
 *     description: Atualizar uma produção de leite
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da produção de leite
 *         example: 640b638fb7f7f1454ce4f347
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Producao'
 *     responses:
 *       200:
 *         description: Produção de leite atualizada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da produção de leite atualizados com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/ProducaoOut'
 */
routes.patch(
  "/:id",
  Validator('producaoPatchParams'),
  Validator('producaoPatchBody'),
  updateProducao
);

/**
 * @swagger
 * /milk/producoes/{id}:
 *   delete:
 *     tag:
 *       - producoes
 *     summary: Excluir uma produção de leite
 *     description: Excluir uma produção de leite através do seu id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da produção de leite
 *         example: 640b638fb7f7f1454ce4f347
 *     responses:
 *       200:
 *         description: Produção de leite excluída com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da produção de leite excluídos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/ProducaoOut'
 */
routes.delete("/:id", Validator('producaoDelete'), deleteProducao);

/**
 * @swagger
 * /milk/producoes/{id}:
 *   get:
 *     tag:
 *       - producoes
 *     summary: Recuperar uma produção de leite
 *     description: Recuperar uma produção de leite através do seu id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da produção de leite
 *         example: 640b638fb7f7f1454ce4f347
 *     responses:
 *       200:
 *         description: Produção de leite recuperada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da produção de leite obtidos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/ProducaoOut'
 */
routes.get("/:id", Validator('producaoGetById'), findProducaoById);

/**
 * @swagger
 * /milk/producoes:
 *   get:
 *     tag:
 *       - producoes
 *     summary: Recuperar producões de leite
 *     description: Recuperar uma lista total ou parcial de produções de leite
 *     parameters:
 *       - in: query
 *         name: dataProducaoInicial
 *         required: false
 *         schema:
 *           type: string
 *         description: Data inicial do período de produção de leite desejado
 *         example: 2020-01-01
 *       - in: query
 *         name: dataProducaoFinal
 *         required: false
 *         schema:
 *           type: string
 *         description: Data final do período de produção de leite desejado
 *         example: 2020-01-31
 *       - in: query
 *         name: fazendeiro
 *         required: false
 *         schema:
 *           type: string
 *         description: Id do fazendeiro
 *         example: 640b638fb7f7f1454ce4f347
 *       - in: query
 *         name: fazenda
 *         required: false
 *         schema:
 *           type: string
 *         description: Id da fazenda
 *         example: 640b638fb7f7f1454ce4f347
 *       - in: query
 *         name: ano
 *         required: false
 *         schema:
 *           type: string
 *         description: Ano da produção de leite
 *         example: 2020
 *       - in: query
 *         name: mes
 *         required: false
 *         schema:
 *           type: string
 *         description: Mês da produção de leite
 *         example: 01
 *     responses:
 *       200:
 *         description: Lista de produções de leite recuperada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados das produções de leite obtidos com sucesso!
 *                 data:
 *                   type: array
 *                   items: 
 *                     $ref: '#/components/schemas/ProducaoOut'
 */
routes.get(
  "/",
  Validator('producaoGetByDataProducaoBetween'),
  Validator('producaoGetByFazendaAndDataProducaoBetween'),
  Validator('producaoGetByFazendaAndAnoAndMes'),
  Validator('producaoGetByFazendaAndAno'),
  Validator('producaoGetByFazendeiroAndDataProducaoBetween'),
  Validator('producaoGetByFazendeiroAndAnoAndMes'),
  Validator('producaoGetByFazendeiroAndAno'),
  findProducoesByParams
);

module.exports = routes;
