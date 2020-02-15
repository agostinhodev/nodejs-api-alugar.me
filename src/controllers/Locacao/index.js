const Locacao = require('../../models/Locacao');

exports.novo = async (req, res)=>{
    
    Locacao.novo(req.body, (err, data)=>{

        if(err){

            if(err.kind === "not_found"){

                res.status(404).send(

                    {message: "Não foi possível solicitar o aluguel do imóvel informado"}

                );

            } else {

                res.status(500).send({                    
                    message: "Erro ao tentar alugar imóveis"
                });

            }

        } else {

            res.status(200).send({message: "Operação executada com sucesso"});

        }

    });
    
}

exports.aprovar = async (req, res)=>{
    
    Locacao.aprovar(req.body, (err, data)=>{

        if(err){

            if(err.kind === "not_found"){

                res.status(404).send(

                    {message: "Não foi possível localizar solicitação para aprovar"}

                );

            } else {

                res.status(500).send({                    
                    message: "Erro ao tentar aprovar a solicitações"
                });

            }

        } else {

            res.status(200).send({message: "Operação executada com sucesso"});

        }

    });
    
}

exports.pendentes = async (req, res)=>{
    
    Locacao.pendentes(req.query.pessoa, (err, data)=>{

        if(err){

            if(err.kind === "not_found"){

                res.status(404).send(

                    {message: "Nenhuma solicitação de locação pendente"}

                );

            } else {

                res.status(500).send({                    
                    message: "Erro ao tentar buscar as solicitações pendentes"
                });

            }

        } else {

            res.status(200).send(data);

        }

    });
    
}

exports.reprovar = async (req, res)=>{
    
    Locacao.reprovar(req.body.locacao, (err, data)=>{

        if(err){

            res.status(err.status).send({message: err.message});

        } else {

            res.status(200).send({message: "Operação executada com sucesso"});

        }

    });
    
}

exports.getPorLocador = async (req, res)=>{
    
    Locacao.getPorLocador(req.params.locador, (err, data)=>{

        if(err){

            res.status(err.status).send({message: err.message});

        } else {

            res.status(200).send(data);

        }

    });
    
}

exports.getPorLocatario = async (req, res)=>{
    
    Locacao.getPorLocatario(req.params.locatario, (err, data)=>{

        if(err){

            res.status(err.status).send({message: err.message});

        } else {

            res.status(200).send(data);

        }

    });
    
}