import { parseValue } from './type-casting';

// These lock in the v0 type-casting behavior so the v1 work cannot
// silently change how existing v0 URLs are decoded.
describe('parseValue (v0 type-casting)', () => {
  it('treats undefined and empty string as null', () => {
    expect(parseValue(undefined)).toBeNull();
    expect(parseValue('')).toBeNull();
  });

  it('parses boolean strings into booleans', () => {
    expect(parseValue('true')).toBe(true);
    expect(parseValue('false')).toBe(false);
  });

  it('parses decimal number strings into numbers', () => {
    expect(parseValue('100')).toBe(100);
    expect(parseValue('0')).toBe(0);
  });

  it('leaves hex strings untouched', () => {
    expect(parseValue('0x1')).toBe('0x1');
    expect(parseValue('0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB')).toBe(
      '0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB',
    );
  });

  it('recurses into nested arrays', () => {
    expect(parseValue(['1', ['0x2', 'true']])).toStrictEqual([
      1,
      ['0x2', true],
    ]);
  });
});
