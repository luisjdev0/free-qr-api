# PrettyQR API

API para generar códigos QR personalizados, uilizada en la aplicación de [PrettyQR: QR Personalizados](https://play.google.com/store/apps/details?id=com.luisjdev.pretty_qr)

## Concepto

El objetivo de esta API es que a través de peticiones GET o POST, genere códigos QR con estilos personalizados, realizando modificaciones como, formas, colores, gradientes, ícono personalizado en el centro, entre otros.

## Requisitos

- Esta API utiliza el sistema de autenticación clásico por coincidencia de checksum de MD5 así como el sistema de [luisjdev0/auth-api-service](https://github.com/luisjdev0/auth-api-service.git) aunque puede ser modificado directamente en el código fuente.

## Despliegue

Para compilar el proyecto, ejecutar el comando ``` npm run build ```, se creará un directorio llamado  ``` dist/ ``` el cual contendrá toda la implementación (excepto el archivo de variables de entorno, el cuál deberá se agregado manualmente).

## Headers

El endpoint disponible solo podrá ser utilizado si el token JWT es valido y contiene el ```API_ID``` definido en las variables de entorno, el token será validado con la firma definida en la variable ```JWT_SECRET_KEY```

```http
Authorization: Bearer <AUTH_SECRET_TOKEN>
```

## Endpoints

A continuación, se listarán los endpoints disponibles en el API:

Crear código QR sencillo y sin autenticación:

```http
GET /
```

Parámetros de query:

* ```data``` Requerido, información que contendrá el código QR.
* ```size``` Opcional, resolución del QR, mínimo ```100px```, máximo ```1200px```, por defecto ```300px```.
* ```shape``` Opcional, estilo del QR, opciones disponibles: ```dots```, ```rounded``` y ```square```, por defecto ```square```.
* ```color``` Opcional, color sólido del QR, en hexadecimal, por defecto es ```#000000``` 

Crear código QR personalizado con autenticación, en el body, el único parámetro obligatorio es ```data```, los demás son opcionales:

```http
POST /

{
    "data" : "https://web.whatsapp.com/",
    "size" : 300,
    "image" : "https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png",
    "backgroundOptions" : {
        "color" : "#FFFFFF"
    },
    "dotsOptions" : {
        "type": "extra-rounded",
        "gradient" : {
            "type" : "linear",
            "rotation" : 45,
            "colorStops" : [
                { "color" : "#58d364", "offset" : 0 },
                { "color" : "#22b33a", "offset" : 1 }
            ]
        }
    }
}

```
Para más información sobre las variantes disponibles en las consultas, visitar [kozakdenys/qr-code-styling](https://github.com/KilianB/styled-qr-code)

La petición retornará la siguiente salida:

![Resultado de código QR](https://imgur.com/SdOAUPN.png)