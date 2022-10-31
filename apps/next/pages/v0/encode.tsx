import type { NextPage } from 'next';
import queryString from 'query-string';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { EncodeURIComponent } from '../../../../packages/txn-dot-xyz/utils/url-encoding/url-encoding';
import { Input } from '../../src/frontend/components/Input';
import styles from '../../styles/Home.module.css';

type ABILeaf = {
  inputs: ReadonlyArray<{
    internalType: 'uint256';
    name: 'index';
    type: 'uint256';
  }>;
  [otherKeys: string]: any;
};
type ContractABI = ReadonlyArray<
  Partial<{
    inputs: [
      {
        internalType: string;
        name: string;
        type: string;
      },
    ];
    name: string;
    outputs: [
      {
        internalType: string;
        name: string;
        type: string;
      },
    ];
    stateMutability: 'view';
    type: 'function';
  }>
>;
type EncodeableParams = {
  fn: string;
  chainID: number;
  contractAddress?: string;
};
function encodeParams(
  params: EncodeableParams,
  fnParams: Record<string, any>,
  abiLeaf: ABILeaf,
): string {
  const query = queryString.stringify(params);
  const pathPrefix = '/v0/decode/';
  if (Object.values(fnParams).length > 0) {
    const encodeableValues: Array<string> = Object.entries(fnParams)
      .filter(
        // remove empty strings
        ([key, val]) => !(typeof val === 'string' && val.length === 0),
      )
      .sort(
        // sort params to smart-contract ordering
        ([keyA], [keyB]) => {
          const firstIndex = abiLeaf.inputs.findIndex(
            (input) => input.name === keyA,
          );
          const secondIndex = abiLeaf.inputs.findIndex(
            (input) => input.name === keyB,
          );

          const i = firstIndex - secondIndex;
          return i;
        },
      )
      .map(([key, value]) => value);

    return `${pathPrefix}?${query}&fnParams=${EncodeURIComponent.encode(
      encodeableValues,
    )}`;
  }
  return `${pathPrefix}?${query}`;
}

const ethereumOption = { value: 1, label: 'Ethereum' };
const chainOptions = [
  ethereumOption,
  { value: 137, label: 'Polygon' },
  { value: 10, label: 'Optimism' },
  // { value: 42161, label: 'Arbitrum One' },
  { value: 100, label: 'Gnosis Chain' },
  { value: 56, label: 'Binance Smart Chain' },
];

// @ts-ignore
const ContractInputs: React.FunctionComponent<{
  contractABI: ContractABI;
  fn: string;
  fnParams: Record<string, any>;
  setFnParams: Dispatch<SetStateAction<Record<string, any>>>;
}> = (props) => {
  const { contractABI, fn, fnParams, setFnParams } = props;

  const abiLeaf = contractABI.find((leaf) => leaf.name === fn);
  if (!abiLeaf) {
    return <>Function not found on contract</>;
  }
  return (abiLeaf.inputs || []).map((input: any) => {
    const { name, type } = input;
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = cleanupInputValue(e.target.value);
      setFnParams((oldParams) => ({
        ...oldParams,
        [name]: newValue,
      }));
    };
    return (
      <>
        <p>
          {name} ({type})*
        </p>
        <Input value={fnParams[name]} onChange={handleChange} />
      </>
    );
  });
};

const computeEncodedUrl = (params: {
  chainID: number;
  fn: string;
  contractAddress: string;
  fnParams: Record<string, any>;
  abiLeaf: ABILeaf;
}) => {
  const { fn, contractAddress, fnParams, chainID, abiLeaf } = params;
  if (params.fn) {
    const encodedFnParams: Record<string, any> = { ...fnParams };
    Object.entries(fnParams).forEach(([key, value]) => {
      // stringified array
      if (value.startsWith?.('[') && value.endsWith?.(']')) {
        encodedFnParams[key] = JSON.parse(value);
      }
    });
    const suffix = encodeParams(
      {
        fn,
        contractAddress,
        chainID,
      },
      encodedFnParams,
      abiLeaf,
    );
    return `https://txn.xyz${suffix}`;
  }
  return null;
};
const initialContractABI: ContractABI = [];
const cleanupInputValue = (value: string) =>
  value
    .trim()
    .replace(/^["|']/, '')
    .replace(/["|']$/, '');

const Encode: NextPage = () => {
  const [contractAddress, _setContractAddress] = useState('');
  const [fn, setFn] = useState<string>('');
  const [contractABI, setContractABI] = useState(initialContractABI);
  const [fnParams, setFnParams] = useState<Record<string, any>>({});
  const [selectedChain, setSelectedChain] = useState<{
    value: number;
    label: string;
  }>(ethereumOption);
  const setContractAddress = (e: ChangeEvent<HTMLInputElement>) => {
    // trim string quotes if user is trying to add them
    const value = cleanupInputValue(e.target.value);
    _setContractAddress(value);
  };

  useEffect(() => {
    const seemsToBeContractAddress =
      contractAddress.startsWith('0x') && contractAddress.length === 42;
    if (seemsToBeContractAddress) {
      const currentNetworkName = selectedChain.label;
      fetch(
        `/api/v0/fetch-abi?contractAddress=${contractAddress}&chainID=${selectedChain.value}`,
      )
        .then((res) => res.json())
        .then((data) => data.abi)
        .then((abi) => setContractABI(abi))
        .catch((err) => {
          toast.warn(
            `There was an error fetching the ABI. Maybe this contract lives on a different network from ${currentNetworkName}?`,
          );
        });
    }
  }, [contractAddress, selectedChain.value]);

  const abiLeaf = contractABI.find((leaf) => leaf.name === fn);
  const encodedUrl =
    abiLeaf &&
    computeEncodedUrl({
      chainID: selectedChain.value,
      fn,
      contractAddress,
      fnParams,
      // @ts-ignore
      abiLeaf,
    });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Encode txn</h1>

        <p className={styles.description}>
          Connect any app to web3 with
          <code className={styles.code}>`zero code`</code>
        </p>

        <div>
          <p>Chain Required *</p>
          <Select
            defaultValue={selectedChain}
            onChange={(args) => setSelectedChain(args as any)}
            options={chainOptions}
          />
          <p>Function * </p>
          <Input
            placeholder="transfer"
            value={fn}
            onChange={(e) => setFn(e.target.value)}
          />
          <p>Contract Address *</p>
          <Input
            placeholder="0xae78736cd615f374d3085123a210448e74fc6393"
            value={contractAddress}
            onChange={setContractAddress}
          />
          {contractABI.length > 0 && (
            <ContractInputs
              contractABI={contractABI}
              fn={fn}
              fnParams={fnParams}
              setFnParams={setFnParams}
            />
          )}
        </div>
        {encodedUrl && (
          <pre>
            <code>
              <a href={encodedUrl} target="_blank" rel="noreferrer">
                {encodedUrl}
              </a>
            </code>
          </pre>
        )}
      </main>
    </div>
  );
};

export default Encode;
