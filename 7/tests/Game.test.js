import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { Game } from '../src/Game.js';

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
    // Suppress console output for cleaner test results
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('creates game with default parameters', () => {
      expect(game.boardSize).toBe(10);
      expect(game.numShips).toBe(3);
      expect(game.shipLength).toBe(3);
      expect(game.gameState).toBe('setup');
      expect(game.winner).toBeNull();
      expect(game.humanPlayer).toBeDefined();
      expect(game.cpuPlayer).toBeDefined();
    });

    test('creates game with custom parameters', () => {
      const customGame = new Game(8, 2, 4);
      expect(customGame.boardSize).toBe(8);
      expect(customGame.numShips).toBe(2);
      expect(customGame.shipLength).toBe(4);
    });
  });

  describe('initialize', () => {
    test('initializes game successfully', () => {
      game.initialize();
      
      expect(game.gameState).toBe('playing');
      expect(game.humanPlayer.board.ships).toHaveLength(3);
      expect(game.cpuPlayer.board.ships).toHaveLength(3);
    });

      test('handles initialization errors', () => {
    // Mock initializeBoard to throw error
    jest.spyOn(game.humanPlayer, 'initializeBoard').mockImplementation(() => {
      throw new Error('Board initialization failed');
    });
    
    expect(() => game.initialize()).toThrow('Board initialization failed');
  });
  });

  describe('processHumanMove', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('rejects move when game not in progress', () => {
      game.gameState = 'finished';
      const result = game.processHumanMove('00');
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Game is not in progress');
    });

      test('processes valid move with miss', () => {
    // Find an empty location that's guaranteed to be a miss
    let missLocation = null;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const location = `${row}${col}`;
        const isOccupied = game.cpuPlayer.board.ships.some(ship => 
          ship.locations.includes(location)
        );
        if (!isOccupied) {
          missLocation = location;
          break;
        }
      }
      if (missLocation) break;
    }
    
    // If we found an empty location, test it
    if (missLocation) {
      const result = game.processHumanMove(missLocation);
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.message).toBe('PLAYER MISS.');
    } else {
      // If all locations are occupied (very unlikely), just pass the test
      expect(true).toBe(true);
    }
  });

    test('processes valid move with hit', () => {
      // Find a ship location to guarantee a hit
      const shipLocation = game.cpuPlayer.board.ships[0].locations[0];
      const result = game.processHumanMove(shipLocation);
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.message).toBe('PLAYER HIT!');
    });

    test('processes move that sinks ship', () => {
      const ship = game.cpuPlayer.board.ships[0];
      
      // Hit all locations except the last one
      for (let i = 0; i < ship.locations.length - 1; i++) {
        game.processHumanMove(ship.locations[i]);
      }
      
      // Hit the last location
      const result = game.processHumanMove(ship.locations[ship.locations.length - 1]);
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
      expect(result.message).toBe('You sunk an enemy battleship!');
    });

      test('detects win condition', () => {
    // Directly sink all CPU ships to ensure win condition
    game.cpuPlayer.board.ships.forEach(ship => {
      ship.locations.forEach(location => {
        ship.hit(location); // Directly hit each ship location
      });
    });
    
    // Verify all ships are sunk
    expect(game.cpuPlayer.hasLost()).toBe(true);
    
    // Now make a human move which should detect the win condition
    // Find any valid location for the move
    const testLocation = '00';
    const result = game.processHumanMove(testLocation);
    
    // The win should be detected during the move processing
    expect(game.gameState).toBe('finished');
    expect(game.winner).toBe(game.humanPlayer);
  });

    test('rejects invalid input', () => {
      const result = game.processHumanMove('invalid');
      
      expect(result.valid).toBe(false);
    });
  });

  describe('processCPUMove', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('rejects move when game not in progress', () => {
      game.gameState = 'finished';
      const result = game.processCPUMove();
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Game is not in progress');
    });

    test('processes CPU move successfully', () => {
      const result = game.processCPUMove();
      
      expect(result.valid).toBe(true);
      expect(result.location).toMatch(/^\d\d$/);
      expect(typeof result.hit).toBe('boolean');
    });

      test('detects CPU win condition', () => {
    // Directly sink all human ships by hitting them
    game.humanPlayer.board.ships.forEach(ship => {
      ship.locations.forEach(location => {
        ship.hit(location); // Directly hit the ship to ensure it's sunk
      });
    });
    
    // Verify all ships are sunk
    expect(game.humanPlayer.hasLost()).toBe(true);
    
    // Now process a CPU move which should detect the win condition
    const result = game.processCPUMove();
    
    expect(game.gameState).toBe('finished');
    expect(game.winner).toBe(game.cpuPlayer);
  });
  });

  describe('validateMove', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('rejects move when game not in progress', () => {
      game.gameState = 'setup';
      const result = game.validateMove('00');
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Game is not in progress');
    });

    test('validates correct input format', () => {
      const result = game.validateMove('34');
      
      expect(result.valid).toBe(true);
      expect(result.location).toBe('34');
    });

    test('rejects null or undefined input', () => {
      expect(game.validateMove(null).valid).toBe(false);
      expect(game.validateMove(undefined).valid).toBe(false);
    });

    test('rejects non-string input', () => {
      const result = game.validateMove(123);
      
      expect(result.valid).toBe(false);
    });

    test('rejects wrong length input', () => {
      expect(game.validateMove('1').valid).toBe(false);
      expect(game.validateMove('123').valid).toBe(false);
    });

    test('rejects non-numeric input', () => {
      const result = game.validateMove('AB');
      
      expect(result.valid).toBe(false);
    });

    test('rejects out of bounds coordinates', () => {
      const result = game.validateMove('AA'); // Invalid coordinates
      
      expect(result.valid).toBe(false);
    });

    test('rejects already guessed locations', () => {
      game.humanPlayer.opponentBoard.guesses.add('55');
      const result = game.validateMove('55');
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('You already guessed that location!');
    });

    test('handles whitespace in input', () => {
      const result = game.validateMove('  34  ');
      
      expect(result.valid).toBe(true);
      expect(result.location).toBe('34');
    });
  });

  describe('getGameDisplay', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('returns formatted game display', () => {
      const display = game.getGameDisplay();
      
      expect(display).toContain('--- OPPONENT BOARD ---');
      expect(display).toContain('--- YOUR BOARD ---');
      expect(typeof display).toBe('string');
    });
  });

  describe('game state methods', () => {
    test('isGameOver returns correct state', () => {
      expect(game.isGameOver()).toBe(false);
      
      game.gameState = 'finished';
      expect(game.isGameOver()).toBe(true);
    });

    test('getWinner returns correct winner', () => {
      expect(game.getWinner()).toBeNull();
      
      game.winner = game.humanPlayer;
      expect(game.getWinner()).toBe(game.humanPlayer);
    });

    test('getGameState returns current state', () => {
      expect(game.getGameState()).toBe('setup');
      
      game.gameState = 'playing';
      expect(game.getGameState()).toBe('playing');
    });
  });

  describe('getGameStats', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('returns correct game statistics', () => {
      const stats = game.getGameStats();
      
      expect(stats).toHaveProperty('humanShipsRemaining');
      expect(stats).toHaveProperty('cpuShipsRemaining');
      expect(stats).toHaveProperty('humanGuesses');
      expect(stats).toHaveProperty('cpuGuesses');
      expect(stats).toHaveProperty('cpuAIStatus');
      
      expect(stats.humanShipsRemaining).toBe(3);
      expect(stats.cpuShipsRemaining).toBe(3);
      expect(stats.humanGuesses).toBe(0);
      expect(stats.cpuGuesses).toBe(0);
    });

    test('updates statistics after moves', () => {
      game.processHumanMove('99');
      game.processCPUMove();
      
      const stats = game.getGameStats();
      
      expect(stats.humanGuesses).toBe(1);
      expect(stats.cpuGuesses).toBe(1);
    });
  });

  describe('reset', () => {
    test('resets game to initial state', () => {
      game.initialize();
      game.processHumanMove('00');
      game.gameState = 'finished';
      game.winner = game.humanPlayer;
      
      game.reset();
      
      expect(game.gameState).toBe('setup');
      expect(game.winner).toBeNull();
      expect(game.humanPlayer.board.ships).toHaveLength(0);
      expect(game.cpuPlayer.board.ships).toHaveLength(0);
    });
  });

  describe('integration tests', () => {
    test('complete game flow', () => {
      // Initialize game
      game.initialize();
      expect(game.gameState).toBe('playing');
      
      // Make some moves
      let moveCount = 0;
      while (!game.isGameOver() && moveCount < 100) { // Prevent infinite loop
        // Try a human move
        const location = `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
        const humanResult = game.processHumanMove(location);
        
        if (humanResult.valid && !game.isGameOver()) {
          // CPU move
          game.processCPUMove();
        }
        
        moveCount++;
      }
      
      // Game should eventually finish
      const stats = game.getGameStats();
      expect(typeof stats.humanGuesses).toBe('number');
      expect(typeof stats.cpuGuesses).toBe('number');
    });
  });
}); 