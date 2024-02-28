const axios = require('axios');
let response;
exports.registraSolicitudService = async (result) => {
    try {
        if (!!result.body) {
            let bodyRq = {
                "body": result.body
            }
            const url = `http://54.210.214.166:8080${result.urlPath}`;
            console.log(url);
            console.log(bodyRq.body);
            const ret = await axios.post(url, bodyRq)
                .then((res) => {
                    console.log('RESULTADO OK');
                    return res.data;
                })
                .catch((error) => {
                    console.log('RESULTADO ERROR');
                    return error;
                });
            console.log(ret);
            response = {
                'statusCode': 200,
                'headers': {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST"
                },
                'body': JSON.stringify({
                    estado: ret.estado,
                    mensaje: ret.mensaje,
                    objeto: ret.objeto
                })
            }
        } else {
            response = {
                'statusCode': 200,
                'headers': {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST"
                },
                'body': JSON.stringify({
                    estado: false,
                    mensaje: 'Error de ejecucion Lambda',
                    objeto: null
                })
            }
        }
    } catch (error) {
        console.log(error);
        response = {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            'body': JSON.stringify({
                estado: false,
                mensaje: 'Error de ejecucion Lambda Cath',
                objeto: null
            })
        }
    }
    return response
}









