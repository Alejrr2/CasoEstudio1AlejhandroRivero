//Se establecen las constantes para la creación del server

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Se llama a express, se establece el puerto y la ruta a la carpeta public.
const app = express();
const PORT = 3001;
const PUBLIC = path.join(__dirname, 'public');

// Se crea el arreglo con los datos fijos para poder visualizarlos al iniciar la pagina web
let notes = [
    {
        id: 1,
        title: 'Nota 1',
        content: 'Contenido de la Nota 1',
        date: new Date(),
        dateModified: new Date(),
        tags: 'Hola'
    },
    {
        id: 2,
        title: 'Nota 2',
        content: 'Contenido de la Nota 2',
        date: new Date(),
        dateModified: new Date(),
        tags: 'Hola'
    }
];

//Se realiza la función para generar un id random (No se utilizo una libreria, debido a que las librerias generaban id pero le agregan letras y en el trabajo se solicito un numero entero)

function generateRandomId() {
    let newId = Math.floor(Math.random() * 1000000);
    //Con este if nos aseguramos de que no se encuentre repetido el ID
    if (notes.some(note => note.id === newId)) {
        return generateRandomId();
    }
    return newId;
}

// Sirve para analizar la información entrante mediante el formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Sirve para configurar el archivo public
app.use(express.static(PUBLIC));

// Ruta para cargar la página principal
app.get('/', (req, res) => {
    console.log('Cargando home...');
    res.sendFile(path.join(PUBLIC, 'notas.html'));
});

// Ruta para obtener todas las notas
app.get('/notas', (req, res) => {
    console.log('Cargando notas...');
    res.json(notes);
});

// Ruta para obtener una nota por su ID 
app.get('/notas/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const nota = notes.find((nota) => nota.id === noteId);
    if (nota) {
        res.json(nota);
    } else {
        res.status(404).send('Nota no encontrada');
    }
});

// Ruta para agregar una nota 
app.post('/notas', (req, res) => {
    const newNote = {
        id: generateRandomId(),
        title: req.body.title,
        content: req.body.content,
        date: new Date(),
        dateModified: new Date(),
        tags: req.body.tags
    };
    notes.push(newNote);
    //Se hace un mensaje de comprobación para verificar los datos que se han guardado
    console.log('Nueva nota agregada:', newNote);
    res.json(newNote);
});
// Ruta que sirve para eliminar un id
app.delete('/notas/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    notes = notes.filter(note => note.id !== noteId);
    //Confirmamos que la nota ha sido eliminada
    console.log('Nota eliminada con ID:', noteId);
    res.json({ success: true });
});

// Ruta para editar una nota existente
app.put('/notas/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const updatedNote = {
        id: noteId,
        title: req.body.title,
        content: req.body.content,
        dateModified: new Date(),
        tags: req.body.tags
    };

    // Mediante este for recorre el array en busca de que exista la nota que se busca editar.
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === noteId) {
            notes[i] = updatedNote;
            break;
        }
    }
    //Devolvemos la nota editada.
    console.log('Nota editada:', updatedNote);
    res.json(updatedNote); 
});


// Inicializa el server en el puerto asignado 
app.listen(PORT, () => {
    console.log(`😊 Servidor corriendo en el puerto ${PORT}`);
});