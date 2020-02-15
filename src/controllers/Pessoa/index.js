const Pessoa = require('../../models/Pessoa');
const encryptPassword = require('../../config/encryptPassword');

exports.signup = async (req, res)=>{

    if(req.body.tipo === undefined || req.body.tipo.length != 1 || (req.body.tipo != 'f' && req.body.tipo != 'j') ){

        res.status(400).send({
    
            message: "Informe o tipo corretamente"
    
        });
    
        return;
    
    }
    
    if(req.body.nome === undefined || req.body.nome.length == 0){
    
        res.status(400).send({
    
            message: "Informe o nome corretamente"
    
        });
    
        return;
    }
    
    if(req.body.documento === undefined || (req.body.documento.length != 11 && req.body.documento.length != 14)){
    
        res.status(400).send({
    
            message: "Informe o documento corretamente"
    
        });
    
        return;
    
    } else {
    
        req.body.document_number = req.body.documento;
    
    }
    
    if(req.body.email === undefined || req.body.email.length == 0){
    
        res.status(400).send({
    
            message: "Informe o email corretamente"
    
        });
    
        return;
    
    }
    
    if(req.body.senha === undefined || req.body.senha.length == 0){
    
        res.status(400).send({
    
            message: "Informe a senha corretamente"
    
        });
    
        return;
    
    }
    
    if(req.body.bank_code === undefined || req.body.bank_code.length == 0){
    
        res.status(400).send({
    
            message: "Informe o código do banco corretamente"
    
        });
    
        return;
    
    }
    
    if(req.body.agencia === undefined || req.body.agencia.length == 0){
    
        res.status(400).send({
    
            message: "Informe a agencia corretamente"
    
        });
    
        return;
    
    }
    
    if(req.body.agencia_dv === undefined || req.body.agencia_dv.length == 0){
    
        res.status(400).send({
    
            message: "Informe dígito verificador da agência corretamente"
    
        });
    
        return;
    
    }
    
    if(req.body.conta === undefined || req.body.conta.length == 0){
    
        res.status(400).send({
    
            message: "Informe a conta corretamente"
    
        });
    
        return;
    
    }
    
    if(req.body.type === undefined || req.body.type.length == 0){
    
        res.status(400).send({
    
            message: "Informe o tipo de conta corretamente"
    
        });
    
        return;
    
    }
    
    if(req.body.conta_dv === undefined || req.body.conta_dv.length == 0){
    
        res.status(400).send({
    
            message: "Informe o dígito verificador da conta corretamente"
    
        });
    
        return;
    
    }
    
    if(req.body.legal_name === undefined || req.body.legal_name.length == 0){
    
        res.status(400).send({
    
            message: "Informe o nome do titular corretamente (Como está no cartão. Ex.: MARIA B N SILVA)"
    
        });
    
        return;
    
    }

    req.body.senha = await encryptPassword(req.body.senha);

    Pessoa.signup(req.body, (err, data)=>{

        if(err){

            if(err.kind === "not_found"){

                res.status(404).send(

                    {message: "Usuário não existe"}

                );

            } else {

                res.status(500).send({                    
                    message: "Erro ao cadastrar o usuário"
                });

            }

        } else {

            res.status(200).send({

                message: "Operação executada com sucesso"

            });

        }

    });
    
};

exports.sign = async (req, res)=>{

    if(req.body.email == undefined || req.body.email.length == 0){

        res.status(400).send({
    
            message: "Informe o email corretamente"
    
        });

        return;
    }

    if(req.body.senha == undefined || req.body.senha.length == 0){

        res.status(400).send({
    
            message: "Informe a senha corretamente"
    
        });

        return;
    }

    let senha = await encryptPassword(req.body.senha);

    Pessoa.sign(senha, req.body.email, (err, data)=>{

        if(err){

            if(err.kind === "not_found"){

                res.status(404).send(

                    {message: "Usuário não existe"}

                );

            } else {

                res.status(500).send({                    
                    message: "Erro ao fazer o login"
                });

            }

        } else {

            res.send(data);

        }

    });
    
};
