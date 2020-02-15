const Pessoa = require('../../models/Pessoa');
const encryptPassword = require('../../config/encryptPassword');

exports.signup = async (req, res)=>{

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
