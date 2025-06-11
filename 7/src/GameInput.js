import { createInterface } from 'readline';

/**
 * Handles input/output operations for the Sea Battle game
 */
export class GameInput {
  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Prompts the user for input and returns a promise
   * @param {string} question - The question to ask the user
   * @returns {Promise<string>} Promise that resolves with user input
   */
  async prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Displays a message to the console
   * @param {string} message - The message to display
   */
  display(message) {
    console.log(message);
  }

  /**
   * Displays an error message
   * @param {string} error - The error message to display
   */
  displayError(error) {
    console.error(`Error: ${error}`);
  }

  /**
   * Clears the console (cross-platform)
   */
  clearScreen() {
    console.clear();
  }

  /**
   * Closes the input interface
   */
  close() {
    this.rl.close();
  }

  /**
   * Displays the game welcome message
   */
  displayWelcome() {
    this.display('\n=== SEA BATTLE GAME ===');
    this.display('Welcome to the modernized Sea Battle game!');
    this.display('You will play against an intelligent CPU opponent.');
    this.display('Good luck!\n');
  }

  /**
   * Displays the game instructions
   */
  displayInstructions() {
    this.display('\n--- GAME INSTRUCTIONS ---');
    this.display('• Enter coordinates as two digits (e.g., 00 for top-left, 99 for bottom-right)');
    this.display('• ~ represents water (unknown)');
    this.display('• S represents your ships');
    this.display('• X represents a hit');
    this.display('• O represents a miss');
    this.display('• Try to sink all enemy ships before they sink yours!\n');
  }

  /**
   * Displays game statistics
   * @param {Object} stats - Game statistics
   */
  displayStats(stats) {
    this.display('\n--- GAME STATISTICS ---');
    this.display(`Your ships remaining: ${stats.humanShipsRemaining}`);
    this.display(`Enemy ships remaining: ${stats.cpuShipsRemaining}`);
    this.display(`Your guesses made: ${stats.humanGuesses}`);
    this.display(`CPU guesses made: ${stats.cpuGuesses}`);
    this.display(`CPU AI mode: ${stats.cpuAIStatus.mode}`);
  }

  /**
   * Prompts user if they want to play again
   * @returns {Promise<boolean>} Promise that resolves with true if user wants to play again
   */
  async promptPlayAgain() {
    const answer = await this.prompt('\nWould you like to play again? (y/n): ');
    return answer.toLowerCase().startsWith('y');
  }

  /**
   * Prompts user if they want to see instructions
   * @returns {Promise<boolean>} Promise that resolves with true if user wants instructions
   */
  async promptShowInstructions() {
    const answer = await this.prompt('Would you like to see the game instructions? (y/n): ');
    return answer.toLowerCase().startsWith('y');
  }

  /**
   * Prompts user for their move
   * @returns {Promise<string>} Promise that resolves with user input
   */
  async promptMove() {
    return await this.prompt('Enter your guess (e.g., 00): ');
  }

  /**
   * Displays the final game result
   * @param {Player} winner - The winning player
   * @param {Object} finalStats - Final game statistics
   */
  displayGameResult(winner, finalStats) {
    this.display('\n' + '='.repeat(50));
    if (winner.isHuman) {
      this.display('🎉 CONGRATULATIONS! YOU WON! 🎉');
      this.display('You successfully sunk all enemy battleships!');
    } else {
      this.display('💥 GAME OVER! CPU WINS! 💥');
      this.display('The CPU sunk all your battleships!');
    }
    this.display('='.repeat(50));
    this.displayStats(finalStats);
  }

  /**
   * Waits for user to press Enter
   * @param {string} message - Optional message to display
   * @returns {Promise<void>}
   */
  async waitForEnter(message = 'Press Enter to continue...') {
    await this.prompt(message);
  }
} 