import { Ship } from './Ship.js';

/**
 * Represents a game board in the Sea Battle game
 */
export class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = this.createEmptyGrid();
    this.ships = [];
    this.guesses = new Set();
  }

  /**
   * Creates an empty grid filled with water (~)
   * @returns {string[][]} Empty grid
   */
  createEmptyGrid() {
    return Array(this.size).fill(null).map(() => 
      Array(this.size).fill('~')
    );
  }

  /**
   * Places ships randomly on the board
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   */
  placeShipsRandomly(numShips, shipLength) {
    let placedShips = 0;
    const maxAttempts = 1000; // Prevent infinite loops
    let attempts = 0;

    while (placedShips < numShips && attempts < maxAttempts) {
      attempts++;
      const ship = new Ship(shipLength);
      const locations = this.generateRandomShipLocations(shipLength);

      if (locations && this.canPlaceShip(locations)) {
        ship.place(locations);
        this.placeShip(ship, locations);
        this.ships.push(ship);
        placedShips++;
      }
    }

    if (placedShips < numShips) {
      throw new Error(`Could only place ${placedShips} out of ${numShips} ships`);
    }
  }

  /**
   * Generates random locations for a ship
   * @param {number} shipLength - Length of the ship
   * @returns {string[]|null} Array of location strings or null if invalid
   */
  generateRandomShipLocations(shipLength) {
    const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    let startRow, startCol;

    if (orientation === 'horizontal') {
      startRow = Math.floor(Math.random() * this.size);
      startCol = Math.floor(Math.random() * (this.size - shipLength + 1));
    } else {
      startRow = Math.floor(Math.random() * (this.size - shipLength + 1));
      startCol = Math.floor(Math.random() * this.size);
    }

    const locations = [];
    for (let i = 0; i < shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      locations.push(`${row}${col}`);
    }

    return locations;
  }

  /**
   * Checks if a ship can be placed at the given locations
   * @param {string[]} locations - Array of location strings
   * @returns {boolean} True if ship can be placed
   */
  canPlaceShip(locations) {
    return locations.every(location => {
      const [row, col] = this.parseLocation(location);
      return this.isValidLocation(row, col) && this.grid[row][col] === '~';
    });
  }

  /**
   * Places a ship on the board (for display purposes)
   * @param {Ship} ship - The ship to place
   * @param {string[]} locations - Array of location strings
   * @param {boolean} showShips - Whether to show ships on the grid (default: false)
   */
  placeShip(ship, locations, showShips = false) {
    if (showShips) {
      locations.forEach(location => {
        const [row, col] = this.parseLocation(location);
        this.grid[row][col] = 'S';
      });
    }
  }

  /**
   * Processes a guess at a specific location
   * @param {string} location - The location to guess (e.g., "00")
   * @returns {Object} Result of the guess
   */
  processGuess(location) {
    if (this.guesses.has(location)) {
      return { valid: false, message: 'Already guessed that location!' };
    }

    const [row, col] = this.parseLocation(location);
    if (!this.isValidLocation(row, col)) {
      return { valid: false, message: 'Invalid location!' };
    }

    this.guesses.add(location);
    let hit = false;
    let sunkShip = null;

    // Check if any ship is hit
    for (const ship of this.ships) {
      if (ship.hit(location)) {
        hit = true;
        this.grid[row][col] = 'X';
        if (ship.isSunk()) {
          sunkShip = ship;
        }
        break;
      }
    }

    if (!hit) {
      this.grid[row][col] = 'O';
    }

    return {
      valid: true,
      hit,
      sunk: sunkShip !== null,
      sunkShip,
      message: hit ? (sunkShip ? 'Hit and sunk!' : 'Hit!') : 'Miss!'
    };
  }

  /**
   * Parses a location string into row and column numbers
   * @param {string} location - Location string (e.g., "00")
   * @returns {number[]} Array of [row, col]
   */
  parseLocation(location) {
    if (location.length !== 2) {
      throw new Error('Location must be exactly 2 characters');
    }
    return [parseInt(location[0]), parseInt(location[1])];
  }

  /**
   * Checks if a location is valid
   * @param {number} row - Row number
   * @param {number} col - Column number
   * @returns {boolean} True if location is valid
   */
  isValidLocation(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Gets the display representation of the board
   * @param {boolean} showShips - Whether to show ships on the board
   * @returns {string} String representation of the board
   */
  getDisplayString(showShips = false) {
    let result = '  ';
    
    // Header row
    for (let i = 0; i < this.size; i++) {
      result += i + ' ';
    }
    result += '\n';

    // Board rows
    for (let i = 0; i < this.size; i++) {
      result += i + ' ';
      for (let j = 0; j < this.size; j++) {
        let cell = this.grid[i][j];
        if (!showShips && cell === 'S') {
          cell = '~'; // Hide ships on opponent board
        }
        result += cell + ' ';
      }
      result += '\n';
    }

    return result;
  }

  /**
   * Gets the number of remaining ships
   * @returns {number} Number of ships not yet sunk
   */
  getRemainingShipsCount() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  /**
   * Checks if all ships are sunk
   * @returns {boolean} True if all ships are sunk
   */
  allShipsSunk() {
    return this.ships.every(ship => ship.isSunk());
  }

  /**
   * Gets adjacent locations for targeting mode
   * @param {string} location - Center location
   * @returns {string[]} Array of valid adjacent locations
   */
  getAdjacentLocations(location) {
    const [row, col] = this.parseLocation(location);
    const adjacent = [
      [row - 1, col], // up
      [row + 1, col], // down
      [row, col - 1], // left
      [row, col + 1]  // right
    ];

    return adjacent
      .filter(([r, c]) => this.isValidLocation(r, c))
      .map(([r, c]) => `${r}${c}`)
      .filter(loc => !this.guesses.has(loc));
  }

  /**
   * Resets the board to initial state
   */
  reset() {
    this.grid = this.createEmptyGrid();
    this.ships = [];
    this.guesses.clear();
  }
} 