/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { getCurrentData, getMarketDataList } from "./requests";
import { CoinData } from "./types/resultTypes";
import { sleep, writeToFile } from "./utils";

const scrapeTokenCategory = async (category: string): Promise<CoinData[]> => {
  console.log(`Scraping ${category} category...`);
  const marketDataList = await getMarketDataList(category);
  console.log(`Found ${marketDataList.length} tokens.`);
  const coinDataList: CoinData[] = [];

  let i = 0;
  for (const marketData of marketDataList) {
    i += 1;
    console.log(
      `Gathering data about ${marketData.name} (${i}/${marketDataList.length}).`
    );
    const currentdata = await getCurrentData(marketData.id);
    await sleep(200);
    coinDataList.push({
      name: marketData.name,
      description: currentdata.description.en,
      symbol: marketData.symbol,
      image: marketData.image,
      marketcap: marketData.market_cap,
      platforms: currentdata.platforms,
    });
  }

  return coinDataList;
};

(async () => {
  const coinDataList = [];
  coinDataList.push(...(await scrapeTokenCategory("social-money")));
  coinDataList.push(...(await scrapeTokenCategory("fan-token")));
  coinDataList.push(...(await scrapeTokenCategory("gaming")));

  const fileName = "result";
  console.log("Writing data to file.");
  writeToFile(coinDataList, fileName);
  console.log(`"${fileName}.json" created.`);
})();
