// Se inicializa el arreglo
let notes = [
    {
        id: 1,
        title: 'Compras',
        content: 'Pana',
        date: new Date(),
        dateModified: new Date(),
        tags: 'Comida'
    },
    {
        id: 2,
        title: 'Fiesta',
        content: 'Salir el 27/07/2024',
        date: new Date(),
        dateModified: new Date(),
        tags: 'IMPORTANTE'
    }
];

// Función para mostrar el modal de agregar nota
function showAddNoteModal() {
    console.log("Usted ha entrado en la zona de agregar notas 😎.");
    $('#addNoteModal').modal('show');
}


// Función para mostrar el modal de editar nota
function showEditNoteModal(noteId) {
    console.log("Usted ha entrado al modal de gestión 😁.");
    console.log('Notas disponibles:', notes);

    const note = notes.find(note => note.id === noteId);
    //Se obtienen los  valores de la nota
    if (note) {
        $('#editNoteId').val(note.id);
        $('#editTitle').val(note.title);
        $('#editContent').val(note.content);
        $('#editTags').val(note.tags);

        //Se establece la función del boton del modal (eliminar)
        $('#deleteNoteButton').off('click').on('click', function() {
            deleteNoteById(note.id);
        });

        $('#editNoteModal').modal('show');
    } else {
        //Excepcion en caso de error
        console.error(`No se encontró la nota con ID ${noteId}`);
    }
}

// Funcion para manejar el proceso de agregar un nota.
$('#addNoteForm').submit(function (event) {
    event.preventDefault(); //Evitamos que recargue la pagina

    //Se obtienen los valores para las notas
    const id = $('#id').val();
    const title = $('#title').val();
    const content = $('#content').val();
    const date = $('#date').val();
    const dateModified = $('#dateModified').val();
    const tags = $('#tags').val();

    //Se realiza la petición para poder agregar la nota
    $.ajax({
        type: 'POST', //Se establece el tipo de acción para poder agregar
        url: '/notas', //Se establece la url
        data: { //Se establecen los datos a agregar
            id: id,
            title: title,
            content: content,
            date: date,
            dateModified: dateModified,
            tags: tags
        },
        success: function (nota) {//En caso de ser exitosa imprimira el mensaje en consola.
            console.log('Nueva nota agregada:', nota);

            // Agrega la nota al array
            notes.push(nota);

            // Reseatea el modal y lo escondemos
            $('#addNoteForm')[0].reset();
            $('#addNoteModal').modal('hide');

            // Actualizamps el html
            //En esta actualización agregamos los datos que qeuermos agregar a la nota y el boton para gestionar la nota.
            const noteHtml = `
                <div class="note" data-id="${nota.id}">
                    <h3>${nota.title}</h3>
                    <p><strong>Fecha:</strong> ${new Date(nota.date).toLocaleString()}</p>
                    <h6></h6>
                    <h5>Etiquetas: ${nota.tags}</h5>
                    <button class="modify-button" data-id="${nota.id}" onclick="showEditNoteModal(${nota.id})">Gestionar</button> 
                </div>
            `;
            $('#notesContainer').append(noteHtml);
            showMessage('Nota agregada exitosamente.', 'success');//Mensaje de exito
        },
        error: function (error) {
            console.error('Error al agregar nota:', error);
            showMessage('Error al agregar la nota.', 'danger');//Mensaje de error
        }
    });
});

// Función para eliminar una nota 
function deleteNoteById(noteId) {
    $.ajax({
        type: 'DELETE', //El tipo de accion establecida en el server.js
        url: `/notas/${noteId}`, // Ruta para eliminar la nota
        success: function (response) {
            if (response.success) {
                console.log('Nota eliminada con ID:', noteId); //Mensaje de exito
                showMessage('Nota eliminada exitosamente.', 'success');
                //Se procede a eliminar la nota
                $(`.note[data-id="${noteId}"]`).remove();
                // Se esconde el modal
                $('#editNoteModal').modal('hide');
            } else {
                console.error('Error al eliminar nota:', response);//Mensaje en caso de error
                showMessage('Error al eliminar la nota.', 'danger');
            }
        },
        error: function (error) {
            console.error('Error al eliminar nota:', error);
        }
    });
}

//Función para poder modificar una nota.
$('#editNoteForm').submit(function (event) {
    event.preventDefault(); // Evitamos que se actualice

    // Obtenemos los datos previos del formulario
    const id = $('#editNoteId').val();
    const title = $('#editTitle').val();
    const  date= $('#editDate').val();
    const content = $('#editContent').val();
    const tags = $('#editTags').val();

    // Realizamos el proceso para modificar
    $.ajax({
        type: 'PUT', //Establecemos el tipo que se va a configurar
        url: `/notas/${id}`, //se establece su URL
        data: { //Agarramos los valores
            id: id,
            title: title,
            date: date,
            content: content,
            tags: tags
        },
        success: function (updatedNote) {
            console.log('Nota editada:', updatedNote); //mensaje de exito
            showMessage('Nota editada exitosamente.', 'success');

            //Se actualizan las notas en el array
            const index = notes.findIndex(note => note.id === updatedNote.id);
            if (index !== -1) {
                notes[index] = updatedNote;
            }

            //Actualizamos la nota
            updateNoteInUI(updatedNote);

            //Se esconde el modal 
            $('#editNoteModal').modal('hide');
        },
        error: function (error) {
            console.error('Error al editar nota:', error);//Se muestra un mensaje de error en caso de que falle.
            showMessage('Error al eliminar la nota.', 'danger');
        }
    });
});

// Función para actualizar una nota en el area visual
function updateNoteInUI(updatedNote) {
    //Encontramos la nota 
    const $noteToUpdate = $(`.note[data-id="${updatedNote.id}"]`); //Se busca la nota mediante el ID
    $noteToUpdate.find('h3').text(updatedNote.title);  //Se actaliza el h3 para cambiar el titulo
    $noteToUpdate.find('h6').html(`Última modificación: ${new Date(updatedNote.dateModified).toLocaleString()}`); //Se modifica el h6 para visualizar la fecha de modificacion
    $noteToUpdate.find('.note-content').text(updatedNote.content);
    $noteToUpdate.find('h5').html(`Etiquetas: ${updatedNote.tags}`); //Se modifica el h5 el cual le pertenece a la etiqueta
}
//Funcion que sirve para poder mostrar un mensaje
function showMessage(message, type) {
    //Se establece al constante
    const messageContainer = $('#messageContainer');
    //Se eliminan las alertas para que no falle
    messageContainer.removeClass('alert-success alert-danger');
    //Se agrega el tipo de alerta
    messageContainer.addClass(`alert-${type}`);
    //Se establece el contenido de la alerta
    messageContainer.text(message);
    //Muestra el contenido de la alerta
    messageContainer.show();
    setTimeout(() => messageContainer.hide(), 3000);
}


//Funcion para mostrar las notas iniciales en el contenedor de notas
function renderInitialNotes() {
    notes.forEach(nota => {
        //Establece los datos que se mostraran:
        const noteHtml = `
            <div class="note" data-id="${nota.id}">
                    <h3>${nota.title}</h3>
                    <p><strong>Fecha:</strong> ${new Date(nota.date).toLocaleString()}</p>
                    <h6></h6>
                    <h5>Etiquetas: ${nota.tags}</h5>
                    <button class="modify-button" data-id="${nota.id}" onclick="showEditNoteModal(${nota.id})">Gestionar</button>
                </div>
        `;
        $('#notesContainer').append(noteHtml);
    });
}

// Este procedimiento nos sirve para inicializar y manejar busquedas.
$(document).ready(function() {
    // Llama a la funcion que se encarga de renderizar las notas
    renderInitialNotes();
    
    // Agregamos el controlador de eventos para la barrra de busqueda.
    $('#searchForm').submit(function(event) {
        event.preventDefault(); // Evitamos que recargue la pagina

        const searchTerm = $('#searchInput').val().toLowerCase();

        // Filtramos las notas basados en lo ingresado en el buscador.
        const filteredNotes = notes.filter(note => {
            return note.title.toLowerCase().includes(searchTerm) || 
                   note.content.toLowerCase().includes(searchTerm) ||
                   note.tags.toLowerCase().includes(searchTerm);
        });

        //Se llama la funcion que renderiza las notas filtradas.
        renderNotes(filteredNotes);
    });
});
//Funcion que renderiza las notas
function renderNotes(notesToRender) {
    $('#notesContainer').empty(); // Establecemos el container como vacio, es decir lo limpiamos.
    notesToRender.forEach(nota => {
        //Establece la estructura con la cual debera de imprimir la busqueda en pantalla
        const noteHtml = `
            <div class="note" data-id="${nota.id}">
                <h3>${nota.title}</h3>
                <p><strong>Fecha:</strong> ${new Date(nota.date).toLocaleString()}</p>
                <h6>Última modificación: ${new Date(nota.dateModified).toLocaleString()}</h6>
                <h5>Etiquetas: ${nota.tags}</h5>
                <button class="modify-button" data-id="${nota.id}" onclick="showEditNoteModal(${nota.id})">Gestionar</button>
            </div>
        `;
        $('#notesContainer').append(noteHtml);
    });
}