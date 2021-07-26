/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { getCurrentData, getMarketDataList } from "./requests";
import { CoinData } from "./types/resultTypes";
import { sleep, writeToFile } from "./utils";

const scrapeTokenCategory = async (category: string) => {
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
      symbol: marketData.symbol,
      image: marketData.image,
      marketcap: marketData.market_cap,
      contactAddress: currentdata.platforms?.ethereum,
    });
  }

  console.log("Writing data to file.");
  writeToFile(coinDataList, category);
  console.log(`"${category}.json" created.`);
};

(async () => {
  await scrapeTokenCategory("social-money");
})();
