const fazendeiroPost = require('./fazendeiro/fazendeiro_post.validator');
const fazendeiroPatchParams = require('./fazendeiro/fazendeiro_patch_params.validator');
const fazendeiroPatchBody = require('./fazendeiro/fazendeiro_patch_body.validator');
const fazendeiroDelete = require('./fazendeiro/fazendeiro_delete.validator');
const fazendeiroGetById = require('./fazendeiro/fazendeiro_get-by-id.validator');
const fazendeiroGetByName = require('./fazendeiro/fazendeiro_get-by-name.validator');
const fazendeiroGetByEmail = require('./fazendeiro/fazendeiro_get-by-email.validator');
const fazendaPost = require('./fazenda/fazenda_post.validator');
const fazendaPatchParams = require('./fazenda/fazenda_patch_params.validator');
const fazendaPatchBody = require('./fazenda/fazenda_patch_body.validator');
const fazendaDelete = require('./fazenda/fazenda_delete.validator');
const fazendaGetById = require('./fazenda/fazenda_get-by-id.validator');
const fazendaGetByName = require('./fazenda/fazenda_get-by-name.validator');
const fazendaGetByDistanciaEmKmBetween = require('./fazenda/fazenda_get-by-distancia-em-km-between.validator');
const fazendaGetByFazendeiro = require('./fazenda/fazenda_get-by-fazendeiro.validator');
const fazendaGetByFazendeiroAndDistanciaEmKmBetween = require('./fazenda/fazenda_get-by-fazendeiro-and-distancia-em-km-between.validator');
const producaoPost = require('./producao/producao_post.validator');
const producaoPatchParams = require('./producao/producao_patch_params.validator');
const producaoPatchBody = require('./producao/producao_patch_body.validator');
const producaoDelete = require('./producao/producao_delete.validator');
const producaoGetById = require('./producao/producao_get-by-id.validator');
const producaoGetByDataProducaoBetween = require('./producao/producao_get-by-data-producao-between.validator');
const producaoGetByFazendaAndDataProducaoBetween = require('./producao/producao_get-by-fazenda-and-data-producao-between.validator');
const producaoGetByFazendaAndAnoAndMes = require('./producao/producao_get-by-fazenda-and-ano-and-mes.validator');
const producaoGetByFazendaAndAno = require('./producao/producao_get-by-fazenda-and-ano.validator');
const producaoGetByFazendeiroAndDataProducaoBetween = require('./producao/producao_get-by-fazendeiro-and-data-producao-between.validator');
const producaoGetByFazendeiroAndAnoAndMes = require('./producao/producao_get-by-fazendeiro-and-ano-and-mes.validator');
const producaoGetByFazendeiroAndAno = require('./producao/producao_get-by-fazendeiro-and-ano.validator');
const tabelaPrecoPost = require('./tabela_preco/tabela-preco_post.validator');
const tabelaPrecoPatchParams = require('./tabela_preco/tabela-preco_patch_params.validator');
const tabelaPrecoPatchBody = require('./tabela_preco/tabela-preco_patch_body.validator');
const tabelaPrecoDelete = require('./tabela_preco/tabela-preco_delete.validator');
const tabelaPrecoGetById = require('./tabela_preco/tabela-preco_get-by-id.validator');
const tabelaPrecoGetByAnoAndSemestre = require('./tabela_preco/tabela-preco_get-by-ano-and-semestre.validator');
const tabelaPrecoGetByAno = require('./tabela_preco/tabela-preco_get-by-ano.validator');

module.exports = {
    fazendeiroPost,
    fazendeiroPatchParams,
    fazendeiroPatchBody,
    fazendeiroDelete,
    fazendeiroGetById,
    fazendeiroGetByName,
    fazendeiroGetByEmail,
    fazendaPost,
    fazendaPatchParams,
    fazendaPatchBody,
    fazendaDelete,
    fazendaGetById,
    fazendaGetByName,
    fazendaGetByDistanciaEmKmBetween,
    fazendaGetByFazendeiro,
    fazendaGetByFazendeiroAndDistanciaEmKmBetween,
    producaoPost,
    producaoPatchParams,
    producaoPatchBody,
    producaoDelete,
    producaoGetById,
    producaoGetByDataProducaoBetween,
    producaoGetByFazendaAndDataProducaoBetween,
    producaoGetByFazendaAndAnoAndMes,
    producaoGetByFazendaAndAno,
    producaoGetByFazendeiroAndDataProducaoBetween,
    producaoGetByFazendeiroAndAnoAndMes,
    producaoGetByFazendeiroAndAno,
    tabelaPrecoPost,
    tabelaPrecoPatchParams,
    tabelaPrecoPatchBody,
    tabelaPrecoDelete,
    tabelaPrecoGetById,
    tabelaPrecoGetByAnoAndSemestre,
    tabelaPrecoGetByAno,
}