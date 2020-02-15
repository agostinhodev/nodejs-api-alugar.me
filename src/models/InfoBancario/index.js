const sql = require('../DB');

const InfoBancario = function(){};

InfoBancario.new = (

    pessoa_id, 
    bank_code, 
    agencia, 
    agencia_dv, 
    conta, 
    type, 
    conta_dv, 
    document_number, 
    id_recebedor,    

)=>{


    sql.query(

        "INSERT INTO info_bancario (pessoa_id, bank_code, agencia, agencia_dv, conta, type, conta_dv, document_number, id_recebedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",

        [
            pessoa_id, 
            bank_code, 
            agencia, 
            agencia_dv, 
            conta, 
            type, 
            conta_dv, 
            document_number, 
            id_recebedor

        ],

        (err, res)=>{

            if(err){

                return false;

            } else {
                
                return true;

            }

        }
        

    )

}

module.exports = InfoBancario;