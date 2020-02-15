module.exports = app =>{

    const pessoa = require('../controllers/Pessoa');      
    app.post('/pessoa/signup',  pessoa.signup);
    app.post('/pessoa/sign',  pessoa.sign);

};