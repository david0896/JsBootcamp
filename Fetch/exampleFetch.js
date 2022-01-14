//console.log("Hola mundo")
const boton = document.getElementById("miBoton");
const myUl = document.getElementById("miul");
let usuarios = []

function enviarDatos(){
    var url = 'https://bootcamp-dia-3.camilomontoyau.vercel.app/usuarios';
    var data = {name: "lunes 24"};

    fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers:{
        'Content-Type': 'application/json'
    }
    }).then(res => res.json()) //res.json() devuelve otra promesa por eso se puede concatenar otro .then 
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response)
        refrescar();
    });    
}

function refrescar(){

    var url = 'https://bootcamp-dia-3.camilomontoyau.vercel.app/usuarios';

    fetch(url)
    .then(res => res.json()) //GET method defoult
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response);
        usuarios = response;
        render();
    });

    
}

function render(){
    console.log("render ", usuarios)
    const userRender = usuarios
        .map(user => `<li>${user.nombre}</li>`)
        .join("");
    console.log(userRender)
    myUl.innerHTML = userRender;
}

boton.addEventListener("click", enviarDatos(),false);