const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './fotos_produtos/');
    },
    filename: (req, file, callback) => {
        crypto.randomBytes(16, (err, hash) => {
            if(err) callback(err);
            const tipo = file.mimetype.split('/');
            const nomeFoto = `${req.usuario.nome.toLowerCase()}_${hash.toString('hex')}_${new Date().getTime()}.${tipo[1]}`;
            callback(null, nomeFoto);
        });
    }
});
const fileFilter = (req, file, cb) => {
    const permitidos = [
        'image/jpeg',
        'image/png'
    ];
    if(permitidos.includes(file.mimetype)) {
        cb(null, true);
    }else {
        cb(new Error('Formato de imagem inválido'));
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
});

const controller = require('../controllers/produtoController');
const auth = require('../middleware/check-auth');

router.get('/', auth, controller.todosProdutos);
router.post('/', auth, upload.single('imagem'), controller.insereProduto);
router.get('/:cod', auth, controller.produtoUnico);
router.patch('/', auth, upload.single('imagem'), controller.alteraProduto);
router.delete('/', auth, controller.excluiProduto);

router.put('/', (req, res, next) => {
    res.status(201).json({
        menssagem: 'produto alterado'
    });
});

module.exports = router;