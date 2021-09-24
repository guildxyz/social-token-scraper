# Social Token Scraper

## Description

The social token scraper is a tool for scraping social token information from the web and blockchains.
It is part of the [Agora project](https://github.com/AgoraSpaceDAO).

- [Website](https://agora.space)
- [License](./LICENSE)

## Getting started

Install dependencies:

```bash
npm install
```

Create a new file called .env and add the following environment variables:

```bash
ETHERSCAN_API_KEY="8XR2YH4X5NA5RF426W5BXHWZ7BK9MGD6XM"
REQUEST_DELAY=1000
MTPROTO_API_ID=1234567
MTPROTO_API_HASH=8723462c38764e283d6478e2e3648723
```

## Run the scraper:

### Scrape social token info from CoinGecko by category:

```bash
npm run social <categories>
# for example:
npm run social social-money fan-token gaming
```

### Scrape NFTs from opensea:

```bash
npm run opensea <collections>
# for example:
npm run opensea mutagen boredapeyachtclub
```
