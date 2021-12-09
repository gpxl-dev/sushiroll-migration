export type TokenInfo = {
  address: string;
  logoURI: string;
  name: string;
  symbol: string;
  decimals: number;
};

const tokens: Record<number, TokenInfo[]> = {
  1: [
    {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "Wrapped Ether",
      decimals: 18,
      symbol: "wETH",
      logoURI:
        "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
    },
    {
      address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
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
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      name: "Dai Stablecoin",
      decimals: 18,
      symbol: "DAI",
      logoURI:
        "https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png",
    },
    {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USDCoin",
      symbol: "USDC",
      decimals: 6,
      logoURI:
        "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
    },
    {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      name: "TetherUSD",
      symbol: "USDT",
      decimals: 6,
      logoURI:
        "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
    },
    {
      address: "0x0aCe32f6E87Ac1457A5385f8eb0208F37263B415",
      name: "HabitatToken",
      symbol: "HBT",
      decimals: 10,
      logoURI:
        "https://tokens.1inch.io/0x0ace32f6e87ac1457a5385f8eb0208f37263b415.png",
    },
    {
      address: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
      name: "Frax",
      symbol: "FRAX",
      decimals: 18,
      logoURI:
        "https://tokens.1inch.io/0x853d955acef822db058eb8505911ed77f175b99e.png",
    },
    {
      address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
      name: "CurveDAOToken",
      symbol: "CRV",
      decimals: 18,
      logoURI:
        "https://tokens.1inch.io/0xd533a949740bb3306d119cc777fa900ba034cd52.png",
    },
    {
      address: "0x383518188C0C6d7730D91b2c03a03C837814a899",
      name: "Olympus",
      symbol: "OHM",
      decimals: 9,
      logoURI:
        "https://tokens.1inch.io/0x383518188c0c6d7730d91b2c03a03c837814a899.png",
    },
  ],
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
