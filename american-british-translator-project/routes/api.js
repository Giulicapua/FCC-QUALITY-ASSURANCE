'use strict';

const TraductorIngles = require('../components/translator.js');

module.exports = function (app) {
  
  const traductor = new TraductorIngles();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body;

      if (text === undefined || locale === undefined) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (text === '') {
        return res.json({ error: 'No text to translate' });
      }

      const resultado = traductor.traducir(text, locale);
      
      if (resultado.error) {
        return res.json({ error: resultado.error });
      }

      res.json(resultado);
    });
};

