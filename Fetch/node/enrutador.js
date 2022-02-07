//manejador de rutas o handlers
module.exports = {
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
                if(global.recursos.mascotas[data.indice]){
                   return callback(200, global.recursos.mascotas[data.indice]);
                }
                return callback(404, {mesaje: `Mascota con indice ${data.indice} no encontrada`});

            }
            //200 OK
            //La solicitud ha tenido éxito. El significado de un éxito varía 
            //dependiendo del método HTTP:
            callback(200, global.recursos.mascotas);
        },
        //prueba postman AGREGAR MASCOTA
        POST: (data, callback)=>{
            //console.log('data desde HANDLER/POST', {data});

            //201 Created
            //La solicitud ha tenido éxito y se ha creado un nuevo recurso como 
            //resultado de ello. Ésta es típicamente la respuesta enviada después 
            //de una petición PUT.
            global.recursos.mascotas.push(data.payload);            
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