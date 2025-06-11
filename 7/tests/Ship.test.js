import { describe, test, expect, beforeEach } from '@jest/globals';
import { Ship } from '../src/Ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  describe('constructor', () => {
    test('creates ship with default length 3', () => {
      const defaultShip = new Ship();
      expect(defaultShip.length).toBe(3);
      expect(defaultShip.locations).toEqual([]);
      expect(defaultShip.hits).toEqual([false, false, false]);
      expect(defaultShip.sunk).toBe(false);
    });

    test('creates ship with specified length', () => {
      const ship5 = new Ship(5);
      expect(ship5.length).toBe(5);
      expect(ship5.hits).toEqual([false, false, false, false, false]);
    });
  });

  describe('place', () => {
    test('places ship with correct number of locations', () => {
      const locations = ['00', '01', '02'];
      ship.place(locations);
      
      expect(ship.locations).toEqual(locations);
      expect(ship.hits).toEqual([false, false, false]);
      expect(ship.sunk).toBe(false);
    });

    test('throws error when wrong number of locations provided', () => {
      expect(() => {
        ship.place(['00', '01']);
      }).toThrow('Ship requires exactly 3 locations');
    });

    test('resets ship state when placed again', () => {
      ship.place(['00', '01', '02']);
      ship.hit('00');
      
      ship.place(['10', '11', '12']);
      
      expect(ship.locations).toEqual(['10', '11', '12']);
      expect(ship.hits).toEqual([false, false, false]);
      expect(ship.sunk).toBe(false);
    });
  });

  describe('hit', () => {
    beforeEach(() => {
      ship.place(['00', '01', '02']);
    });

    test('successfully hits ship at valid location', () => {
      const result = ship.hit('01');
      
      expect(result).toBe(true);
      expect(ship.hits[1]).toBe(true);
      expect(ship.sunk).toBe(false);
    });

    test('returns false for location not part of ship', () => {
      const result = ship.hit('99');
      
      expect(result).toBe(false);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('returns false when hitting same location twice', () => {
      ship.hit('00');
      const result = ship.hit('00');
      
      expect(result).toBe(false);
      expect(ship.hits[0]).toBe(true);
    });

    test('marks ship as sunk when all locations hit', () => {
      ship.hit('00');
      ship.hit('01');
      expect(ship.sunk).toBe(false);
      
      ship.hit('02');
      expect(ship.sunk).toBe(true);
    });
  });

  describe('isSunk', () => {
    beforeEach(() => {
      ship.place(['00', '01', '02']);
    });

    test('returns false when ship not fully hit', () => {
      ship.hit('00');
      expect(ship.isSunk()).toBe(false);
    });

    test('returns true when all locations hit', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('occupiesLocation', () => {
    beforeEach(() => {
      ship.place(['00', '01', '02']);
    });

    test('returns true for location occupied by ship', () => {
      expect(ship.occupiesLocation('01')).toBe(true);
    });

    test('returns false for location not occupied by ship', () => {
      expect(ship.occupiesLocation('99')).toBe(false);
    });
  });

  describe('getStatus', () => {
    beforeEach(() => {
      ship.place(['00', '01', '02']);
    });

    test('returns correct status for undamaged ship', () => {
      const status = ship.getStatus();
      
      expect(status).toEqual({
        length: 3,
        locations: ['00', '01', '02'],
        hits: [false, false, false],
        sunk: false,
        hitCount: 0
      });
    });

    test('returns correct status for partially damaged ship', () => {
      ship.hit('00');
      ship.hit('02');
      
      const status = ship.getStatus();
      
      expect(status).toEqual({
        length: 3,
        locations: ['00', '01', '02'],
        hits: [true, false, true],
        sunk: false,
        hitCount: 2
      });
    });

    test('returns correct status for sunk ship', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      
      const status = ship.getStatus();
      
      expect(status).toEqual({
        length: 3,
        locations: ['00', '01', '02'],
        hits: [true, true, true],
        sunk: true,
        hitCount: 3
      });
    });

    test('returns deep copy of arrays', () => {
      const status = ship.getStatus();
      status.locations.push('03');
      status.hits.push(true);
      
      expect(ship.locations).toEqual(['00', '01', '02']);
      expect(ship.hits).toEqual([false, false, false]);
    });
  });
}); 