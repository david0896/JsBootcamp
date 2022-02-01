const http = require("http");
const url = require("url");
const { StringDecoder } = require('string_decoder');
const { json } = require("stream/consumers");

let recursos = {

    mascotas : [
        {tipo: "perro", nombre: "boby", dueno: "daniel"},
        {tipo: "perro", nombre: "boby", dueno: "daniel"},
        {tipo: "perro", nombre: "boby", dueno: "daniel"},
        {tipo: "perro", nombre: "boby", dueno: "daniel"},
        {tipo: "gato", nombre: "blue", dueno: "sonia"}
    ],

}

//manejador de rutas o handlers
const enrutador = {
    //handler
    ruta: (data, callback)=>{
        callback(200, {mesaje: 'Esta es /ruta'});
    },
    //handler mascotas 
    mascotas: {
        //prueba postman LISTAR MASCOTAS y OPTENER UNA SOLA MASCOTA
        GET: (data, callback)=>{
            //evaluamos que en la ruta exista un indice a buscar
            if(data.indice){
                //luego evaluamos que ese indice exista en nuetro array recursos
                if(recursos.mascotas[data.indice]){
                   return callback(200, recursos.mascotas[data.indice]);
                }
                return callback(404, {mesaje: `Mascota con indice ${data.indice} no encontrada`});

            }
            //200 OK
            //La solicitud ha tenido éxito. El significado de un éxito varía 
            //dependiendo del método HTTP:
            callback(200, recursos.mascotas);
        },
        //prueba postman AGREGAR MASCOTA
        POST: (data, callback)=>{
            //console.log('data desde HANDLER/POST', {data});

            //201 Created
            //La solicitud ha tenido éxito y se ha creado un nuevo recurso como 
            //resultado de ello. Ésta es típicamente la respuesta enviada después 
            //de una petición PUT.
            recursos.mascotas.push(data.payload);            
            callback(201, data.payload);
        },       
    },
    //handler usuarios 
    usuarios: (data, callback)=>{
        callback(200, [{nombre: "usuario 1"},{nombre: "usuario 2"}]);
    },
    //handler
    noEncontrado: (data, callback)=>{
        //404 Not Found
        //El servidor no pudo encontrar el contenido solicitado. Este código de 
        //respuesta es uno de los más famosos dada su alta ocurrencia en la web.
        callback(404, {mesaje: 'Pagina no encontrada'});
    }
}

//req = petición, res = respuesta 
const server = http.createServer((req, res) => {

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
});

server.listen(5000, () =>{
    console.log("Se inicio el servidor correctamente");
});
