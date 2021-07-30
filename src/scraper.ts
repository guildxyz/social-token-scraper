import axios from "axios";
import cheerio from "cheerio";

const scrapeHoldersCount = async (contractAddress: string): Promise<number> => {
  const response = await axios.get(
    `https://etherscan.io/token/${contractAddress}`
  );
  const $ = cheerio.load(response.data);
  const selector =
    "#ContentPlaceHolder1_tr_tokenHolders > div > div.col-md-8 > div > div";
  const holdersText = $(selector).text();
  return parseInt(holdersText.replace(",", ""), 10);
};

export default scrapeHoldersCount;
