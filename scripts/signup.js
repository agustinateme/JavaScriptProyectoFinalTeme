let baseDeDatos = localStorage.getItem('USUARIOS:'); // Obtener los datos almacenados en el localStorage

if (!baseDeDatos) {
    // Si no existe una base de datos, creo una nueva
    const arreglo = [];
    baseDeDatos = JSON.stringify(arreglo);
    localStorage.setItem('USUARIOS:', baseDeDatos);
}

//obtengo el formulario de registro
const signUpForm = document.getElementById('SignUpForm');

//cuando se envíe el formulario agrego el evento submit
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault(); //evito que se recargue la pagina

    //obtengo los valores de los datos de registro
    const name = document.getElementById('name-signup').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;

    let texterror = document.getElementById('email-error');
    let passerror = document.getElementById('password-error');
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const isPasswordValid = passwordRegex.test(password);

    let spinner = document.getElementById('contenedor-spinner');
 
    //obtengo la "base de datos" del localstorage (la paso de string a objeto)
    const buscarUser = JSON.parse(baseDeDatos);
    //con el metodo some busco si ya existe el email en el localstorage
    const aux = buscarUser.some((buscar) => buscar.emailUser == email);

    //si existe aviso
    if ((aux) || (!isPasswordValid)) {
        if (aux) {
            texterror.innerHTML = 'E-mail vinculado a otra cuenta'
            setTimeout(() => {
                texterror.innerHTML = '';
            }, 5000);
        }
        else if (!isPasswordValid) {
            passerror.innerHTML = 'La contraseña debe tener al menos 8 <br> caracteres y contener letras y números';
            setTimeout(() => {
                passerror.innerHTML = '';
            }, 5000);
        }
    }
    else { //si no existe creo un nuevo usuario y lo agrego (pusheo y paso de objeto a string para devolverlo al local storage)
        const newUser = { nameUser: name, emailUser: email, passwordUser: password };
        buscarUser.push(newUser);
        baseDeDatos = JSON.stringify(buscarUser);
        localStorage.setItem('USUARIOS:', baseDeDatos);

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
            title: 'Generando usuario'
        })
        setTimeout(() => {
            spinner.innerHTML = '';
            window.location.href = '../pages/login.html';
        }, 3000);
        
    }
});
