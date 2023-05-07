// Variables
let precioA = 2500;
let cantA = 0;
let precioB = 859;
let cantB = 0;
let precioC = 429;
let cantC = 0;
let precioD = 1590;
let cantD = 0;
let precioE = 2399;
let cantE = 0;
let monDePago = 'UYU';

// Función para calcular el iva de un producto, iva de Uruguay es del 22%
function calcularIva(precio) {
    return precio + (precio * 22 / 100);
}

// Función para calcular descuentos con cupones
// Si se ingresa un código de cupón incorrecto se puede finalizar la función o llamarse recursivamente
function cuponDescuento(codigo, precio) {
    let continuar;
    if (codigo == 'NewUser23') { //CUPÓN DE 15% DE DESCUENTO PARA NUEVOS USUARIOS
        return precio - (precio * 15 / 100);
        
    }
    else if (codigo == 'plant520') { //CUPÓN DE 30% DE DESCUENTO
        return precio = precio - (precio * 30 / 100)
    }
    else {
        continuar = prompt(`Ingrese un código valido \nA: reingresar código \nB: Finalizar compra`);
        if (continuar == 'A') {
            codigo = prompt(`Ingrese su cupón de descuento:`);
            return cuponDescuento(codigo, precio);
        }
        else if (continuar == 'B') {
            return -1; //centinela para avisar que se finaliza la compra sin descuento luego de haber ingresado uno o más cupones incorrectos
        }
        else {
            alert('Ingrese una opción válida');
            codigo = prompt(`Ingrese su cupón de descuento:`);
            return cuponDescuento(codigo, precio);
        }
    }
}

// Procedimiento para agregar productos al carrito
// El procedimiento aumenta la cantidad de cada producto que agrego al carrito, si ingreso una letra que no pertenece a un producto la función se llama recursivamente
function agregarEnCarrito() {
    let planta;
    let cantidad;
    cantidad = cantProductos(cantA, cantB, cantC, cantD, cantE);
    planta = prompt(`Bienvenido al carrito de compras, usted tiene agregado ${cantidad} productos para comprar \n (Precios sin IVA incluido) \n Ingrese letra del producto elegido: \n A: Bonsai UYU 2500, ${cantA} Unidad/es \n B: Lirio Japonés UYU 859, ${cantB} Unidad/es \n C: Azalea UYU 429, ${cantC} Unidad/es \n D: Sakura UYU 1590 , ${cantD} Unidad/es\n E: Ginkgo UYU 2399, ${cantE} Unidad/es`);
    switch (planta) {
        case "A":
            cantA++;
            break;
        case "B":
            cantB++;
            break;
        case "C":
            cantC++;
            break;
        case "D":
            cantD++;
            break;
        case "E":
            cantE++;
            break;
        default:
            alert(`Ingrese letra de un producto`);
            agregarEnCarrito();
            break;
    }
}

// Procedimiento para remover productos del carrito
function removerDeCarrito() {
    let planta;
    planta = prompt(`Ingrese letra del producto a eliminar del carrito: \n A: Bonsai UYU 2500, ${cantA} Unidad/es \n B: Lirio Japonés UYU 859, ${cantB} Unidad/es \n C: Azalea UYU 429, ${cantC} Unidad/es \n D: Sakura UYU 1590 , ${cantD} Unidad/es\n E: Ginkgo UYU 2399, ${cantE} Unidad/es`);
    switch (planta) {
        case "A":
            cantA--;
            break;
        case "B":
            cantB--;
            break;
        case "C":
            cantC--;
            break;
        case "D":
            cantD--;
            break;
        case "E":
            cantE--;
            break;
        default:
            alert(`Ingrese letra de un producto`);
            removerDeCarrito();
            break;
    }
}

// Función para calcular el precio total
// utilizo calcularIva(precio)
function precioTotal() {
    return (cantA * calcularIva(precioA) + cantB * calcularIva(precioB) + cantC * calcularIva(precioC) + cantD * calcularIva(precioD) + cantE * calcularIva(precioE));
}

// Función para calcular cantidad total de productos seleccionados
// Sumo todas las cantidades para obtener la total
function cantProductos(cantA, cantB, cantC, cantD, cantE) {
    return (cantA + cantB + cantC + cantD + cantE);
}

// Función para convertir pesos uruguayos a (dolares, reales brasileños o pesos argentinos)
function conversor(moneda, precio) {
    let valorConvertido;
    switch (moneda) {
        case "UYU":
            monDePago = "UYU"
            return valorConvertido = precio / 1; //MANTENGO PRECIO EN PESOS URUGUAYOS
        case "USD":
            monDePago = "USD"
            return valorConvertido = precio / 39.02; //39.02 UYU = 1 USD
        case "BRL":
            monDePago = "BRL"
            return valorConvertido = precio / 7.83; //7.83 UYU = 1 BRL
        case "ARS":
            monDePago = "ARS"
            return valorConvertido = precio / 0.17; //0.17 UYU = 1 ARS
        default:
            alert("Ingrese USD, BRL o ARS para generar conversión");
            moneda = prompt(`Ingrese el código de su divisa \n USD: Dólares \n BRL: Reales \n ARS: Pesos Argentinos \n UYU: Mantener el tipo de cambio en Pesos Uruguayos`);
            return conversor(moneda, precio);
    }
}

//Funcion menú
function menu() {
    let app;
    let aux;
    let precio = 0;
    let descuento;
    let codigoDescuento;
    let precioDescuento = 0;
    app = prompt(`PASOS EN ORDEN PARA COMPRAR: \n 1: Carrito de compras \n 2: Consultar precio \n 3: Convertir precio a diferentes divisas \n 4: Finalizar compra`);
    while (aux != '4') {
        switch (app) {
            case '1':
                let next;
                next = prompt(`Desea agregar productos al carrito: \n A: Sí \n B: No`);
                while (next != "B") {
                    agregarEnCarrito();
                    next = prompt(`Desea seguir agregando productos al carrito: \n A: Sí \n B: No`);
                }
                let remove;
                remove = prompt(`Desea remover productos del carrito: \n A: Sí \n B: No`);
                while (remove != "B") {
                    removerDeCarrito();
                    precio = precioTotal();
                    remove = prompt(`Desea seguir removiendo productos del carrito: \n A: Sí \n B: No`);
                }
                break;
            case '2':
                precio = (precioTotal());
                precio = precio.toFixed(2);
                alert(`El precio total es: ${precio} (con IVA incluido)`);
                break;
            case '3':
                if (precio > 0) {
                    monDePago = prompt(`Ingrese el código de su divisa \n USD: Dólares \n BRL: Reales \n ARS: Pesos Argentinos \n UYU: Mantener el tipo de cambio en Pesos Uruguayos`);
                    precio = conversor(monDePago, precio);
                    precio = precio.toFixed(2);
                    alert(`El precio convertido es: ${monDePago} ${precio}`);
                } else {
                    alert(`Primero agregue productos al carrito de compras`);
                }
                break;
            case '4':
                descuento = prompt(`TOTAL DE COMPRA: ${monDePago} ${precio} \n Los clientes nuevos tienen 15% de descuento con el código "NewUser23" en su primera compra \n ¿Desea agregar cupones de descuento? \n A: SI \n B: NO`);
                switch (descuento) {
                    case 'A':
                        if (precio > 0) {
                            codigoDescuento = prompt(`Ingrese su cupón de descuento:`);
                            precioDescuento = cuponDescuento(codigoDescuento, precio);
                            precioDescuento = precioDescuento.toFixed(2);
                            if (precioDescuento == -1) {
                                alert(`COMPRA SIN DESCUENTO \n No se ingresaron cupones válidos, total original ${monDePago} ${precio} \n ¡Gracias por su compra!`);
                            }
                            else {
                                alert(`DESCUENTO APROBADO \n El precio con el descuento es: ${monDePago} ${precioDescuento} \n El precio original era de: ${monDePago} ${precio} \n ¡Gracias por su compra!`);
                            }
                            return 0;
                        } else {
                            alert(`Primero agregue productos a su carrito`);
                        }
                        break;
                    case 'B':
                        alert(`TOTAL: ${monDePago} ${precio} \n ¡Gracias por su compra!`)
                        return 0;
                }
            default:
                alert(`Ingrese una opción válida`);
                break;
        }
        app = prompt(`PASOS EN ORDEN PARA COMPRAR: \n1: Carrito de compras \n2: Calcular precio total \n3: Convertir precio a diferentes divisas \n4: Finalizar compra`);
    }
}

//programa principal
alert(`Bienvenidos a la DEMO de mi aplicación en JavaScript \nSomos una ecommerce de plantas Japonesas en Uruguay`);
console.log(menu())