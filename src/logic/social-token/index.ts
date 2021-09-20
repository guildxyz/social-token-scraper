/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import config from "../../config";
import { getCurrentData, getMarketDataList } from "./requests";
import getHoldersCount from "./scraper";
import { CoinData } from "../../types/resultTypes";
import logger from "../../utils/logger";
import { getDateString, sleep, writeToFile } from "../../utils/utils";

const scrapeTokenCategory = async (category: string): Promise<CoinData[]> => {
  logger.info(`Scraping ${category} category...`);
  const marketDataList = await getMarketDataList(category);
  logger.info(`Found ${marketDataList.length} tokens.`);

  const coinDataList: CoinData[] = [];
  let i = 0;
  for (const marketData of marketDataList) {
    i += 1;
    logger.info(
      `Gathering data about ${marketData.name} (${i}/${marketDataList.length}).`
    );
    const currentdata = await getCurrentData(marketData.id);
    const holdersCount = await getHoldersCount(currentdata.platforms);
    await sleep(config.requestDelay);
    coinDataList.push({
      name: marketData.name,
      description: currentdata.description.en,
      symbol: marketData.symbol,
      image: marketData.image,
      marketcap: marketData.market_cap,
      platforms: currentdata.platforms,
      holdersCount,
    });
  }

  return coinDataList;
};

const scrapeSocialTokens = async (categories: string[]) => {
  const coinDataList = [];

  for (const category of categories) {
    coinDataList.push(...(await scrapeTokenCategory(category)));
  }

  const fileName = getDateString();
  logger.info("Writing data to file.");
  writeToFile(coinDataList, fileName);
  logger.info(`"${fileName}.json" created.`);
};

export default scrapeSocialTokens;
