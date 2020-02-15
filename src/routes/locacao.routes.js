module.exports = app =>{

    const locacao = require('../controllers/Locacao');      
    app.post('/locacao',  locacao.novo);
    app.put('/locacao/aprovar',  locacao.aprovar);
    app.put('/locacao/reprovar',  locacao.reprovar);
    app.get('/locacao', locacao.pendentes);

    //Lista as locações na visão do locador
    app.get('/locacao/locador/:locador', locacao.getPorLocador);
    app.get('/locacao/locatario/:locatario', locacao.getPorLocatario);

};