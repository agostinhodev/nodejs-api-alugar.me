module.exports = app =>{

    const boleto = require('../controllers/Boleto');   
    app.post('/boleto/compensar', boleto.compensar);

};
