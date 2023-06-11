//TENGO QUE IMPORTARME EL CARRITO
const CarritoData = localStorage.getItem('CARRITO:'); //obtengo la "base de datos" del localstorage
let carrito = JSON.parse(CarritoData);
console.log(carrito);
let CAR = document.getElementById('ContCarrito');

let totalDesc = 0;
let fechaActual = new Date();
let diaActual = fechaActual.getDay();

let auxDescuento = false;
const arregloDescuento = [
    { nombre: 'newuser23', usado: false, desc: 10 },
    { nombre: '23plantsLOVE', usado: false, desc: 5 },
]
//Arreglos de objetos divisa
const divisa = [
    { codigo: 'USD', valor: 38.6},
    { codigo: 'ARS', valor: 0.16},
    { codigo: 'BRL', valor: 7.76},
    { codigo: 'UYU', valor: 1},
];

//Función que retorna un arreglo con el precio modificado según la divisa
function conversor(arreglo, divisa) {
    const conversion = arreglo.map((prod) => {
        return {
            nombre: prod.nombre,
            id: prod.id,
            divisa: divisa.codigo,
            precio: parseFloat((prod.precio / divisa.valor).toFixed(2)),
            cant: prod.cant,
            stock: prod.stock,
            imgA: prod.imgA,
            imgB: prod.imgB,
        };
    });
    return conversion;
}

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

function mostrarCarrito(carrito) {
    carrito.forEach(producto => {
        let subtotal = document.getElementById('subTotal');
        let valorSubTotal = carrito.reduce((acum, prod) => acum + parseFloat(prod.precio * prod.cant), 0).toFixed(2);
        subtotal.innerHTML = `${producto.divisa} ${valorSubTotal}`

        const contCar = document.createElement("div");
        contCar.id = 'car__productos-elementos';

        let carimg = document.createElement("div");
        carimg.id = 'car-img'
        carimg.innerHTML = `
        <img src="${producto.imgA}" alt="${producto.nombre}">
    `;
        contCar.appendChild(carimg);

        let carNyF = document.createElement("div");
        carNyF.id = 'car-nombreyfav'
        carNyF.innerHTML = `
        <p>${producto.nombre}</p>
    `;
        contCar.appendChild(carNyF);

        let carPre = document.createElement("div");
        carPre.id = 'car-precio'
        carPre.innerHTML = `
       <p>${producto.divisa} ${producto.precio}</p>
    `;
        contCar.appendChild(carPre);

        let carC = document.createElement("div");
        carC.id = 'car-cant1'
        carC.innerHTML = `
            <div>
                <p>X ${producto.cant}</p>
            </div>

    `;
        contCar.appendChild(carC);

        let carT = document.createElement("div");
        carT.id = 'total';
        let precioTotal = parseFloat(producto.precio * producto.cant).toFixed(2);
        carT.innerHTML = `
        <p>${producto.divisa} ${precioTotal}</p>
    `;
        contCar.appendChild(carT);
        CAR.appendChild(contCar)
    });
}

const contEnvio = document.getElementById('car__envioYpago');
let tituloenvio = document.createElement("h2");
tituloenvio.innerHTML = `
    Seleccione tipo de envío
`;
contEnvio.appendChild(tituloenvio);
let divenvio = document.createElement("div")
divenvio.classList.add('envio');
divenvio.innerHTML = `
    <input type="radio" name="envio" id="envio-free" class="envio--radio" checked>
    <p class="envio--titulo">Envío gratuito</p>
    <div class="envio--inline">
        <p class="envio--subtitulo" id="entregaFree"></p>
    </div>
`;
contEnvio.appendChild(divenvio);

let divenvio2 = document.createElement("div")
divenvio2.classList.add('envio');
divenvio2.innerHTML = `
    <input type="radio" name="envio" id="envio-express" class="envio--radio">
    <p class="envio--titulo">Envío rápido</p>
    <div class="envio--inline">
        <p class="envio--subtitulo" id="entregaExpress"></p>
    </div>
`;
contEnvio.appendChild(divenvio2);

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

            const descuentosUsados = arregloDescuento.filter(descuento => descuento.usado);
            // Obtener la suma de los descuentos
            const sumaDescuentos = descuentosUsados.reduce((acumulador, descuento) => acumulador + descuento.desc, 0);
            let totalP = document.getElementById('total');


            let valorSubTotal = carrito.reduce((acum, prod) => acum + parseFloat(prod.precio * prod.cant), 0).toFixed(2);
            const precioConDescuento = valorSubTotal * (1 - sumaDescuentos / 100);
            console.log(precioConDescuento)
            totalP.innerHTML = `${precioConDescuento}`
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


function obtenerPosicionDivisaSeleccionada() {
    const divisaSeleccionada = document.querySelector('input[name="divisaElegida"]:checked');
    const idSeleccionado = divisaSeleccionada.id;
    // Buscar la posición en el arreglo divisa
    const posicion = divisa.findIndex(item => item.codigo === idSeleccionado);
    return posicion;
}

function borrarElementosHijos(elementoPadre) {
    while (elementoPadre.firstChild) {
        elementoPadre.removeChild(elementoPadre.firstChild);
    }
}

let selecc = document.getElementsByClassName('choose-divisa');
for (let i = 0; i < selecc.length; i++) {
    selecc[i].addEventListener('click', () => {
        let pos = obtenerPosicionDivisaSeleccionada();
        let div = divisa[pos];
        let carritoDos = conversor(carrito, div);

        // Obtener el elemento padre donde se muestran los elementos del carrito
        let carritoElementoPadre = document.getElementById('ContCarrito');

        // Borrar los elementos anteriores del carrito
        borrarElementosHijos(carritoElementoPadre);

        // Mostrar el carrito actualizado
        mostrarCarrito(carritoDos);
    });
}
let divisaPred = divisa[3];
mostrarCarrito(carrito, divisaPred);