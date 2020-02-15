const Locacao = require('../../models/Locacao');

exports.novo = async (req, res)=>{

    if(req.body.imovel === undefined || req.body.imovel.length == 0){

        res.status(400).send(

            {message: "Informe o id do imóvel corretamente"}

        );

        return;

    }

    if(req.body.locatario === undefined || req.body.locatario.length == 0){

        res.status(400).send(

            {message: "Informe o id do locatário corretamente"}

        );

        return;

    }

    if(req.body.inicio === undefined || req.body.inicio.length == 0){

        res.status(400).send(

            {message: "Informe a data de início do período de aluguel corretamente"}

        );

        return;

    }

    if(req.body.termino === undefined || req.body.termino.length == 0){

        res.status(400).send(

            {message: "Informe a data de término do período de aluguel corretamente"}

        );

        return;

    }

    if(req.body.valor === undefined || req.body.valor.length == 0){

        res.status(400).send(

            {message: "Informe o valor que você deseja pagar corretamente"}

        );

        return;

    }

    if(req.body.dia_vencimento === undefined || req.body.dia_vencimento.length == 0){

        res.status(400).send(

            {message: "Informe o dia do vencimento corretamente"}

        );

        return;

    }
    
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

    if(req.query.pessoa === undefined || req.query.pessoa.length == 0){

        res.status(400).send({

            message: "Informe o id do locador (pessoa) corretamente"

        })
        return;
    }
    
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