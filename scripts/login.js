let usuario = localStorage.getItem('sesionIniciada');

//Si la sesión no está iniciada
if (!usuario) {
    const sesion = [];
    usuario = JSON.stringify(sesion);
    localStorage.setItem('sesionIniciada', usuario);
}

// Obtener el formulario de ingreso
const loginForm = document.getElementById('loginForm');

//cuando se envíe el formulario agrego el evento submit
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); //evito que se recargue la pagina

    //obtengo los valores de los datos de ingreso
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    let texterror = document.getElementById('email-error');
    let spinner = document.getElementById('contenedor-spinner');

    const storedData = localStorage.getItem('USUARIOS:'); //obtengo la "base de datos" del localstorage

    if (storedData) { //si no está vacía
        const buscarUser = JSON.parse(storedData);
        const aux = buscarUser.some((buscar) => buscar.emailUser === email && buscar.passwordUser === password);
        let datoUser = buscarUser.find((buscar) => buscar.emailUser === email && buscar.passwordUser === password);
    
        if (aux) {
            let userIniciado = { iniciada: true, nombre: datoUser.nameUser, correo: datoUser.emailUser };
            console.log(userIniciado);
            usuario = JSON.stringify(userIniciado)
            localStorage.setItem('sesionIniciada', usuario);
            spinner.innerHTML = `
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `;
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
                title: 'Ingresando Sesión'
            })

            setTimeout(() => {
                spinner.innerHTML = '';
                window.location.href = '../index.html';
            }, 3000);
            
        } else {
            spinner.innerHTML = `
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `;
            setTimeout(() => {
                spinner.innerHTML = '';
                texterror.innerHTML = 'Usuario y/o contraseña incorrectos';
                setTimeout(() => {
                    texterror.innerHTML = '';
                }, 5000);
            }, 2000);
        }
    } else {
        console.log('No se encontraron datos de usuarios registrados');
    }
});