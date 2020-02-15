const sql = require('../DB');

const Banco = function(){};

Banco.listar = (result)=>{

    sql.query(

        `SELECT cod, banco FROM bancos ORDER BY banco ASC`,
        (err, res)=>{

            if(err){

                console.log(err);
                result(err, null);

            } else if(res.length){

                result(null, res);

            } else {

                result({kind:"not_found"}, null);

            }

            return;

        }

    )

}

module.exports = Banco;