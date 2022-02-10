const http = require("http");
const request_handler = require("./request-handler");
const recursos = require("./recursos");

global.recursos = recursos;

//req = petición, res = respuesta 
const server = http.createServer(request_handler);

server.listen(5000, () =>{
    console.log("Se inicio el servidor correctamente");
});
