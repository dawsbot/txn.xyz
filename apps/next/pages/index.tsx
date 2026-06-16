import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import dynamiteSrc from '../public/firecracker-240.png';
import styles from '../styles/Home.module.css';
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>txn.xyz</h1>

        <p className={styles.description}>
          Connect any app to web3 with
          <code className={styles.code}>`zero code`</code>
        </p>
        <Image src={dynamiteSrc} width={120} height={120} alt="dynamite" />

        <div className={styles.grid}>
          <Link href="/v1/encode" className={styles.card}>
            <h2>
              <Image
                src="/images/calculator.png"
                width={24}
                height={24}
                alt={'calculator'}
              />{' '}
              Encode Transaction &rarr;
            </h2>
            <p>The fastest way to send or call contracts on Ethereum!</p>
          </Link>
        </div>
        <hr></hr>
        <h2 className={styles.h2}>Examples</h2>
        <div className={styles.grid}>
          <a
            href="/v1/decode?chainId=1&to=0xbe1a33519f586a4c8aa37525163df8d67997016f&fnSignature=claim%28uint256%2Caddress%2Cuint256%2Cbytes32%5B%5D%29&fnArgs=%5B%226%22%2C%220x0018Bfd060CB966AbAfE852eb1648a3e4385b477%22%2C%220x15ac34f35c8a8a4000%22%2C%5B%220xdcbe9395349958f3e62500d98a3a4e9c6746c62cb9fd33d3e5e541aa4218acd1%22%2C%220x0dfedf53747027eebb3cbe5332bcf5c4bc16d02263244f9cdd99d7ada04432f0%22%2C%220x264be6a6457432e8a9894d7ed72bae6450b78f1ddb25b92901e9e758ec590c43%22%2C%220x3d2c228a47f63fda1532ea1eb1efa1099db58c89bd3b4d4745707b37cdd99795%22%2C%220xc2b6183614f72d5b85c7d53f250db5879560d90f554c65f0fd7d3f6380119fc4%22%2C%220xe76ae0d30fa261e7467721193055eb1332c12782cb60d5c8b5698faf596575d0%22%2C%220xed9357ca61a04981613541be6a5ee8cc63f35474ecc93eaa957ed2430bf75a8f%22%2C%220x23ee7245c67a5bc908c31d3f9be7752ac3490b5ddd3b50553064489e23218ee9%22%2C%220xe56ca04bc13b6f40c97dd1d01b2b2b13cec066b5815d5009c0f376906376cdbe%22%2C%220xbb82590a09313c61ea7febcfca233db9743a8b768bee8e0ef6b3b3490ffd6bc1%22%2C%220x11c2e4ca0ef6bec317ce1835ce64895a4351a26efad65fd263682927056297de%22%2C%220x78cb0d3b6c7d126a579b634cc8330a23d10b1d1135f2515154a5582071b3fe8e%22%2C%220x52ece03a32eb1cd7bfb1214dc4e5385e5e34366fc98d48dfb3c0a21c40032b96%22%2C%220xad6d25188df580042879fdf0ee94033f601bb48dc5e001aabda9df15956bb0bd%22%2C%220x6e4d811f548750e6321070ff0f3529d106f7efacf77fb23218253119351d56a0%22%5D%5D"
            className={styles.card}
            target="_blank"
            rel="noreferrer"
          >
            <h2>
              <Image
                src="/images/helicopter.png"
                width={24}
                height={24}
                alt={'helicopter'}
              />{' '}
              Claim Airdrop&rarr;
            </h2>
            <p>
              The most complex of the examples! Complex function parameters all
              stored in the URL.
            </p>
          </a>
          <a
            href="/v1/decode?chainId=1&to=0x6b175474e89094c44da98b954eedeac495271d0f&fnSignature=approve%28address%2Cuint256%29&fnArgs=%5B%220xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB%22%2C%22100%22%5D"
            className={styles.card}
            target="_blank"
            rel="noreferrer"
          >
            <h2>
              <Image
                src="/images/check-mark.png"
                width={24}
                height={24}
                alt={'check mark'}
              />{' '}
              Approve DAI&rarr;
            </h2>
            <p>The First step to any ERC-20 send.</p>
          </a>
          <a
            href="/v1/decode?chainId=1&to=0x6b175474e89094c44da98b954eedeac495271d0f&fnSignature=transfer%28address%2Cuint256%29&fnArgs=%5B%220xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB%22%2C%22100%22%5D"
            className={styles.card}
            target="_blank"
            rel="noreferrer"
          >
            <h2>
              <Image
                src="/images/money-with-wings.png"
                width={24}
                height={24}
                alt={'money with wings'}
              />{' '}
              Transfer DAI&rarr;
            </h2>
            <p>Transfering an ERC-20 after it has been approved</p>
          </a>
        </div>
        <hr></hr>
        <h2 className={styles.h2}>Use Cases</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>
              <Image
                src="/images/nerd-face.png"
                width={24}
                height={24}
                alt={'nerd face'}
              />{' '}
              Command Line Tools&rarr;
            </h2>

            <p>
              NEVER store your private key in your scripts again. Use txn.xyz to
              approve transactions and keep your keys safe.
            </p>
          </div>
          <div className={styles.card}>
            <h2>
              <Image
                src="/images/spider-web.png"
                width={24}
                height={24}
                alt={'spider web'}
              />{' '}
              Web Apps&rarr;
            </h2>
            <p>
              NEVER slow your sites with Ethers.js or web3.js again! Send users
              here for just-in-time approvals.
            </p>
          </div>
          <div className={styles.card}>
            <h2>
              <Image
                src="/images/recycling.png"
                width={24}
                height={24}
                alt={'recycling'}
              />{' '}
              Recurring Events&rarr;
            </h2>
            <p>
              Want to claim your DeFi yields weekly? Just put the claim
              transaction URL into you calendar.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
