const axios = require('axios');
const fs = require('fs');
let response;
exports.AppService = async (result) => {
    try {
        let url = `http://54.210.214.166:8080${result.urlPath}`;
        let rqService;
        url = `${url}?body=${result.body}`;
        if (!!result.files) {

        } else {
            rqService = JSON.parse(result.body);
        }
        console.log(url);
        console.log(JSON.parse(result.body));
        const ret = await axios.post(url, rqService, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log('Resultado THEN Axios');
            return res.data;
        }).catch((error) => {
            console.log('Resultado CATH Axios');
            console.log(error);
            return null;
        });
        if (!!ret) {
            response = responseObject(ret.estado, ret.mensaje, ret.objeto);
        } else {
            response = responseObject(false, 'Error de consumo Api', null);
        }
    } catch (error) {
        console.log(error);
        response = responseObject(false, 'Error de ejecucion Lambda Cath', null);
    }
    return response
}

const responseObject = (estado, mensaje, objeto) => {
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        'body': {
            estado,
            mensaje,
            objeto
        }
    }
}

// REVISAR SIGUIEN URL para envio de Archivos.
// https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers