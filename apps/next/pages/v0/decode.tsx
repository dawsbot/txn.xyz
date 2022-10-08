import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Contract, ContractInterface, ethers } from 'ethers';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useNetwork, useSigner } from 'wagmi';
import { EncodeURIComponent } from '../../../../packages/txn-dot-xyz/utils/url-encoding/url-encoding';
import { Button } from '../../src/frontend/components/Button';
import styles from '../../styles/Home.module.css';

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
  const [contractAddress, setContractAddress] = useState<string>();
  const [fn, setFn] = useState<string>();
  const [contractABI, setContractABI] = useState<ContractInterface>();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const _contractAddress = router.query.contractAddress as string;
    const _fn = router.query.fn as string;
    const chainID = router.query.chainID as string;
    setFn(_fn);
    setContractAddress(_contractAddress);
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
    // fetch ABI from etherscan
  }, [router.query?.fn, router.isReady]);

  if (!router.isReady) {
    return <Body>loading...</Body>;
  }
  if (!signer) {
    return (
      <Body>
        <ConnectButton label="Login to Continue" />
      </Body>
    );
  }
  if (chain?.id != router.query.chainID && typeof window !== 'undefined') {
    // switchNetwork?.(router.query.chainID);
    (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${Number(router.query.chainID).toString(16)}` }], // chainId must be in hexadecimal numbers
    });
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
    const to = router.query.to as string;
    const value = router.query.value as string;
    if (!to) {
      return <>Missing "to"</>;
    }
    if (!value) {
      return <>Missing "value"</>;
    }

    const transaction: ethers.providers.TransactionRequest = {
      to,
      value,
    };
    signer?.sendTransaction(transaction);
  } else {
    if (typeof contractAddress !== 'string') {
      return <>Missing contract address</>;
    }
    // TODO: only do this if user is calling a custom function like `claim` and all non-"transfer" functions
    if (typeof contractABI === 'undefined') {
      return <>Fetching contract ABI...</>;
    }
    if (!signer) {
      return (
        <>
          missing signer
          <ConnectButton />
        </>
      );
    }

    const contract = new Contract(
      contractAddress as string,
      contractABI,
      signer as ethers.Signer,
    );
    const functionParams = EncodeURIComponent.decode(
      router.query.fnParams as string,
    );

    debugger;
    // @ts-ignore
    contract[fn](...(functionParams || [])).catch((err) => {
      toast.warn(`Error calling ${fn}: ${err.code}`);
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
          <Link href="/">
            <a className={styles.card}>
              <h2>What is this?&rarr;</h2>
              <p>
                txn.xyz is a new way to use Ethereum. Everything required to
                call functions is URL encoded!
              </p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Decode;
