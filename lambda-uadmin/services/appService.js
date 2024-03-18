const axios = require('axios');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
let response;
exports.AppService = async (result) => {
    try {
        let url = `http://54.210.214.166:8080${result.urlPath}`;
        let rqService;
        console.log('Tiene archivos -->', !!result.files);
        if (!!result.files) {
            url = `${url}?body=${result.body}`;
        } else {
            rqService = JSON.parse(result.body);
        }
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
            if (ret.estado) {
                if (!!result.files) {
                    console.log('Total de Archivos --> ', result.files);
                    await validacionArchivosS3(result, ret);
                }
            }
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

const validacionArchivosS3 = async (result, ret) => {

    await listarElementosOT()

    if (!!result.file_0) {
        const { content, contentType } = result.file_0
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_0`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_1) {
        const { content, contentType } = result.file_1
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_1`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_2) {
        const { content, contentType } = result.file_2
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_2`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_3) {
        const { content, contentType } = result.file_3
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_3`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_4) {
        const { content, contentType } = result.file_4
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_4`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_5) {
        const { content, contentType } = result.file_5
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_5`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_6) {
        const { content, contentType } = result.file_6
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_6`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_7) {
        const { content, contentType } = result.file_7
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_7`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_8) {
        const { content, contentType } = result.file_8
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_8`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_9) {
        const { content, contentType } = result.file_9
        const fileName = `OT_UADMIN/${ret.objeto}/${ret.objeto}_9`
        await procesaGuardadoS3(fileName, content, contentType)
    }
}

const procesaGuardadoS3 = async (keyFileName, content, contentType) => {
    const params = {
        Bucket: 'appuadminbucket',
        Key: keyFileName,
        Body: content,
        ContentType: contentType
    };
    try {
        const data = await s3.upload(params).promise();
        console.log('Imagen cargada exitosamente', data.Location);
    } catch (error) {
        console.log('Error al cargar la imagen', error);
    }
}

const listarElementosOT = async () => {
    try {
        const data = await s3.listObjectsV2({ Bucket: 'appuadminbucket' }).promise();
        data.Contents.forEach((objeto) => {
            console.log(objeto.Key);
        });
    } catch (error) {
        console.error('Error al listar objetos:', error);
    }
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