let baseDeDatosFav = localStorage.getItem('FAVORITOS:'); //Obtener los datos de favoritos del localStorage
let favoritos = [];
if (!baseDeDatosFav) {
    const arregloFav = [];
    baseDeDatosFav = JSON.stringify(arregloFav);
    localStorage.setItem('FAVORITOS:', baseDeDatosFav);
}
else {
    favoritos = JSON.parse(baseDeDatosFav); //Parsear los datos almacenados en el localStorage
}

function mostrarProductos(arreglo, favoritos) {
    //accedo al id del contenedor principal
    let contenedorProductos = document.getElementById('productos-container');
    
    if (arreglo.length === 0) {
        //creo un contenedor div para cada producto
        let cartaProducto = document.createElement('div');

        //agrego la clase a cada contenedor
        cartaProducto.classList.add('producto-card');

        //creo el contenido que tendra cada contenedor de producto
        cartaProducto.innerHTML = `
            <p> No hay nada guardado en la lista de deseos </p>
        `;
        //agrego los contenedores de los productos al contenedor principal
        contenedorProductos.appendChild(cartaProducto);
    }

    arreglo.forEach(producto => {

        //creo un contenedor div para cada producto
        let cartaProducto = document.createElement('div');

        //agrego la clase a cada contenedor
        cartaProducto.classList.add('producto-card');

        //creo el contenido que tendra cada contenedor de producto
        cartaProducto.innerHTML = `
            <img class="productos__img" src="${producto.imgA}" data-hover="${producto.imgB}">
            <div class="prod-t-sFAV">
                <div class="fav-nombreHeart">
                    <h2 class = "productos__titulo">${producto.nombre}</h2>
                    <label for="fav-${producto.id}" class = "productos__fav">
                        <input type="checkbox" id="fav-${producto.id}" class="prod-fav" value="favorito" checked>
                        <span class="heart"></span>
                    </label>
                </div>
                <div class="fav-precioCant">
                    <p class = "productos__precio">${producto.divisa} ${producto.precio}</p>
                </div>
                
            </div>
        `;
        //agrego los contenedores de los productos al contenedor principal
        contenedorProductos.appendChild(cartaProducto);
        actualizarFAV(cartaProducto, producto.id, favoritos);
        cambiarImagen(cartaProducto);
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

//Procedimiento para eliminar un producto de favoritos
function eliminarFavorito(id, fav) {
    let ind = fav.findIndex((prod) => prod.id == id);
    fav.splice(ind, 1);
    baseDeDatosFav = JSON.stringify(fav);
    localStorage.setItem('FAVORITOS:', baseDeDatosFav);
}

//Función para limpiar los productos mostrados en la página
function limpiarProductos() {
    let contenedorProductos = document.getElementById('productos-container');
    while (contenedorProductos.firstChild) {
        contenedorProductos.removeChild(contenedorProductos.firstChild);
    }
}

function actualizarFAV(cartaProducto, id, fav) {
    // eventos de cambio para cada checkbox de favoritos
    let checkboxFav = cartaProducto.querySelector('.prod-fav');
    checkboxFav.addEventListener('change', () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "El producto se eliminará de tus favoritos",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#23b98c',
            cancelButtonColor: '#FE654F',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarFavorito(id, fav);
                limpiarProductos()
                mostrarProductos(favoritos, favoritos);
                Swal.fire(
                    '¡Eliminado!',
                    `El producto a sido eliminado`,
                    'success'
                )
            }
            limpiarProductos()
            mostrarProductos(favoritos, favoritos);
        });
    });
}

mostrarProductos(favoritos, favoritos);