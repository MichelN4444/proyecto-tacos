export const registrarVenta = (venta) =>{
    venta = JSON.stringify(venta);
    console.log(venta);

    fetch('./src/php/api.php?action=registrarVenta',{
        method: 'POST',
        headers:{
            'Content-type': 'application/json'
        },
        body: venta
    })
    .then(response => response.json())
    .then(result => {
        console.log('respuesta del server', result);
    })
    .catch(error => console.log('error:', error));
}