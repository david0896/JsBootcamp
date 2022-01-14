//console.log("Hola mundo")
const boton = document.getElementById("miBoton");
const botonLimpiar = document.getElementById("limpiar");
let botonesEliminar = null;
let botonesEditar = null;
const myTableBody = document.getElementById("tbody-usuarios");
const inputIndice = document.getElementById("indice");
const inputNombre = document.getElementById("inNombre");
const inputApellido = document.getElementById("inApellido");
const inputPais = document.getElementById("inPais");
let usuarios = []

function enviarDatos (e){
    e.preventDefault();
    var url = null;
    var metodo = null;
    var accion = e.target.innerText;
    var data = {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        pais: inputPais.value
    };
    console.log("Accion ", accion)

    if(accion === 'Crear'){
        url = 'https://bootcamp-dia-3.camilomontoyau.vercel.app/usuarios';
        metodo = 'POST';
    }else if(accion === 'Guardar'){
        if(inputIndice.value){
            url = `https://bootcamp-dia-3.camilomontoyau.vercel.app/usuarios/${inputIndice.value}`;
            metodo = 'PUT';
        }else{
            return;
        }
    }else{
        return;
    }

    fetch(url, {
    method: metodo, 
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers:{
        'Content-Type': 'application/json'
    }
    }).then(res => res.json()) //res.json() devuelve otra promesa por eso se puede concatenar otro .then 
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response)
        refrescar();
        restaurarForm();
    });    
};

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
        .map((user, indice) => 
            `<tr>
                <td>${user.nombre ? user.nombre : `vacio`}</td>
                <td>${user.apellido ? user.apellido : `vacio`}</td>
                <td>${user.pais ? user.pais : `vacio`}</td>
                <td><a class="ver" href="/miIndex_view1user.html?usuario=${indice}">Ver</a></td>
                <td><button class="editar" data-indice="${indice}">Editar</button></td>
                <td><button class="eliminar" data-indice="${indice}">Eliminar</button></td>
            </tr>`        
        ).join("");
    console.log(userRender)
    myTableBody.innerHTML = userRender;
    
    botonesEliminar = document.getElementsByClassName("eliminar");   
    Array.from(botonesEliminar).forEach(botonEliminar => {
        botonEliminar.addEventListener("click", eliminarUsuarios)
    });    

    botonesEditar = document.getElementsByClassName("editar");   
    Array.from(botonesEditar).forEach(botonEditar => {
        botonEditar.addEventListener("click", editarUsuarios)
    }); 
}

function eliminarUsuarios(e){

    e.preventDefault();            
    var url = `https://bootcamp-dia-3.camilomontoyau.vercel.app/usuarios/${e.target.dataset.indice}`;
    fetch(url, {
        method: 'DELETE' // or 'PUT'
    })
    .then(res => res.json()) //res.json() devuelve otra promesa por eso se puede concatenar otro .then 
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response)
        refrescar();
        console.log(`usuario ${e.target.dataset.indice} a sido eliminado con exito`);
    }); 
}

function editarUsuarios(e){
    e.preventDefault();      
    const usuario = usuarios[e.target.dataset.indice]
    console.log(usuario)

    if(e.target.dataset.indice){
        inputIndice.value = e.target.dataset.indice
        inputNombre.value = usuario.nombre ? usuario.nombre : ""
        inputApellido.value = usuario.apellido ? usuario.apellido : ""
        inputPais.value = usuario.pais ? usuario.pais : "seleccione"

        boton.innerText = "Guardar"
    }
}

function restaurarForm(){
    boton.innerText = "Crear"
    inputNombre.value = ""
    inputApellido.value = ""
    inputPais.value = "seleccione"
    inputIndice.value = ""
}

refrescar()
boton.onclick = enviarDatos;
botonLimpiar.onclick = restaurarForm
