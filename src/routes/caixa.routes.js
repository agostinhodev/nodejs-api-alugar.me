module.exports = app =>{

    const caixa = require('../controllers/Caixa');   
    app.get('/caixa/saldo/:pessoa', caixa.saldo);

};