const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './fotos_produtos/');
    },
    filename: function (req, file, callback) {
        callback(null, new Date().getTime() + '.jpg');
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg') {
        cb(null, true);
    }else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
        fileFilter: fileFilter
    }
});

const controller = require('../controllers/produtoController');
const auth = require('../middleware/check-auth');

router.get('/', auth, controller.todosProdutos);
router.post('/', auth, upload.single('imagem'), controller.insereProduto);
router.get('/:cod', auth, controller.produtoUnico);
router.patch('/', auth, controller.alteraProduto);
router.delete('/', auth, controller.excluiProduto);

router.put('/', (req, res, next) => {
    res.status(201).json({
        menssagem: 'produto alterado'
    });
});

module.exports = router;