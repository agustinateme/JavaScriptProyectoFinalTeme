//TENGO QUE IMPORTARME EL CARRITO
const CarritoData = localStorage.getItem('CARRITO:'); //obtengo la "base de datos" del localstorage
let carrito = JSON.parse(CarritoData);
console.log(carrito);
let CAR = document.getElementById('ContCarrito');

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

    
    const btnEliminar = contCar.querySelector('#quitarProd');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            eliminarProductoDelCarrito(producto, contCar);
            actualizarSubtotal();
        });
    }

    let carT = document.createElement("div");
    carT.id = 'total';
    let precioTotal = parseFloat(producto.precio * producto.cant).toFixed(2);
    carT.innerHTML = `
        <p>${producto.divisa} ${precioTotal}</p>
    `;
    contCar.appendChild(carT);
    CAR.appendChild(contCar)
});

let paso1 = document.getElementById('buy');
paso1.addEventListener('click', () => {
    window.location.href = './checkout.html';
})