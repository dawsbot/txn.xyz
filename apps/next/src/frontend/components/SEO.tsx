import Head from 'next/head';

export const DEFAULT_TITLE = 'txn.xyz';
export const DEFAULT_DESCRIPTION =
  'txn.xyz is a new way to use Ethereum. Request transactions, transfers, and more without ever needing ethers or web3.js';
const DEFAULT_IMAGE = 'https://txn.xyz/images/screenshot-v0.jpg';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}
export const SEO: React.FunctionComponent<SEOProps> = (props) => {
  const title = props.title || DEFAULT_TITLE;
  const description = props.description || DEFAULT_DESCRIPTION;
  const image = props.image || DEFAULT_IMAGE;

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="og:title" key="og:title" content={title} />
      <meta name="twitter:title" key="twitter:title" content={title} />
      <meta name="description" key="description" content={description} />
      <meta name="og:description" key="og:description" content={description} />
      {/* favicon */}
      <link rel="icon" href={`https://txn.xyz/firecracker-120.png`} />
      <link rel="manifest" href="/manifest.json" />
      <meta
        name="twitter:description"
        key="twitter:description"
        content={description}
      />
      <meta name="twitter:image" key="twitter:image" content={image} />
      <meta
        name="twitter:card"
        key="twitter:card"
        content="summary_large_image"
      />
      <meta name="og:image" key="og:image" content={image} />
    </Head>
  );
};
