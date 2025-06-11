import { HumanPlayer, CPUPlayer } from './Player.js';

/**
 * Main Game class that orchestrates the Sea Battle game
 */
export class Game {
  constructor(boardSize = 10, numShips = 3, shipLength = 3) {
    this.boardSize = boardSize;
    this.numShips = numShips;
    this.shipLength = shipLength;
    this.humanPlayer = new HumanPlayer('Player');
    this.cpuPlayer = new CPUPlayer('CPU');
    this.gameState = 'setup'; // 'setup', 'playing', 'finished'
    this.winner = null;
  }

  /**
   * Initializes the game by placing ships for both players
   */
  initialize() {
    try {
      console.log('Setting up the game...');
      this.humanPlayer.initializeBoard(this.numShips, this.shipLength);
      this.cpuPlayer.initializeBoard(this.numShips, this.shipLength);
      this.gameState = 'playing';
      console.log('Game setup complete!');
      console.log(`\nLet's play Sea Battle!`);
      console.log(`Try to sink the ${this.numShips} enemy ships.`);
      console.log('Enter coordinates as two digits (e.g., 00, 34, 98)');
    } catch (error) {
      console.error('Error setting up game:', error.message);
      throw error;
    }
  }

  /**
   * Processes a human player's move
   * @param {string} input - The player's input
   * @returns {Object} Result of the move
   */
  processHumanMove(input) {
    if (this.gameState !== 'playing') {
      return { valid: false, message: 'Game is not in progress' };
    }

    const moveResult = this.humanPlayer.makeMove(input);
    
    if (!moveResult.valid) {
      return moveResult;
    }

    // Process the move against CPU's board
    const hitResult = this.cpuPlayer.receiveMove(input);
    
    // Update human player's opponent board to reflect the result
    const [row, col] = this.humanPlayer.opponentBoard.parseLocation(input);
    this.humanPlayer.opponentBoard.grid[row][col] = hitResult.hit ? 'X' : 'O';
    this.humanPlayer.opponentBoard.guesses.add(input);

    let message = hitResult.hit ? 'PLAYER HIT!' : 'PLAYER MISS.';
    if (hitResult.sunk) {
      message = 'You sunk an enemy battleship!';
    }

    // Check for win condition
    if (this.cpuPlayer.hasLost()) {
      this.gameState = 'finished';
      this.winner = this.humanPlayer;
      message += '\n\n*** CONGRATULATIONS! You sunk all enemy battleships! ***';
    }

    return {
      valid: true,
      hit: hitResult.hit,
      sunk: hitResult.sunk,
      message,
      gameOver: this.gameState === 'finished'
    };
  }

  /**
   * Processes the CPU's move
   * @returns {Object} Result of the CPU's move
   */
  processCPUMove() {
    if (this.gameState !== 'playing') {
      return { valid: false, message: 'Game is not in progress' };
    }

    console.log("\n--- CPU's Turn ---");
    
    const moveResult = this.cpuPlayer.makeMove();
    const location = moveResult.location;
    
    // Process the move against human's board
    const hitResult = this.humanPlayer.receiveMove(location);
    
    let message = hitResult.hit ? `CPU HIT at ${location}!` : `CPU MISS at ${location}.`;
    if (hitResult.sunk) {
      message = `CPU sunk your battleship at ${location}!`;
    }

    console.log(message);

    // Check for win condition
    if (this.humanPlayer.hasLost()) {
      this.gameState = 'finished';
      this.winner = this.cpuPlayer;
      console.log('\n*** GAME OVER! The CPU sunk all your battleships! ***');
    }

    return {
      valid: true,
      hit: hitResult.hit,
      sunk: hitResult.sunk,
      location,
      message,
      gameOver: this.gameState === 'finished'
    };
  }

  /**
   * Gets the current game display
   * @returns {string} Formatted game board display
   */
  getGameDisplay() {
    return this.humanPlayer.getBoardsDisplay();
  }

  /**
   * Checks if the game is over
   * @returns {boolean} True if game is finished
   */
  isGameOver() {
    return this.gameState === 'finished';
  }

  /**
   * Gets the winner of the game
   * @returns {Player|null} The winning player or null if game not finished
   */
  getWinner() {
    return this.winner;
  }

  /**
   * Gets the current game state
   * @returns {string} Current game state
   */
  getGameState() {
    return this.gameState;
  }

  /**
   * Gets game statistics
   * @returns {Object} Game statistics
   */
  getGameStats() {
    return {
      humanShipsRemaining: this.humanPlayer.board.getRemainingShipsCount(),
      cpuShipsRemaining: this.cpuPlayer.board.getRemainingShipsCount(),
      humanGuesses: this.humanPlayer.opponentBoard.guesses.size,
      cpuGuesses: this.cpuPlayer.opponentBoard.guesses.size,
      cpuAIStatus: this.cpuPlayer.getAIStatus()
    };
  }

  /**
   * Resets the game to initial state
   */
  reset() {
    this.humanPlayer = new HumanPlayer('Player');
    this.cpuPlayer = new CPUPlayer('CPU');
    this.gameState = 'setup';
    this.winner = null;
  }

  /**
   * Validates if a move can be made
   * @param {string} input - The input to validate
   * @returns {Object} Validation result
   */
  validateMove(input) {
    if (this.gameState !== 'playing') {
      return { valid: false, message: 'Game is not in progress' };
    }

    if (!input || typeof input !== 'string') {
      return { valid: false, message: 'Input is required' };
    }

    const trimmedInput = input.trim();
    if (trimmedInput.length !== 2) {
      return { valid: false, message: 'Input must be exactly two digits (e.g., 00, 34, 98).' };
    }

    const [row, col] = trimmedInput.split('').map(char => parseInt(char));
    if (isNaN(row) || isNaN(col) || row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
      return { 
        valid: false, 
        message: `Please enter valid row and column numbers between 0 and ${this.boardSize - 1}.` 
      };
    }

    if (this.humanPlayer.opponentBoard.guesses.has(trimmedInput)) {
      return { valid: false, message: 'You already guessed that location!' };
    }

    return { valid: true, location: trimmedInput };
  }
} 