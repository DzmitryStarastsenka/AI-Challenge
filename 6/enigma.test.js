const { Enigma, Rotor, plugboardSwap, ROTORS, REFLECTOR, alphabet, mod } = require('./enigma.js');

// Export the necessary components for testing
class TestableEnigma extends Enigma {
  constructor(rotorIDs, rotorPositions, ringSettings, plugboardPairs) {
    super(rotorIDs, rotorPositions, ringSettings, plugboardPairs);
  }
  
  // Expose internal methods for testing
  getRotorPositions() {
    return this.rotors.map(r => r.position);
  }
  
  resetRotorPositions(positions) {
    positions.forEach((pos, i) => {
      this.rotors[i].position = pos;
    });
  }
}

// Test utilities
function runTests() {
  console.log('Running Enigma Machine Tests...\n');
  
  let totalTests = 0;
  let passedTests = 0;
  
  function test(name, testFn) {
    totalTests++;
    try {
      testFn();
      console.log(`✓ ${name}`);
      passedTests++;
    } catch (error) {
      console.log(`✗ ${name}: ${error.message}`);
    }
  }
  
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }
  
  // Test 1: Basic plugboard swap function
  test('Plugboard swap function works correctly', () => {
    assert(plugboardSwap('A', [['A', 'B']]) === 'B', 'Should swap A to B');
    assert(plugboardSwap('B', [['A', 'B']]) === 'A', 'Should swap B to A');
    assert(plugboardSwap('C', [['A', 'B']]) === 'C', 'Should leave C unchanged');
    assert(plugboardSwap('A', []) === 'A', 'Should leave A unchanged with no pairs');
  });
  
  // Test 2: Mod function
  test('Mod function handles negative numbers correctly', () => {
    assert(mod(-1, 26) === 25, 'Should handle negative numbers');
    assert(mod(26, 26) === 0, 'Should handle exact divisors');
    assert(mod(27, 26) === 1, 'Should handle positive numbers');
  });
  
  // Test 3: Rotor construction and basic methods
  test('Rotor construction and methods work', () => {
    const rotor = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 0);
    assert(rotor.position === 0, 'Initial position should be 0');
    assert(rotor.atNotch() === false, 'Should not be at notch initially');
    
    rotor.step();
    assert(rotor.position === 1, 'Position should increment after step');
  });
  
  // Test 4: Rotor at notch detection
  test('Rotor notch detection works', () => {
    const rotor = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 16); // Q is at position 16
    assert(rotor.atNotch() === true, 'Should detect when at notch position');
  });
  
  // Test 5: Basic encryption reversibility (most important test)
  test('Encryption is reversible with same settings', () => {
    const enigma1 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const original = 'HELLO';
    const encrypted = enigma1.process(original);
    const decrypted = enigma2.process(encrypted);
    
    assert(decrypted === original, `Expected "${original}", got "${decrypted}"`);
  });
  
  // Test 6: Encryption with plugboard is reversible
  test('Encryption with plugboard is reversible', () => {
    const plugboard = [['A', 'B'], ['C', 'D']];
    const enigma1 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugboard);
    const enigma2 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugboard);
    
    const original = 'ABCD';
    const encrypted = enigma1.process(original);
    const decrypted = enigma2.process(encrypted);
    
    assert(decrypted === original, `Expected "${original}", got "${decrypted}"`);
  });
  
  // Test 7: Different initial positions produce different results
  test('Different rotor positions produce different encryptions', () => {
    const enigma1 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new TestableEnigma([0, 1, 2], [1, 0, 0], [0, 0, 0], []);
    
    const message = 'A';
    const result1 = enigma1.process(message);
    const result2 = enigma2.process(message);
    
    assert(result1 !== result2, 'Different positions should produce different results');
  });
  
  // Test 8: Rotor stepping works correctly
  test('Rotor stepping advances correctly', () => {
    const enigma = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const initialPositions = enigma.getRotorPositions();
    
    enigma.process('A'); // This should step the rightmost rotor
    const newPositions = enigma.getRotorPositions();
    
    assert(newPositions[2] === 1, 'Rightmost rotor should step');
    assert(newPositions[1] === initialPositions[1], 'Middle rotor should not step');
    assert(newPositions[0] === initialPositions[0], 'Leftmost rotor should not step');
  });
  
  // Test 9: Ring settings affect encryption
  test('Ring settings affect encryption results', () => {
    const enigma1 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new TestableEnigma([0, 1, 2], [0, 0, 0], [1, 0, 0], []);
    
    const message = 'A';
    const result1 = enigma1.process(message);
    const result2 = enigma2.process(message);
    
    assert(result1 !== result2, 'Different ring settings should produce different results');
  });
  
  // Test 10: Non-alphabetic characters pass through unchanged
  test('Non-alphabetic characters pass through unchanged', () => {
    const enigma = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const message = 'A1B2C!';
    const result = enigma.process(message);
    
    // The numbers and punctuation should remain unchanged
    assert(result.includes('1'), 'Numbers should pass through unchanged');
    assert(result.includes('2'), 'Numbers should pass through unchanged');
    assert(result.includes('!'), 'Punctuation should pass through unchanged');
  });
  
  // Test 11: Empty string handling
  test('Empty string returns empty string', () => {
    const enigma = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    assert(enigma.process('') === '', 'Empty string should return empty string');
  });
  
  // Test 12: Single character encryption/decryption
  test('Single character encryption is reversible', () => {
    const enigma1 = new TestableEnigma([0, 1, 2], [5, 10, 15], [0, 0, 0], [['A', 'Z']]);
    const enigma2 = new TestableEnigma([0, 1, 2], [5, 10, 15], [0, 0, 0], [['A', 'Z']]);
    
    for (let i = 0; i < alphabet.length; i++) {
      const char = alphabet[i];
      const encrypted = enigma1.process(char);
      const decrypted = enigma2.process(encrypted);
      assert(decrypted === char, `Character ${char} should decrypt correctly`);
      
      // Reset positions for next test
      enigma1.resetRotorPositions([5, 10, 15]);
      enigma2.resetRotorPositions([5, 10, 15]);
    }
  });
  
  // Test 13: Long message encryption/decryption
  test('Long message encryption is reversible', () => {
    const enigma1 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const longMessage = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
    const encrypted = enigma1.process(longMessage);
    const decrypted = enigma2.process(encrypted);
    
    assert(decrypted === longMessage, 'Long message should decrypt correctly');
  });
  
  // Test 14: Plugboard with multiple pairs
  test('Multiple plugboard pairs work correctly', () => {
    const plugboard = [['A', 'B'], ['C', 'D'], ['E', 'F']];
    const enigma1 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugboard);
    const enigma2 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugboard);
    
    const message = 'ABCDEF';
    const encrypted = enigma1.process(message);
    const decrypted = enigma2.process(encrypted);
    
    assert(decrypted === message, 'Multiple plugboard pairs should work correctly');
  });
  
  // Test 15: Case insensitivity
  test('Input is converted to uppercase', () => {
    const enigma1 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new TestableEnigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const lower = 'hello';
    const upper = 'HELLO';
    
    const encryptedLower = enigma1.process(lower);
    enigma2.resetRotorPositions([0, 0, 0]);
    const encryptedUpper = enigma2.process(upper);
    
    assert(encryptedLower === encryptedUpper, 'Lowercase and uppercase should produce same result');
  });
  
  // Summary
  console.log(`\n=== Test Summary ===`);
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Coverage: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n❌ Some tests failed!');
  }
  
  return { totalTests, passedTests };
}

// Module exports for testing framework compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TestableEnigma,
    runTests
  };
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
} 