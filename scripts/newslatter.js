let baseDeDatos = localStorage.getItem('SuscriptoNoticias:'); // Obtener los datos almacenados en el localStorage
let sesion = localStorage.getItem('sesionIniciada')

if (!sesion) {
    const arreglo = [];
    sesion = JSON.stringify(arreglo);
    localStorage.setItem('sesionIniciada', sesion);
}

//obtengo el formulario de cupon
const cuponForm = document.getElementById('cuponFORM');
cuponForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-cupon').value;
    const buscarUser = JSON.parse(baseDeDatos);
    const aux = buscarUser.some((buscar) => buscar.emailUser == email);
    if (aux) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Correo electrónico ya suscripto',
        })
    }
    else{
        const newEmail = { emailUser: email };
        buscarUser.push(newEmail);
        baseDeDatos = JSON.stringify(buscarUser);
        localStorage.setItem('SuscriptoNoticias:', baseDeDatos);
        Swal.fire({
            icon: 'success',
            title: '¡Felicidades! Codigo de cupón',
            text: '23plantsLOVE',
        })
    }
});

let iniciada = JSON.parse(sesion)

const pagUser = document.getElementById('header-img1');
pagUser.addEventListener('click', () => {
    if (iniciada.iniciada) {
        Swal.fire({
            title: `Cerrar sesión`,
            text: `¿${iniciada.nombre}, estás seguro/a de que deseas cerrar sesión?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#23b98c',
            cancelButtonColor: '#FE654F',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Cerrar sesión',
            footer: `${iniciada.correo}`
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Sesión cerrada',
                    'haz cerrado sesión',
                    'success',
                    iniciada = false,
                    sesion = JSON.stringify(iniciada),
                    localStorage.setItem('sesionIniciada', sesion)
                )
            }
        })
    }
    else {
        Swal.fire({
            title: 'Iniciar Sesión',
            text: "¿Quieres iniciar sesión?",
            icon: 'question',
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
});
