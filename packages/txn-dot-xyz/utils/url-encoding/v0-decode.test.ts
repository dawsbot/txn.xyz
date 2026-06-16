import { EncodeURIComponent } from './url-encoding';

// Characterizes the exact decoding of the live v0 example URLs (see
// apps/next/pages/index.tsx). Next.js url-decodes query params before they
// reach the page, so these are the already-url-decoded `fnParams` strings.
// If v1 work ever changes EncodeURIComponent, these break loudly.
describe('v0 example URL decoding', () => {
  it('decodes the "Transfer DAI" fnParams to [recipient, amount]', () => {
    const fnParams = '0=0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB,1=100';
    expect(EncodeURIComponent.decode(fnParams)).toStrictEqual([
      '0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB',
      100,
    ]);
  });

  it('decodes the "Approve DAI" fnParams to [spender, amount]', () => {
    const fnParams = '0=0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB,1=100';
    expect(EncodeURIComponent.decode(fnParams)).toStrictEqual([
      '0xc0DEAF6bD3F0c6574a6a625EF2F22f62A5150EAB',
      100,
    ]);
  });

  it('round-trips the airdrop claim fnParams (index, address, amount, proof)', () => {
    const params = [
      6,
      '0x0018Bfd060CB966AbAfE852eb1648a3e4385b477',
      '0x15ac34f35c8a8a4000',
      [
        '0xdcbe9395349958f3e62500d98a3a4e9c6746c62cb9fd33d3e5e541aa4218acd1',
        '0x0dfedf53747027eebb3cbe5332bcf5c4bc16d02263244f9cdd99d7ada04432f0',
      ],
    ];
    const encoded = EncodeURIComponent.encode(params);
    expect(EncodeURIComponent.decode(encoded)).toStrictEqual(params);
  });
});
