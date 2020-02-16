const pagarme       = require('pagarme');
const pagarmeConfig = require('../../config/pagarMeConfig');

module.exports = async function novaTransacao(

    amount,
    boleto_expiration_date,
    name,
    number

){
    
    const response = await pagarme.client.connect({ api_key: pagarmeConfig.api_key })
  
    .then(client => client.transactions.create({
        
        amount,
        "payment_method": "boleto",
        boleto_expiration_date,
        postback_url: "http://alugar.me:3131/boleto/compensar",
        "customer":{
            
            "type": "individual",
            "country": "br",
            name,
            "documents": [{
                
                "type": "cpf",
                number
            }]

        }
    }))
    .then((transaction) => {

        return transaction;
    
    })
    .catch((err)=>{
      
        return false;

    });
  
    return response;

}