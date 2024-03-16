import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Abi } from 'viem';
import { useWriteContract, useAccount, useWalletClient } from 'wagmi';
import { EncodeURIComponent } from '../../../../packages/txn-dot-xyz/utils/url-encoding/url-encoding';
import { Button } from '../../src/frontend/components/Button';
import styles from '../../styles/Home.module.css';
import { switchChain } from 'viem/actions';
import { z } from 'zod';

// http://localhost:3000/?fn=sendTransaction&to=seein.eth&value=1
// http://localhost:3000/?fn=claim&contractAddress=0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982
// merkle.index, address, merkle.amount, merkle.proof

const Body = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Decode: NextPage = () => {
  const router = useRouter();
  const [contractAddress, setContractAddress] = useState<`0x${string}`>();
  const [fn, setFn] = useState<string>();
  const [contractABI, setContractABI] = useState<Abi>();
  const { data: walletClient } = useWalletClient();
  const { chain } = useAccount();

  const { data: hash, writeContract } = useWriteContract()

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const _contractAddress = router.query.contractAddress as `0x${string}`;
    const _fn = z.string().parse(router.query.fn);
    const chainID = z.string().parse(router.query.chainID);
    setFn(_fn);
    setContractAddress(_contractAddress);
    // fetch ABI from etherscan
    fetch(
      `/api/v0/fetch-abi?contractAddress=${_contractAddress}&chainID=${chainID}`,
    )
      .then((res) => res.json())
      .then((data) => data.abi)
      .then((abi) => setContractABI(abi))
      .catch((err) => {
        toast.warn(
          `There was an error fetching the ABI. Maybe this contract lives on a different network from network ID ${chainID}?`,
        );
      });
  }, [router.query?.fn, router.isReady]);

  if (!router.isReady) {
    return <Body>loading...</Body>;
  }
  // from here on, router.isReady is true
  if (!walletClient) {
    return (
      <Body>
        <ConnectButton label="Login to Continue" />
      </Body>
    );
  }
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
  }, [router.isReady])
  if (chain?.id != router.query.chainID) {
    const chainId = Number(router.query.chainID);
    walletClient.switchChain({ id: chainId });
    return (
      <Body>
        <p>Must change network to {router.query.chainID}</p>
        <ConnectButton />
      </Body>
    );
  }

  if (typeof fn === 'undefined') {
    return <>loading...</>;
  }
  // send the native token of the chain
  if (fn === 'sendTransaction') {
    const to = router.query.to as `0x${string}`;
    const value = z.string().parse(router.query.value);
    if (!to) {
      return <>Missing &quot;to&quot;</>;
    }
    if (!value) {
      return <>Missing &quot;value&quot;</>;
    }

    (async () => {
      const [account] = await walletClient.getAddresses();
      const transaction = {
        account,
        to,
        value: BigInt(value),
      };
      walletClient?.sendTransaction(transaction);
    })();
  } else {
    if (typeof contractAddress !== 'string') {
      return <>Missing contract address</>;
    }
    // TODO: only do this if user is calling a custom function like `claim` and all non-"transfer" functions
    if (typeof contractABI === 'undefined') {
      return <>Fetching contract ABI...</>;
    }
    if (!walletClient) {
      return (
        <>
          wallet not found
          <ConnectButton />
        </>
      );
    }

    const functionParams = EncodeURIComponent.decode(
      router.query.fnParams as string,
    );

    writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: fn,
      args: [...(functionParams || [])],
    });
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>txn.xyz</h1>

        <p className={styles.description}>
          The person who sent you here wants you to call
          <br />
          <code>`{fn}`</code> on <code>`{contractAddress}`</code>
        </p>
        <Button
          // @ts-ignore
          onClick={() => window.location.reload(false)}
          style={{ fontSize: '20px' }}
        >
          Execute Transaction
        </Button>

        <div className={styles.grid} style={{ marginTop: '100px' }}>
          <Link href="/" className={styles.card}>
            <h2>What is this?&rarr;</h2>
            <p>
              txn.xyz is a new way to use Ethereum. Everything required to call
              functions is URL encoded!
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Decode;
