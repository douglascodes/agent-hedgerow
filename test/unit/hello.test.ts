import { describe, expect, it } from 'vitest';
import { greet } from '../../src/hello.js';

describe('greet', () => {
  it('greets by name', () => {
    expect(greet('Douglas')).toBe('Hello, Douglas!');
  });

  it('trims surrounding whitespace rather than including it in the greeting', () => {
    expect(greet('  Douglas\n')).toBe('Hello, Douglas!');
  });

  it('preserves interior whitespace, which is part of the name', () => {
    expect(greet('Douglas King')).toBe('Hello, Douglas King!');
  });

  it('rejects an empty name', () => {
    expect(() => greet('')).toThrow('Cannot greet a blank name');
  });

  it('rejects a name that is only whitespace', () => {
    expect(() => greet('   \t ')).toThrow('Cannot greet a blank name');
  });
});
