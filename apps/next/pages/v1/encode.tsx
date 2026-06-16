import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { buildV1Url } from '../../../../packages/txn-dot-xyz/utils/v1/v1';
import { Button } from '../../src/frontend/components/Button';
import { Input } from '../../src/frontend/components/Input';
import styles from '../../styles/Home.module.css';

const chainOptions = [
  { value: 1, label: 'Ethereum' },
  { value: 137, label: 'Polygon' },
  { value: 10, label: 'Optimism' },
  { value: 42161, label: 'Arbitrum One' },
  { value: 100, label: 'Gnosis Chain' },
  { value: 56, label: 'Binance Smart Chain' },
  { value: 8453, label: 'Base' },
];

// Parse the comma-separated (or JSON) argument input into an array.
// Use a JSON array (e.g. ["0xabc", ["0x1","0x2"]]) for nested arguments.
function parseArgsInput(raw: string): unknown[] {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }
  if (trimmed.startsWith('[')) {
    return JSON.parse(trimmed);
  }
  return trimmed.split(',').map((arg) => arg.trim());
}

const Encode: NextPage = () => {
  const [chainId, setChainId] = useState(1);
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [fnSignature, setFnSignature] = useState('');
  const [fnArgs, setFnArgs] = useState('');

  const encodedUrl = useMemo(() => {
    if (!to) {
      return '';
    }
    try {
      const path = buildV1Url({
        chainId,
        to,
        value: value || undefined,
        fnSignature: fnSignature || undefined,
        fnArgs: fnSignature ? parseArgsInput(fnArgs) : undefined,
      });
      return `https://txn.xyz${path}`;
    } catch {
      return '';
    }
  }, [chainId, to, value, fnSignature, fnArgs]);

  const copy = () => {
    navigator.clipboard.writeText(encodedUrl);
    toast.success('Copied URL to clipboard');
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Encode a Transaction</h1>
        <p className={styles.description}>
          Build a txn.xyz API v1 link. Share it and the recipient signs with
          their own wallet.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label>Network</label>
          <div style={{ minWidth: 360 }}>
            <Select
              options={chainOptions}
              value={chainOptions.find((c) => c.value === chainId)}
              onChange={(option) => option && setChainId(option.value)}
            />
          </div>

          <label>Recipient address (to)</label>
          <Input
            value={to}
            placeholder="0x..."
            onChange={(e) => setTo(e.target.value)}
          />

          <label>Value in wei (optional)</label>
          <Input
            value={value}
            placeholder="0"
            onChange={(e) => setValue(e.target.value)}
          />

          <label>Function signature (optional)</label>
          <Input
            value={fnSignature}
            placeholder="transfer(address,uint256)"
            onChange={(e) => setFnSignature(e.target.value)}
          />

          <label>Arguments (comma-separated, or JSON array)</label>
          <Input
            value={fnArgs}
            placeholder="0xRecipient, 100"
            onChange={(e) => setFnArgs(e.target.value)}
          />
        </div>

        {encodedUrl && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ wordBreak: 'break-all', maxWidth: 600 }}>
              <a href={encodedUrl} target="_blank" rel="noreferrer">
                {encodedUrl}
              </a>
            </p>
            <Button onClick={copy}>Copy URL</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Encode;
