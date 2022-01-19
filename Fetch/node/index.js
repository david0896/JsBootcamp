const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {

    //obtener url desde el obj request
        //console.log(req);
    const urlActual = req.url;
    const urlParseada = url.parse(urlActual, true);
        //console.log({urlActual, urlParseada});

    //obtener la ruta
    const rutaActual = urlParseada.pathname;
        //console.log({rutaActual});

    //ruta limpia 
    const rutaLimpia = rutaActual.replace(/^\/+|\/+$/g, ""); //elimina los / del principio del final 
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
    const decoder = new stringDecoder("utf-8");
    let buffer = ''; //acumulador/recolector

    //ir acumulando la data cuando el request recibe un payload codificando los paquetes(stream) a string
    req.on('data', (data)=>{
        buffer += decoder.write(data);
    });

    //se finaliza la acumulacion de datos al dejar de llegar data finalizando el decoder
    req.on('end', ()=>{
        buffer += decoder.end();

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
    });
    //Enviar una respuesta dependiendo de la ruta
        /*if(rutaLimpia === "ruta"){
            res.end("Estas en /ruta bienvenido");        
        }else{
            res.end("Estas en ruta que desconosco");        
        } */
});

server.listen(5000, () =>{
    console.log("Se inicio el servidor correctamente");
});
