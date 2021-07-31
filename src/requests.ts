import axios from "axios";
import config from "./config";
import { CurrentDataResponse, MarketDataResponse } from "./types/apiTypes";
import { logAxiosError } from "./utils/utils";

const getMarketDataList = async (
  category: string
): Promise<MarketDataResponse[]> => {
  try {
    const vsCurrency = "usd";
    const marketDataList = await axios.get(
      `${config.coingeckoBaseUrl}/coins/markets?vs_currency=${vsCurrency}&category=${category}`
    );
    return marketDataList.data;
  } catch (error) {
    logAxiosError(error);
    throw error;
  }
};

const getCurrentData = async (coinId: string): Promise<CurrentDataResponse> => {
  try {
    const currentData = await axios.get(
      `${config.coingeckoBaseUrl}/coins/${coinId}`
    );
    return currentData.data;
  } catch (error) {
    logAxiosError(error);
    throw error;
  }
};

export { getMarketDataList, getCurrentData };
