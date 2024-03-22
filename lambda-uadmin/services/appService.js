const axios = require('axios');
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
            if (ret.estado) {
                if (!!result.files) {
                    console.log('Objeto ret --> ', ret);
                    console.log('Total de Archivos --> ', result.files);
                    try {
                        await validacionArchivosS3(result, ret);
                    } catch (error) {
                        ret.objeto.errorS3 = 'Error cargando los archivos, contante al administador';
                    }
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

    let indxArchivo = ret.objeto.totalArchivos;
    console.log('Total de Archivos Existentes --> ', indxArchivo);
    if (!!result.file_0) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_0
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_1) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_1
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_2) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_2
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_3) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_3
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_4) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_4
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_5) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_5
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_6) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_6
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_7) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_7
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_8) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_8
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
        await procesaGuardadoS3(fileName, content, contentType)
    }
    if (!!result.file_9) {
        indxArchivo = indxArchivo + 1
        const { content, contentType } = result.file_9
        const ext = obtenerExtensionDeContentType(contentType)
        const fileName = `OT_UADMIN/${ret.objeto.idProcesamiento}/${ret.objeto.idProcesamiento}_${indxArchivo}.${ext}`
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

const obtenerExtensionDeContentType = (contentType) => {

    const mapeoExtensiones = {
        "text/plain": "txt",
        "text/html": "html",
        "text/css": "css",
        "application/javascript": "js",
        "application/json": "json",
        "application/xml": "xml",
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/bmp": "bmp",
        "image/svg+xml": "svg",
        "video/mp4": "mp4",
        "video/mpeg": "mpeg",
        "audio/mpeg": "mp3",
        "audio/wav": "wav",
        "audio/ogg": "ogg",
        "application/pdf": "pdf",
        "application/zip": "zip",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/vnd.ms-powerpoint": "ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
        "application/vnd.oasis.opendocument.text": "odt",
        "application/vnd.oasis.opendocument.spreadsheet": "ods",
        "application/vnd.oasis.opendocument.presentation": "odp",
        "application/rtf": "rtf",
        "application/x-shockwave-flash": "swf",
        "application/x-tar": "tar",
        "application/x-gzip": "gz",
        "application/x-7z-compressed": "7z",
        "application/x-rar-compressed": "rar",
        "application/x-msdownload": "exe",
        "application/x-msdos-program": "com",
        "application/octet-stream": "bin",
        "application/x-bittorrent": "torrent",
        "application/vnd.android.package-archive": "apk",
        "application/x-php": "php",
        "application/x-perl": "pl",
        "application/x-python": "py",
        "application/x-ruby": "rb",
        "application/x-java-archive": "jar",
        "application/x-msmetafile": "wmf",
        "application/vnd.apple.keynote": "key",
        "application/vnd.apple.pages": "pages",
        "application/vnd.apple.numbers": "numbers",
        "application/vnd.visio": "vsd",
        "application/vnd.visio2013": "vsdx",
        "application/vnd.ms-access": "mdb",
        "application/x-iwork-keynote-sffkey": "key",
        "application/x-iwork-pages-sffpages": "pages",
        "application/x-iwork-numbers-sffnumbers": "numbers",
        "application/x-rar-compressed": "rar",
        "application/x-tar": "tar",
        "application/x-7z-compressed": "7z",
        "application/x-gzip": "gz",
        "application/x-bzip2": "bz2",
        "application/x-xz": "xz",
        "application/x-dvi": "dvi",
        "application/x-stuffit": "sit",
        "application/x-tarz": "tar.z",
        "application/x-webarchive": "webarchive",
        "application/x-7z-compressed": "7z",
        "application/x-lzh": "lzh",
        "application/x-lzx": "lzx",
        "application/x-tar-gz": "tar.gz",
        "application/x-tar-bzip2": "tar.bz2",
        "application/x-tar-xz": "tar.xz",
        "application/x-tar-lz": "tar.lz",
        "application/x-tar-lzma": "tar.lzma",
        "application/x-tar-lzo": "tar.lzo",
        "application/x-tar-xz": "tar.xz",
        "application/x-tar-7z": "tar.7z",
        "application/x-tar-7zip": "tar.7zip",
        "application/x-zip-compressed": "zip",
        "application/x-7zip-compressed": "7z",
        "application/x-rar-compressed": "rar"

    };
    const extension = mapeoExtensiones[contentType];
    return extension || "";
}