import axios from "axios";
import cheerio from "cheerio";

const platformExplorerMap = new Map([
  ["ethereum", "etherscan.io"],
  ["binance-smart-chain", "bscscan.com"],
  ["polygon-pos", "polygonscan.com"],
  ["fantom", "ftmscan.com"],
]);

const scrapeHoldersCount = async (
  platform: string,
  contractAddress: string
): Promise<number> => {
  const explorer = platformExplorerMap.get(platform);
  if (!explorer) {
    return 0;
  }

  const response = await axios.get(
    `https://${explorer}/token/${contractAddress}`
  );
  const $ = cheerio.load(response.data);
  const selector =
    platform === "fantom"
      ? "#ContentPlaceHolder1_tr_tokenHolders > div > div.col-md-8"
      : "#ContentPlaceHolder1_tr_tokenHolders > div > div.col-md-8 > div > div";
  const holdersText = $(selector).text();
  return parseInt(holdersText.replace(",", ""), 10);
};

const getHoldersCount = async (platforms: object): Promise<number> => {
  let holdersCount = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const entry of Object.entries(platforms)) {
    if (entry[0] !== "" && /^(0x)?[0-9a-f]{40}$/i.test(entry[1])) {
      // eslint-disable-next-line no-await-in-loop
      holdersCount += await scrapeHoldersCount(entry[0], entry[1]);
    }
  }
  return holdersCount;
};

export default getHoldersCount;
