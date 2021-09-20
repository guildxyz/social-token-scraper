import fs from "fs";
import { CoinData } from "../types/resultTypes";
import logger from "./logger";

const logAxiosError = (error) => {
  if (
    error.response?.data?.errors?.length > 0 &&
    error.response?.data?.errors[0]?.msg
  ) {
    logger.error(error.response.data.errors[0].msg);
  } else {
    logger.error(error);
  }
};

const writeToFile = (coinDataList: CoinData[], fileName: string) => {
  const dirName = "results";
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  fs.writeFile(
    `${dirName}/${fileName}.json`,
    JSON.stringify(coinDataList),
    (err) => {
      if (err) logger.error(err);
    }
  );
};

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getDateString = () =>
  new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "")
    .replaceAll(":", "-")
    .replace(" ", "_");

export { logAxiosError, writeToFile, sleep, getDateString };
