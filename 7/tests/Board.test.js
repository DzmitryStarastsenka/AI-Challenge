import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { Board } from '../src/Board.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  describe('constructor', () => {
    test('creates board with default size 10', () => {
      expect(board.size).toBe(10);
      expect(board.grid).toHaveLength(10);
      expect(board.grid[0]).toHaveLength(10);
      expect(board.ships).toEqual([]);
      expect(board.guesses).toEqual(new Set());
    });

    test('creates board with custom size', () => {
      const customBoard = new Board(5);
      expect(customBoard.size).toBe(5);
      expect(customBoard.grid).toHaveLength(5);
      expect(customBoard.grid[0]).toHaveLength(5);
    });

    test('initializes grid with water symbols', () => {
      expect(board.grid[0][0]).toBe('~');
      expect(board.grid[9][9]).toBe('~');
    });
  });

  describe('createEmptyGrid', () => {
    test('creates grid filled with water symbols', () => {
      const grid = board.createEmptyGrid();
      
      expect(grid).toHaveLength(10);
      expect(grid[0]).toHaveLength(10);
      expect(grid.every(row => row.every(cell => cell === '~'))).toBe(true);
    });
  });

  describe('parseLocation', () => {
    test('parses valid location correctly', () => {
      const [row, col] = board.parseLocation('34');
      expect(row).toBe(3);
      expect(col).toBe(4);
    });

    test('throws error for invalid location format', () => {
      expect(() => board.parseLocation('123')).toThrow('Location must be exactly 2 characters');
      expect(() => board.parseLocation('1')).toThrow('Location must be exactly 2 characters');
    });
  });

  describe('isValidLocation', () => {
    test('returns true for valid coordinates', () => {
      expect(board.isValidLocation(0, 0)).toBe(true);
      expect(board.isValidLocation(5, 5)).toBe(true);
      expect(board.isValidLocation(9, 9)).toBe(true);
    });

    test('returns false for invalid coordinates', () => {
      expect(board.isValidLocation(-1, 0)).toBe(false);
      expect(board.isValidLocation(0, -1)).toBe(false);
      expect(board.isValidLocation(10, 0)).toBe(false);
      expect(board.isValidLocation(0, 10)).toBe(false);
    });
  });

  describe('generateRandomShipLocations', () => {
    test('generates horizontal ship locations', () => {
      // Mock Math.random to control orientation and position
      const mockRandom = jest.spyOn(Math, 'random');
      mockRandom.mockReturnValueOnce(0.3); // horizontal
      mockRandom.mockReturnValueOnce(0.5); // row 5
      mockRandom.mockReturnValueOnce(0.7); // col 5 (adjusted for ship length)
      
      const locations = board.generateRandomShipLocations(3);
      
      expect(locations).toEqual(['55', '56', '57']);
      mockRandom.mockRestore();
    });

      test('generates vertical ship locations', () => {
    const mockRandom = jest.spyOn(Math, 'random');
    mockRandom.mockReturnValueOnce(0.7); // vertical
    mockRandom.mockReturnValueOnce(0.3); // row 2 (0.3 * (10-3+1) = 2.4 -> floor = 2) 
    mockRandom.mockReturnValueOnce(0.7); // col 7 (0.7 * 10 = 7)
    
    const locations = board.generateRandomShipLocations(3);
    
    expect(locations).toEqual(['27', '37', '47']);
    mockRandom.mockRestore();
  });
  });

  describe('canPlaceShip', () => {
    test('returns true for valid ship placement', () => {
      const locations = ['00', '01', '02'];
      expect(board.canPlaceShip(locations)).toBe(true);
    });

      test('returns false for invalid coordinates', () => {
    // Mock parseLocation to simulate invalid coordinates
    const originalParseLocation = board.parseLocation;
    board.parseLocation = jest.fn().mockImplementation((location) => {
      if (location === 'AA') {
        return [NaN, NaN]; // Simulate invalid parse result
      }
      return originalParseLocation.call(board, location);
    });
    
    const locations = ['00', 'AA', '02']; // 'AA' will parse to invalid coordinates
    expect(board.canPlaceShip(locations)).toBe(false);
    
    // Restore original method
    board.parseLocation = originalParseLocation;
  });

    test('returns false for occupied locations', () => {
      board.grid[0][0] = 'S';
      const locations = ['00', '01', '02'];
      expect(board.canPlaceShip(locations)).toBe(false);
    });
  });

  describe('placeShipsRandomly', () => {
    test('places ships successfully', () => {
      board.placeShipsRandomly(2, 3);
      
      expect(board.ships).toHaveLength(2);
      expect(board.ships[0].length).toBe(3);
      expect(board.ships[1].length).toBe(3);
    });

    test('throws error if unable to place ships', () => {
      // Create a very small board to force placement failure
      const smallBoard = new Board(2);
      
      expect(() => {
        smallBoard.placeShipsRandomly(10, 3); // Too many ships for small board
      }).toThrow('Could only place');
    });
  });

  describe('processGuess', () => {
    beforeEach(() => {
      board.placeShipsRandomly(1, 3);
    });

    test('processes valid miss', () => {
      const result = board.processGuess('99');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(result.message).toBe('Miss!');
      expect(board.grid[9][9]).toBe('O');
    });

    test('processes valid hit', () => {
      const ship = board.ships[0];
      const location = ship.locations[0];
      
      const result = board.processGuess(location);
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(result.message).toBe('Hit!');
    });

    test('processes hit that sinks ship', () => {
      const ship = board.ships[0];
      
      // Hit all locations except the last one
      for (let i = 0; i < ship.locations.length - 1; i++) {
        board.processGuess(ship.locations[i]);
      }
      
      // Hit the last location
      const result = board.processGuess(ship.locations[ship.locations.length - 1]);
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
      expect(result.message).toBe('Hit and sunk!');
    });

    test('rejects duplicate guess', () => {
      board.processGuess('00');
      const result = board.processGuess('00');
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Already guessed that location!');
    });

    test('rejects invalid location', () => {
      const result = board.processGuess('AB');
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid location!');
    });
  });

  describe('getDisplayString', () => {
    test('returns correct board display', () => {
      const display = board.getDisplayString();
      
      expect(display).toContain('0 1 2 3 4 5 6 7 8 9');
      expect(display.split('\n')).toHaveLength(12); // header + 10 rows + empty
    });

    test('hides ships when showShips is false', () => {
      board.grid[0][0] = 'S';
      const display = board.getDisplayString(false);
      
      expect(display).toContain('~ ');
      expect(display).not.toContain('S ');
    });

    test('shows ships when showShips is true', () => {
      board.grid[0][0] = 'S';
      const display = board.getDisplayString(true);
      
      expect(display).toContain('S ');
    });
  });

  describe('getRemainingShipsCount', () => {
    beforeEach(() => {
      board.placeShipsRandomly(2, 3);
    });

    test('returns correct count for undamaged ships', () => {
      expect(board.getRemainingShipsCount()).toBe(2);
    });

    test('returns correct count after sinking ship', () => {
      const ship = board.ships[0];
      ship.locations.forEach(location => {
        board.processGuess(location);
      });
      
      expect(board.getRemainingShipsCount()).toBe(1);
    });
  });

  describe('allShipsSunk', () => {
    beforeEach(() => {
      board.placeShipsRandomly(2, 3);
    });

    test('returns false when ships remain', () => {
      expect(board.allShipsSunk()).toBe(false);
    });

      test('returns true when all ships sunk', () => {
    // Manually sink all ships by hitting all their locations
    board.ships.forEach(ship => {
      ship.locations.forEach(location => {
        ship.hit(location); // Directly hit the ship
      });
    });
    
    expect(board.allShipsSunk()).toBe(true);
  });
  });

  describe('getAdjacentLocations', () => {
    test('returns all adjacent locations for center position', () => {
      const adjacent = board.getAdjacentLocations('55');
      
      expect(adjacent).toEqual(expect.arrayContaining(['45', '65', '54', '56']));
      expect(adjacent).toHaveLength(4);
    });

    test('returns valid adjacent locations for corner position', () => {
      const adjacent = board.getAdjacentLocations('00');
      
      expect(adjacent).toEqual(expect.arrayContaining(['10', '01']));
      expect(adjacent).toHaveLength(2);
    });

    test('excludes already guessed locations', () => {
      board.guesses.add('45');
      board.guesses.add('65');
      
      const adjacent = board.getAdjacentLocations('55');
      
      expect(adjacent).toEqual(expect.arrayContaining(['54', '56']));
      expect(adjacent).toHaveLength(2);
    });
  });

  describe('reset', () => {
    test('resets board to initial state', () => {
      board.placeShipsRandomly(2, 3);
      board.processGuess('00');
      
      board.reset();
      
      expect(board.ships).toHaveLength(0);
      expect(board.guesses.size).toBe(0);
      expect(board.grid[0][0]).toBe('~');
    });
  });
}); 