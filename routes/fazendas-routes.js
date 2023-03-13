const Express = require("express");

const routes = Express.Router();

const {
  createFazenda,
  updateFazenda,
  deleteFazenda,
  findFazendaById,
  findFazendasByParams,
} = require("../controllers/fazenda-controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     FazendaAbstract:
 *       type: object
 *       description: Dados de uma fazenda abstrata
 *       properties:
 *         id:
 *           type: string
 *           description: Id da fazenda no banco de dados
 *           example: 6409e75d2566fed5d36fa2c2
 *         nome:
 *           type: string
 *           description: Nome da fazenda
 *           example: Brilhante do Araguáia
 *         distanciaEmKm:
 *           type: number
 *           description: Distância da fazenda até a empresa ou cooperativa
 *           example: 105
 *     Fazenda:
 *       allOf:
 *         - $ref: '#/components/schemas/FazendaAbstract'
 *         - type: object
 *           description: Dados de uma fazenda para serem usados nas operações POST ou PATCH
 *           properties:
 *             fazendeiro:
 *               type: string
 *               description: Id do fazendeiro
 *               example: 6409e75d2566fed5d36fa2c2
 *     FazendaOut:
 *       allOf:
 *         - $ref: '#/components/schemas/FazendaAbstract'
 *         - type: object
 *           description: Dados de uma fazenda para serem usados nas respostas das operações
 *           properties:
 *             fazendeiro:
 *               type: object
 *               $ref: '#/components/schemas/Fazendeiro'
 *             ptBR:
 *               type: object
 *               description: Valores localizados para os formatos brasileiros
 *               properties:
 *                 distanciaEmKm:
 *                   type: string
 *                   description: Distância da fazenda até a empresa ou cooperativa
 *                   example: 105,000
 *             enUS:
 *               type: object
 *               description: Valores localizados para os formatos norte americanos
 *               properties:
 *                 distanciaEmKm:
 *                   type: string
 *                   description: Distância da fazenda até a empresa ou cooperativa
 *                   example: 105.000
 */

/**
 * @swagger
 * /milk/fazendas:
 *   post:
 *     tag:
 *       - fazendas
 *     summary: Criar uma fazenda
 *     description: Criar uma fazenda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Fazenda'
 *     responses:
 *       201:
 *         description: Fazenda criada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da fazenda salvos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/FazendaOut'
 */
routes.post("/", createFazenda);

/**
 * @swagger
 * /milk/fazendas/{id}:
 *   patch:
 *     tag:
 *       - fazendas
 *     summary: Atualizar uma fazenda
 *     description: Atualizar uma fazenda
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da fazenda
 *         example: 640b638fb7f7f1454ce4f347
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Fazenda'
 *     responses:
 *       200:
 *         description: Fazenda atualizada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da fazenda atualizados com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/FazendaOut'
 */
routes.patch("/:id", updateFazenda);

/**
 * @swagger
 * /milk/fazendas/{id}:
 *   delete:
 *     tag:
 *       - fazendas
 *     summary: Excluir uma fazenda
 *     description: Excluir uma fazenda através do seu id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da fazenda
 *         example: 640b638fb7f7f1454ce4f347
 *     responses:
 *       200:
 *         description: Fazenda excluída com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da fazenda excluídos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/FazendaOut'
 */
routes.delete("/:id", deleteFazenda);

/**
 * @swagger
 * /milk/fazendas/{id}:
 *   get:
 *     tag:
 *       - fazendas
 *     summary: Recuperar uma fazenda
 *     description: Recuperar uma fazenda através do seu id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da fazenda
 *         example: 640b638fb7f7f1454ce4f347
 *     responses:
 *       200:
 *         description: Fazenda recuperada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da fazenda obtidos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/FazendaOut'
 */
routes.get("/:id", findFazendaById);

/**
 * @swagger
 * /milk/fazendas:
 *   get:
 *     tag:
 *       - fazendas
 *     summary: Recuperar fazendas
 *     description: Recuperar uma lista total ou parcial de fazendas
 *     responses:
 *       200:
 *         description: Lista de fazendas recuperada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados das fazendas obtidos com sucesso!
 *                 data:
 *                   type: array
 *                   items: 
 *                     $ref: '#/components/schemas/FazendaOut'
 */
routes.get("/", findFazendasByParams);

module.exports = routes;
