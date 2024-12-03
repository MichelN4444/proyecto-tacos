export const formulario = ` 
    <form id='formAgregarProducto'>
        <h1>Agregar productos</h1>
        <label>Categoria:</label>
        <select name='categoria' id="categoriaProducto">
            <option>Tacos</option>
            <option>Alambres</option>
            <option>Bebidas</option>
            <option>Postres</option>
        </select><br>
        <label>Introduce el nombre:</label>
        <input type='text' id="nombreProducto" name="nombre" placeholder='Nombre del producto' required><br>
        <label for="precioProducto">Precio:</label>
        <input type="number" id="precioProducto" name="precio" placeholder="Precio del producto" min="0" required><br>
        <button type="button" id="btnAgregarProducto">Agregar producto</button>
    </form>
    <table id="productosTabla">
        <tr>
            <th>Nombre del producto</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Modificar</th>
        </tr>
        <tbody>
        </tbody>
    </table>
    <button id="editarSeleccionados">Editar seleccionados</button>

    <form>
        <br><h1>Modificar productos</h1>
        <label>Introduce el nombre:</label>
        <input type='text' id="buscarProducto" name="nombre" placeholder='Nombre del producto' required><br>
        <button type="button" id="btnBuscarProducto">Agregar producto</button>
    </form>
`;
//Llenar tabla
fetch('http://localhost/proyecto-tacos/api.php?action=obtenerProductos')//vamos a unificar mis php
    .then(response => response.json())
    .then(data => {
        const llenarTabla = document.querySelector('#productosTabla tbody');
        llenarTabla.innerHTML = ''; // Limpia la tabla

        data.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${producto.precio}</td>
                <td><input class="seleccionar" type="checkbox" value="${producto.id}"></td>
            `;
            llenarTabla.appendChild(fila);
        });
    })
    .catch(error => console.error('Error:', error));
   //Aqui va
export const btnEditarProductos = () =>{
    document.getElementById('editarSeleccionados').addEventListener('click' ,()=>{
        const seleccionados = document.querySelectorAll('.seleccionar:checked');
        const ids = Array.from(seleccionados).map(checkbox => checkbox.value);
        if(ids.lenght === 0){
            alert('selecciona al menos uno');
            return;
        }
        //Aqui se crea un formulario para editar o elimar 
    })
}
//En el html de arriba colocar la tabla en donde se verán los productos que tenemos, podemos tambien hacer las categorias dinamicas
export const agregarProducto = () =>{
    const categoria = document.getElementById("categoriaProducto").value.trim();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = document.getElementById("precioProducto").value.trim();

    // Validar que todos los campos estén completos
    if (!nombre || !precio || !categoria) {
        Swal.fire("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Crear el objeto 
    const datos = `nombre=${encodeURIComponent(nombre)}&precio=${encodeURIComponent(precio)}&categoria=${encodeURIComponent(categoria)}`;

    // Enviar los datos por AJAX
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:82/proyecto-tacos/src/api.php?action=insertarProductos", true);//?action=insertarProductos
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                Swal.fire(xhr.responseText);
                // Limpiar campos si se agregó correctamente
                document.getElementById("formAgregarProducto").reset();
            } else {
                console.log("Error en la solicitud:", xhr.status, xhr.responseText);
                Swal.fire("Error al agregar el producto. Intenta nuevamente.");
            }
        }
    };
    xhr.send(datos);
}