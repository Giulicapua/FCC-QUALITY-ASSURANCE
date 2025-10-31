const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  setup(() => {
    solver = new Solver();
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.validarPuzzle(puzzle);
    assert.isTrue(result.valido);
  });

  test('Logic handles a puzzle string with invalid characters', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37A';
    const result = solver.validarPuzzle(puzzle);
    assert.isFalse(result.valido);
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';
    const result = solver.validarPuzzle(puzzle);
    assert.isFalse(result.valido);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.verificarColocacion(puzzle, 0, 1, '3');
    assert.isTrue(result.valido);
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.verificarColocacion(puzzle, 0, 1, '1');
    assert.isFalse(result.valido);
    assert.include(result.conflicto, 'row');
  });

  test('Logic handles a valid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.verificarColocacion(puzzle, 0, 1, '3');
    assert.isTrue(result.valido);
  });

  test('Logic handles an invalid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.verificarColocacion(puzzle, 1, 0, '1');
    assert.isFalse(result.valido);
    assert.include(result.conflicto, 'column');
  });

  test('Logic handles a valid region placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.verificarColocacion(puzzle, 0, 1, '3');
    assert.isTrue(result.valido);
  });

  test('Logic handles an invalid region placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.verificarColocacion(puzzle, 1, 1, '1');
    assert.isFalse(result.valido);
    assert.include(result.conflicto, 'region');
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.resolver(puzzle);
    assert.isUndefined(result.error);
    assert.exists(result.solution); 
  });

  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37A';
    const result = solver.resolver(puzzle);
    assert.exists(result.error);
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const expected = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    const result = solver.resolver(puzzle);
    assert.equal(result.solution, expected); 
  });
});
