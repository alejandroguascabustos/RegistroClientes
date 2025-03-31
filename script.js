// Variable global para almacenar el índice de edición
let indiceEdicion = null;

// Esperamos a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    manejarFormulario(); // Maneja el envío del formulario
    mostrarRegistros();  // Carga y muestra los registros almacenados
});

// Función para manejar el formulario
function manejarFormulario() {
    const form = document.getElementById("crud-form");

    if (!form) {
        console.error("No se encontró el formulario con id 'crud-form'.");
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita que la página se recargue
        guardarRegistro(); // Llama a la función para guardar el registro
    });
}

// Función para guardar un registro
function guardarRegistro() {
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const identificacion = document.getElementById("identificacion").value.trim();
    const servicio = document.getElementById("servicio").value.trim();
    const observaciones = document.getElementById("observaciones").value.trim();
    const total = document.getElementById("total").value.replace(/\D/g, ""); // Elimina caracteres no numéricos

    // Validar que todos los campos estén llenos
    if (nombre && telefono && identificacion && servicio && observaciones && total) {
        let registros = JSON.parse(localStorage.getItem("registros")) || [];

        if (indiceEdicion !== null) {
            // Si estamos editando, reemplazamos el registro existente
            registros[indiceEdicion] = {
                nombre,
                telefono,
                identificacion,
                servicio,
                observaciones,
                total: parseFloat(total),
                fechaHora: new Date().toLocaleString(),
            };
            indiceEdicion = null; // Reiniciar la variable de edición
        } else {
            // Si es un nuevo registro, lo agregamos
            const nuevoRegistro = {
                nombre,
                telefono,
                identificacion,
                servicio,
                observaciones,
                total: parseFloat(total),
                fechaHora: new Date().toLocaleString(),
            };
            registros.push(nuevoRegistro);
        }

        // Guardar en LocalStorage y actualizar la tabla
        localStorage.setItem("registros", JSON.stringify(registros));
        document.getElementById("crud-form").reset(); // Limpiar formulario
        mostrarRegistros(); // Actualizar la tabla
        alert("Registro guardado con éxito!");
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// Función para mostrar los registros en una tabla
function mostrarRegistros() {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    let tablaBody = document.getElementById("tabla-body");

    if (!tablaBody) {
        console.warn("No se encontró una tabla para mostrar los registros.");
        return;
    }

    tablaBody.innerHTML = ""; // Limpiar contenido previo

    registros.forEach((registro, index) => {
        const fila = document.createElement("tr");

        // Formatear el valor de "total" como moneda
        const totalFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(registro.total);

        fila.innerHTML = `
            <td>${registro.nombre}</td>
            <td>${registro.fechaHora || 'Fecha no disponible'}</td>
            <td>${registro.telefono}</td>
            <td>${registro.identificacion}</td>
            <td>${registro.servicio}</td>
            <td>${registro.observaciones}</td>
            <td>${totalFormateado}</td>
            <td>
                <button class="editar" onclick="editarRegistro(${index})">Editar</button>
                <button class="eliminar" onclick="eliminarRegistro(${index})">Eliminar</button>
            </td>
        `;

        tablaBody.appendChild(fila);
    });
}

// Mostrar el pop-up y rellenar el formulario con los datos del registro
function editarRegistro(index) {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    let registro = registros[index];

    // Actualizar el índice de edición
    indiceEdicion = index;

    // Rellenar el formulario del pop-up
    document.getElementById("editar-nombre").value = registro.nombre;
    document.getElementById("editar-telefono").value = registro.telefono;
    document.getElementById("editar-identificacion").value = registro.identificacion;
    document.getElementById("editar-servicio").value = registro.servicio;
    document.getElementById("editar-observaciones").value = registro.observaciones;
    document.getElementById("editar-total").value = registro.total;

    // Mostrar el pop-up
    const popup = document.getElementById("popup-editar");
    popup.classList.remove("hidden");
}

// Manejar el envío del formulario de edición
const editarForm = document.getElementById("editar-form");
editarForm.onsubmit = function (event) {
    event.preventDefault();

    let registros = JSON.parse(localStorage.getItem("registros")) || [];

    // Actualizar los datos del registro
    registros[indiceEdicion] = {
        nombre: document.getElementById("editar-nombre").value.trim(),
        telefono: document.getElementById("editar-telefono").value.trim(),
        identificacion: document.getElementById("editar-identificacion").value.trim(),
        servicio: document.getElementById("editar-servicio").value.trim(),
        observaciones: document.getElementById("editar-observaciones").value.trim(),
        total: parseFloat(document.getElementById("editar-total").value.replace(/\D/g, "")),
        fechaHora: registros[indiceEdicion].fechaHora, // Mantener la fecha original
    };

    // Guardar los cambios en localStorage
    localStorage.setItem("registros", JSON.stringify(registros));
    alert ("Registro actualizado");
    

    // Actualizar la tabla y cerrar el pop-up
    mostrarRegistros();
    document.getElementById("popup-editar").classList.add("hidden");
};

// Manejar el botón de cancelar
document.getElementById("cerrar-popup").onclick = function () {
    document.getElementById("popup-editar").classList.add("hidden");
};

// Función para eliminar un registro
function eliminarRegistro(index) {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.splice(index, 1); // Elimina el registro en la posición "index"

    // Guardar cambios y actualizar la tabla
    localStorage.setItem("registros", JSON.stringify(registros));
    mostrarRegistros();
}

// Formatear campo "Total" como moneda al perder foco
document.addEventListener("DOMContentLoaded", function() {
    const inputTotal = document.getElementById("total");

    inputTotal.addEventListener("blur", function() {
        let value = inputTotal.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
        if (value) {
            let formattedValue = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0
            }).format(value);

            inputTotal.value = formattedValue; // Formatea el valor
        }
    });

    // Elimina el formato de moneda si el usuario vuelve a escribir
    inputTotal.addEventListener("focus", function() {
        let value = inputTotal.value.replace(/[^0-9]/g, ""); // Elimina el formato
        inputTotal.value = value;
    });
});



