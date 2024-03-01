const axios = require('axios');
let response;
exports.loginAppService = async (result) => {
    try {
        const url = `http://54.210.214.166:8080${result.urlPath}`;
        console.log(url);
        console.log(JSON.parse(result.body));
        const ret = await axios.post(url, JSON.parse(result.body), {
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