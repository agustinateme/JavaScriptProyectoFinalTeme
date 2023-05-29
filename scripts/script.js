//Arreglos de productos sin IVA
const productosSinIVA = [
    { nombre: 'bonsai', id: 1, divisa: 'UYU', precio: 2500, cant: 0, stock: 27 },
    { nombre: 'lirio japonés', id: 2, divisa: 'UYU', precio: 859, cant: 0, stock: 35 },
    { nombre: 'azalea', id: 3, divisa: 'UYU', precio: 429, cant: 0, stock: 15 },
    { nombre: 'sakura', id: 4, divisa: 'UYU', precio: 1590, cant: 0, stock: 10 },
    { nombre: 'ginkgo', id: 5, divisa: 'UYU', precio: 2399, cant: 0, stock: 20 },
    { nombre: 'fujibakama ', id: 6, divisa: 'UYU', precio: 599, cant: 0, stock: 12 },
    { nombre: 'kiku ', id: 7, divisa: 'UYU', precio: 3499, cant: 0, stock: 4 },
    { nombre: 'nadeshiko', id: 8, divisa: 'UYU', precio: 1990, cant: 0, stock: 3 },
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
    };
});

//Arreglos de objetos divisa
const divisa = [
    { codigo: 'USD', valor: 38.68 },
    { codigo: 'ARS', valor: 0.16 },
    { codigo: 'BRL', valor: 7.76 },
];

//función que retorna true si el carrito está vacío
function cantidadEsCero(arreglo, id) {
    id = id - 1;
    return arreglo[id].cant === 0;
}

//función que retorna true si hay stock
function hayStock(arreglo, id) {
    id = id - 1;
    return arreglo[id].cant < arreglo[id].stock;
}

//Función que retorna un arreglo con el precio modificado según la divisa
//Se le pasa un arreglo y un objeto divisa
function conversor(arreglo, divisa) {
    const conversion = arreglo.map((prod) => {
        return {
            nombre: prod.nombre,
            id: prod.id,
            divisa: divisa.codigo,
            precio: parseFloat((prod.precio / divisa.valor).toFixed(2)),
            cant: prod.cant,
            stock: prod.cant,
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
function entrePrecios(arreglo) {
    let pMenor = prompt('Ingrese precio inferior:');
    let pMayor = prompt('Ingrese precio superior:');
    const aFiltrado = arreglo.filter((prod) => prod.precio > pMenor && prod.precio < pMayor);
    if (aFiltrado.length == 0) {
        console.log(`No hay productos en el rango de precios dado`);
    }
    return aFiltrado;
}

//Función que recibe un arreglo y devuelve otro filtrado por nombre (buscador)
function buscador(arreglo) {
    search = prompt('Busqueda por nombre:');
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

//Función que devuelve el precio total de un arreglo
function precioTotal(arreglo) {
    const total = arreglo.reduce((acum, prod) => acum + parseFloat(prod.precio * prod.cant), 0).toFixed(2);
    return total;
}

//Programa que muestra id, nombre, precio y cantidad de elementos de un arreglo
function mostrarArreglo(arreglo) {
    arreglo.forEach((prod) => {
        console.log(`id ${prod.id}: ${prod.nombre} ${prod.divisa} ${prod.precio}, (agregado al carrito: ${prod.cant} producto/s)`);
    });
}

//Programa que muestra las opciones del menú interactivo
function mostrarMenu() {
    console.log('\n 1. Agregar producto al carrito \n 2. Eliminar producto del carrito \n 3. Buscador \n 4. Ordenar de menor a mayor \n 5. Ordenar de mayor a menor \n 6. Filtrar entre dos precios \n 7. Precio total \n 8. Comprar \n 9. Salir');
}


//PROGRAMA PRINCIPAL
function ejecutarPrograma() {
    let opcion = 0;
    while (opcion !== 9) {
        mostrarMenu();
        opcion = parseInt(prompt('Ingrese una opción:'));
        switch (opcion) {
            case 1:
                mostrarArreglo(productosConIVA);
                let idAgregar = parseInt(prompt('Ingrese el ID del producto a agregar:'));
                if ((idAgregar <= 8) && (idAgregar >= 1)) {
                    if (hayStock(productosConIVA, idAgregar)) {
                        agregar(productosConIVA, idAgregar);
                        console.log(`Producto ${productosConIVA[idAgregar - 1].nombre} agregado al carrito.`);
                    }
                    else {
                        console.log(`No hay stock de ${productosConIVA[idAgregar - 1].nombre}.`);
                    } 
                } else {
                    console.log('Ingrese un valor válido');
                }
                break;
            case 2:
                mostrarArreglo(productosConIVA);
                let idEliminar = parseInt(prompt('Ingrese el ID del producto a eliminar:'));
                if ((idEliminar <= 8) && (idEliminar >= 1)) {
                    if (!cantidadEsCero(productosConIVA, idEliminar)) {
                        eliminar(idEliminar);
                        console.log(`Producto ${productosConIVA[idEliminar - 1].nombre} eliminado del carrito.`);
                    }
                    else {
                        console.log(`El producto ${productosConIVA[idEliminar - 1].nombre} no está en el carrito`);
                    }
                }
                else {
                    console.log('Ingrese un valor válido');
                }
                break;
            case 3:
                mostrarArreglo(productosConIVA);
                console.log('Buscar productos por nombre:');
                let arrbuscar = buscador(productosConIVA);
                mostrarArreglo(arrbuscar);
                break;
            case 4:
                console.log('Ordenar de menor a mayor precio:');
                let arrmen = menorAMayor(productosConIVA);
                mostrarArreglo(arrmen);
                break;
            case 5:
                console.log('Ordenar de mayor a menor precio:');
                let arrmay = mayorAMenor(productosConIVA);
                mostrarArreglo(arrmay);
                break;
            case 6:
                console.log('Filtrar entre dos precios:');
                let arrfilt = entrePrecios(productosConIVA);
                mostrarArreglo(arrfilt);
                break;
            case 7:
                const precio = precioTotal(carrito);
                console.log(`El precio total del carrito es: UYU ${precio}`);
                break;
            case 8:
                console.log(`Elija en que moneda pagará: \n 1: ${divisa[0].codigo} (Dolares) \n 2: ${divisa[1].codigo} (Pesos Argentinos)\n 3: ${divisa[2].codigo} (Reales Brasileños)`);
                let idDivisa = parseInt(prompt(`Ingrese opción`)) - 1;
                if ((idDivisa <= 2) && (idDivisa >= 0)) { 
                    let carritoConvertido = conversor(carrito, divisa[idDivisa]);
                    let preciofinal = precioTotal(carritoConvertido);
                    mostrarArreglo(carritoConvertido);
                    console.log(`El total de su compra es de: ${divisa[idDivisa].codigo} ${preciofinal} \n ¡GRACIAS POR SU COMPRA!`);
                    opcion = 9;
                }
                else {
                    console.log('Ingrese un valor válido');
                } 
                break;
            default:
                console.log('Opción inválida. Por favor, ingrese una opción válida.');
                break;
        }

        console.log('------------------------------------------');
    }
}

ejecutarPrograma();