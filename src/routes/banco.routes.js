module.exports = app =>{

    const banco = require('../controllers/Banco');   
    app.get('/banco', banco.listar);

};
