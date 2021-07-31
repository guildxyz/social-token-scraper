import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error)
  throw new Error(
    `Couldn't find .env file or volumes in compose. ${envFound.error}`
  );

const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
if (!etherscanApiKey) {
  throw new Error(
    "You need to specify the bot's ETHERSCAN_API_KEY in the .env file."
  );
}

const requestDelay = +process.env.REQUEST_DELAY || 1000;

const coingeckoBaseUrl = "https://api.coingecko.com/api/v3";

export default {
  coingeckoBaseUrl,
  etherscanApiKey,
  requestDelay,
};
