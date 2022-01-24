/*
const myDiv = document.getElementById('myDiv');
console.log(myDiv);
*/

//funcion de primer orden 
function a(){
    console.log("hola");
}

//funcion de orden superior
//recibe funciones como parametros
function b(param){
    param();
    console.log("Bienvenido a Js");
    param();
}

b(a);

function callbackFn(param){
    console.log(param);
}

function callbackFnPrintHtml(param){
    //debugger;
    //console.log(param);
    //interpolacion de cadenas o plantillas literales `string${variable}string`
    let MihtmlContent = '';

    param.forEach(element => {
        MihtmlContent += `<div>${element.title}<div>`;        
    });

    myDiv.innerHTML = MihtmlContent;
}

async function _request1(url, paramFn){
     let respuesta = await fetch(url);
     //let respuestaJson = respuesta.json(); // muestra una promesa en estado pendiente
     let respuestaJson = await respuesta.json();

     //console.log(respuestaJson);
     paramFn(respuestaJson);
}

const url= "https://jsonplaceholder.typicode.com/todos/";

//_request1(url);

//gracias al callback se puede reutilizar la funcion 
    //_request1(url, callbackFn);
    //_request1(url, callbackFnPrintHtml);


//nivel mas avanzado 
//clouseres

function callbackFnPrintHtmlClosure(pHtmlElement){
    return (content) => {
        let MihtmlContent = '';

        content.forEach(element => {
            MihtmlContent += `<div>${element.title}<div>`;        
        });

        pHtmlElement.innerHTML = MihtmlContent;
    };
}

    //_request1(url, callbackFnPrintHtmlClosure(myDiv));

/*
    una buena practica en toda la programacion en general es darle una 
    responsabbilidad unica a las funciones, tambien el paradigma funcional es darle 
    la minima responsabilidad o que sea lo mas abstrapto posible 
*/

//funcion refactorizada para poder ser reutilizada
function RcallbackFnPrintHtmlClosure(pHtmlElement, fields){
    return (content) => {
        let MihtmlContent = '';        

        content.forEach(element => {

            //reduce recorre un array y devuelve un valor escalar
                                        //esta sintaxis ayuda a retornar en una sola linea evitando corchetes y return
            let text = fields.reduce((acumulado, elemento) => acumulado + element[elemento] + ' '
            , '' );

            MihtmlContent += `<div>${text}<div>`;        
        });

        pHtmlElement.innerHTML = MihtmlContent;
    };
}

_request1(url, RcallbackFnPrintHtmlClosure(myDiv, ['userId', 'title', 'id']));
