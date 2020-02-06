const express = require('express');
const router = express.Router();

const controller = require('../controllers/produtoController');
const auth = require('../middleware/check-auth');

router.get('/', auth, controller.todosProdutos);
router.post('/', auth, controller.insereProduto);
router.get('/:cod', auth, controller.produtoUnico);
router.patch('/', auth, controller.alteraProduto);
router.delete('/', auth, controller.excluiProduto);

router.put('/', (req, res, next) => {
    res.status(201).json({
        menssagem: 'produto alterado'
    });
});

module.exports = router;