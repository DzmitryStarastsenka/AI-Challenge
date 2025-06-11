/**
 * Represents a ship in the Sea Battle game
 */
export class Ship {
  constructor(length = 3) {
    this.length = length;
    this.locations = [];
    this.hits = new Array(length).fill(false);
    this.sunk = false;
  }

  /**
   * Places the ship at specified locations
   * @param {string[]} locations - Array of location strings (e.g., ["00", "01", "02"])
   */
  place(locations) {
    if (locations.length !== this.length) {
      throw new Error(`Ship requires exactly ${this.length} locations`);
    }
    this.locations = [...locations];
    this.hits = new Array(this.length).fill(false);
    this.sunk = false;
  }

  /**
   * Attempts to hit the ship at a specific location
   * @param {string} location - The location to hit (e.g., "00")
   * @returns {boolean} True if hit was successful, false if location not found
   */
  hit(location) {
    const index = this.locations.indexOf(location);
    if (index === -1) {
      return false; // Location not part of this ship
    }

    if (this.hits[index]) {
      return false; // Already hit
    }

    this.hits[index] = true;
    this.checkIfSunk();
    return true;
  }

  /**
   * Checks if the ship is sunk and updates the sunk status
   */
  checkIfSunk() {
    this.sunk = this.hits.every(hit => hit);
  }

  /**
   * Checks if the ship is sunk
   * @returns {boolean} True if ship is sunk
   */
  isSunk() {
    return this.sunk;
  }

  /**
   * Checks if a location is part of this ship
   * @param {string} location - The location to check
   * @returns {boolean} True if location is part of ship
   */
  occupiesLocation(location) {
    return this.locations.includes(location);
  }

  /**
   * Gets the ship's status
   * @returns {Object} Ship status information
   */
  getStatus() {
    return {
      length: this.length,
      locations: [...this.locations],
      hits: [...this.hits],
      sunk: this.sunk,
      hitCount: this.hits.filter(hit => hit).length
    };
  }
} 