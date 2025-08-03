/**
 * Simple test to verify Jest setup
 */

describe('Jest Setup Test', () => {
  test('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have access to window object', () => {
    expect(window).toBeDefined();
  });

  test('should have access to navigator', () => {
    expect(navigator).toBeDefined();
  });
});
