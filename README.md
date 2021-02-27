# CryptoTracker
A simple UI to track crypto holdings, with live prices and return data

## Getting Started
1. Get an API Key from [CoinMarketCap](https://pro.coinmarketcap.com/signup)
2. Export the API Key as an environment variable: `export CMC_API_KEY="XXXXX"`
3. Create a `data.yml` file containing your static portfolio data (see below)
4. Run `yarn build`, `yarn dev`, etc.

## Example data.yml file
```yaml
---
- token: BTC # For display only
  api: 1     # CoinMarketCap ID
  # See https://coinmarketcap.com/api/documentation/v1/#section/Best-Practices
  holding: 5 # The amount you hold
  buy: 10000 # The price at which you bought this holding
- token: ETH
  api: 1027
  holding: 0.5782
  buy: 527.82
```