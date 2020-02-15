const Imovel = require('../../models/Imovel');
const isValidCoordinates = require('is-valid-coordinates')

exports.novo = async (req, res)=>{

    req.body.longitude = parseFloat(req.body.longitude);
    req.body.latitude  = parseFloat(req.body.latitude);
    
    if(!isValidCoordinates(req.body.longitude, req.body.latitude)){
       
        res.status(400).send({
            
            message: "Coordenadas inválidas"

        });

    } else {

        Imovel.novo(req.body, (err, data)=>{

            if(err){

                if(err.kind === "not_found"){

                    res.status(404).send(

                        {message: "Imóvel não existe"}

                    );

                } else {

                    res.status(500).send({                    
                        message: "Erro ao cadastrar imóvel"
                    });

                }

            } else {

                res.status(200).send({

                    message: "Operação executada com sucesso"

                });

            }

        });

    }

}

exports.listar = async (req, res)=>{

    req.query.longitude = parseFloat(req.query.longitude);
    req.query.latitude  = parseFloat(req.query.latitude);
    req.query.raio      = parseInt(req.query.raio);

    if(!isValidCoordinates(req.query.longitude, req.query.latitude)){
       
        res.status(400).send({
            
            message: "Coordenadas inválidas"

        });

    } else {

        Imovel.listar(req.query, (err, data)=>{

            if(err){

                if(err.kind === "not_found"){

                    res.status(404).send(

                        {message: "Não existem imóveis próximos a você"}

                    );

                } else {

                    res.status(500).send({                    
                        message: "Erro ao localizar imóveis"
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
