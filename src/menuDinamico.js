import Swal from "sweetalert2";

export const llenarCategorias = () => {
    fetch('./src/php/api.php?action=obtenerCategorias')
    .then(response => response.json())
    .then(data =>{
        const form = document.getElementById('categoriaProducto');
        form.innerHTML = '';
        data.forEach(categoria =>{
            const option = document.createElement('option');
            option.value = categoria.id
            option.textContent = categoria.nombre
            form.appendChild(option);
        })
    })
    .catch(error => console.log('Error al obtener las categorías:', error));
}

export const formulario = ` 
        <form class="form-categorias">
        <h1 class="titulo-categorias">Agregar categorias</h1>
        <label class="label-categorias">Agregar categorias:</label>
        <input type="text" id="inputCat" class="input-categorias">
        <button type="button" id="btnAgregarCat" class="btn-categorias">Agregar categorias</button>
    </form>

    <form id="formAgregarProducto" class="form-productos">
        <h1 class="titulo-productos">Agregar productos</h1>
        <label class="label-productos">Categoria:</label>
        <select name="categoria" id="categoriaProducto" class="select-productos">
        </select><br>
        <label class="label-productos">Introduce el nombre:</label>
        <input type="text" id="nombreProducto" name="nombre" placeholder="Nombre del producto" required class="input-productos"><br>
        <label for="precioProducto" class="label-productos">Precio:</label>
        <input type="number" id="precioProducto" name="precio" placeholder="Precio del producto" min="0" required class="input-productos"><br>
        <button type="button" id="btnAgregarProducto" class="btn-productos">Agregar producto</button>
    </form>

    <br><h1 class="titulo-modificar">Modificar productos</h1>
    <div class="table-contenedor">
        <table id="productosTabla" border="1" class="tabla-productos">
            <thead class="thead-productos">
                <tr class="fila-encabezado">
                    <th class="columna-nombre">Nombre del producto</th>
                    <th class="columna-categoria">Categoria</th>
                    <th class="columna-precio">Precio</th>
                    <th class="columna-modificar">Modificar</th>
                </tr>
            </thead>
            <tbody class="tbody-productos">
            </tbody>
        </table>
    </div>
    <button id="editarSeleccionados" class="btn-editar">Editar seleccionados</button>
`;

export const agregarCategorias = (recargar) => {
    document.getElementById('btnAgregarCat').addEventListener('click', () =>{
        let categoria = document.getElementById('inputCat').value;
        if (categoria) {
            Swal.fire({
                title: "¿Estas seguro?",
                text: "Agregarias: " + categoria,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: "Cancelar",
                confirmButtonText: "Sí, agregar!"
            }).then((result) => {
                if (result.isConfirmed) {
                    let catjson = {nombre: categoria}
                    fetch('./src/php/api.php?action=registrarCategoria',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    //se pasan en json
                        body: JSON.stringify(catjson)
                    })
                    .then(response => response.json())
                    .then(data =>{
                        if (data.success) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Categoria registrada con exito!.",
                                showConfirmButton: false,
                                timer: 1500
                            });
                            document.getElementById('inputCat').value = '';
                            recargar();
                        }else{
                            Swal.fire("Error: " + data.error);
                        }
                    })
                    .catch(error =>{
                        Swal.fire("Error al agregar");
                    })
                }
            });
        }
        else{
            Swal.fire("Por favor, ingresa una categoria.!");
        }
})
}

//Llenar tabla
export const tabla = () => {
    fetch('./src/php/api.php?action=obtenerProductos')
    .then(response => response.json())//promise
    .then(data => {
        const llenarTabla = document.querySelector('#productosTabla tbody');
        llenarTabla.innerHTML = ''; 
        data.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>$${producto.precio}</td>
                <td><input class="seleccionar" type="checkbox" value="${producto.id}" data-info='${producto.nombre}'></td>
            `;
            llenarTabla.appendChild(fila);
        });
    })
    .catch(error => console.error('Error:', error));
   //Aqui va
}

export const btnEditarProductos = (contenedorEditar, recargar) =>{
    document.getElementById('editarSeleccionados').addEventListener('click' ,()=>{
        const seleccionados = document.querySelectorAll('.seleccionar:checked');
        const ids = Array.from(seleccionados).map(checkbox => checkbox.value);
        const nombres = Array.from(seleccionados).map(checkbox => checkbox.dataset.info)

        if(seleccionados.length == 0){
            Swal.fire("Selecciona al menos un producto!");
            return;
        }
        //Aqui se crea un formulario para editar o elimar
        let html = '<form id="editarFormulario">';
        ids.forEach((id, i) => {
                html += `
                    <br><br><label>Producto: ${nombres[i]}</label>
                    <input type="text" name="nombre_${id}" placeholder="Nuevo nombre">
                    <input type="number" min="0" name="precio_${id}" placeholder="Nuevo precio">
                    <select name="categoria_${id}">
                    <option value="">Selecciona una categoría</option>
                        
                    </select>
                    <button type="button" class='btnEliminar' data-id="${id}">Eliminar producto</button>
                `;
        });
    html += `<br><br><button type="button" id="guardar">Guardar cambios</button></form>`;
    contenedorEditar.innerHTML = html;
    
    fetch('./src/php/api.php?action=obtenerCategorias')
            .then(response => response.json())
            .then(data => {
                const selects = document.querySelectorAll('select[name^="categoria_"]');
                selects.forEach(select => {
                    data.forEach(categoria => {
                        select.innerHTML += `<option value="${categoria.nombre}">${categoria.nombre}</option>`;
                    });
                });
            });

    document.querySelectorAll('.btnEliminar').forEach(btn =>{
        btn.addEventListener('click', (e)=>{
            const id = e.target.getAttribute('data-id'); // Obtener el ID del producto
    
            // Confirmar antes de eliminar
            Swal.fire({
                title: "¿Estás seguro?",
                text: "No podras revertirlo!",
                icon: "Atencion",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: 'Cancelar',
                confirmButtonText: "Sí, eliminarlo!"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`http://localhost:82/proyecto-tacos/src/php/api.php?action=eliminarProducto&id=${id}`, {
                        method: 'POST'
                    })
                    .then(response => response.json())
                    .then(result => {
                    if (result.success) {
                        Swal.fire({
                            title: "Eliminado!",
                            text: "El producto fue eliminado.",
                            icon: "success"
                        });
                        recargar(); // Recargar la tabla para reflejar los cambios
                    } else {
                        Swal.fire({
                            title: "Ha ocurrido un error",
                            showClass: {
                            popup: `
                                animate__animated
                                animate__fadeInUp
                                animate__faster
                            `
                            },
                            hideClass: {
                            popup: `
                                animate__animated
                                animate__fadeOutDown
                                animate__faster
                            `
                            }
                        });
                    }
                })
                }
            });
        })
    })
    document.getElementById('guardar').addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.getElementById('editarFormulario')
        Swal.fire({
            title: "¿Estas seguro?",
            text: "Cambiaras los datos!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí, cambiar!"
        }).then((result) => {
            if (result.isConfirmed) {
                if (form) {
                    const datosProducto = {};
                    const inputs = form.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        const name = input.name;
                        const value = input.value;
                        if (name && value) {
                            // Extraer el ID de la categoría desde el nombre del campo (por ejemplo "categoria_1")
                            const [campo, id] = name.split('_');
                            if (!datosProducto[id]) {
                                datosProducto[id] = {};
                            }
                            datosProducto[id][campo] = value;
                        }
                    });
                    fetch('./src/php/api.php?action=editarProductos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(datosProducto), 
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            Swal.fire({
                                title: "Actualizado!",
                                text: "Productos actualizados.",
                                icon: "success"
                            });
                            recargar();
                        } else {
                            alert('Error al actualizar los productos');
                        }
                    });
                }
            }
        });
    });
    })
}
//En el html de arriba colocar la tabla en donde se verán los productos que tenemos, podemos tambien hacer las categorias dinamicas
export const agregarProducto = (recargar) =>{
    const categoria_id = document.getElementById("categoriaProducto").value.trim();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = document.getElementById("precioProducto").value.trim();

    // Validar que todos los campos estén completos
    if (!nombre || !precio || !categoria_id) {
        Swal.fire("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Crear el objeto 
    const datos = `nombre=${encodeURIComponent(nombre)}&precio=${encodeURIComponent(precio)}&categoria_id=${encodeURIComponent(categoria_id)}`;

    // Enviar los datos por AJAX despues pasarlo con fetch
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./src/php/api.php?action=insertarProductos", true);//?action=insertarProductos
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                Swal.fire(xhr.responseText);
                // Limpiar campos si se agregó correctamente
                document.getElementById("formAgregarProducto").reset();
                recargar();
            } else {
                console.log("Error en la solicitud:", xhr.status, xhr.responseText);
                Swal.fire("Error al agregar el producto. Intenta nuevamente.");
            }
        }
    };
    xhr.send(datos);
}