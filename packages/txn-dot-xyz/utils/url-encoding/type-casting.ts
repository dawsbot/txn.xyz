function isObject(val: any) {
  return val.constructor === Object;
}

// only convert decimal numbers. Hex numbers should stay as-is because ethers.js knows how to handle hex number strings
function isDecimalNumber(val: any) {
  if (val.startsWith?.('0x')) {
    return false;
  }
  return !isNaN(parseFloat(val)) && isFinite(val);
}

function isBoolean(val: unknown) {
  return val === 'false' || val === 'true';
}

function isArray(val: unknown): boolean {
  return Array.isArray(val);
}

export function parseValue(val: any): any {
  if (typeof val == 'undefined' || val == '') {
    return null;
  } else if (isBoolean(val)) {
    return parseBoolean(val);
  } else if (isArray(val)) {
    // handle deeply-nested array data (like `proof` for a merkle `claim` fn)
    return val.map((subValue: any) => parseValue(subValue));
  } else if (isObject(val)) {
    return parseObject(val);
  } else if (isDecimalNumber(val)) {
    return parseNumber(val);
  }
  return val;
}

function parseObject(obj: any) {
  var result: Record<any, any> = {};
  var key, val;
  for (key in obj) {
    val = parseValue(obj[key]);
    if (val !== null) result[key] = val; // ignore null values
  }
  return result;
}

function parseArray(arr: any): Array<unknown> {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    result[i] = parseValue(arr[i]);
  }
  return result;
}

function parseNumber(val: unknown) {
  return Number(val);
}

function parseBoolean(val: unknown) {
  return val === 'true';
}
