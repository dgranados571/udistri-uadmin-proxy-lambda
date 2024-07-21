const axios = require('axios');
const { PDFDocument } = require('pdf-lib');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
let response;
exports.AppService = async (result) => {
    try {
        const url = `http://54.210.214.166:8080${result.urlPath}`;
        const rqService = JSON.parse(result.body);
        console.log('Tiene archivos -->', !!result.files);
        console.log('URL de peticion back-end', url);
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
            response = responseObject(false, 'Error de consumo Api', null);
        }
    } catch (error) {
        console.log('Error de ejecucion Lambda Cath', error);
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