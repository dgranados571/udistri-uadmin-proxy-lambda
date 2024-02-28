const multipart = require('aws-lambda-multipart-parser');
const { registraSolicitudService } = require("./services/registraSolicitudLambda");
let response;
exports.lambdaHandler = async (event, context) => {
    console.log('START Lambda Control');
    const result = multipart.parse(event, false);
    switch (result.urlPath) {
        case '/service/uadmin/registraSolicitudLambda':
            response = await registraSolicitudService(result);
            console.log(response);
            break;
        default:
            response = {
                'statusCode': 200,
                'headers': {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST"
                },
                'body': JSON.stringify({
                    estado: false,
                    mensaje: 'Sin redireccionamiento a API',
                    objeto: null
                })
            }
            break;
    }

    return response;
}