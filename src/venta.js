export function registrarVenta(venta) {
    Swal.fire({
        title: "Estas seguro?",
        text: "No podras cancelar la venta despues!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancelar',
        confirmButtonText: "Sí, registrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('./src/php/api.php?action=registrarVenta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: venta // Aquí se pasa el JSON generado
            })
            .then(response => response.json()) // Procesar la respuesta JSON del servidor
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: "Registrada!",
                        text: "Venta registrada con exito!",
                        icon: "success"
                    });
                    form.querySelectorAll('input[type="number"]').forEach(input =>{
                        input.value = 0;
                    })
                } else {
                    console.error('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error al registrar la venta:', error);
            });
        }
    });
}
