'use strict';

// base de datos
require('../config/database')();
const Librito = require('../models/Librito');

module.exports = function (app) {

  // OBTENER TODOS LOS LIBROS
  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const libros = await Librito.find({}, 'titulo _id totalComentarios');
        res.json(libros.map(libro => ({
          _id: libro._id,
          title: libro.titulo,
          commentcount: libro.totalComentarios
        })));
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los libros' });
      }
    })
    
    // CREAR NUEVO LIBRO
    .post(async function (req, res) {
      try {
        const { title } = req.body;
        
        if (!title || title.trim() === '') {
          return res.type('text').send('missing required field title');
        }

        const nuevoLibro = new Librito({
          titulo: title.trim()
        });

        const libroGuardado = await nuevoLibro.save();
        
        res.json({
          _id: libroGuardado._id,
          title: libroGuardado.titulo
        });
      } catch (error) {
        res.status(500).json({ error: 'Error al crear el libro' });
      }
    })
    
    // ELIMINAR TODOS LOS LIBROS
    .delete(async function(req, res) {
      try {
        await Librito.deleteMany({});
        res.type('text').send('complete delete successful');
      } catch (error) {
        res.status(500).json({ error: 'Error al eliminar los libros' });
      }
    });

  // OPERACIONES CON LIBRO ESPECÍFICO
  app.route('/api/books/:id')
    // OBTENER LIBRO POR ID
    .get(async function (req, res) {
      try {
        const libro = await Librito.findById(req.params.id);
        
        if (!libro) {
          return res.type('text').send('no book exists');
        }

        res.json({
          _id: libro._id,
          title: libro.titulo,
          comments: libro.comentarios.map(com => com.texto)
        });
      } catch (error) {
        if (error.name === 'CastError') {
          return res.type('text').send('no book exists');
        }
        res.status(500).json({ error: 'Error al obtener el libro' });
      }
    })
    
    // AGREGAR COMENTARIO
    .post(async function(req, res) {
      try {
        const { comment } = req.body;
        const libroId = req.params.id;

        if (!comment || comment.trim() === '') {
          return res.type('text').send('missing required field comment');
        }

        const libro = await Librito.findById(libroId);
        
        if (!libro) {
          return res.type('text').send('no book exists');
        }

        // Agregar comentario
        libro.comentarios.push({
          texto: comment.trim()
        });

        await libro.save();

        res.json({
          _id: libro._id,
          title: libro.titulo,
          comments: libro.comentarios.map(com => com.texto)
        });
      } catch (error) {
        if (error.name === 'CastError') {
          return res.type('text').send('no book exists');
        }
        res.status(500).json({ error: 'Error al agregar comentario' });
      }
    })
    
    // ELIMINAR LIBRO
    .delete(async function(req, res) {
      try {
        const libroEliminado = await Librito.findByIdAndDelete(req.params.id);
        
        if (!libroEliminado) {
          return res.type('text').send('no book exists');
        }

        res.type('text').send('delete successful');
      } catch (error) {
        if (error.name === 'CastError') {
          return res.type('text').send('no book exists');
        }
        res.status(500).json({ error: 'Error al eliminar el libro' });
      }
    });
};
