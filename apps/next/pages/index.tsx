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
          <Link href="/v0/encode" className={styles.card}>
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
            href="/v0/decode?chainID=1&contractAddress=0xbe1a33519f586a4c8aa37525163df8d67997016f&fn=claim&fnParams=0%3D6%2C1%3D0x0018Bfd060CB966AbAfE852eb1648a3e4385b477%2C2%3D0x15ac34f35c8a8a4000%2C3%5B0%5D%3D0xdcbe9395349958f3e62500d98a3a4e9c6746c62cb9fd33d3e5e541aa4218acd1%2C3%5B1%5D%3D0x0dfedf53747027eebb3cbe5332bcf5c4bc16d02263244f9cdd99d7ada04432f0%2C3%5B2%5D%3D0x264be6a6457432e8a9894d7ed72bae6450b78f1ddb25b92901e9e758ec590c43%2C3%5B3%5D%3D0x3d2c228a47f63fda1532ea1eb1efa1099db58c89bd3b4d4745707b37cdd99795%2C3%5B4%5D%3D0xc2b6183614f72d5b85c7d53f250db5879560d90f554c65f0fd7d3f6380119fc4%2C3%5B5%5D%3D0xe76ae0d30fa261e7467721193055eb1332c12782cb60d5c8b5698faf596575d0%2C3%5B6%5D%3D0xed9357ca61a04981613541be6a5ee8cc63f35474ecc93eaa957ed2430bf75a8f%2C3%5B7%5D%3D0x23ee7245c67a5bc908c31d3f9be7752ac3490b5ddd3b50553064489e23218ee9%2C3%5B8%5D%3D0xe56ca04bc13b6f40c97dd1d01b2b2b13cec066b5815d5009c0f376906376cdbe%2C3%5B9%5D%3D0xbb82590a09313c61ea7febcfca233db9743a8b768bee8e0ef6b3b3490ffd6bc1%2C3%5B10%5D%3D0x11c2e4ca0ef6bec317ce1835ce64895a4351a26efad65fd263682927056297de%2C3%5B11%5D%3D0x78cb0d3b6c7d126a579b634cc8330a23d10b1d1135f2515154a5582071b3fe8e%2C3%5B12%5D%3D0x52ece03a32eb1cd7bfb1214dc4e5385e5e34366fc98d48dfb3c0a21c40032b96%2C3%5B13%5D%3D0xad6d25188df580042879fdf0ee94033f601bb48dc5e001aabda9df15956bb0bd%2C3%5B14%5D%3D0x6e4d811f548750e6321070ff0f3529d106f7efacf77fb23218253119351d56a0"
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
            href="/v0/decode?fnParams=0%3D0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB%2C1%3D100&contractAddress=0x6b175474e89094c44da98b954eedeac495271d0f&fn=approve&chainID=1"
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
            href="/v0/decode/?chainID=1&contractAddress=0x6b175474e89094c44da98b954eedeac495271d0f&fn=transfer&fnParams=0=0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB,1=100"
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
