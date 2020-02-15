const Caixa = require('../../models/Caixa');

exports.saldo = async (req, res)=>{

    if(req.params.pessoa === undefined || req.params.pessoa == 0){

        res.status(400).send({

            message: "Falta o parâmetro pessoa"

        })

    } else {

        Caixa.getSaldo(req.params.pessoa, (err, data)=>{

            if(err){

                if(err.kind === "not_found"){

                    res.status(404).send(

                        {message: "Nenhuma informação de saldo encontrada"}

                    );

                } else {

                    res.status(500).send({                    
                        message: "Erro ao buscar saldo"
                    });

                }

            } else {

                res.status(200).send(
                    data
                );

            }

        });
    }

}