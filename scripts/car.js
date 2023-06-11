//TENGO QUE IMPORTARME EL CARRITO
const CarritoData = localStorage.getItem('CARRITO:'); //obtengo la "base de datos" del localstorage
let carrito = JSON.parse(CarritoData);
console.log(carrito);
let CAR = document.getElementById('ContCarrito');

/*
function eliminarProductoDelCarrito(producto, elemento) {
    // Eliminar el producto del carrito
    const index = carrito.indexOf(producto);
    carrito.splice(index, 1);

    // Eliminar el elemento del DOM
    elemento.remove();

    // Actualizar el carrito en el localStorage
    localStorage.setItem("CARRITO:", JSON.stringify(carrito));
}

//ahora con el carrito importado lo que haré será mostrarlo en pantalla

function actualizarSubtotal() {
    // Calcular el nuevo subtotal
    let subtotal = 0;
    carrito.forEach(producto => {
        subtotal += producto.precio * producto.cant;
    });

    // Actualizar el valor del subtotal en el DOM
    subtotalElement.textContent = subtotal.toFixed(2);
}
*/

carrito.forEach(producto => {
    let subtotal = document.getElementById('subTotal');
    let valorSubTotal = carrito.reduce((acum, prod) => acum + parseFloat(prod.precio * prod.cant), 0).toFixed(2);
    subtotal.innerHTML = `${valorSubTotal}`

    const contCar = document.createElement("div");
    contCar.id = 'car__productos-elementos';

    let carimg = document.createElement("div");
    carimg.id = 'car-img'
    carimg.innerHTML = `
        <button id="quitarProd">x</button>
        <img src="${producto.imgA}" alt="${producto.nombre}">
    `;
    contCar.appendChild(carimg);

    let carNyF = document.createElement("div");
    carNyF.id = 'car-nombreyfav'
    carNyF.innerHTML = `
        <p>${producto.nombre}</p>
        <input type="checkbox">
        <label>Añadir a fav</label>
    `;
    contCar.appendChild(carNyF);

    let carPre = document.createElement("div");
    carPre.id = 'car-precio'
    carPre.innerHTML = `
       <p>${producto.divisa} ${producto.precio}</p>
    `;
    contCar.appendChild(carPre);

    let carC = document.createElement("div");
    carC.id = 'car-cant'
    carC.innerHTML = `
        <button id="boton-menos">-</button>
            <div>
                <p>${producto.cant}</p>
            </div>
        <button id="boton-mas">+</button>
    `;
    contCar.appendChild(carC);

    

  
    

    // Obtén las referencias a los botones "boton-menos" y "boton-mas" dentro del alcance actual
    const botonMenos = carC.querySelector("#boton-menos");
    const botonMas = carC.querySelector("#boton-mas");

    botonMenos.addEventListener("click", () => {
        if (producto.cant > 1) {
            producto.cant--;
        }
        let cantidadElement = carC.querySelector("p");
        cantidadElement.textContent = producto.cant.toString();
        
        let cantidadPrecio = carT.querySelector("p");
        precioTotal = parseFloat(producto.precio * producto.cant).toFixed(2);
        cantidadPrecio.textContent = `${producto.divisa} ${precioTotal}`;

        let subtotal = document.getElementById('subTotal');
        let valorSubTotal = carrito.reduce((acum, prod) => acum + parseFloat(prod.precio * prod.cant), 0).toFixed(2);
        subtotal.innerHTML = `${valorSubTotal}`
    });

    botonMas.addEventListener("click", () => {
        if (producto.cant < producto.stock) {
            producto.cant++;
        }
        let cantidadElement = carC.querySelector("p");
        cantidadElement.textContent = producto.cant.toString();
        
        let cantidadPrecio = carT.querySelector("p");
        precioTotal = parseFloat(producto.precio * producto.cant).toFixed(2);
        cantidadPrecio.textContent = `${producto.divisa} ${precioTotal}`;

        let subtotal = document.getElementById('subTotal');
        let valorSubTotal = carrito.reduce((acum, prod) => acum + parseFloat(prod.precio * prod.cant), 0).toFixed(2);
        subtotal.innerHTML = `${valorSubTotal}` 
    });

    /*
    const btnEliminar = contCar.querySelector('#quitarProd');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            eliminarProductoDelCarrito(producto, contCar);
            actualizarSubtotal();
        });
    }
    */

    let carT = document.createElement("div");
    carT.id = 'total';
    let precioTotal = parseFloat(producto.precio * producto.cant).toFixed(2);
    carT.innerHTML = `
        <p>${producto.divisa} ${precioTotal}</p>
    `;
    contCar.appendChild(carT);


    CAR.appendChild(contCar)
});



let auxDescuento = false;
const arregloDescuento = [
    { nombre: 'newuser23', usado: false, desc: 10},
    { nombre: '23plantsLOVE', usado: false, desc: 5 },
]

let totalDesc = 0;
let fechaActual = new Date();
let diaActual = fechaActual.getDay();

function obtenerNombreDia(numeroDia) {
    let diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[numeroDia];
}
function obtenerNombreMes(numeroMes) {
    let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[numeroMes];
}
function fechaEntrega(espera) {
    let fechaActual1 = new Date();
    fechaActual1.setDate(fechaActual1.getDate() + espera);
    let dia = fechaActual1.getDate();
    let mes = fechaActual1.getMonth();
    let nombremes = obtenerNombreMes(fechaActual1.getMonth())
    let nombreDia = obtenerNombreDia(fechaActual1.getDay());
    return `${nombreDia} ${dia}, de ${nombremes}`;
}

//Descuentos del carrito
const formCupones = document.getElementById('form-cupones');
formCupones.addEventListener('submit', (e) => {
    e.preventDefault();
    let ctrPrincipal = document.getElementById('car__pedido-resumen__descuentos');
    let section = document.createElement("section");
    let cupon = document.getElementById('cupon').value;
    const ind = arregloDescuento.findIndex((desc) => desc.nombre == cupon);
    if (arregloDescuento.some((desc) => desc.nombre == cupon)) {
        if (arregloDescuento[ind].usado == false) {
            if (!auxDescuento) {
                let divDescuento = document.createElement("div");
                divDescuento.classList.add('car__pedido-resumen--stretch');
                divDescuento.innerHTML = `
                <p class="car__pedido-resumen--normal">Descuento:</p>
                <p id="descuento-total">-${totalDesc}%</p>
            `;
                ctrPrincipal.appendChild(divDescuento);
                auxDescuento = true;
            }
            let divCupon = document.createElement("div");
            divCupon.classList.add('tipo-descuento');
            divCupon.innerHTML = `
                <p class="dtitle">Codigo de cupon: ${arregloDescuento[ind].nombre}</p>
                <p class="dsubtitle">-${arregloDescuento[ind].desc}%</p>
            `;
            let tdesafter = document.getElementById('descuento-total');
            totalDesc = totalDesc + arregloDescuento[ind].desc;
            tdesafter.innerHTML = `-${totalDesc}%`;
            section.appendChild(divCupon);
            ctrPrincipal.appendChild(section);

            arregloDescuento[ind].usado = true;
        }
    }
})

if (diaActual == 5) { //BLACK FRIDAY
    totalDesc = 35;
    let ctrPrincipal = document.getElementById('car__pedido-resumen__descuentos');
    let section = document.createElement("section");
    let divDescuento = document.createElement("div");
    divDescuento.classList.add('car__pedido-resumen--stretch');
    divDescuento.innerHTML = `
                <p class="car__pedido-resumen--normal">Descuento:</p>
                <p id="descuento-total">-${totalDesc}%</p>
            `;
    ctrPrincipal.appendChild(divDescuento);
    auxDescuento = true;

    let divCuponFRIDAY = document.createElement("div");
    divCuponFRIDAY.classList.add('tipo-descuento');
    divCuponFRIDAY.innerHTML = `
            <p class="dtitle">Black friday</p>
            <p class="dsubtitle">-35%</p>
        `;
    section.appendChild(divCuponFRIDAY);
    ctrPrincipal.appendChild(section);
}

//ENVIOS
const envioFree = document.getElementById('envio-free');
const envioExpress = document.getElementById('envio-express');

if (envioFree.checked) {
    let envio = document.getElementById('envio');
    envio.innerHTML = 'Gratuito'
    envio.style.color = '#1d8f6d';
}

envioFree.addEventListener('click', (e) => {
    let envio = document.getElementById('envio');
    envio.innerHTML = 'Gratuito'
    envio.style.color = '#1d8f6d';
})

envioExpress.addEventListener('click', (e) => {
    let envio = document.getElementById('envio');
    envio.innerHTML = 'UYU 350'
    envio.style.color = 'black';
})

diaEntregaFree = document.getElementById('entregaFree');
diaEntregaFree.innerHTML = `
    Sin costo, tu pedido será entregado: ${fechaEntrega(8)}
`;
diaEntregaExpress = document.getElementById('entregaExpress');
diaEntregaExpress.innerHTML = `
    UYU 350, tu pedido será entregado: ${fechaEntrega(3)}
`;

