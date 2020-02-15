module.exports = function calculaParcelasMensalidade(
    
    dia_vencimento, 
    inicio, 
    termino
    
){
    
    inicio = new Date(inicio);
    inicio.setDate(inicio.getDate() + 1);

    termino = new Date(termino);
    termino.setDate(termino.getDate() + 1);
    termino.setMonth(termino.getMonth() + 1);

    let diferencaTempo = parseInt(Math.abs(termino.getTime() - inicio.getTime()));
    let diferencaDias  = parseInt(Math.ceil(diferencaTempo / (1000 * 3600 * 24))); 
    let totalMeses     = parseInt(Math.trunc(diferencaDias / 30));		
    
    let datas = [];
    let mensalidadeTemp = [];

    for(let i = 0; i < (totalMeses - 1); i++){

        if(i == 0){
            
            mensalidadeTemp[i] = inicio;

        } else {

            mensalidadeTemp[i] = mensalidadeTemp[(i - 1)];
            mensalidadeTemp[i].setMonth(mensalidadeTemp[i].getMonth() + 1);
            mensalidadeTemp[i].setDate(dia_vencimento);

        }

        datas[i] = `${mensalidadeTemp[i].getFullYear()}-${mensalidadeTemp[i].getMonth() + 1}-${mensalidadeTemp[i].getDate()}`;
        

    }

    return datas;
    
}