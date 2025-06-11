# Sea Battle CLI Game (Modernized)

This is a modernized, well-structured command-line interface (CLI) implementation of the classic Sea Battle (Battleship) game, completely refactored using modern JavaScript (ES6+) with comprehensive testing.

## Features

- **Modern JavaScript**: Built with ES6+ features including classes, modules, async/await, and arrow functions
- **Modular Architecture**: Clean separation of concerns with dedicated modules for game logic, players, board management, and I/O
- **Intelligent CPU Opponent**: Advanced AI with hunt and target modes for challenging gameplay
- **Comprehensive Testing**: 100+ unit tests covering all core functionality with 93%+ code coverage
- **Enhanced User Experience**: Improved input validation, error handling, and game flow
- **Object-Oriented Design**: Proper encapsulation and inheritance for maintainable code

## Gameplay

You play against an intelligent CPU opponent. Both players place their ships randomly on a 10x10 grid. Players take turns guessing coordinates to hit the opponent's ships. The first player to sink all of the opponent's ships wins.

### Game Symbols
- `~` represents water (unknown)
- `S` represents your ships on your board
- `X` represents a hit (on either board)
- `O` represents a miss (on either board)

### Game Rules
- 10x10 game board
- 3 ships per player, each 3 squares long
- Ships are placed randomly at game start
- Enter coordinates as two digits (e.g., `00`, `34`, `99`)
- First to sink all enemy ships wins!

## Installation & Setup

1. **Ensure you have Node.js installed** (version 14 or higher recommended)
   - Download from [https://nodejs.org/](https://nodejs.org/)

2. **Navigate to the project directory** in your terminal

3. **Install dependencies** (for testing):
   ```bash
   npm install
   ```

## How to Run

### Start the Game
```bash
npm start
```
or
```bash
node seabattle.js
```

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Project Structure

```
7/
├── src/                    # Source code modules
│   ├── Ship.js            # Ship class with hit detection
│   ├── Board.js           # Board management and display
│   ├── Player.js          # Player classes (Human & CPU)
│   ├── Game.js            # Main game controller
│   └── GameInput.js       # Input/output handling
├── tests/                 # Comprehensive test suite
│   ├── Ship.test.js       # Ship class tests
│   ├── Board.test.js      # Board class tests
│   ├── Player.test.js     # Player classes tests
│   └── Game.test.js       # Game class tests
├── seabattle.js           # Application entry point
├── package.json           # Project configuration
├── jest.config.js         # Test framework configuration
├── refactoring.md         # Detailed refactoring documentation
├── test_report.txt        # Test coverage report
└── README.md              # This file
```

## Architecture Overview

The game follows modern software engineering principles:

- **Ship Class**: Manages individual ship state, hits, and sunk detection
- **Board Class**: Handles grid operations, ship placement, and guess processing
- **Player Classes**: Base class with HumanPlayer and CPUPlayer extensions
- **Game Class**: Orchestrates game flow and manages player interactions
- **GameInput Class**: Handles all user input/output with async/await patterns

## Key Improvements from Original

### Modernization
- ✅ ES6+ syntax (classes, modules, const/let, arrow functions)
- ✅ Async/await pattern for input handling
- ✅ Modern array methods and destructuring
- ✅ Template literals and default parameters

### Code Quality
- ✅ Modular architecture with clear separation of concerns
- ✅ Eliminated all global variables
- ✅ Comprehensive error handling
- ✅ Extensive JSDoc documentation
- ✅ Consistent naming conventions

### Testing
- ✅ 100+ unit tests with Jest framework
- ✅ 93%+ code coverage
- ✅ Integration tests for complete game flows
- ✅ Mock objects for isolated testing
- ✅ Edge case coverage

### Functionality
- ✅ All original game mechanics preserved
- ✅ Enhanced input validation
- ✅ Improved AI with strategic targeting
- ✅ Better user interface and messaging
- ✅ Game statistics and state management

## CPU AI Strategy

The CPU opponent uses an intelligent strategy:

1. **Hunt Mode**: Random targeting to find ships
2. **Target Mode**: When a hit is scored, systematically target adjacent squares
3. **Smart Targeting**: Prioritizes likely ship locations based on previous hits
4. **Collision Avoidance**: Avoids impossible placements and duplicate guesses

## Development

This project demonstrates modern JavaScript development practices:

- Object-oriented programming with ES6 classes
- Module system with import/export
- Comprehensive testing with Jest
- Error handling and input validation
- Async programming patterns
- Clean code principles

## Testing

The project includes extensive testing:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Test coverage exceeds 93% with comprehensive coverage of:
- All class methods and properties
- Edge cases and error conditions
- Game flow and state transitions
- Input validation scenarios
- AI behavior patterns

## Contributing

This codebase serves as an excellent example of:
- Legacy code modernization
- Test-driven development
- Clean architecture principles
- ES6+ JavaScript features
- Object-oriented design patterns

## License

MIT License - Feel free to use this code for educational purposes or as a starting point for your own projects.

---

**Enjoy the modernized Sea Battle experience!** 🚢⚓ 