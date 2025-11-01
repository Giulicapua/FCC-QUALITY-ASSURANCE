const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class TraductorIngles {
  constructor() {
    this.diccionarioAmericanoBritanico = this.crearDiccionarioAmericanoBritanico();
    this.diccionarioBritanicoAmericano = this.crearDiccionarioBritanicoAmericano();
    this.titulos = americanToBritishTitles;
    this.casosEspeciales = this.definirCasosEspeciales();
  }

  crearDiccionarioAmericanoBritanico() {
    return { ...americanOnly, ...americanToBritishSpelling };
  }

  crearDiccionarioBritanicoAmericano() {
    const diccionario = {};
    
    Object.entries(britishOnly).forEach(([terminoBritanico, terminoAmericano]) => {
      diccionario[terminoBritanico] = terminoAmericano;
    });
    
    Object.entries(americanToBritishSpelling).forEach(([americano, britanico]) => {
      diccionario[britanico] = americano;
    });
    
    return diccionario;
  }

  definirCasosEspeciales() {
    return {
      'american-to-british': {
        'rube goldberg machine': 'Heath Robinson device',
        'rube goldberg device': 'Heath Robinson device'
      },
      'british-to-american': {}
    };
  }

  traducir(texto, direccionTraduccion) {
    if (!texto || texto.trim() === '') {
      return { error: 'No text to translate' };
    }

    if (!['american-to-british', 'british-to-american'].includes(direccionTraduccion)) {
      return { error: 'Invalid value for locale field' };
    }

    let textoTraducido = texto;
    let huboCambios = false;

    const procesos = [
      () => this.procesarCasosEspeciales(textoTraducido, direccionTraduccion),
      () => this.procesarFormatoHora(textoTraducido, direccionTraduccion),
      () => this.procesarTitulos(textoTraducido, direccionTraduccion),
      () => this.procesarPalabrasYFrases(textoTraducido, direccionTraduccion)
    ];

    procesos.forEach(proceso => {
      const textoAnterior = textoTraducido;
      textoTraducido = proceso();
      if (textoTraducido !== textoAnterior) {
        huboCambios = true;
      }
    });

    if (!huboCambios) {
      return { text: texto, translation: 'Everything looks good to me!' };
    }

    return { text: texto, translation: textoTraducido };
  }

  procesarCasosEspeciales(texto, direccion) {
    const casos = this.casosEspeciales[direccion] || {};
    
    return Object.entries(casos).reduce((resultado, [original, traducido]) => {
      const expresionRegular = new RegExp(`\\b${this.escaparExpresionRegular(original)}\\b`, 'gi');
      return resultado.replace(expresionRegular, (coincidencia) => {
        return `<span class="highlight">${this.preservarMayusculas(coincidencia, traducido)}</span>`;
      });
    }, texto);
  }

  procesarFormatoHora(texto, direccion) {
    if (direccion === 'american-to-british') {
      return texto.replace(/(\d{1,2}):(\d{2})/g, (coincidencia, horas, minutos) => {
        return `<span class="highlight">${horas}.${minutos}</span>`;
      });
    } else if (direccion === 'british-to-american') {
      return texto.replace(/(\d{1,2})\.(\d{2})/g, (coincidencia, horas, minutos) => {
        return `<span class="highlight">${horas}:${minutos}</span>`;
      });
    }
    return texto;
  }

  procesarTitulos(texto, direccion) {
    let resultado = texto;

    const procesarTitulo = (tituloOriginal, tituloTraducido, agregarPunto = false) => {
      const regex = new RegExp(`\\b${this.escaparExpresionRegular(tituloOriginal)}(?=\\s+[A-Z])`, 'gi');
      return resultado.replace(regex, (coincidencia) => {
        let reemplazo = this.preservarMayusculas(coincidencia, tituloTraducido);
        if (agregarPunto && !reemplazo.endsWith('.')) {
          reemplazo += '.';
        }
        return `<span class="highlight">${reemplazo}</span>`;
      });
    };

    if (direccion === 'american-to-british') {
      Object.entries(this.titulos).forEach(([americano, britanico]) => {
        resultado = procesarTitulo(americano, britanico, false);
      });
    } else if (direccion === 'british-to-american') {
      Object.entries(this.titulos).forEach(([americano, britanico]) => {
        resultado = procesarTitulo(britanico, americano, true);
      });
    }

    return resultado;
  }

  procesarPalabrasYFrases(texto, direccion) {
    const diccionario = direccion === 'american-to-british' 
      ? this.diccionarioAmericanoBritanico 
      : this.diccionarioBritanicoAmericano;

    let resultado = texto;

    const entradasOrdenadas = Object.entries(diccionario)
      .filter(([original]) => !Object.keys(this.titulos).includes(original) && 
                              !Object.values(this.titulos).includes(original))
      .sort((a, b) => b[0].length - a[0].length);

    entradasOrdenadas.forEach(([original, traducido]) => {
      if (direccion === 'british-to-american' && original === 'uni' && 
          (texto.includes('College') || texto.includes('college'))) {
        return;
      }

      const regex = new RegExp(`\\b${this.escaparExpresionRegular(original)}\\b`, 'gi');
      
      resultado = resultado.replace(regex, (coincidencia) => {
        if (resultado.includes(`<span class="highlight">${coincidencia}</span>`)) {
          return coincidencia;
        }
        
        const reemplazo = this.preservarMayusculas(coincidencia, traducido);
        return `<span class="highlight">${reemplazo}</span>`;
      });
    });

    return resultado;
  }

  escaparExpresionRegular(cadena) {
    return cadena.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  preservarMayusculas(original, reemplazo) {
    if (original === original.toUpperCase()) {
      return reemplazo.toUpperCase();
    } else if (original === original.charAt(0).toUpperCase() + original.slice(1).toLowerCase()) {
      return reemplazo.charAt(0).toUpperCase() + reemplazo.slice(1);
    } else {
      return reemplazo.toLowerCase();
    }
  }
}

module.exports = TraductorIngles;