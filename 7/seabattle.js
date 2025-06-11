import { Game } from './src/Game.js';
import { GameInput } from './src/GameInput.js';

/**
 * Main application class that runs the Sea Battle game
 */
class SeaBattleApp {
  constructor() {
    this.game = new Game();
    this.input = new GameInput();
  }

  /**
   * Starts the application
   */
  async start() {
    try {
      this.input.displayWelcome();
      
      // Ask if user wants to see instructions
      const showInstructions = await this.input.promptShowInstructions();
      if (showInstructions) {
        this.input.displayInstructions();
        await this.input.waitForEnter();
      }

      let playAgain = true;
      while (playAgain) {
        await this.playGame();
        playAgain = await this.input.promptPlayAgain();
        if (playAgain) {
          this.game.reset();
        }
      }

      this.input.display('\nThank you for playing Sea Battle! Goodbye! 👋');
    } catch (error) {
      this.input.displayError(`An unexpected error occurred: ${error.message}`);
    } finally {
      this.input.close();
    }
  }

  /**
   * Plays a single game
   */
  async playGame() {
    try {
      // Initialize the game
      this.game.initialize();

      // Main game loop
      while (!this.game.isGameOver()) {
        // Display current board state
        this.input.display(this.game.getGameDisplay());

        // Get player move
        let validMove = false;
        while (!validMove) {
          const playerInput = await this.input.promptMove();
          const moveResult = this.game.processHumanMove(playerInput);

          if (moveResult.valid) {
            validMove = true;
            this.input.display(moveResult.message);

            // Check if player won
            if (moveResult.gameOver) {
              this.displayGameEnd();
              return;
            }

            // CPU turn
            const cpuResult = this.game.processCPUMove();
            
            // Check if CPU won
            if (cpuResult.gameOver) {
              this.displayGameEnd();
              return;
            }

          } else {
            this.input.displayError(moveResult.message);
          }
        }
      }
    } catch (error) {
      this.input.displayError(`Game error: ${error.message}`);
    }
  }

  /**
   * Displays the game end screen
   */
  displayGameEnd() {
    const winner = this.game.getWinner();
    const stats = this.game.getGameStats();
    
    // Show final board state
    this.input.display(this.game.getGameDisplay());
    
    // Show game result
    this.input.displayGameResult(winner, stats);
  }
}

/**
 * Application entry point
 */
async function main() {
  const app = new SeaBattleApp();
  await app.start();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the application
main().catch(console.error);
