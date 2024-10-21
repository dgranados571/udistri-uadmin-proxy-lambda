const axios = require('axios');
let response;
exports.AppService = async (result) => {
    try {
        console.log('Service lambda', result);
        const url = `${result.urlPath}`;
        const rqService = JSON.parse(result.body);
        console.log('URL de peticion back-end', url);
        console.log('Body de peticion back-end', rqService);
        const ret = await axios.post(url, rqService, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log('Resultado THEN Axios');
            return res.data;
        }).catch((error) => {
            console.log('Resultado CATH Axios --> ', error);
            return null;
        });
        if (!!ret) {
            response = responseObject(ret.estado, ret.mensaje, ret.objeto);
        } else {
            response = responseObject(false, 'Error_lambda', null);
        }
    } catch (error) {
        console.log('Error de ejecucion Lambda Cath', error);
        response = responseObject(false, 'Error_lambda', null);
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