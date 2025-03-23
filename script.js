// Esperamos a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {

    // Verificamos en qué página estamos
    if (document.getElementById("crud-form")) {
        manejarFormulario();
    } else if (document.getElementById("tabla-body")) {
        mostrarRegistros();
    }
});

// Función para manejar el formulario
function manejarFormulario() {
    const form = document.getElementById("crud-form");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita recargar la página

        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const identificacion = document.getElementById("identificacion").value.trim();
        const servicio = document.getElementById("servicio").value.trim();
        const observaciones = document.getElementById("observaciones").value.trim();
        const totalInput = document.getElementById("total").value.replace(/\D/g, ""); // Elimina caracteres no numéricos



        // Validar que todos los campos estén llenos
        if (nombre && telefono && identificacion && servicio && observaciones && totalInput) {
            const nuevoRegistro = { 
                nombre, 
                telefono, 
                identificacion, 
                servicio, 
                observaciones,
                total: parseFloat(totalInput), // Guarda el valor como número
                fechaHora: new Date().toLocaleString()//Agregar fecha y hora actual
            };

            // Obtener registros almacenados
            let registros = JSON.parse(localStorage.getItem("registros")) || [];
            registros.push(nuevoRegistro);

            // Guardar en localStorage
            localStorage.setItem("registros", JSON.stringify(registros));

            // Limpiar formulario
            form.reset();
            alert("Registro agregado con éxito!");
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });
}

// Función para mostrar registros en la tabla
function mostrarRegistros() {
    const tablaBody = document.getElementById("tabla-body");
    let registros = JSON.parse(localStorage.getItem("registros")) || [];

    tablaBody.innerHTML = ""; // Limpiar tabla

    registros.forEach((registro, index) => {
        const fila = document.createElement("tr");

        // Formatear el valor de "total" como moneda al mostrarlo
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

//Funcion para formatear valores del formulario

document.addEventListener("DOMContentLoaded", function() {
    const inputTotal = document.getElementById("total");

    // Formatear el valor como moneda al perder el foco
    inputTotal.addEventListener("blur", function() {
        let value = inputTotal.value.replace(/\D/g, ""); // Elimina caracteres no numéricos
        if (value) {
            let formattedValue = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0
            }).format(value);

            inputTotal.value = formattedValue; // Formatea el valor al perder el foco
        }
    });

    // Elimina el formato si el usuario vuelve a escribir
    inputTotal.addEventListener("focus", function() {
        let value = inputTotal.value.replace(/[^0-9]/g, ""); // Elimina el formato de moneda
        inputTotal.value = value; // Muestra solo el número
    });
});

// Función para formatear los valores de la columna "Total" como pesos sin decimales
function formatearTotales() {
    let totalElementos = document.querySelectorAll("td:nth-child(6)");

    totalElementos.forEach(td => {
        let total = parseFloat(td.textContent.replace(/\D/g, "")); // Elimina caracteres no numéricos
        if (!isNaN(total)) {
            td.textContent = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(total);
        }
    });
}

// Función para eliminar un registro
function eliminarRegistro(index) {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.splice(index, 1);

    localStorage.setItem("registros", JSON.stringify(registros));
    mostrarRegistros();
}
