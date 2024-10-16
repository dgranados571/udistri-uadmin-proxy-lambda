const multipart = require('aws-lambda-multipart-parser');
const { AppService } = require('./services/appService');
let response;
exports.lambdaHandler = async (event, context) => {
    console.log('START Lambda Control');
    try {
        const result = JSON.parse(event.body);
        console.log('Body result',(!!result.body), result);
        if (!!result.body) {
            const resObj = await AppService(result);
            const { estado, mensaje, objeto } = resObj.body;
            response = responseObject(estado, mensaje, objeto);
            console.log(response);
        } else {
            response = responseObject(false, 'Auth-012', null);
        }
    } catch (error) {
        console.log('Error de ejecucion Lambda Cath', error);
        response = responseObject(false, 'Auth-002-lambda', null);
    }
    console.log('FINISH Lambda Control');
    return response;
}

const responseObject = (estado, mensaje, objeto) => {
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        'body': JSON.stringify({
            estado,
            mensaje,
            objeto
        })
    }
}