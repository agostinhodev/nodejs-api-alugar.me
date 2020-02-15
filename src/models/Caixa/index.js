const sql = require('../DB');

const Caixa = function(){};

Caixa.novo = async (pessoa, saldo)=>{
    
    sql.query(

        "INSERT INTO caixa (pessoa, saldo) VALUES (?,?)",

        [

           pessoa,
           saldo

        ],      

        (err, res) =>{

            if(err){

                return false;

            }

            if(res.affectedRows == 1){
                                
                return true;

            }

        }

    );

};

Caixa.getSaldo = async (pessoa, result)=>{
    
    sql.query(

        "SELECT saldo FROM caixa WHERE pessoa = ? LIMIT 1",

        [

           pessoa

        ],      

        (err, res) =>{

            if(err){

                result(err, null);

            }else if(res.length){
                                
                result(null, res);

            } else {

                result({kind: 'not_found'}, null);

            }
            return;

        }

    );

};

module.exports = Caixa;