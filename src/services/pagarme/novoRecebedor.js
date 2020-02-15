const pagarme       = require('pagarme');
const pagarmeConfig = require('../../config/pagarMeConfig');

module.exports = async function novoRecebedor(

    bank_code,
    agencia,
    agencia_dv,
    conta,
    type,
    conta_dv,
    document_number,
    legal_name

){

    
    const response = await pagarme.client.connect({ api_key: pagarmeConfig.api_key })
    .then(client => client.recipients.create({

        automatic_anticipation_enabled: true, 
        bank_account: {
            
            bank_code,
            agencia,
            agencia_dv,
            conta,
            type,
            conta_dv,
            document_number,
            legal_name
        }, 
        transfer_day: 10, 
        transfer_enabled: false, 
        transfer_interval: "monthly",
        postback_url: null

    }))
    .then((recipient) => {

        return recipient;
    
    })
    .catch((err)=>{
      
        return false;

    });

    return response;

}