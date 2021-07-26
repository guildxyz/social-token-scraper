import fs from "fs";
import { CoinData } from "./types/resultTypes";

/* eslint-disable no-console */
const logAxiosError = (error) => {
  if (
    error.response?.data?.errors?.length > 0 &&
    error.response?.data?.errors[0]?.msg
  ) {
    console.log(error.response.data.errors[0].msg);
  } else {
    console.log(error);
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
      if (err) console.log(err);
    }
  );
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export { logAxiosError, writeToFile, sleep };
