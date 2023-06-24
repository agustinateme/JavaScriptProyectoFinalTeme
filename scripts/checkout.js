let sesionUser = localStorage.getItem('sesionIniciada')

if (!sesionUser) {
    const arreglo = [];
    sesionUser = JSON.stringify(arreglo);
    localStorage.setItem('sesionIniciada', sesionUser);
}

let userLog = JSON.parse(sesionUser);

//TENGO QUE IMPORTARME EL CARRITO
let CarritoData = localStorage.getItem('CARRITO:'); //obtengo la "base de datos" del localstorage
let carrito = JSON.parse(CarritoData);
let CAR = document.getElementById('ContCarrito');

let valorTotal = carrito.reduce((acum, prod) => acum + parseFloat(prod.precio * prod.cant), 0).toFixed(2);

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

//ENVIOS
const envioFree = document.getElementById('envio-free');
const envioExpress = document.getElementById('envio-express');

if (envioFree.checked) {
    let envio = document.getElementById('envio');
    envio.innerHTML = 'Gratuito'
    envio.style.color = '#1d8f6d';
}



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

function valorDesc(valor) {
    valor = valor - ((valor * totalDesc) / 100);
    return valor;
}

let envioactual = 0; 

function cambiarPrecios(precioEnvio) {
    let Ptotal = document.getElementById('total1');
    let v0 = parseFloat(valorTotal) + precioEnvio;
    let v1 = valorDesc(v0).toFixed(2);
    v1 = parseFloat((v1 / divisaPred.valor).toFixed(2));
    Ptotal.innerHTML = `${divisaPred.codigo} ${v1}`;
    envioActualizado(precioEnvio)

    let stotal = document.getElementById('subTotal');
    let vs0 = parseFloat(valorTotal);
    let vs1 = ((vs0 / divisaPred.valor).toFixed(2));
    stotal.innerHTML = `${divisaPred.codigo} ${vs1}`
}

function reiniciarPrecios() {
    let Ptotal = document.getElementById('total1');
    Ptotal.innerHTML = ``;
    let stotal = document.getElementById('subTotal');
    stotal.innerHTML = ``;
    let cont = document.getElementById('car__pedido-resumen__descuentos');
    borrarElementosHijos(cont);
}


function mostrarCarrito(carrito, divisa) {
    carrito.forEach(producto => {
        let cod = divisa.codigo;
        let div = divisa.valor;
        let price = parseFloat(producto.precio / div).toFixed(2);
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
       <p>${cod} ${price}</p>
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
        let precioFinal = (precioTotal / div).toFixed(2);
        carT.innerHTML = `
        <p>${cod} ${precioFinal}</p>
    `;
        contCar.appendChild(carT);
        CAR.appendChild(contCar)
    });
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

            cambiarPrecios(envioactual)
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

function envioActualizado(coso) {
    let envio = document.getElementById('envio');
    if (coso === 350) {
        envio.innerHTML = `${divisaPred.codigo} ${parseFloat((coso / divisaPred.valor).toFixed(2))}`;
    }
    else if(coso === 0) {
        envio.innerHTML = 'Gratuito'
        envio.style.color = '#1d8f6d';
    }
}

envioExpress.addEventListener('click', (e) => {
    borrarElementosHijos(diaEntregaFree);
    let coso = 350;
    envioActualizado(coso)
    envio.style.color = 'black';
    diaEntregaExpress = document.getElementById('entregaExpress');
    diaEntregaExpress.innerHTML = `
    UYU 350, tu pedido será entregado: ${fechaEntrega(3)}
    `;
    let precioEnvioExpress = 350;
    envioactual = 350;
    cambiarPrecios(precioEnvioExpress);
})

envioFree.addEventListener('click', (e) => {
    borrarElementosHijos(diaEntregaExpress);
    let coso = 0;
    envioActualizado(coso)
    diaEntregaFree = document.getElementById('entregaFree');
    diaEntregaFree.innerHTML = `
    Sin costo, tu pedido será entregado: ${fechaEntrega(8)}
    `;
    let precioEnvioFree = 0;
    envioactual = 0;
    cambiarPrecios(precioEnvioFree);
})

//el gratuito está seleccionado por defecto
diaEntregaFree = document.getElementById('entregaFree');
diaEntregaFree.innerHTML = `
    Sin costo, tu pedido será entregado: ${fechaEntrega(8)}
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

        divisaPred = div;

        // Obtener el elemento padre donde se muestran los elementos del carrito
        let carritoElementoPadre = document.getElementById('ContCarrito');

        // Borrar los elementos anteriores del carrito
        borrarElementosHijos(carritoElementoPadre);

        // Mostrar el carrito actualizado
        mostrarCarrito(carrito, div);
        cambiarPrecios(envioactual)
    });
}

let buy = document.getElementById('buy');
buy.addEventListener('click', () => {
    if ((userLog.iniciada) && (carrito.length > 0)) {
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'Compra realizada con exito',
                text: '¡Gracias por su compra!',
            })
            borrarElementosHijos(CAR);
            valorTotal = 0;
            cambiarPrecios(0);
            reiniciarPrecios();
        }, 3000);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: 'Procesando compra'
        })        
        carrito.splice(0, carrito.length);
        CarritoData = JSON.stringify(carrito);
        localStorage.setItem('CARRITO:', CarritoData);
    }
    else if (!userLog.iniciada) {
        Swal.fire({
            title: '¿Quieres iniciar sesión?',
            text: "Debes iniciar sesión para comprar",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#23b98c',
            cancelButtonColor: '#FE654F',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'iniciar sesión'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    iniciada = false,
                    sesion = JSON.stringify(iniciada),
                    localStorage.setItem('sesionIniciada', sesion),
                    window.location.href = '../pages/login.html',
                )
            }
        })
    }
    else if (carrito.length <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'Agrega productos al carrito para poder comprar'
        })
    }
});

let divisaPred = divisa[3];
cambiarPrecios(envioactual)
mostrarCarrito(carrito, divisaPred);
