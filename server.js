const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const PUBLIC = path.join(__dirname, 'public');

// Array para almacenar las notas (simulado, puedes usar una base de datos real)
let notes = [];

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', PUBLIC); // Especifica la carpeta donde se encuentran las vistas

// Middleware para parsear datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(PUBLIC));

// Ruta para cargar la página principal
app.get('/', (req, res) => {
    // Renderiza la vista 'home' y pasa las notas como datos
    res.render('home', { notes });
});

// Ruta para agregar una nueva nota
app.post('/add-note', (req, res) => {
    const newNote = {
        title: req.body.title,
        date: req.body.date,
        tags: req.body.tags
    };
    notes.push(newNote);
    console.log('Nueva nota agregada:', newNote);

    // Después de agregar la nota, redirige a la página principal para actualizar las notas
    res.redirect('/');
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
