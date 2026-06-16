import { encodeFunctionData } from 'viem';
import {
  buildV1Url,
  encodeCalldata,
  parseChainId,
  parseRouterQuery,
  parseTransaction,
  parseTxValue,
} from './v1';

describe('parseChainId', () => {
  it('parses decimal chain id strings', () => {
    expect(parseChainId('1')).toBe(1);
    expect(parseChainId('8453')).toBe(8453);
  });
  it('parses hex chain id strings (eth_chainId style)', () => {
    expect(parseChainId('0x1')).toBe(1);
    expect(parseChainId('0x2105')).toBe(8453);
  });
  it('throws on a missing or invalid chain id', () => {
    expect(() => parseChainId(undefined as unknown as string)).toThrow();
    expect(() => parseChainId('not-a-number')).toThrow();
  });
});

describe('parseTxValue', () => {
  it('defaults to 0n when undefined', () => {
    expect(parseTxValue(undefined)).toBe(0n);
  });
  it('parses decimal strings as wei', () => {
    expect(parseTxValue('1000000000000000000')).toBe(1000000000000000000n);
  });
  it('parses hex strings as wei', () => {
    expect(parseTxValue('0xde0b6b3a7640000')).toBe(1000000000000000000n);
  });
  it('preserves precision beyond Number.MAX_SAFE_INTEGER', () => {
    expect(parseTxValue('1234567890123456789012')).toBe(
      1234567890123456789012n,
    );
  });
});

describe('encodeCalldata', () => {
  const transferAbi = [
    {
      type: 'function',
      name: 'transfer',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [],
    },
  ] as const;

  it('encodes a function call from a signature + string args', () => {
    const oracle = encodeFunctionData({
      abi: transferAbi,
      functionName: 'transfer',
      args: [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        1000000000000000000n,
      ],
    });
    expect(
      encodeCalldata('transfer(address,uint256)', [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        '1000000000000000000',
      ]),
    ).toBe(oracle);
  });

  it('coerces large uint args without losing precision', () => {
    const big = '1234567890123456789012345';
    const oracle = encodeFunctionData({
      abi: transferAbi,
      functionName: 'transfer',
      args: ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8', BigInt(big)],
    });
    expect(
      encodeCalldata('transfer(address,uint256)', [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        big,
      ]),
    ).toBe(oracle);
  });

  it('supports named parameters in the signature', () => {
    expect(
      encodeCalldata('transfer(address to, uint256 amount)', [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        '100',
      ]),
    ).toBe(
      encodeCalldata('transfer(address,uint256)', [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        '100',
      ]),
    );
  });

  it('coerces bool args', () => {
    const approveForAll = encodeCalldata('setApprovalForAll(address,bool)', [
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      'true',
    ]);
    expect(approveForAll.startsWith('0x')).toBe(true);
  });

  it('rejects a bare function name (ambiguous without param types)', () => {
    expect(() => encodeCalldata('transfer', [])).toThrow();
  });

  it('throws when arg count does not match the signature', () => {
    expect(() =>
      encodeCalldata('transfer(address,uint256)', ['0xabc']),
    ).toThrow();
  });
});

describe('parseTransaction', () => {
  const to = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

  it('builds a bare value transfer when data is omitted', () => {
    const txn = parseTransaction({ chainId: '1', to, value: '1000' });
    expect(txn).toMatchObject({
      chainId: 1,
      to,
      value: 1000n,
      data: '0x',
    });
  });

  it('defaults value to 0n', () => {
    expect(parseTransaction({ chainId: '1', to }).value).toBe(0n);
  });

  it('forwards a pre-encoded data string as-is', () => {
    const txn = parseTransaction({ chainId: '1', to, data: '0xdeadbeef' });
    expect(txn.data).toBe('0xdeadbeef');
  });

  it('encodes calldata from fnSignature + fnArgs', () => {
    const txn = parseTransaction({
      chainId: '1',
      to,
      fnSignature: 'transfer(address,uint256)',
      fnArgs: ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8', '100'],
    });
    expect(txn.data).toBe(
      encodeCalldata('transfer(address,uint256)', [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        '100',
      ]),
    );
    expect(txn.functionName).toBe('transfer');
  });

  it('throws on an invalid recipient address', () => {
    expect(() => parseTransaction({ chainId: '1', to: 'nope' })).toThrow();
  });
});

describe('buildV1Url + parseRouterQuery round-trip', () => {
  const to = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

  it('round-trips a contract function call through the query string', () => {
    const url = buildV1Url({
      chainId: 1,
      to,
      fnSignature: 'transfer(address,uint256)',
      fnArgs: ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8', '100'],
    });
    const query = Object.fromEntries(new URLSearchParams(url.split('?')[1]));
    const txn = parseRouterQuery(query);
    expect(txn).toMatchObject({
      chainId: 1,
      to,
      value: 0n,
      functionName: 'transfer',
    });
    expect(txn.data).toBe(
      encodeCalldata('transfer(address,uint256)', [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        '100',
      ]),
    );
  });

  it('parses a merkle claim with a nested bytes32[] proof', () => {
    const query = {
      chainId: '1',
      to: '0xbe1a33519f586a4c8aa37525163df8d67997016f',
      fnSignature: 'claim(uint256,address,uint256,bytes32[])',
      fnArgs: JSON.stringify([
        '6',
        '0x0018Bfd060CB966AbAfE852eb1648a3e4385b477',
        '0x15ac34f35c8a8a4000',
        [
          '0xdcbe9395349958f3e62500d98a3a4e9c6746c62cb9fd33d3e5e541aa4218acd1',
          '0x0dfedf53747027eebb3cbe5332bcf5c4bc16d02263244f9cdd99d7ada04432f0',
        ],
      ]),
    };
    const txn = parseRouterQuery(query);
    expect(txn.functionName).toBe('claim');
    expect(txn.data.startsWith('0x')).toBe(true);
  });

  it('round-trips a native value transfer', () => {
    const url = buildV1Url({ chainId: 8453, to, value: '5' });
    const query = Object.fromEntries(new URLSearchParams(url.split('?')[1]));
    const txn = parseRouterQuery(query);
    expect(txn).toMatchObject({ chainId: 8453, to, value: 5n, data: '0x' });
  });
});
