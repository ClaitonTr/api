const express = require('express');
const router = express.Router();

const controller = require('../controllers/usuarioController');

router.post('/cadastro', controller.cadastro);
router.post('/login', controller.login);
router.post('/refresh-token', controller.token);

module.exports = router;