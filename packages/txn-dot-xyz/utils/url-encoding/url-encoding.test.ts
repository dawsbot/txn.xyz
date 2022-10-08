import { EncodeURIComponent } from './url-encoding';

describe('EncodeURIComponent class', () => {
  it('handles basic arrays of numbers', () => {
    const referenceParams = [1, 2, 3];
    const encoded = EncodeURIComponent.encode(referenceParams);
    const decoded = EncodeURIComponent.decode(encoded);
    expect(decoded).toStrictEqual(referenceParams);
  });
  // TODO: Come back and support this style
  it.skip('handles basic arrays of string', () => {
    const referenceParams = ['1', '2', '3'];
    const encoded = EncodeURIComponent.encode(referenceParams);
    const decoded = EncodeURIComponent.decode(encoded);
    expect(decoded).toStrictEqual(referenceParams);
  });
  it('handles arrays of hexadecimal strings', () => {
    const referenceParams = ['0x1'];
    const encoded = EncodeURIComponent.encode(referenceParams);
    const decoded = EncodeURIComponent.decode(encoded);
    expect(decoded).toStrictEqual(referenceParams);
  });
  it('handles boolean nested array', () => {
    const referenceParams = [true, [false]];
    const encoded = EncodeURIComponent.encode(referenceParams);
    const decoded = EncodeURIComponent.decode(encoded);
    expect(decoded).toStrictEqual(referenceParams);
  });
  it('handles airdrop claim data', () => {
    const referenceParams = [
      0,
      '0x00000000079A2BF7701D039fAa681954B428Ac43',
      '0x6a16d4ab5e9f740000',
      [
        '0xaae4dbaafff830e62af4c0b5a9a76cfec6a6000f9a2cd5485309abe298758f0c',
        '0xdbc058796e7d4685f8b4a8e7c86db16a028f61238c306d9284d779c58f0892b6',
        '0xb1f4032d74ab12b606bb91300e383a3601251b2638e2fe95ab82c607fcec29ff',
        '0xabf049f765e4f8943329cf2bd7b3002d0ad79ba211b34752e7c71cc42becfbb2',
        '0x138b45d8f723129e6a2d6a347587155af3f3f9643b15c0a486dba9c0babc887d',
        '0xb6b7ece35a8f05e30e57739f4e77a3e6dd6fcaaa6408c3b38a0f97da6714783e',
        '0xb1a3d6afe6ec96ac6e4986620e2642b110f8d19352b030b5e78383128ca0cd29',
        '0xc8236c165e31b50608bedc60a03c0074ac7c8e0ee63fbf20bda07718d977aaa5',
        '0x72adc30d194c61c79e0af9a18f7319b97b3d6591adaaf636b48656a8be207fb7',
        '0x54e5ff9600f437be59cf248e313501c291f716c73f530f3f82a03f0f34ca6947',
      ],
    ];
    const encoded = EncodeURIComponent.encode(referenceParams);
    const decoded = EncodeURIComponent.decode(encoded);
    expect(decoded).toStrictEqual(referenceParams);
  });
});
