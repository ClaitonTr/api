const express = require('express');
const router = express.Router();

const controller = require('../controllers/pedidoController');
const auth = require('../middleware/check-auth');

router.get('/', auth, controller.todosPedidos);
router.post('/', auth, controller.novoPedido);
router.get('/:cod', auth, controller.unicoPedido);
router.patch('/', auth, controller.alteraPedido);
router.delete('/', auth, controller.excluiPedido);

router.put('/', (req, res, next) => {
    res.status(201).json({
        menssagem: 'produto alterado'
    });
});

module.exports = router;