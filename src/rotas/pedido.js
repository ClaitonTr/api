const express = require('express');
const router = express.Router();

const controller = require('../controllers/pedidoController');
const auth = require('../middleware/check-auth');

router.get('/', controller.todosPedidos);
router.post('/', auth, controller.novoPedido);
router.get('/:cod', controller.unicoPedido);
router.patch('/', auth, controller.alteraPedido);
router.delete('/', auth, controller.excluiPedido);

router.put('/', (req, res, next) => {
    res.status(201).json({
        menssagem: 'produto alterado'
    });
});

module.exports = router;