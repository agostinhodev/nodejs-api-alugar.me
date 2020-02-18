const sql = require('../DB');

const Imovel = function(){};

Imovel.novo = async (req, result)=>{
    
    sql.query(

        "INSERT INTO imovel (descricao, latitude, longitude, valor, locador) VALUES (?, ?, ?, ?, ?)",

        [

           req.descricao,
           req.latitude,
           req.longitude,
           req.valor,
           req.locador

        ],      

        (err, res) =>{

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

    );

};

Imovel.listar = async (req, result)=>{
    
    sql.query(

        `SELECT
            id, 
            valor,
            descricao,
            latitude,
            longitude,
            (
            6371 * acos (
                cos ( radians(?) )
                * cos( radians( latitude ) )
                * cos( radians( longitude ) - radians(?) )
                + sin ( radians(?) )
                * sin( radians( latitude ) )
            )
            ) AS distancia
        FROM imovel
        WHERE status = 0
        HAVING distancia < ?
        ORDER BY distancia
        LIMIT 0 , 20`,

        [

           req.latitude,
           req.longitude,
           req.latitude,
           req.raio

        ],      

        (err, res) =>{

            if(err){

                result(err, null);

            } else if(res.length){
                
                let imoveis = res;
                
                for(let i = 0; i < imoveis.length; i++){
                    
                    sql.query(

                        `SELECT foto FROM imovel_foto WHERE imovel = ? LIMIT 1`,
                        [ imoveis[i].id ],
                        (err, res)=>{
                            
                            if(!err && res.length && res[0].foto !== undefined && res[0].foto !== null){
                                
                                imoveis[i].foto = res[0].foto;

                            }  else {

                                imoveis[i].foto = null;

                            }
                            
                            if((i) === (imoveis.length - 1)){
                                
                                result(null, imoveis);
                                return;

                            }

                        }

                    )

                }

            } else {

                result({kind: 'not_found'}, null);

            }

        }

    );

};


module.exports = Imovel;
