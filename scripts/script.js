let baseDeDatosCar = localStorage.getItem('CARRITO:'); //Obtener los datos del carrito del localStorage
let baseDeDatosFav = localStorage.getItem('FAVORITOS:'); //Obtener los datos de favoritos del localStorage

let carrito = baseDeDatosCar ? JSON.parse(baseDeDatosCar) : [];
let favoritos = baseDeDatosFav ? JSON.parse(baseDeDatosFav) : [];

//Función asincrona
const productos = async () => {
    const resp = await fetch('../data/productos.json');
    const data = await resp.json();
    const nuevo = agregarIVA(data);
    mostrarProductos(nuevo, favoritos, carrito)
}

//Funcion que devuelve un arreglo con el IVA incluido en el precio
function agregarIVA(arreglo) {
    const IVA_FACTOR = 1.22;
    const productosConIVA = arreglo.map((prod) => {
        return {
            nombre: prod.nombre,
            id: prod.id,
            divisa: prod.divisa,
            precio: parseFloat((prod.precio * IVA_FACTOR).toFixed(2)),
            cant: prod.cant,
            stock: prod.stock,
            imgA: prod.imgA,
            imgB: prod.imgB,
        };
    });
    return productosConIVA;
}

//Procedimiento para actualizar el stock
function actualizarStock(arreglo) {
    const productosDOM = document.querySelectorAll('.productos__stock');
    arreglo.forEach((producto, index) => {
        const stock = producto.stock - producto.cant;
        productosDOM[index].textContent = `Stock: ${stock}`;
    });
}

function actualizarCantidadesCarrito(arreglo, car) {
    car.forEach((item) => {
        let productoEncontrado = arreglo.find((prod) => prod.id == item.id);
        if (productoEncontrado) {
            productoEncontrado.cant = item.cant;
        }
    });
}

function agregarACarrito(arreglo, id, car) {
    let ind = arreglo.findIndex((prod) => prod.id == id);
    if (hayStock(arreglo, ind)) {
        if (car.some((prod) => prod.id == id)) {
            car[car.findIndex((prod) => prod.id == id)].cant++;
        } else {
            arreglo[ind].cant++;
            car.push(arreglo[ind]);
        }

        baseDeDatosCar = JSON.stringify(car);
        localStorage.setItem('CARRITO:', baseDeDatosCar);
        actualizarCantidadesCarrito(arreglo, car);
        actualizarStock(arreglo); // Actualizar el stock en el DOM
    }
}

function eliminarDeCarrito(arreglo, id, car) {
    if (hayStock(car, id)) {
        let index = car.findIndex((prod) => prod.id == id);
        if (car[index].cant > 1) {
            car[index].cant--;
        } else {
            car.splice(index, 1);
        }
        arreglo[id].cant--;

        baseDeDatosCar = JSON.stringify(car);
        localStorage.setItem('CARRITO:', baseDeDatosCar);
        actualizarCantidadesCarrito(arreglo, car);
        actualizarStock(arreglo); // Actualizar el stock en el DOM
    }
}

//Procedimiento para agregar un producto a favoritos
function agregarAFavoritos(arreglo, id, fav) {
    let agregar = arreglo.map((prod) => {
        return {
            nombre: prod.nombre,
            id: prod.id,
            divisa: prod.divisa,
            precio: prod.precio,
            imgA: prod.imgA,
            imgB: prod.imgB,
        }
    })
    let ind = agregar.findIndex((prod) => prod.id == id);
    fav.push(agregar[ind]);
    baseDeDatosFav = JSON.stringify(fav);
    localStorage.setItem('FAVORITOS:', baseDeDatosFav);
}

//Procedimiento para eliminar un producto de favoritos
function eliminarFavorito(id, fav) {
    let ind = fav.findIndex((prod) => prod.id == id);
    fav.splice(ind, 1);
    baseDeDatosFav = JSON.stringify(fav);
    localStorage.setItem('FAVORITOS:', baseDeDatosFav);
}

//Funcion que verifica si un producto está en favoritos
function existeFav(id, fav) {
    return fav.some((prod) => prod.id === id);
}

//Función que retorna true si hay stock de un producto, false en caso contrario
function hayStock(arreglo, id) {
    return arreglo[id].cant < arreglo[id].stock;
}

//Función que retorna un arreglo filtrado de menor a mayor
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
        prod.nombre.toLowerCase().includes(search.toLowerCase())
    );
    return aFiltrado;
}

function botonCompra(cartaProducto, arreglo, id, car) {
    //cada vez que se clickea un botón de compra se agrega el producto al carrito
    let botonComprar = cartaProducto.querySelector('.productos__btn');
    botonComprar.addEventListener('click', () => {
        //Con el evento click agrego el producto al carrito si tengo stock disponible, si no lo hay no hago nada
        agregarACarrito(arreglo, id, car);
    });
}

function actualizarFAV(cartaProducto, arreglo, id, fav) {
    // eventos de cambio para cada checkbox de favoritos
    let checkboxFav = cartaProducto.querySelector('.prod-fav');
    checkboxFav.addEventListener('change', () => {
        if (checkboxFav.checked) {
            agregarAFavoritos(arreglo, id, fav);
        } else {
            eliminarFavorito(id, fav);
        }
    });
}

function cambiarImagen(cartaProducto) {
    // eventos de mouse para cada imagen de producto
    let img = cartaProducto.querySelector('.productos__img');
    let originalSrc = img.src;
    let hoverSrc = img.getAttribute('data-hover');

    img.addEventListener('mouseover', () => {
        img.src = hoverSrc;
    });

    img.addEventListener('mouseout', () => {
        img.src = originalSrc;
    });
}

//Función para limpiar los productos mostrados en la página
function limpiarProductos() {
    let contenedorProductos = document.getElementById('productos-container');
    while (contenedorProductos.firstChild) {
        contenedorProductos.removeChild(contenedorProductos.firstChild);
    }
}

function filtradoBusqueda(arreglo, car) {
    let formBusqueda = document.getElementById('search-form');
    formBusqueda.addEventListener('submit', (e) => {
        e.preventDefault();
        let buscarnombre = document.getElementById('searchInput').value;
        let encontrado = buscador(arreglo, buscarnombre);

        //limpiar productos antes de mostrar los nuevos resultados
        limpiarProductos();
        mostrarProductos(encontrado, favoritos, car);
    });
}

function filtradoOrdMenor(arreglo, favoritos, car) {
    let ordenMenor = document.getElementById('menorA');
    ordenMenor.addEventListener('click', (e) => {
        let encontrado = menorAMayor(arreglo);

        //limpiar productos antes de mostrar los nuevos resultados
        limpiarProductos();
        mostrarProductos(encontrado, favoritos, car);
    });
}

function filtradoOrdMayor(arreglo, favoritos, car) {
    let ordenMayor = document.getElementById('mayorA');
    ordenMayor.addEventListener('click', (e) => {
        let encontrado = mayorAMenor(arreglo);

        //limpiar productos antes de mostrar los nuevos resultados
        limpiarProductos();
        mostrarProductos(encontrado, favoritos, car);
    });
}

function filtradoPrecios(arreglo, favoritos, car) {
    let entre2precios = document.getElementById('entrePrecios');
    entre2precios.addEventListener('click', (e) => {
        e.preventDefault();
        let precioInferior = document.getElementById('pInf').value;
        let precioSuperior = document.getElementById('pSup').value;
        let encontrado = entrePrecios(arreglo, precioInferior, precioSuperior);

        //limpiar productos antes de mostrar los nuevos resultados
        limpiarProductos();
        mostrarProductos(encontrado, favoritos, car);
    });
}

//Funcion que muestra los productos en la página productos
function mostrarProductos(arreglo, favoritos, car) {
    //accedo al id del contenedor principal
    let contenedorProductos = document.getElementById('productos-container');
    arreglo.forEach(producto => {

        //creo un contenedor div para cada producto
        let cartaProducto = document.createElement('div');
        //agrego la clase a cada contenedor
        cartaProducto.classList.add('producto-card');

        // Actualizar las cantidades del carrito en el arreglo filtrado
        actualizarCantidadesCarrito(arreglo, car)

        //creo el contenido que tendra cada contenedor de producto
        cartaProducto.innerHTML = `
            <img class="productos__img" src="${producto.imgA}" data-hover="${producto.imgB}">
            <div class="prod-t-s">
                <h2 class = "productos__titulo">${producto.nombre}</h2>
                <label for="fav-${producto.id}" class = "productos__fav">
                    <input type="checkbox" id="fav-${producto.id}" class="prod-fav" value="favorito" ${existeFav(producto.id, favoritos) ? 'checked' : ''}>
                    <span class="heart">&#x2764;</span>
                </label>
            </div>
            <p class = "productos__precio">${producto.divisa} ${producto.precio}</p>
            <p class="productos__stock">Stock: ${producto.stock - producto.cant}</p>
            <button class = 'productos__btn'>COMPRAR</button>
        `;

        //agrego los contenedores de los productos al contenedor principal
        contenedorProductos.appendChild(cartaProducto);
        botonCompra(cartaProducto, arreglo, producto.id, car);
        filtradoBusqueda(arreglo, car);
        filtradoOrdMayor(arreglo, favoritos, car);
        filtradoOrdMenor(arreglo, favoritos, car);
        filtradoPrecios(arreglo, favoritos, car);
        actualizarFAV(cartaProducto, arreglo, producto.id, favoritos);
        cambiarImagen(cartaProducto);
    });
}

productos()