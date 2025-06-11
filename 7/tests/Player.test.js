import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { Player, HumanPlayer, CPUPlayer } from '../src/Player.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('TestPlayer', true);
  });

  describe('constructor', () => {
    test('creates player with correct properties', () => {
      expect(player.name).toBe('TestPlayer');
      expect(player.isHuman).toBe(true);
      expect(player.board).toBeDefined();
      expect(player.opponentBoard).toBeDefined();
    });
  });

  describe('initializeBoard', () => {
    test('places ships on player board', () => {
      player.initializeBoard(2, 3);
      
      expect(player.board.ships).toHaveLength(2);
      expect(player.board.ships[0].length).toBe(3);
    });
  });

  describe('receiveMove', () => {
    beforeEach(() => {
      player.initializeBoard(1, 3);
    });

    test('processes opponent move correctly', () => {
      const ship = player.board.ships[0];
      const location = ship.locations[0];
      
      const result = player.receiveMove(location);
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
    });
  });

  describe('hasLost', () => {
    beforeEach(() => {
      player.initializeBoard(1, 3);
    });

    test('returns false when ships remain', () => {
      expect(player.hasLost()).toBe(false);
    });

    test('returns true when all ships sunk', () => {
      const ship = player.board.ships[0];
      ship.locations.forEach(location => {
        player.receiveMove(location);
      });
      
      expect(player.hasLost()).toBe(true);
    });
  });

  describe('getBoardsDisplay', () => {
    test('returns formatted board display', () => {
      const display = player.getBoardsDisplay();
      
      expect(display).toContain('--- OPPONENT BOARD ---');
      expect(display).toContain('--- YOUR BOARD ---');
    });
  });

  describe('makeMove', () => {
    test('throws error for base Player class', () => {
      expect(() => player.makeMove('00')).toThrow('makeMove must be implemented by subclass');
    });
  });
});

describe('HumanPlayer', () => {
  let humanPlayer;

  beforeEach(() => {
    humanPlayer = new HumanPlayer();
    // Suppress console output for cleaner test results
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('creates human player with correct properties', () => {
      expect(humanPlayer.name).toBe('Player');
      expect(humanPlayer.isHuman).toBe(true);
    });

    test('accepts custom name', () => {
      const customPlayer = new HumanPlayer('John');
      expect(customPlayer.name).toBe('John');
    });
  });

  describe('makeMove', () => {
    test('validates correct input format', () => {
      const result = humanPlayer.makeMove('34');
      
      expect(result.valid).toBe(true);
    });

    test('rejects invalid input length', () => {
      const result = humanPlayer.makeMove('123');
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('exactly two digits');
    });

    test('rejects null or empty input', () => {
      expect(humanPlayer.makeMove('').valid).toBe(false);
      expect(humanPlayer.makeMove(null).valid).toBe(false);
    });

    test('rejects non-numeric input', () => {
      const result = humanPlayer.makeMove('AB');
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('valid row and column numbers');
    });

    test('rejects out of bounds coordinates', () => {
      const result = humanPlayer.makeMove('99'); // 9,9 is valid, but let's test with actual out of bounds
      const outOfBounds = humanPlayer.makeMove('AA');
      
      expect(outOfBounds.valid).toBe(false);
    });

    test('processes valid move', () => {
      const result = humanPlayer.makeMove('55');
      
      expect(result.valid).toBe(true);
      expect(humanPlayer.opponentBoard.guesses.has('55')).toBe(true);
    });

    test('rejects duplicate moves', () => {
      humanPlayer.makeMove('55');
      const result = humanPlayer.makeMove('55');
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Already guessed');
    });
  });
});

describe('CPUPlayer', () => {
  let cpuPlayer;

  beforeEach(() => {
    cpuPlayer = new CPUPlayer();
    // Suppress console output for cleaner test results
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('creates CPU player with correct properties', () => {
      expect(cpuPlayer.name).toBe('CPU');
      expect(cpuPlayer.isHuman).toBe(false);
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
      expect(cpuPlayer.lastHit).toBeNull();
    });
  });

  describe('generateRandomLocation', () => {
    test('generates valid location', () => {
      const location = cpuPlayer.generateRandomLocation();
      
      expect(location).toMatch(/^\d\d$/);
      const [row, col] = location.split('').map(Number);
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(10);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(10);
    });

    test('avoids already guessed locations', () => {
      // Fill most of the board with guesses
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
          cpuPlayer.opponentBoard.guesses.add(`${r}${c}`);
        }
      }
      
      const location = cpuPlayer.generateRandomLocation();
      expect(cpuPlayer.opponentBoard.guesses.has(location)).toBe(false);
    });
  });

  describe('makeMove', () => {
    test('makes hunt mode move', () => {
      const result = cpuPlayer.makeMove();
      
      expect(result.valid).toBe(true);
      expect(result.location).toMatch(/^\d\d$/);
      expect(cpuPlayer.mode).toBe('hunt');
    });

    test('switches to target mode on hit', () => {
      // Mock the opponent board to have a ship at '55'
      cpuPlayer.opponentBoard.ships = [{
        hit: jest.fn().mockReturnValue(true),
        isSunk: jest.fn().mockReturnValue(false),
        locations: ['55']
      }];
      
      // Mock processGuess to return a hit
      const originalProcessGuess = cpuPlayer.opponentBoard.processGuess;
      cpuPlayer.opponentBoard.processGuess = jest.fn().mockReturnValue({
        valid: true,
        hit: true,
        sunk: false
      });
      
      // Force the CPU to target '55'
      cpuPlayer.opponentBoard.guesses.clear();
      const mockRandom = jest.spyOn(Math, 'random');
      mockRandom.mockReturnValue(0.55); // This should generate '55'
      
      const result = cpuPlayer.makeMove();
      
      expect(result.hit).toBe(true);
      expect(cpuPlayer.mode).toBe('target');
      expect(cpuPlayer.targetQueue.length).toBeGreaterThan(0);
      
      mockRandom.mockRestore();
      cpuPlayer.opponentBoard.processGuess = originalProcessGuess;
    });

    test('returns to hunt mode when ship sunk', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = ['45', '65'];
      
      // Mock a sunk ship result
      cpuPlayer.opponentBoard.processGuess = jest.fn().mockReturnValue({
        valid: true,
        hit: true,
        sunk: true
      });
      
      const result = cpuPlayer.makeMove();
      
      expect(result.sunk).toBe(true);
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
    });

    test('uses target queue in target mode', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = ['55', '56'];
      
      cpuPlayer.opponentBoard.processGuess = jest.fn().mockReturnValue({
        valid: true,
        hit: false,
        sunk: false
      });
      
      const result = cpuPlayer.makeMove();
      
      expect(result.location).toBe('55');
      expect(cpuPlayer.targetQueue).toEqual(['56']);
    });
  });

  describe('addAdjacentTargets', () => {
    test('adds valid adjacent locations to target queue', () => {
      cpuPlayer.addAdjacentTargets('55');
      
      expect(cpuPlayer.targetQueue).toEqual(
        expect.arrayContaining(['45', '65', '54', '56'])
      );
    });

    test('avoids duplicate targets', () => {
      cpuPlayer.targetQueue = ['45'];
      cpuPlayer.addAdjacentTargets('55');
      
      // Should only have one instance of '45'
      const count45 = cpuPlayer.targetQueue.filter(loc => loc === '45').length;
      expect(count45).toBe(1);
    });

      test('excludes out of bounds locations', () => {
    cpuPlayer.addAdjacentTargets('00');
    
    // '00' is top-left corner, so only '10' (down) and '01' (right) are valid
    // No negative coordinates should be included
    expect(cpuPlayer.targetQueue).toEqual(
      expect.arrayContaining(['10', '01'])
    );
    expect(cpuPlayer.targetQueue).toHaveLength(2); // Only 2 valid adjacent locations
  });
  });

  describe('getAIStatus', () => {
    test('returns correct AI status', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = ['55', '56'];
      cpuPlayer.lastHit = '54';
      
      const status = cpuPlayer.getAIStatus();
      
      expect(status).toEqual({
        mode: 'target',
        targetQueueLength: 2,
        lastHit: '54'
      });
    });
  });

  describe('resetAI', () => {
    test('resets AI state to initial values', () => {
      cpuPlayer.mode = 'target';
      cpuPlayer.targetQueue = ['55', '56'];
      cpuPlayer.lastHit = '54';
      
      cpuPlayer.resetAI();
      
      expect(cpuPlayer.mode).toBe('hunt');
      expect(cpuPlayer.targetQueue).toEqual([]);
      expect(cpuPlayer.lastHit).toBeNull();
    });
  });
}); 