const Express = require("express");
const Validator = require('../middlewares/validator.middleware');

const routes = Express.Router();

const {
    createTabelaPreco,
    updateTabelaPreco,
    deleteTabelaPreco,
    findTabelaPrecoById,
    findTabelasPrecosByParams,
} = require("../controllers/tabela-preco.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     TabelaPreco:
 *       type: object
 *       description: Dados de uma tabela de preço
 *       properties:
 *         id:
 *           type: string
 *           description: Id da tabela de preço no banco de dados
 *           example: 6409e75d2566fed5d36fa2c2
 *         ano:
 *           type: number
 *           description: Ano de produção
 *           example: 2022
 *         semestre:
 *           type: number
 *           description: Semestre de produção 1 (primeiro) ou 2 (segundo)
 *           example: 2
 *         precoBasePorLitro:
 *           type: number
 *           description: Preço base pago por cada litro de leite produzido
 *           example: 1.9
 *         custoDeslocamentoPorKmAte50Km:
 *           type: number
 *           description: Custo do deslocamento por Km cobrado quando a fazenda dista até 50 Km da empresa ou cooperativa
 *           example: 0.05
 *         custoDeslocamentoPorKmAcimaDe50Km:
 *           type: number
 *           description: Custo do deslocamento por Km cobrado quando a fazenda dista acima de 50 Km da empresa ou cooperativa
 *           example: 0.06
 *         bonusPorProducaoAcimaDe10000L:
 *           type: number
 *           description: Bônus, por litro, por producao mensal acima de 10.000 litros
 *           example: 0.01
 *     TabelaPrecoOut:
 *       allOf:
 *         - $ref: '#/components/schemas/TabelaPreco'
 *         - type: object
 *           properties:
 *             ptBR:
 *               type: object
 *               description: Valores localizados para os formatos brasileiros
 *               properties:
 *                 precoBasePorLitro:
 *                   type: string
 *                   description: Preço base pago por cada litro de leite produzido
 *                   example: R$ 1,90
 *                 custoDeslocamentoPorKmAte50Km:
 *                   type: string
 *                   description: Custo do deslocamento por Km cobrado quando a fazenda dista até 50 Km da empresa ou cooperativa
 *                   example: R$ 0,05
 *                 custoDeslocamentoPorKmAcimaDe50Km:
 *                   type: string
 *                   description: Custo do deslocamento por Km cobrado quando a fazenda dista acima de 50 Km da empresa ou cooperativa
 *                   example: R$ 0,06
 *                 bonusPorProducaoAcimaDe10000L:
 *                   type: string
 *                   description: Bônus, por litro, por producao mensal acima de 10.000 litros
 *                   example: R$ 0,01
 *             enUS:
 *               type: object
 *               description: Valores localizados para os formatos norte americanos
 *               properties:
 *                 precoBasePorLitro:
 *                   type: string
 *                   description: Preço base pago por cada litro de leite produzido
 *                   example: $1.90
 *                 custoDeslocamentoPorKmAte50Km:
 *                   type: string
 *                   description: Custo do deslocamento por Km cobrado quando a fazenda dista até 50 Km da empresa ou cooperativa
 *                   example: $0.05
 *                 custoDeslocamentoPorKmAcimaDe50Km:
 *                   type: string
 *                   description: Custo do deslocamento por Km cobrado quando a fazenda dista acima de 50 Km da empresa ou cooperativa
 *                   example: $0,06
 *                 bonusPorProducaoAcimaDe10000L:
 *                   type: string
 *                   description: Bônus, por litro, por producao mensal acima de 10.000 litros
 *                   example: $0.01
 */

/**
 * @swagger
 * /milk/tabelas-de-precos:
 *   post:
 *     tag:
 *       - tabelas-de-precos
 *     summary: Criar uma tabela de preço
 *     description: Criar uma tabela de preço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/TabelaPreco'
 *     responses:
 *       201:
 *         description: Tabela de preço criada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da tabela de preço salvos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/TabelaPrecoOut'
 */
routes.post("/", Validator('tabelaPrecoPost'), createTabelaPreco);

/**
 * @swagger
 * /milk/tabelas-de-precos/{id}:
 *   patch:
 *     tag:
 *       - tabelas-de-precos
 *     summary: Atualizar uma tabela de preço
 *     description: Atualizar uma tabela de preço
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da tabela de preço
 *         example: 640b638fb7f7f1454ce4f347
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/TabelaPreco'
 *     responses:
 *       200:
 *         description: Tabela de preço atualizada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da tabela de preço atualizados com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/TabelaPrecoOut'
 */
routes.patch(
    "/:id",
    Validator('tabelaPrecoPatchParams'),
    Validator('tabelaPrecoPatchBody'),
    updateTabelaPreco
);

/**
 * @swagger
 * /milk/tabelas-de-precos/{id}:
 *   delete:
 *     tag:
 *       - tabelas-de-precos
 *     summary: Excluir uma tabela de preço
 *     description: Excluir uma tabela de preço através do seu id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da tabela de preço
 *         example: 640b638fb7f7f1454ce4f347
 *     responses:
 *       200:
 *         description: Tabela de preço excluída com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da tabela de preço excluídos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/TabelaPrecoOut'
 */
routes.delete("/:id", Validator('tabelaPrecoDelete'), deleteTabelaPreco);

/**
 * @swagger
 * /milk/tabelas-de-precos/{id}:
 *   get:
 *     tag:
 *       - tabelas-de-precos
 *     summary: Recuperar uma tabela de preço
 *     description: Recuperar uma tabela de preço através do seu id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da tabela de preço
 *         example: 640b638fb7f7f1454ce4f347
 *     responses:
 *       200:
 *         description: Tabela de preço recuperada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados da tabela de preço obtidos com sucesso!
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/TabelaPrecoOut'
 */
routes.get("/:id", Validator('tabelaPrecoGetById'), findTabelaPrecoById);

/**
 * @swagger
 * /milk/tabelas-de-precos:
 *   get:
 *     tag:
 *       - tabelas-de-precos
 *     summary: Recuperar tabelas de preços
 *     description: Recuperar uma lista total ou parcial de tabelas de preços
 *     responses:
 *       200:
 *         description: Lista de tabelas de preços recuperada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: Dados das tabelas de preços obtidos com sucesso!
 *                 data:
 *                   type: array
 *                   items: 
 *                     $ref: '#/components/schemas/TabelaPrecoOut'
 */
routes.get(
    "/",
    Validator('tabelaPrecoGetByAnoAndSemestre'),
    Validator('tabelaPrecoGetByAno'),
    findTabelasPrecosByParams
);

module.exports = routes;