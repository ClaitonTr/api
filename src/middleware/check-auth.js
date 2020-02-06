const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const deco = jwt.verify(token, 'Cl4170n');
        req.usuario = deco; //pode ser usado nas rotas para mostrar id_usuario e email
        next();
    } catch (error) {
        res.status(401).send({ menssagem: 'Necessaário autenticação para prosseguir' });
    }
}