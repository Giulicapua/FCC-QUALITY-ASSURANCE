'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  const solucionador = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const regexCoordenada = /^[A-Ia-i][1-9]$/;
      if (!regexCoordenada.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const letraFila = coordinate[0].toUpperCase();
      const numeroColumna = parseInt(coordinate[1]);
      const fila = letraFila.charCodeAt(0) - 65; 
      const columna = numeroColumna - 1;

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const resultado = solucionador.verificarColocacion(puzzle, fila, columna, value);
      
      if (resultado.error) {
        return res.json({ error: resultado.error });
      }

      if (resultado.valido) {
        return res.json({ valid: true });
      } else {
        return res.json({ 
          valid: false, 
          conflict: resultado.conflicto 
        });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const resultado = solucionador.resolver(puzzle);
      
      if (resultado.error) {
        return res.json({ error: resultado.error });
      }

      res.json(resultado);
    });
};
