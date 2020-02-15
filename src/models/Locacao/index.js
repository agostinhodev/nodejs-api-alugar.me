const sql = require('../DB');
const convertData = require('../../config/convertData');

const Locacao = function(){};

Locacao.novo = async (req, result)=>{

    sql.query(
        
        //Atualiza o status indicando que o imóvel está em processo de locação
        "UPDATE imovel SET status = 1 WHERE status = 0 AND id = ? LIMIT 1",
        [
            req.imovel,   
        ],

        (err, res) =>{
            
            if(err){

                result(err, null);
                return;

            }

            if(res.affectedRows == 1){
                
                //Se conseguir atualizar o status, atualiza o valor do aluguel

                req.inicio  = convertData(req.inicio);
                req.termino = convertData(req.termino);

                sql.query(
                    `INSERT INTO
                    locacao
                    (imovel, locatario, valor, dia_vencimento, status, inicio, termino) VALUES
                    (?, ?, ?, ?, ?, ?, ? )`,
                    [

                        req.imovel,
                        req.locatario,
                        req.valor, 
                        String(req.dia_vencimento),
                        0,
                        req.inicio,
                        req.termino
                        
                    ],

                    (err, res)=>{

                        if(err){

                            result(err, null);
                            return;
            
                        }

                        if(res.affectedRows == 1){

                            result(null, res);
                            return;

                        }

                        result({kind: 'not_found'}, null);
                       

                    }
                    
                )

                return;

            }
            
            result({kind: 'not_found'}, null);

        }

    )

}

Locacao.aprovar = async (req, result)=>{

    sql.query(

        "UPDATE locacao SET status = 1 WHERE status = 0 AND id = ? LIMIT 1",
        [

            req.locacao

        ],
        (err, res)=>{

            if(err){

                result(err, null);
                return;

            }
            
            if(res.affectedRows == 1){

                /*Se for aprovada a solicitação, é necessário calcular por quanto tempo 
                o locatário deseja permanecer no local (em meses) e criar parcelas*/

                sql.query(

                    `SELECT 
                    L.valor, 
                    L.inicio, 
                    L.termino,
                    L.dia_vencimento,
                    P.nome,
                    P.documento

                    FROM locacao L
                    
                    LEFT JOIN pessoa P ON
                    L.locatario = P.id
                    
                    WHERE 
                    L.id = ? AND
                    L.status = 1
                    
                    LIMIT 1`,
                    [

                        req.locacao

                    ],

                    async (err,res)=>{
                        
                        if(err){

                            result(err, null);
                            return;
            
                        }

                        if(res.length){
                            
                            const calculaParcelasMensalidade = require('../../config/calculaParcelasMensalidade');
                            const novaTransacao = require('../../services/pagarme/novaTransacao');
                            const realParaCentavos = require('../../config/realParaCentavos');
                            
                            let datas = calculaParcelasMensalidade(

                                res[0].dia_vencimento, 
                                res[0].inicio, 
                                res[0].termino

                            );
                                
                            let valor = res[0].valor;
                            //A Api do pagarme só aceita valores em centavos, então, vamos calculá-lo assim                            
                            let valorCents = realParaCentavos(valor);

                            for(let i = 0; i < datas.length; i++){
                                
                                let transacao = await novaTransacao(

                                    valorCents,
                                    datas[i],
                                    res[0].nome,
                                    res[0].documento

                                );

                                if(transacao){

                                    datas[i] = new Date(datas[i]);
                                    mes_referencia = parseInt(datas[i].getMonth() + 1);
                                    ano_referencia = parseInt(datas[i].getFullYear());

                                    /*Após criar o boleto na api da pagarme,
                                    cria a referencia das mensalidades no sistema local                                    
                                    */
                                    sql.query(
                                        `INSERT INTO 
                                        mensalidade 
                                        (locacao, status, valor, mes_referencia, ano_referencia) VALUES
                                        (?, ?, ?, ?, ?)`,
                                        [

                                            req.locacao,
                                            0,
                                            res[0].valor,
                                            mes_referencia,
                                            ano_referencia

                                        ],
                                        (err, res)=>{

                                            if(res.affectedRows == 1){

                                                /*Após criar as mensalidades, é necessário definir os boletos
                                                relacionados à esta determinada mensalidade, fazendo referência com 
                                                a api da pagarme*/
                                                sql.query(

                                                    `INSERT INTO 
                                                    boleto 
                                                    (mensalidade, id_transacao, valor) VALUES
                                                    (?,?,?)`,
                                                    [

                                                        res.insertId,
                                                        transacao.id,
                                                        valor                                                                                                                

                                                    ],
                                                    ()=>{



                                                    }

                                                )

                                            }
                                           
                                        }

                                    );

                                }

                            }

                            result(null, res);
                            return;

                        }

                        result({kind: 'not_found'}, null);
                        return;                       

                    }

                )
                          
                return;             

            }

            result({kind: 'not_found'}, null);     
            return;     

        }

    )

}

Locacao.pendentes = async(pessoa, result)=>{

    sql.query(

        `SELECT 
        L.id,
        P.nome as solicitante,
        I.descricao, 
        L.valor as valorProposto,
        I.valor as valorSolicitado,
        L.inicio as dataInicioPrevista,
        L.termino as dataTerminoPrevista
        
        FROM locacao L
        
        LEFT JOIN imovel I ON
        L.imovel = I.id
        
        LEFT JOIN pessoa P ON
        L.locatario = P.id
        
        WHERE 
        L.status = 0 AND
        I.locador = ?
        
        ORDER BY L.id ASC`,

        [pessoa],

        (err, res)=>{

            if(err){

                result(err, null);
                return;

            }

            if(res.length){

                result(null, res);
                return; 

            }

            result({kind: 'not_found'}, null);
            return;

        }

    )

}

Locacao.reprovar = (locacao, result) =>{

    sql.query(

        `SELECT imovel FROM locacao WHERE status = 0 AND id = ? LIMIT 1`,
        [locacao],
        (err, res)=>{

            if(err){

                result({status: 500, message: `Houve uma falha ao tentar localizar a locação`},null);

            } else if(res.length){

                let imovel = res[0].imovel;

                sql.query(

                    `UPDATE locacao SET status = 2 WHERE status = 0 AND id = ? LIMIT 1`,
                    [locacao],
                    (err, res)=>{

                        if(err){

                            result({status: 500, message: `Houve uma falha ao tentar atualizar a locação`},null);


                        } else if(res.affectedRows == 1){

                            sql.query(

                                `UPDATE imovel SET status = 0 WHERE status = 1 AND id = ? LIMIT 1`,
                                [imovel],
                                (err, res)=>{

                                    if(err){

                                        result({status: 500, message: `Houve uma falha ao tentar atualizar o imóvel`},null);
            
            
                                    } else if(res.affectedRows == 1){

                                        result(null, res);

                                    } else {

                                        result({status: 500, message: `Ocorreu um erro desconhecido ao tentar atualizar o imóvel`}, null);

                                    }

                                }
                            )

                        } else {

                            result({status: 500, message: `Ocorreu um erro desconhecido ao tentar atualizar a locação`}, null);

                        }

                    }

                )

            } else {

                result({status: 500, message: `Ocorreu um erro desconhecido ao tentar localizar a locação`}, null);

            }

        }

    )

}

Locacao.getPorLocador = (locador, result)=>{

    sql.query(

        `SELECT id, status, descricao, latitude, longitude, valor FROM imovel WHERE locador = ? ORDER BY descricao`,
        [locador],
        (err, res)=>{

            if(err){

                result({

                    status: 500,
                    message: "Houve um erro ao tentar localizar as locações"

                }, null);

            } else if(res.length){

                result(null, res);

            } else {

                result({

                    status: 404,
                    message: "Nenhuma locação encontrada"

                }, null);

            }

        }

    )

}

Locacao.getPorLocatario = (locatario, result)=>{

    sql.query(

        `SELECT 
        L.id,
        L.status,
        L.valor,
        L.dia_vencimento,
        L.inicio as dataPrevistaInicio,
        L.termino as dataPrevistaTermino,
        I.descricao as imovel,
        I.latitude,
        I.longitude

        FROM locacao L

        LEFT JOIN imovel I ON
        L.imovel = I.id

        WHERE L.locatario = ?

        ORDER BY L.status ASC`,
        [locatario],
        (err, res)=>{

            if(err){

                result({

                    status: 500,
                    message: "Houve um erro ao tentar localizar as locações"

                }, null);

            } else if(res.length){

                result(null, res);

            } else {

                result({

                    status: 404,
                    message: "Nenhuma locação encontrada"

                }, null);

            }

        }

    )

}

module.exports = Locacao;
