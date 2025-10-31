class SudokuSolver {
  constructor() {
    this.SIZE = 9;
    this.BOX_SIZE = 3;
  }

  validarPuzzle(puzzleString) {
    if (puzzleString.length !== 81) {
      return { valido: false, error: 'Expected puzzle to be 81 characters long' };
    }

    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { valido: false, error: 'Invalid characters in puzzle' };
    }

    return { valido: true };
  }

  stringAMatriz(puzzleString) {
    const matriz = [];
    for (let i = 0; i < this.SIZE; i++) {
      const inicio = i * this.SIZE;
      const fin = inicio + this.SIZE;
      matriz.push(puzzleString.slice(inicio, fin).split(''));
    }
    return matriz;
  }

  matrizAString(matriz) {
    return matriz.flat().join('');
  }

  verificarFila(matriz, fila, valor) {
    for (let col = 0; col < this.SIZE; col++) {
      if (matriz[fila][col] === valor) {
        return false;
      }
    }
    return true;
  }

  verificarColumna(matriz, columna, valor) {
    for (let fila = 0; fila < this.SIZE; fila++) {
      if (matriz[fila][columna] === valor) {
        return false;
      }
    }
    return true;
  }

  verificarRegion(matriz, fila, columna, valor) {
    const inicioFila = Math.floor(fila / this.BOX_SIZE) * this.BOX_SIZE;
    const inicioCol = Math.floor(columna / this.BOX_SIZE) * this.BOX_SIZE;

    for (let f = inicioFila; f < inicioFila + this.BOX_SIZE; f++) {
      for (let c = inicioCol; c < inicioCol + this.BOX_SIZE; c++) {
        if (matriz[f][c] === valor) {
          return false;
        }
      }
    }
    return true;
  }

  verificarColocacion(puzzleString, fila, columna, valor) {
    const validacion = this.validarPuzzle(puzzleString);
    if (!validacion.valido) {
      return { valido: false, error: validacion.error };
    }

    if (fila < 0 || fila >= this.SIZE || columna < 0 || columna >= this.SIZE) {
      return { valido: false, error: 'Invalid coordinate' };
    }

    if (!/^[1-9]$/.test(valor)) {
      return { valido: false, error: 'Invalid value' };
    }

    const matriz = this.stringAMatriz(puzzleString);
    const conflictos = [];

    if (matriz[fila][columna] === valor) {
      return { valido: true };
    }

    if (matriz[fila][columna] !== '.' && matriz[fila][columna] !== valor) {
      return { valido: false, error: 'Cell is already filled' };
    }

    if (!this.verificarFila(matriz, fila, valor)) {
      conflictos.push('row');
    }

    if (!this.verificarColumna(matriz, columna, valor)) {
      conflictos.push('column');
    }

    if (!this.verificarRegion(matriz, fila, columna, valor)) {
      conflictos.push('region');
    }

    if (conflictos.length > 0) {
      return { valido: false, conflicto: conflictos };
    }

    return { valido: true };
  }

  encontrarCeldaVacia(matriz) {
    for (let fila = 0; fila < this.SIZE; fila++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (matriz[fila][col] === '.') {
          return [fila, col];
        }
      }
    }
    return null;
  }

  resolverSudoku(matriz) {
    const celdaVacia = this.encontrarCeldaVacia(matriz);
    
    if (!celdaVacia) {
      return matriz; 
    }

    const [fila, col] = celdaVacia;

    for (let num = 1; num <= 9; num++) {
      const valor = num.toString();
      
      if (this.verificarFila(matriz, fila, valor) &&
          this.verificarColumna(matriz, col, valor) &&
          this.verificarRegion(matriz, fila, col, valor)) {
        
        matriz[fila][col] = valor;

        if (this.resolverSudoku(matriz)) {
          return matriz;
        }

        matriz[fila][col] = '.'; 
      }
    }

    return false; 
  }

  resolver(puzzleString) {
    const validacion = this.validarPuzzle(puzzleString);
    if (!validacion.valido) {
      return { error: validacion.error };
    }

    const matriz = this.stringAMatriz(puzzleString);
    const matrizResuelta = this.resolverSudoku(matriz);

    if (!matrizResuelta) {
      return { error: 'Puzzle cannot be solved' };
    }

    const solucion = this.matrizAString(matrizResuelta);
    return { solution: solucion }; 
  }
}

module.exports = SudokuSolver;
