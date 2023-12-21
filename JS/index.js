let listaEmpleados = [];
let editando = false;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await cargarEmpleadosDesdeApi();
        mostrarEmpleados();
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        document.getElementById('mensaje-error').textContent = 'Error al cargar datos. Por favor, intenta nuevamente.';
    }
});

async function cargarEmpleadosDesdeApi() {
    const response = await fetch('https://api.example.com/empleados'); // Reemplaza con la URL de tu API
    if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    listaEmpleados = await response.json();
}
function cargarEmpleadosDesdeStorage() {
    fetch('./data/empleados.json') // Ajusta la ruta según la estructura de tu proyecto
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && Array.isArray(data)) {
                listaEmpleados = data;
                mostrarEmpleados();
            }
        })
        .catch(error => {
            console.error('Error al cargar empleados:', error);
            document.getElementById('mensaje-error').textContent = 'Error al cargar datos. Por favor, intenta nuevamente.';
        });
}

function validarFormulario(e) {
    e.preventDefault();

    const nombreInput = document.getElementById('nombre');
    const puestoInput = document.getElementById('puesto');

    if (nombreInput.value === '' || puestoInput.value === '') {
        alert('Todos los campos se deben llenar');
        return;
    }

    if (editando) {
        editarEmpleado();
        editando = false;
    } else {
        const objEmpleado = {
            id: obtenerFechaFormateada(),
            nombre: nombreInput.value,
            puesto: puestoInput.value
        };

        agregarEmpleado(objEmpleado);
    }
}

function obtenerFechaFormateada() {
    const fechaActual = new Date();
    const formatoFecha = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return fechaActual.toLocaleDateString('es-ES', formatoFecha);
}

function agregarEmpleado() {
    listaEmpleados.push({ ...objEmpleado });

    guardarEmpleadosEnStorage();

    mostrarEmpleados();

    formulario.reset();
    limpiarObjeto();
}

function limpiarObjeto() {
    objEmpleado.id = '';
    objEmpleado.nombre = '';
    objEmpleado.puesto = '';
}

function mostrarEmpleados() {
    limpiarHTML();

    const divEmpleados = document.querySelector('.div-empleados');

    listaEmpleados.forEach(empleado => {
        const { id, nombre, puesto } = empleado;

        const parrafo = document.createElement('p');
        parrafo.textContent = `${id} - ${nombre} - ${puesto} - `;
        parrafo.dataset.id = id;

        const editarBoton = document.createElement('button');
        editarBoton.onclick = () => cargarEmpleado(empleado);
        editarBoton.textContent = 'Editar';
        editarBoton.classList.add('btn', 'btn-editar');
        parrafo.append(editarBoton);

        const eliminarBoton = document.createElement('button');
        eliminarBoton.onclick = () => eliminarEmpleado(id);
        eliminarBoton.textContent = 'Eliminar';
        eliminarBoton.classList.add('btn', 'btn-eliminar');
        parrafo.append(eliminarBoton);

        const hr = document.createElement('hr');

        divEmpleados.appendChild(parrafo);
        divEmpleados.appendChild(hr);
    });
}

function cargarEmpleado(empleado) {
    const { id, nombre, puesto } = empleado;

    nombreInput.value = nombre;
    puestoInput.value = puesto;

    objEmpleado.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Actualizar';

    editando = true;
}

function editarEmpleado() {
    objEmpleado.nombre = nombreInput.value;
    objEmpleado.puesto = puestoInput.value;

    listaEmpleados.map(empleado => {
        if (empleado.id === objEmpleado.id) {
            empleado.id = objEmpleado.id;
            empleado.nombre = objEmpleado.nombre;
            empleado.puesto = objEmpleado.puesto;
        }
    });

    guardarEmpleadosEnStorage();

    limpiarHTML();
    mostrarEmpleados();
    formulario.reset();

    formulario.querySelector('button[type="submit"]').textContent = 'Agregar';

    editando = false;
}

function eliminarEmpleado(id) {
    listaEmpleados = listaEmpleados.filter(empleado => empleado.id !== id);

    guardarEmpleadosEnStorage();

    limpiarHTML();
    mostrarEmpleados();
}

function limpiarHTML() {
    const divEmpleados = document.querySelector('.div-empleados');
    while (divEmpleados.firstChild) {
        divEmpleados.removeChild(divEmpleados.firstChild);
    }
}

function guardarEmpleadosEnStorage() {
    localStorage.setItem('empleados', JSON.stringify(listaEmpleados));
}

function cargarEmpleadosDesdeStorage() {
    const empleadosEnStorage = localStorage.getItem('empleados');
    if (empleadosEnStorage) {
        listaEmpleados = JSON.parse(empleadosEnStorage);
    }
}
