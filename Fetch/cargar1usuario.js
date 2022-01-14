let usuario = {}
const myTableBody = document.getElementById("tbody-usuario");

function tomarIndiceUsuarioDeUrl(){

    return location.search.replace("?","").split("=")[1];

}

function obtenerUsuario(){

    var url = `https://bootcamp-dia-3.camilomontoyau.vercel.app/usuarios/${tomarIndiceUsuarioDeUrl()}`;

    fetch(url)
    .then(res => res.json()) //GET method defoult
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response);
        usuario = response;
        render();
    });    
}

function render(){
    const userRender = `<tr>
                            <td class='campo-usuario'>Nombre</td>
                            <td>${usuario.nombre ? usuario.nombre : `vacio`}</td>
                        </tr>
                        <tr>
                            <td class='campo-usuario'>Apellido</td>
                            <td>${usuario.apellido ? usuario.apellido : `vacio`}</td>
                        </tr>
                        <tr>
                            <td class='campo-usuario'>Pais</td>
                            <td>${usuario.pais ? usuario.pais : `vacio`}</td>
                        </tr>`;
    console.log(userRender)
    myTableBody.innerHTML = userRender;
}

obtenerUsuario()