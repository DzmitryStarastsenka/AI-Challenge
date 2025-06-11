import { Board } from './Board.js';

/**
 * Base Player class
 */
export class Player {
  constructor(name, isHuman = false) {
    this.name = name;
    this.isHuman = isHuman;
    this.board = new Board();
    this.opponentBoard = new Board(); // For tracking guesses against opponent
  }

  /**
   * Initializes the player's board with ships
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   */
  initializeBoard(numShips, shipLength) {
    this.board.placeShipsRandomly(numShips, shipLength);
    // Show ships on player's own board
    this.board.ships.forEach(ship => {
      this.board.placeShip(ship, ship.locations, true);
    });
  }

  /**
   * Makes a move against the opponent
   * @param {string} location - The location to target
   * @returns {Object} Result of the move
   */
  makeMove(location) {
    throw new Error('makeMove must be implemented by subclass');
  }

  /**
   * Receives a move from the opponent
   * @param {string} location - The location being targeted
   * @returns {Object} Result of the opponent's move
   */
  receiveMove(location) {
    return this.board.processGuess(location);
  }

  /**
   * Checks if the player has lost (all ships sunk)
   * @returns {boolean} True if player has lost
   */
  hasLost() {
    return this.board.allShipsSunk();
  }

  /**
   * Gets the display string for both boards
   * @returns {string} Formatted board display
   */
  getBoardsDisplay() {
    const opponentDisplay = this.opponentBoard.getDisplayString(false);
    const playerDisplay = this.board.getDisplayString(true);
    
    const opponentLines = opponentDisplay.split('\n');
    const playerLines = playerDisplay.split('\n');
    
    let result = '\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---\n';
    
    for (let i = 0; i < Math.max(opponentLines.length, playerLines.length); i++) {
      const opponentLine = opponentLines[i] || '';
      const playerLine = playerLines[i] || '';
      result += opponentLine.padEnd(30) + playerLine + '\n';
    }
    
    return result;
  }
}

/**
 * Human Player class
 */
export class HumanPlayer extends Player {
  constructor(name = 'Player') {
    super(name, true);
  }

  /**
   * Makes a move (for human players, this validates the input)
   * @param {string} location - The location to target
   * @returns {Object} Result of the move
   */
  makeMove(location) {
    // Validate input format
    if (!location || location.length !== 2) {
      return { 
        valid: false, 
        message: 'Input must be exactly two digits (e.g., 00, 34, 98).' 
      };
    }

    const [row, col] = location.split('').map(char => parseInt(char));
    if (isNaN(row) || isNaN(col) || row < 0 || row >= 10 || col < 0 || col >= 10) {
      return { 
        valid: false, 
        message: 'Please enter valid row and column numbers between 0 and 9.' 
      };
    }

    return this.opponentBoard.processGuess(location);
  }
}

/**
 * CPU Player class with AI logic
 */
export class CPUPlayer extends Player {
  constructor(name = 'CPU') {
    super(name, false);
    this.mode = 'hunt'; // 'hunt' or 'target'
    this.targetQueue = [];
    this.lastHit = null;
  }

  /**
   * Makes an AI move
   * @returns {Object} Result of the move including the location chosen
   */
  makeMove() {
    let location;
    
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      location = this.targetQueue.shift();
    } else {
      this.mode = 'hunt';
      location = this.generateRandomLocation();
    }

    const result = this.opponentBoard.processGuess(location);
    result.location = location;

    // Process the result for AI state management
    if (result.valid) {
      if (result.hit) {
        this.lastHit = location;
        if (result.sunk) {
          // Ship sunk, go back to hunt mode
          this.mode = 'hunt';
          this.targetQueue = [];
        } else {
          // Hit but not sunk, switch to target mode
          this.mode = 'target';
          this.addAdjacentTargets(location);
        }
      } else if (this.mode === 'target' && this.targetQueue.length === 0) {
        // Miss in target mode and no more targets, go back to hunt
        this.mode = 'hunt';
      }
    }

    return result;
  }

  /**
   * Generates a random location that hasn't been guessed
   * @returns {string} Random location string
   */
  generateRandomLocation() {
    let location;
    let attempts = 0;
    const maxAttempts = 1000;
    
    do {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      location = `${row}${col}`;
      attempts++;
    } while (this.opponentBoard.guesses.has(location) && attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
      // Fallback: find first available location
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          location = `${r}${c}`;
          if (!this.opponentBoard.guesses.has(location)) {
            return location;
          }
        }
      }
    }
    
    return location;
  }

  /**
   * Adds adjacent locations to the target queue
   * @param {string} location - The location that was hit
   */
  addAdjacentTargets(location) {
    const adjacentLocations = this.opponentBoard.getAdjacentLocations(location);
    
    // Add unique locations to target queue
    adjacentLocations.forEach(adjLocation => {
      if (!this.targetQueue.includes(adjLocation)) {
        this.targetQueue.push(adjLocation);
      }
    });
  }

  /**
   * Gets the current AI mode and status
   * @returns {Object} AI status information
   */
  getAIStatus() {
    return {
      mode: this.mode,
      targetQueueLength: this.targetQueue.length,
      lastHit: this.lastHit
    };
  }

  /**
   * Resets AI state
   */
  resetAI() {
    this.mode = 'hunt';
    this.targetQueue = [];
    this.lastHit = null;
  }
} 