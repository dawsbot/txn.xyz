import {
  type Abi,
  type Address,
  type Hex,
  encodeFunctionData,
  isAddress,
  parseAbiItem,
} from 'viem';

/**
 * txn.xyz API v1.
 *
 * A standardized, wallet-shaped transaction description that is encoded
 * entirely in the URL query string. See issue #26.
 *
 *   chainId     ID of the chain (hex like `0x1` or decimal like `1`)
 *   to          Recipient address (no EOA vs. contract distinction)
 *   value       Native token amount in wei (optional, defaults to 0)
 *   data        Either a pre-encoded hex string, or omitted and supplied
 *               via `fnSignature` + `fnArgs`
 *   fnSignature Full function signature, e.g. `transfer(address,uint256)`
 *   fnArgs      JSON-encoded array of arguments
 */

export type V1Query = {
  chainId: string;
  to: string;
  value?: string;
  data?: string;
  fnSignature?: string;
  fnArgs?: readonly unknown[];
};

export type ParsedTransaction = {
  chainId: number;
  to: Address;
  value: bigint;
  data: Hex;
  /** present only when the transaction is a contract function call */
  functionName?: string;
  args?: readonly unknown[];
};

/** Parse a chain id from the URL. Accepts hex (`0x1`) or decimal (`1`). */
export function parseChainId(raw: string): number {
  if (raw === undefined || raw === null || raw === '') {
    throw new Error('Missing chainId');
  }
  const parsed =
    typeof raw === 'string' && raw.startsWith('0x')
      ? parseInt(raw, 16)
      : Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid chainId: ${raw}`);
  }
  return parsed;
}

/** Parse a native-token value into wei. Defaults to 0n. */
export function parseTxValue(raw?: string): bigint {
  if (raw === undefined || raw === '') {
    return 0n;
  }
  return BigInt(raw);
}

/** Coerce a single URL-sourced argument into the JS type viem expects. */
function coerceArg(type: string, value: unknown): unknown {
  const arrayMatch = type.match(/^(.*)\[\d*\]$/);
  if (arrayMatch) {
    if (!Array.isArray(value)) {
      throw new Error(`Expected an array for type ${type}`);
    }
    return value.map((item) => coerceArg(arrayMatch[1], item));
  }
  if (/^u?int\d*$/.test(type)) {
    return BigInt(value as string | number | bigint);
  }
  if (type === 'bool') {
    return value === true || value === 'true';
  }
  // address, bytes, bytesN, string — forward as-is
  return value;
}

/**
 * Build calldata from a human-readable function signature and its args.
 * The ABI is inferred from the signature, so no ABI lookup is required.
 */
export function encodeCalldata(
  fnSignature: string,
  fnArgs: readonly unknown[] = [],
): Hex {
  const normalized = fnSignature.trim();
  const human = normalized.startsWith('function ')
    ? normalized
    : `function ${normalized}`;

  const item = parseAbiItem(human);
  if (item.type !== 'function') {
    throw new Error(`Signature is not a function: ${fnSignature}`);
  }
  if (fnArgs.length !== item.inputs.length) {
    throw new Error(
      `Expected ${item.inputs.length} argument(s) for ${item.name}, received ${fnArgs.length}`,
    );
  }
  const args = item.inputs.map((input, i) => coerceArg(input.type, fnArgs[i]));
  return encodeFunctionData({
    abi: [item] as Abi,
    functionName: item.name,
    args,
  });
}

function extractFunctionName(fnSignature: string): string | undefined {
  return fnSignature
    .trim()
    .replace(/^function\s+/, '')
    .match(/^(\w+)/)?.[1];
}

/**
 * Turn a v1 query into a wallet-ready transaction:
 * `{ chainId, to, value, data }` plus optional display metadata.
 */
export function parseTransaction(query: V1Query): ParsedTransaction {
  const chainId = parseChainId(query.chainId);

  const to = query.to;
  if (!to || !isAddress(to)) {
    throw new Error(`Invalid recipient address: ${to}`);
  }

  const value = parseTxValue(query.value);

  if (query.fnSignature) {
    const fnArgs = query.fnArgs ?? [];
    return {
      chainId,
      to,
      value,
      data: encodeCalldata(query.fnSignature, fnArgs),
      functionName: extractFunctionName(query.fnSignature),
      args: fnArgs,
    };
  }

  if (query.data) {
    const data = (
      query.data.startsWith('0x') ? query.data : `0x${query.data}`
    ) as Hex;
    return { chainId, to, value, data };
  }

  return { chainId, to, value, data: '0x' };
}

/** Parse a Next.js router query object (strings) into a transaction. */
export function parseRouterQuery(
  query: Record<string, string | string[] | undefined>,
): ParsedTransaction {
  const get = (key: string): string | undefined => {
    const v = query[key];
    return Array.isArray(v) ? v[0] : v;
  };

  let fnArgs: readonly unknown[] | undefined;
  const rawArgs = get('fnArgs');
  if (typeof rawArgs === 'string' && rawArgs.length > 0) {
    fnArgs = JSON.parse(rawArgs);
  }

  return parseTransaction({
    chainId: get('chainId') as string,
    to: get('to') as string,
    value: get('value'),
    data: get('data'),
    fnSignature: get('fnSignature'),
    fnArgs,
  });
}

export type BuildV1UrlInput = {
  chainId: number | string;
  to: string;
  value?: number | string;
  data?: string;
  fnSignature?: string;
  fnArgs?: readonly unknown[];
};

/** Build a `/v1/decode?...` URL for a transaction. */
export function buildV1Url(input: BuildV1UrlInput): string {
  const params = new URLSearchParams();
  params.set('chainId', String(input.chainId));
  params.set('to', input.to);

  if (input.value !== undefined && input.value !== '') {
    params.set('value', String(input.value));
  }

  if (input.fnSignature) {
    params.set('fnSignature', input.fnSignature);
    params.set('fnArgs', JSON.stringify(input.fnArgs ?? []));
  } else if (input.data) {
    params.set('data', input.data);
  }

  return `/v1/decode?${params.toString()}`;
}
