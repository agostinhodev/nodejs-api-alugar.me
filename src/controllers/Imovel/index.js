const Imovel = require('../../models/Imovel');
const isValidCoordinates = require('is-valid-coordinates')

exports.novo = async (req, res)=>{

    try{

        if(req.body.longitude === undefined || req.body.longitude === 0){

            res.status(400).send({

                message: "Informe a longitude"

            })
            return;
        }

        if(req.body.latitude === undefined || req.body.latitude === 0){

            res.status(400).send({

                message: "Informe a longitude"

            })
            return;
        }

        req.body.longitude = parseFloat(req.body.longitude);
        req.body.latitude  = parseFloat(req.body.latitude);

        if(req.body.descricao === undefined || req.body.descricao.length == 0){
            
            res.status(400).send({

                message: "Informe a descrição"

            });

            return;

        }

        if(req.body.valor === undefined || req.body.valor == 0){
            
            res.status(400).send({

                message: "Informe o valor"

            });

            return;

        }

        if(req.body.locador === undefined || req.body.locador == 0){
            
            res.status(400).send({

                message: "Informe o locador"

            });

            return;

        }
        
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

    }catch(e){

        res.status(500).send({

            message: e.message

        })

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
