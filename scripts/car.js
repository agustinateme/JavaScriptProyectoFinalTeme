let carritoData = localStorage.getItem('CARRITO:');
let datosFav = localStorage.getItem('FAVORITOS:');

if (!datosFav) {
    const arregloFav = [];
    datosFav = JSON.stringify(arregloFav);
    localStorage.setItem('FAVORITOS:', datosFav);
}

let favoritos = JSON.parse(datosFav);

if (!carritoData) {
    const arreglo = [];
    carritoData = JSON.stringify(arreglo);
    localStorage.setItem('CARRITO:', carritoData); // Corregir la clave aquí
}

let carrito = JSON.parse(carritoData);

let CAR = document.getElementById('ContCarrito');

function mostrarCarrito(carrito) {
    
    carrito.forEach((producto) => {
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
            <section class="fav-carr">
                <p>${producto.nombre}</p>
                 <label for="fav-${producto.id}" class="productos__fav">
                    <input type="checkbox" id="fav-${producto.id}" class="prod-fav" value="favorito" ${favoritos.includes(producto.id) ? 'checked' : ''}>
                    <span class="heart">&#x2764;</span>
                </label>
            </section>
        `;
        contCar.appendChild(carNyF);

        let carPre = document.createElement("div");
        carPre.id = 'car-precio'
        carPre.innerHTML = `
            <p>${producto.divisa} ${producto.precio}</p>
        `;
        contCar.appendChild(carPre);

        let carC = document.createElement("div");
        carC.id = 'car-cantc'
        carC.innerHTML = `
            <button id="boton-menos">-</button>
                <div>
                    <p>${producto.cant}</p>
                </div>
            <button id="boton-mas">+</button>
        `;
        contCar.appendChild(carC);

        let carT = document.createElement("div");
        carT.id = 'total';
        let precioTotal = parseFloat(producto.precio * producto.cant).toFixed(2);
        carT.innerHTML = `
            <p>${producto.divisa} ${precioTotal}</p>
        `;
        contCar.appendChild(carT);
        CAR.appendChild(contCar);


        let botonQuitar = document.createElement("button");
        botonQuitar.id = `quitar${producto.id}`;
        botonQuitar.classList.add('quitarCarrito')
        botonQuitar.innerHTML = "&#9986;";
        carimg.appendChild(botonQuitar);

        botonQuitar.addEventListener("click", () => {
            const productoIndex = carrito.findIndex((p) => p.id === producto.id);
            if (productoIndex !== -1) {
                carrito.splice(productoIndex, 1);
                carritoData = JSON.stringify(carrito);
                localStorage.setItem('CARRITO:', carritoData);
                contCar.remove(); // Elimina el elemento visualmente
            }
            subtotal = carrito.reduce((acc, el) => acc + (el.precio) * el.cant, 0);
            subtotal = subtotal.toFixed(2)
            let contotal = document.getElementById('subTotal');
            contotal.innerHTML = `${subtotal}`;
        });


        // Obtén las referencias a los botones "boton-menos" y "boton-mas" dentro del alcance actual
        const botonMenos = carC.querySelector("#boton-menos");
        const botonMas = carC.querySelector("#boton-mas");

        botonMenos.addEventListener("click", () => {
            if (producto.cant > 1) {
                producto.cant--;
                carritoData = JSON.stringify(carrito);
                localStorage.setItem('CARRITO:', carritoData);
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
                carritoData = JSON.stringify(carrito);
                localStorage.setItem('CARRITO:', carritoData);
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
    });
    carritoData = JSON.stringify(carrito);
    localStorage.setItem('CARRITO:', carritoData);
}

subtotal = carrito.reduce((acc, el) => acc + (el.precio) * el.cant, 0);
subtotal = subtotal.toFixed(2)
let contotal = document.getElementById('subTotal');
contotal.innerHTML = `${subtotal}`;

mostrarCarrito(carrito)




let paso1 = document.getElementById('buy');
paso1.addEventListener('click', () => {
    window.location.href = './checkout.html';
})