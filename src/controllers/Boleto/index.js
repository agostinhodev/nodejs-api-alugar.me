const Boleto = require('../../models/Boleto');

exports.compensar = async(req, res)=>{

    if(req.body.id === undefined || req.body.id.length == 0){

        res.status(400).send({

            message: "Informe o id da transação corretamente"

        });

    } else {

        if(req.body.event === undefined || req.body.event.length == 0){

            res.status(400).send({
    
                message: "Informe o evento da transação corretamente"
    
            });
    
        } else {
    
            if(req.body.event !== "transaction_status_changed"){

                res.status(400).send({
    
                    message: "Este endpoint espera somente events do tipo transaction_status_changed"
        
                });

            } else {

                if(req.body.current_status === undefined || req.body.current_status.length == 0){

                    res.status(400).send({
            
                        message: "Informe o status atual da transação"
            
                    });
            
                } else {

                    if(req.body.current_status !== "paid"){

                        res.status(400).send({
                
                            message: "A este endpoint interessa somente conhecer o status da transação se o mesmo for paid"
                
                        });
                
                    } else {
                        
                        let id_transacao = parseInt(req.body.id);

                        Boleto.compensar(id_transacao, (err, data)=>{

                            if(err){

                                res.status(err.status).send({

                                    message: err.message

                                });

                            } else {

                                res.status(data.status).send({

                                    message: data.message

                                });

                            }
                
                        });
    
                    }

                }

            }
    
        }

    }

}