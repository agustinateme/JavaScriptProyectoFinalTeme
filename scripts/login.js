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
        if (aux) {
            spinner.innerHTML = `
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `;
            setTimeout(() => {
                spinner.innerHTML = '';
                window.location.href = '../index.html';
            }, 3000);
            
        } else {
            texterror.innerHTML = 'Usuario y/o contraseña incorrectos';
            setTimeout(() => {
                texterror.innerHTML = '';
            }, 5000);
        }
    } else {
        console.log('No se encontraron datos de usuarios registrados');
    }
});