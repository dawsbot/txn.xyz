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
        <Image
          src={dynamiteSrc}
          width={120}
          height={120}
          alt={'dynamite emoji'}
        />

        <div className={styles.grid}>
          <Link href="/v0/encode" className={styles.card}>
            <h2>
              <Image
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/pocket-calculator_1f5a9.png"
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
            href="/v0/decode?chainID=1&contractAddress=0xce2C372cF4040092F9911fa9B62A4536Ec445e8D&fn=claim&fnParams=0%3D0%2C1%3D0x00000000079A2BF7701D039fAa681954B428Ac43%2C2%3D0x6a16d4ab5e9f740000%2C3%5B0%5D%3D0xaae4dbaafff830e62af4c0b5a9a76cfec6a6000f9a2cd5485309abe298758f0c%2C3%5B1%5D%3D0xdbc058796e7d4685f8b4a8e7c86db16a028f61238c306d9284d779c58f0892b6%2C3%5B2%5D%3D0xb1f4032d74ab12b606bb91300e383a3601251b2638e2fe95ab82c607fcec29ff%2C3%5B3%5D%3D0xabf049f765e4f8943329cf2bd7b3002d0ad79ba211b34752e7c71cc42becfbb2%2C3%5B4%5D%3D0x138b45d8f723129e6a2d6a347587155af3f3f9643b15c0a486dba9c0babc887d%2C3%5B5%5D%3D0xb6b7ece35a8f05e30e57739f4e77a3e6dd6fcaaa6408c3b38a0f97da6714783e%2C3%5B6%5D%3D0xb1a3d6afe6ec96ac6e4986620e2642b110f8d19352b030b5e78383128ca0cd29%2C3%5B7%5D%3D0xc8236c165e31b50608bedc60a03c0074ac7c8e0ee63fbf20bda07718d977aaa5%2C3%5B8%5D%3D0x72adc30d194c61c79e0af9a18f7319b97b3d6591adaaf636b48656a8be207fb7%2C3%5B9%5D%3D0x54e5ff9600f437be59cf248e313501c291f716c73f530f3f82a03f0f34ca6947"
            className={styles.card}
            target="_blank"
            rel="noreferrer"
          >
            <h2>
              <Image
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/apple/325/helicopter_1f681.png"
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
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/apple/325/check-mark-button_2705.png"
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
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/apple/325/money-with-wings_1f4b8.png"
                width={24}
                height={24}
                alt={'money with wings'}
              />{' '}
              Transfer DAI&rarr;
            </h2>
            <p>Transferring an ERC-20 after it has been approved</p>
          </a>
        </div>
        <hr></hr>
        <h2 className={styles.h2}>Use Cases</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>
              <Image
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/apple/325/nerd-face_1f913.png"
                width={24}
                height={24}
                alt={'helicopter'}
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
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/apple/325/spider-web_1f578-fe0f.png"
                width={24}
                height={24}
                alt={'check mark'}
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
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/60/apple/325/recycling-symbol_267b-fe0f.png"
                width={24}
                height={24}
                alt={'check mark'}
              />{' '}
              Recurring Events&rarr;
            </h2>
            <p>
              Want to claim your DeFi yields weekly? Just put the claim
              transaction URL into your calendar.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
