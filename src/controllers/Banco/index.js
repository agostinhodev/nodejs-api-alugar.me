const Banco = require('../../models/Banco');

exports.listar = (req, res)=>{

    Banco.listar((err, data)=>{

        if(err){

            if(err.kind === "not_found"){

                res.status(404).send(

                    {message: "Nenhum banco encontrado"}

                );

            } else {

                res.status(500).send({                    
                    message: "Erro ao localizar bancos"
                });

            }

        } else {

            res.status(200).send(data);

        }

    });

}