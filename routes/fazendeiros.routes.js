const Express = require("express");
const Validator = require('../middlewares/validator.middleware');

const routes = Express.Router();

const {
  createFazendeiro,
  updateFazendeiro,
  deleteFazendeiro,
  findFazendeiroById,
  findFazendeirosByParams,
} = require("../controllers/fazendeiro.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Fazendeiro:
 *       type: object
 *       description: Dados de um fazendeiro
 *       properties:
 *         id:
 *           type: string
 *           description: Id do fazendeiro no banco de dados
 *           example: 6409e75d2566fed5d36fa2c2
 *         nome:
 *           type: string
 *           description: Nome do fazendeiro
 *           example: Raul Fernandez
 *         email:
 *           type: string
 *           description: E-mail do fazendeiro
 *           example: raulfernandez@gmail.com
 */

/**
 * @swagger
 * /milk/fazendeiros:
 *   post:
 *     tag:
 *       - fazendeiros
 *     summary: Criar um fazendeiro
 *     description: Criar um fazendeiro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Fazendeiro'
 *     responses:
 *       201:
 *         description: Fazendeiro criado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados do fazendeiro salvos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Fazendeiro'
 */
routes.post("/", Validator('fazendeiroPost'), createFazendeiro);

/**
 * @swagger
 * /milk/fazendeiros/{id}:
 *   patch:
 *     tag:
 *       - fazendeiros
 *     summary: Atualizar um fazendeiro
 *     description: Atualizar um fazendeiro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id do fazendeiro
 *         example: 640b638fb7f7f1454ce4f347
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Fazendeiro'
 *     responses:
 *       200:
 *         description: Fazendeiro Atualizado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados do fazendeiro atualizados com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Fazendeiro'
 */
routes.patch(
  "/:id",
  Validator('fazendeiroPatchParams'),
  Validator('fazendeiroPatchBody'),
  updateFazendeiro
);

/**
 * @swagger
 * /milk/fazendeiros/{id}:
 *   delete:
 *     tag:
 *       - fazendeiros
 *     summary: Excluir um fazendeiro
 *     description: Excluir um fazendeiro através do seu id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id do fazendeiro
 *         example: 640b638fb7f7f1454ce4f347
 *     responses:
 *       200:
 *         description: Fazendeiro excluído com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados do fazendeiro excluídos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Fazendeiro'
 */
routes.delete("/:id", Validator('fazendeiroDelete'), deleteFazendeiro);

/**
 * @swagger
 * /milk/fazendeiros/{id}:
 *   get:
 *     tag:
 *       - fazendeiros
 *     summary: Recuperar um fazendeiro
 *     description: Recuperar um fazendeiro através do seu id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id do fazendeiro
 *         example: 640b638fb7f7f1454ce4f347
 *     responses:
 *       200:
 *         description: Fazendeiro recuperado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados do fazendeiro obtidos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Fazendeiro'
 */
routes.get("/:id", Validator('fazendeiroGetById'), findFazendeiroById);

/**
 * @swagger
 * /milk/fazendeiros:
 *   get:
 *     tag:
 *       - fazendeiros
 *     summary: Recuperar fazendeiros
 *     description: Recuperar uma lista total ou parcial de fazendeiros
 *     responses:
 *       200:
 *         description: Lista de fazendeiros recuperada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados dos fazendeiros obtidos com sucesso!
 *                 data:
 *                   type: array
 *                   items: 
 *                     $ref: '#/components/schemas/Fazendeiro'
 */
routes.get(
  "/",
  Validator('fazendeiroGetByName'),
  Validator('fazendeiroGetByEmail'),
  findFazendeirosByParams
);

module.exports = routes;
