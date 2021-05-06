# CryptoTracker
A simple UI to track crypto holdings, with live prices and return data

## Installation
1. Make sure `node` and `yarn` are installed
2. Run `yarn` in the project directory
## Getting Started
1. Get an API Key from [CoinMarketCap](https://pro.coinmarketcap.com/signup)
2. Export the API Key as an environment variable: `export CMC_API_KEY="XXXXX"`
3. Create a `data.yml` file containing your static portfolio data (see below)
4. Run `yarn build && yarn start` or `yarn dev`
### Example data.yml file
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

## Docker
1. Create a production build with `yarn build`
2. Build the image with `docker build -t crypto-tracker .`
3. You can use `docker run -d --name crypto --restart unless-stopped -p 8080:3000 crypto-tracker` to start the container (runs on localhost, port 8080)
4. Restart (if stopped) with `docker restart crypto`
5. Stop and remove the container with `docker stop crypto && docker rm crypto`
### Updating the container
The convenience script, `./update.sh` is provided for this purpose, which will rebuild the image then restart the container with this latest image.