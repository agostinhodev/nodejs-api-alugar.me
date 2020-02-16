const sql = require('../DB');

const Boleto = function(){};

Boleto.compensar = (id_transacao, result)=>{

    sql.query(

        `SELECT 
        P.id as pessoa,
        B.mensalidade,
        B.valor 
        
        FROM boleto B
        
        LEFT JOIN mensalidade M ON
        B.mensalidade = M.id
        
        LEFT JOIN locacao L ON
        M.locacao = L.id
        
        LEFT JOIN imovel I ON
        L.imovel = I.id
        
        LEFT JOIN pessoa P ON
        I.locador = P.id
        
        WHERE 
        
        B.id_transacao = ? AND
        M.status = 0
        
        LIMIT 1`,
        [
            id_transacao
        ],
        (err, res)=>{

            if(err){

                result({status: 500,message: "Ocorreu um erro ao buscar informações da mensalidade" }, null);

            } else if(res.length){

                let pessoa      = res[0].pessoa;
                let mensalidade = res[0].mensalidade;
                let valor       = res[0].valor;

                let data_pagamento = new Date();
                data_pagamento     = `${data_pagamento.getFullYear()}-${(data_pagamento.getMonth() + 1)}-${data_pagamento.getDate()} ${data_pagamento.getHours()}:${data_pagamento.getMinutes()}:${data_pagamento.getMinutes()}`;
                
                //Atualiza o boleto
                sql.query(

                    `UPDATE 
                    boleto 
                    
                    SET data_pagamento = ?
                    
                    WHERE id_transacao = ? 
                    
                    LIMIT 1`,
                    [

                        data_pagamento,
                        id_transacao

                    ],

                    (err, res)=>{

                        if(err){

                            result({status: 500,message: "Ocorreu um erro ao tentar atualizar a data de pagamento do boleto" }, null);

                        } else if(res.affectedRows == 1){
                            
                            //Se atualizou a data do boleto com sucesso, é hora de atualizar o status da mensalidade para PAGO

                            sql.query(

                                `UPDATE 

                                mensalidade
                                
                                SET 
                                
                                status = 1
                                
                                WHERE status = 0 AND
                                id = ? LIMIT 1`,
                                [
                                    mensalidade

                                ],
                                (err, res)=>{

                                    if(err){

                                        result({status: 500,message: "Ocorreu um erro ao tentar atualizar o status da mensalidade" }, null);

                                    } else if(res.affectedRows == 1){
                                        
                                        /*Se conseguiu atualizar o status da mensalidade para pago, é hora de adicionar o valor ao 
                                        saldo do locador*/

                                        //Captura o saldo atual

                                        sql.query(

                                            `SELECT saldo FROM caixa WHERE pessoa = ? LIMIT 1`,
                                            
                                            [ pessoa ],

                                            (err, res)=>{

                                                if(err){

                                                    result({status: 500,message: "Ocorreu um erro ao tentar recuperar o saldo do locador" }, null);

                                                } else if(res.length){

                                                    let saldo = res[0].saldo;

                                                    saldo += valor;

                                                    //Atualiza o saldo

                                                    sql.query(

                                                        `UPDATE caixa SET saldo = ? WHERE pessoa = ? LIMIT 1`,
                                                        [ saldo, pessoa ],

                                                        (err, res)=>{

                                                            if(err){

                                                                result({status: 500,message: "Ocorreu um erro ao tentar atuaalizar o saldo do locador" }, null);

                                                            } else if(res.affectedRows == 1){

                                                                result(null, {status: 200, message: "Operação executada com sucesso"});

                                                            } else {

                                                                result({status: 500,message: "Ocorreu um erro desconhecido ao tentar atualizar o saldo do locador" }, null);

                                                            }

                                                        }

                                                    )

                                                } else {

                                                    result({status: 500,message: "Ocorreu um erro desconhecido ao tentar recuperar o saldo do locador" }, null);

                                                }

                                            }

                                        )

                                    } else {

                                        result({status: 500,message: "Ocorreu um erro desconhecido ao tentar atualizar a data de pagamento do boleto" }, null);

                                    }

                                }

                            )

                        } else {

                            result({status: 500,message: "Um erro desconhecido aconteceu ao tentar atualizar a data do boleto" }, null);

                        }

                    }

                )

            } else {

                result({status: 404, message: "Nenhuma transação encontrada com este id" }, null);

            }

        }

    )

}

module.exports = Boleto;