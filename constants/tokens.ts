export type TokenInfo = {
  address: string;
  logoURI: string;
  name: string;
  symbol: string;
  decimals: number;
};

const tokens: Record<number, TokenInfo[]> = {
  1: [],
  4: [
    {
      address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      name: "Wrapped Ether",
      decimals: 18,
      symbol: "wETH",
      logoURI:
        "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
    },
    {
      address: "0x5457Cc9B34eA486eB8d3286329F3536f71fa8A8B",
      name: "SushiToken",
      decimals: 18,
      symbol: "SUSHI",
      logoURI:
        "https://tokens.1inch.io/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2.png",
    },
    {
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      name: "Uniswap",
      decimals: 18,
      symbol: "UNI",
      logoURI:
        "https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png",
    },
    {
      address: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
      name: "Dai Stablecoin",
      decimals: 18,
      symbol: "DAI",
      logoURI:
        "https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png",
    },
  ],
};

export default tokens;
