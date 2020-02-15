module.exports = app =>{

    const imovel = require('../controllers/Imovel');      
    app.post('/imovel',  imovel.novo);
    app.get('/imovel',  imovel.listar);

};