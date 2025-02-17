let users = [];

document.addEventListener('DOMContentLoaded', async () => {
    const urlApiBase = 'https://67b2b95dbc0165def8ce4bf1.mockapi.io/api/first/users';
    const form = document.getElementById('userForm');
    const estadoSelect = document.getElementById('estado');
    const municipioSelect = document.getElementById('municipio');
    const userList = document.getElementById('userList');
    const toggleButton = document.getElementById('toggleButton');
    
    try {
        // Cargar los datos de los estados y municipios desde el archivo JSON
        const response = await fetch('gps.json');
        const data = await response.json();

        // Llenar el select de estados
        Object.keys(data).forEach((estado) => {
            const option = document.createElement('option');
            option.value = estado;
            option.textContent = estado;
            estadoSelect.appendChild(option);
        });

        // Llenar el select de municipios cuando se seleccione un estado
        estadoSelect.addEventListener('change', () => {
            municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
            const estadoSeleccionado = estadoSelect.value;

            if (estadoSeleccionado && data[estadoSeleccionado]) {
                data[estadoSeleccionado].forEach((municipio) => {
                    const option = document.createElement('option');
                    option.value = municipio;
                    option.textContent = municipio;
                    municipioSelect.appendChild(option);
                });
            }
        });
    }
    catch (error) {
        console.error(error);
    }

    // Función para cargar usuarios registrados
    await cargarUsuarios();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const userData = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                direccion: document.getElementById('direccion').value,
                municipio: municipioSelect.value,
                estado: estadoSelect.value
            };
    
            const response = await fetch(urlApiBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                alert('Error al enviar el formulario');
                return;
            } 

            const newUser = await response.json();
            users.push(newUser);
            alert('Usuario registrado correctamente');
            form.reset();
            cargarUsuarios();
        } catch (error) {
            console.error(error);
        }
    });

    // Función para cargar los usuarios
    async function cargarUsuarios() {
        try {
            const response = await fetch(urlApiBase, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }   
            });
            if (!response.ok) {
                alert('Error al cargar los usuarios');
                return;
            }

            users = await response.json();
            userList.innerHTML = ''; // Limpiar la lista antes de agregar los nuevos usuarios

            users.forEach((user) => {
                const userItem = document.createElement('li');
                userItem.innerHTML = `
                <p><strong>Nombre:</strong> ${user.nombre} ${user.apellido}</p>
                <p><strong>Dirección:</strong> ${user.direccion}</p>
                <p><strong>Estado:</strong> ${user.estado}</p>
                <p><strong>Municipio:</strong> ${user.municipio}</p>
                `;
                userList.appendChild(userItem);
            });
        } catch (error) {
            console.error(error);
        }
    }

    // Mostrar/ocultar la lista de usuarios al hacer clic en el botón
    toggleButton.addEventListener('click', () => {
        if (userList.style.display === 'none' || userList.style.display === '') {
            userList.style.display = 'flex'; // Mostrar la lista
        } else {
            userList.style.display = 'none'; // Ocultar la lista
        }
    });
});