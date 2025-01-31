const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multipart = require('aws-lambda-multipart-parser');
const { AppService } = require('./services/appService');

const s3Client = new S3Client({ region: 'us-east-1' });
const BUCKET_NAME = 'appuadminbucket';
let response;

exports.lambdaHandler = async (event, context) => {
    console.log('START Lambda Control');
    try {
        const result = multipart.parse(event, true)
        const fileBase64 = result.file;
        if (!fileBase64) {
            console.log('START Result form Data Body', (!!result.body), result);
            const resObj = await AppService(result);
            const { estado, mensaje, objeto } = resObj.body;
            response = responseObject(estado, mensaje, objeto);
            console.log(response);
        } else {            
            try {
                console.log('START Result form Data Files', result.fileName, fileBase64.length);
                const uploadResult = await uploadToS3(result.fileName, fileBase64);
                response = responseObject(true, 'Archivo cargado exitosamente', uploadResult);
            } catch (error) {
                response = responseObject(false, 'Error cargando el archivo a S3', error);
            }
        }
    } catch (error) {
        console.log('Error de ejecucion Lambda Cath', error);
        response = responseObject(false, 'Error_lambda', null);
    }
    console.log('FINISH Lambda Control');
    return response;
}

const uploadToS3 = async (fileName, fileStream) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileStream,
        ContentType: 'text/plain'
    };
    try {
        const command = new PutObjectCommand(params);
        const uploadResult = await s3Client.send(command);
        return uploadResult;
    } catch (error) {
        console.error('Error al subir archivo a S3', error);
        throw new Error('Error al subir archivo a S3');
    }
};

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