import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { formatEther } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';
import {
  type ParsedTransaction,
  parseRouterQuery,
} from '../../../../packages/txn-dot-xyz/utils/v1/v1';
import { Button } from '../../src/frontend/components/Button';
import styles from '../../styles/Home.module.css';

// API v1 — the whole transaction is described in the URL query string.
// Examples:
//   /v1/decode?chainId=1&to=0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB&value=1000000000000000000
//   /v1/decode?chainId=1&to=0x6b175474e89094c44da98b954eedeac495271d0f&fnSignature=transfer(address,uint256)&fnArgs=["0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB","100"]

const Body = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Decode: NextPage = () => {
  const router = useRouter();
  const { data: walletClient } = useWalletClient();
  const { chainId } = useAccount();

  const [txn, setTxn] = useState<ParsedTransaction>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    try {
      setTxn(parseRouterQuery(router.query));
      setError(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid transaction URL');
    }
  }, [router.isReady, router.query]);

  // switch the wallet to the requested network
  useEffect(() => {
    if (!walletClient || !txn) {
      return;
    }
    if (chainId !== txn.chainId) {
      walletClient.switchChain({ id: txn.chainId }).catch(() => {
        toast.warn(`Please switch your wallet to chain ${txn.chainId}`);
      });
    }
  }, [chainId, txn, walletClient]);

  if (!router.isReady || (!txn && !error)) {
    return <Body>loading...</Body>;
  }
  if (error) {
    return (
      <Body>
        <p style={{ color: 'red' }}>Could not read transaction: {error}</p>
      </Body>
    );
  }
  if (!txn) {
    return <Body>loading...</Body>;
  }
  if (!walletClient) {
    return (
      <Body>
        <ConnectButton label="Login to Continue" />
      </Body>
    );
  }
  if (chainId !== txn.chainId) {
    return (
      <Body>
        <p>
          Must change network to {txn.chainId}. You&apos;re connected with{' '}
          {chainId || 'unknown'}
        </p>
        <ConnectButton />
      </Body>
    );
  }

  const executeTxn = async () => {
    const [account] = await walletClient.getAddresses();
    await walletClient.sendTransaction({
      account,
      to: txn.to,
      value: txn.value,
      data: txn.data,
    });
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>txn.xyz</h1>

        <Description txn={txn} />

        <Button
          onClick={executeTxn}
          style={{ fontSize: '20px', marginTop: '24px' }}
        >
          Execute Transaction
        </Button>

        <div className={styles.grid} style={{ marginTop: '100px' }}>
          <Link href="/" className={styles.card}>
            <h2>What is this?&rarr;</h2>
            <p>
              txn.xyz is a new way to use Ethereum. Everything required to send
              a transaction is URL encoded!
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

const Description: React.FunctionComponent<{ txn: ParsedTransaction }> = ({
  txn,
}) => {
  // contract function call
  if (txn.functionName) {
    return (
      <div className={styles.description} style={{ textAlign: 'center' }}>
        <p>
          The person who sent you here wants you to call{' '}
          <code>`{txn.functionName}`</code> on <code>`{txn.to}`</code>
        </p>
        {txn.args && txn.args.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {txn.args.map((arg, i) => (
              <li key={i}>
                <code>{JSON.stringify(arg)}</code>
              </li>
            ))}
          </ul>
        )}
        {txn.value > 0n && (
          <p>Including {formatEther(txn.value)} in native token</p>
        )}
      </div>
    );
  }

  // arbitrary pre-encoded data
  if (txn.data && txn.data !== '0x') {
    return (
      <div className={styles.description} style={{ textAlign: 'center' }}>
        <p>
          The person who sent you here wants you to send a transaction to{' '}
          <code>`{txn.to}`</code> with custom data.
        </p>
        <p style={{ color: 'orange' }}>
          ⚠️ Review carefully. Arbitrary transaction data could be malicious.
        </p>
        <code style={{ wordBreak: 'break-all' }}>{txn.data}</code>
      </div>
    );
  }

  // bare native-token transfer
  return (
    <div className={styles.description} style={{ textAlign: 'center' }}>
      <p>
        The person who sent you here wants you to send{' '}
        <b>{formatEther(txn.value)}</b> in native token to{' '}
        <code>`{txn.to}`</code>
      </p>
    </div>
  );
};

export default Decode;
