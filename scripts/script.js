let baseDeDatosPROD = localStorage.getItem('CARRITO:'); // Obtener los datos almacenados en el localStorage

if (!baseDeDatosPROD) {
    // Si no existe una base de datos, creo una nueva
    const arreglo = [];
    baseDeDatosPROD = JSON.stringify(arreglo);
    localStorage.setItem('CARRITO:', baseDeDatosPROD);
}

//Arreglos de productos sin IVA
const productosSinIVA = [
    { nombre: 'bonsai', id: 1, divisa: 'UYU', precio: 2500, cant: 0, stock: 27, imgA: '../img/productos/1a.jpg', imgB: '../img/productos/1b.jpg', fav: false },
    { nombre: 'lirio japonés', id: 2, divisa: 'UYU', precio: 859, cant: 0, stock: 35, imgA: '../img/productos/2a.jpg', imgB: '../img/productos/2b.jpg', fav: false },
    { nombre: 'azalea', id: 3, divisa: 'UYU', precio: 429, cant: 0, stock: 15, imgA: '../img/productos/3a.jpg', imgB: '../img/productos/3b.jpg', fav: false },
    { nombre: 'sakura', id: 4, divisa: 'UYU', precio: 1590, cant: 0, stock: 10, imgA: '../img/productos/4a.jpg', imgB: '../img/productos/4b.jpg', fav: false },
    { nombre: 'ginkgo', id: 5, divisa: 'UYU', precio: 2399, cant: 0, stock: 20, imgA: '../img/productos/5a.jpg', imgB: '../img/productos/5b.jpg', fav: false },
    { nombre: 'fujibakama ', id: 6, divisa: 'UYU', precio: 599, cant: 0, stock: 12, imgA: '../img/productos/6a.jpg', imgB: '../img/productos/6b.jpg', fav: false },
    { nombre: 'kiku', id: 7, divisa: 'UYU', precio: 3499, cant: 0, stock: 4, imgA: '../img/productos/7a.jpg', imgB: '../img/productos/7b.jpg', fav: false },
    { nombre: 'nadeshiko', id: 8, divisa: 'UYU', precio: 1990, cant: 0, stock: 3, imgA: '../img/productos/8a.jpg', imgB: '../img/productos/8b.jpg', fav: false },
];

let carrito = [];

//Arreglos de productos con IVA incluído
const IVA_FACTOR = 1.22;
const productosConIVA = productosSinIVA.map((prod) => {
    return {
        nombre: prod.nombre,
        id: prod.id,
        divisa: prod.divisa,
        precio: parseFloat((prod.precio * IVA_FACTOR).toFixed(2)),
        cant: prod.cant,
        stock: prod.stock,
        imgA: prod.imgA,
        imgB: prod.imgB,
        fav: prod.fav,
    };
});

//Arreglos de objetos divisa
const divisa = [
    { codigo: 'USD', valorOrigen: 38.68, codigoDestino: 'UYU', valorDestino: 1},
    { codigo: 'ARS', valorOrigen: 0.16, codigoDestino: 'UYU', valorDestino: 1},
    { codigo: 'BRL', valorOrigen: 7.76, codigoDestino: 'UYU', valorDestino: 1},
    {codigoOrigen: 'USD', valorOrigen: 38.68, codigoDestino: 'ARS', valorDestino: 0.16},
    {codigoOrigen: 'USD', valorOrigen: 38.68, codigoDestino: 'BRL', valorDestino: 7.76},
    {codigoOrigen: 'ARS', valorOrigen: 0.16, codigoDestino: 'USD', valorDestino: 38.68},
    {codigoOrigen: 'ARS', valorOrigen: 0.16, codigoDestino: 'BRL', valorDestino: 7.76},
    {codigoOrigen: 'BRL', valorOrigen: 7.76, codigoDestino: 'USD', valorDestino: 38.68},
    {codigoOrigen: 'BRL', valorOrigen: 7.76, codigoDestino: 'ARS', valorDestino: 0.16},
];

//función que retorna true si hay stock
function hayStock(arreglo, id) {
    id = id - 1;
    return arreglo[id].cant < arreglo[id].stock;
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

//Función que retorna un arreglo filtrado de menor a mayor
//recibe el arreglo que quiero filtrar
function menorAMayor(arreglo) {
    const pOrdMenor = arreglo.map((prod) => prod);
    pOrdMenor.sort((a, b) => {
        if (a.precio > b.precio) {
            return 1;
        }
        if (a.precio < b.precio) {
            return -1;
        }
        return 0;
    });
    return pOrdMenor;
}

//Función que retorna un arreglo filtrado de mayor a menor
//recibe el arreglo que quiero filtrar
function mayorAMenor(arreglo) {
    const pOrdMayor = arreglo.map((prod) => prod);
    pOrdMayor.sort((a, b) => {
        if (b.precio > a.precio) {
            return 1;
        }
        if (b.precio < a.precio) {
            return -1;
        }
        return 0;
    });
    return pOrdMayor;
}

//Función que recibe un arreglo y devuelve otro filtrado entre dos precios
function entrePrecios(arreglo, pMenor, pMayor) {
    const aFiltrado = arreglo.filter((prod) => prod.precio >= pMenor && prod.precio <= pMayor);
    if (aFiltrado.length == 0) {
        console.log(`No hay productos en el rango de precios dado`);
    }
    return aFiltrado;
}

//Función que recibe un arreglo y devuelve otro filtrado por nombre (buscador)
function buscador(arreglo, search) {
    const aFiltrado = arreglo.filter((prod) =>
        prod.nombre.includes(search.toLowerCase())
    );
    return aFiltrado;
}

//Procemiento para agregar un producto al carrito recibe un arreglo y un identificador del producto a agregar
//se ejecuta solo si hay stock del elemento a agregar
function agregar(arreglo, id) {
    id = id - 1;
    if (carrito.some((prod) => prod.id == id + 1)) {
        const index = carrito.findIndex((prod) => prod.id == id + 1);
        carrito[index].cant++;
    } else {
        carrito.push({ ...arreglo[id], cant: 1 });
    }
    productosConIVA[id].cant++;
}

//Procedimiento que elimina un elemento del carrito
function eliminar(id) {
    id = id - 1;
    const index = carrito.findIndex((prod) => prod.id === id + 1);
    if (index !== -1) {
        if (carrito[index].cant > 1) {
            carrito[index].cant--;
        } else {
            carrito.splice(index, 1);
        }
    }
    productosConIVA[id].cant--;
}



//funcion que muestra los productos en la página productos
function mostrarProductos(arreglo) {
    //accedo al id del contenedor principal
    let contenedorProductos = document.getElementById('productos-container');
    arreglo.forEach(producto => {

        //creo un contenedor div para cada producto
        let cartaProducto = document.createElement('div');

        //agrego la clase a cada contenedor
        cartaProducto.classList.add('producto-card');

        //creo el contenido que tendra cada contenedor de producto
        cartaProducto.innerHTML = `
            <img class="productos__img" src="${producto.imgA}" data-hover="${producto.imgB}">
            <h2 class = 'productos__titulo'>${producto.nombre}</h2>
            <p class = 'productos__precio'>${producto.divisa} ${producto.precio}</p>
            <p class="productos__stock">Stock: ${producto.stock - producto.cant}</p>
            <button class = 'productos__btn'>COMPRAR</button>
        `;

        //agrego los contenedores de los productos al contenedor principal
        contenedorProductos.appendChild(cartaProducto);

        //cada vez que se clickea un botón de compra se agrega el producto al carrito
        let botonComprar = cartaProducto.querySelector('.productos__btn');
        botonComprar.addEventListener('click', () => {
            //Con el evento click agrego el producto al carrito si tengo stock disponible, si no lo hay no hago nada
            if (hayStock(productosConIVA, producto.id)) {
                agregar(productosConIVA, producto.id);
                const stockElement = cartaProducto.querySelector('.productos__stock');
                stockElement.textContent = `Stock: ${producto.stock - producto.cant}`;

                baseDeDatosPROD = JSON.stringify(carrito);
                localStorage.setItem('CARRITO:', baseDeDatosPROD);
            }
        });

        // eventos de mouse para cada imagen de producto
        let img = cartaProducto.querySelector('.productos__img');
        let originalSrc = img.src;
        let hoverSrc = img.getAttribute('data-hover');

        img.addEventListener('mouseover', function () {
            img.src = hoverSrc;
        });

        img.addEventListener('mouseout', function () {
            img.src = originalSrc;
        });
    });
}

// función para limpiar los productos mostrados en la página
function limpiarProductos() {
    let contenedorProductos = document.getElementById('productos-container');
    while (contenedorProductos.firstChild) {
        contenedorProductos.removeChild(contenedorProductos.firstChild);
    }
}

mostrarProductos(productosConIVA)



let formBusqueda = document.getElementById('search-form');
formBusqueda.addEventListener('submit', (e) => {
    e.preventDefault();
    let buscarnombre = document.getElementById('searchInput').value;
    let encontrado = buscador(productosConIVA, buscarnombre);

    //limpiar productos antes de mostrar los nuevos resultados
    limpiarProductos();
    mostrarProductos(encontrado);
});

let ordenMenor = document.getElementById('menorA');
ordenMenor.addEventListener('click', (e) => {
    let encontrado = menorAMayor(productosConIVA);
    limpiarProductos();
    mostrarProductos(encontrado);
});

let ordenMayor = document.getElementById('mayorA');
ordenMayor.addEventListener('click', (e) => {
    let encontrado = mayorAMenor(productosConIVA);
    limpiarProductos();
    mostrarProductos(encontrado);
});


let entre2precios = document.getElementById('entrePrecios');
entre2precios.addEventListener('click', (e) => {
    e.preventDefault();
    let precioInferior = document.getElementById('pInf').value;
    let precioSuperior = document.getElementById('pSup').value;

    let encontrado = entrePrecios(productosConIVA, precioInferior, precioSuperior);

    //limpiar productos antes de mostrar los nuevos resultados
    limpiarProductos();
    mostrarProductos(encontrado);
});











/*
var fechaActual = new Date();
console.log(fechaActual);
// Obtener el número del día actual (0: domingo, 1: lunes, ..., 6: sábado)
var diaActual = fechaActual.getDay();

if (diaActual === 5) {
    //5 equivale al día viernes
    //si es viernes aplico descuento de black friday (luego debo expecificar los descuentos aplicados)
}
*/

