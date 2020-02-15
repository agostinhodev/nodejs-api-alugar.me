const sql = require('../DB');

const Pessoa = function(){};

Pessoa.signup = async (req, result)=>{
    
    sql.query(

        "INSERT INTO pessoa (tipo, nome, documento, email, senha) VALUES (?, ?, ?, ?, ?) ",

        [

            req.tipo,
            req.nome,
            req.documento,
            req.email,
            req.senha

        ],      

        async (err, res) =>{

            if(err){

                result(err, null);
                return;

            }

            if(res.affectedRows == 1){

                const novoRecebedor = require('../../services/pagarme/novoRecebedor');

                const recebedor = await novoRecebedor(

                    req.bank_code,
                    req.agencia,
                    req.agencia_dv,
                    req.conta,
                    req.type,
                    req.conta_dv,
                    req.document_number,
                    req.legal_name
                
                );
                                                                
                if(recebedor && recebedor.id){
                    
                    const InfoBancario = require('../InfoBancario');

                    InfoBancario.new(

                        res.insertId, 
                        req.bank_code, 
                        req.agencia, 
                        req.agencia_dv, 
                        req.conta, 
                        req.type, 
                        req.conta_dv, 
                        req.document_number, 
                        recebedor.id,  

                    );

                    const Caixa = require("../Caixa");

                    Caixa.novo(res.insertId, 0);

                }
                
                result(null, res);
                return;

            }

            result({kind: 'not_found'}, null);

        }

    );

};

Pessoa.sign = async (senha, email, result)=>{
    
    sql.query(

        `SELECT 
        
        id, nome 
        
        FROM pessoa 
        
        WHERE 
        
        email = ? AND 
        senha = ? 
        
        AND status = 1 LIMIT 1`,

        [

            email,
            senha

        ],      

        (err, res) =>{

            if(err){

                result(err, null);
                return;

            }

            if(res.length){
                                
                result(null, res);
                return;

            }

            result({kind: 'not_found'}, null);

        }

    );

};


module.exports = Pessoa;