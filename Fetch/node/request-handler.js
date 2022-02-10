const url = require("url");
const { StringDecoder } = require('string_decoder');
const { json } = require("stream/consumers");
const enrutador = require("./enrutador");

module.exports = (req, res) => {

    //obtener url desde el obj request
        //console.log(req);
    const urlActual = req.url;
    const urlParseada = url.parse(urlActual, true);
        console.log("urls: ", {urlActual, urlParseada});

    //obtener la ruta
    const rutaActualpath = urlParseada.pathname;
        //console.log({rutaActual});

    //ruta limpia 
    const rutaLimpia = rutaActualpath.replace(/^\/+|\/+$/g, ""); //elimina los / del principio y del final usando Regex 
        //console.log(rutaLimpia);

    //obtenemos el metodo HTTP
    const metodo = req.method.toUpperCase();
        //console.log("Method ", req.method.toUpperCase());

    //obtener propiedades enviadas como variablen en la url
    const {query = {}} = urlParseada; //se usa destructuring o const q = urlParseada.query 
        //console.log(query);

    //obtener los headers
    const {headers = {}} = req;
        //console.log(headers);

    //Obtener payload, en el caso de haber uno 
    const decoder = new StringDecoder('utf8');
    let buffer = ''; //acumulador/recolector

    //ir acumulando la data cuando el request recibe un payload codificando los paquetes(stream) a string
    //se ejecuta con el evento data de la peticion(req)
    req.on('data', (data)=>{
        buffer += decoder.write(data);
    });

    //se finaliza la acumulacion de datos al dejar de llegar data finalizando el decoder
    //se ejecuta con el evento end de la peticion(req)
    req.on('end', ()=>{
        buffer += decoder.end();

    //validar headers type JSON
    if(headers['content-type'] === 'application/json'){
        buffer = JSON.parse(buffer);
    }

    //evaluar ruta si trae una variable ( //ruta/:variable ) en este caso indice a buscar en el array recursos
    //indexOf se encarga de encontrar dendro de un string o un array el valor que se le pasa como parametro, devolviendo su indice y -1 si no lo encuentra
    if(rutaLimpia.indexOf('/') > -1){
        //usamos var para que las variables creadas puedan ser usadas fuera de este hambito
        console.log("rutaLimpia ", rutaLimpia);
        console.log("rutaLimpia split ", rutaLimpia.split('/'));
        var [rutaPrincipal, indice] = rutaLimpia.split('/');//split devuelve un array y lo guardamos usando destructuring
    }

    //Organizar data del request(peticion)
    const data = {
        indice,
        ruta: rutaPrincipal || rutaLimpia,
        query,
        metodo,
        headers,
        payload: buffer 
    }

    console.log("Data organizada: ", {data});

    //Elegir el manejador dependiendo de la ruta y asignarle la funcion que el enrutador tiene 
    let handler;
    if(data.ruta && enrutador[data.ruta] && enrutador[data.ruta][metodo]){
        handler = enrutador[data.ruta][metodo];
    }else{
        handler = enrutador.noEncontrado;
    }

    //ejecutar handler(manejador) para enviar la respuesta
    if(typeof handler === 'function'){
    
        handler(data,(statusCode = 200, mensaje)=>{

            const respuesta = JSON.stringify(mensaje);

            //colocamos en el handler que se devuelve una respuesta tipo JSON
            res.setHeader("Content-Type", "application/json")
            res.writeHead(statusCode);
            //linea donde realmente ya estamos respondiendo a la aplicacion cliente
            res.end(respuesta);
        });
    }    
        /*
            //aseguramos que la respuesta se ejecute al finalizar request ya que end es asincrono 
            switch(rutaLimpia){
                case "ruta":
                    res.end("Estas en /ruta bienvenido");
                    break;        
                case "oso":
                    res.end("Estas en /oso que es una ruta con nombre animal"); 
                    break;       
                case "carro":
                    res.end("Estas en /carro bienvenido :D");   
                    break;
                default:
                    res.end("Desconozco esta ruta x____x"); 
                    break;  
            }
            //
            // o 
            //
            //Enviar una respuesta dependiendo de la ruta (segunda forma)
                if(rutaLimpia === "ruta"){
                    res.end("Estas en /ruta bienvenido");        
                }else{
                    res.end("Estas en ruta que desconosco");        
                } 
        */
    });    
}