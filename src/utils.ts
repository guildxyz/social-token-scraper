import axios from "axios";
import { BigNumber, ethers } from "ethers";
import fs from "fs";
import config from "./config";

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

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  }
  return value;
}

const writeToFile = (coinDataList: object, fileName: string) => {
  const dirName = "results";
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  fs.writeFile(
    `${dirName}/${fileName}.json`,
    JSON.stringify(coinDataList, replacer),
    (err) => {
      if (err) console.log(err);
    }
  );
};

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getAbi = async (address: string) => {
  const response = await axios.get(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${config.etherscanApiKey}`
  );
  return response.data.result;
};

const getHoldersCount = async (contractAddress: string) => {
  const provider = new ethers.providers.EtherscanProvider();
  let history = await provider.getHistory(contractAddress);
  let lastHistory = history;
  while (lastHistory.length === 10000) {
    const lastBlock = history[history.length - 1].blockNumber;
    if (lastBlock === undefined) {
      // TODO: handle error
      throw new Error("Last blockNumber is undefined.");
    }
    // eslint-disable-next-line no-await-in-loop
    lastHistory = await provider.getHistory(contractAddress, lastBlock);
    history = [...history, ...lastHistory];
  }

  writeToFile(history, "history");
  console.log(history.length);
  const abi = await getAbi(contractAddress);
  const iface = new ethers.utils.Interface(abi);

  const balances = new Map<string, BigNumber>();
  let i = 0;
  history.forEach((transactionResponse) => {
    console.log(i);
    i += 1;
    if (transactionResponse.data !== "0x") {
      console.log(transactionResponse.hash);
      const transactionDescription = iface.parseTransaction({
        data: transactionResponse.data,
        value: transactionResponse.value,
      });

      if (transactionDescription.name === "transfer") {
        const { from } = transactionResponse;
        const { value, to } = transactionDescription.args;
        balances.set(
          from,
          (balances.get(from) || BigNumber.from(0)).sub(value)
        );
        balances.set(to, (balances.get(to) || BigNumber.from(0)).add(value));

        console.log(`from: ${from}`);
        console.log(`to: ${to}`);
        console.log(`value: ${value}`);
      }
    }
  });

  writeToFile(balances, "balances");
  let holderCount = 0;
  let all = 0;
  const zero = BigNumber.from(0);
  balances.forEach((value) => {
    all += 1;
    if (value.gt(zero)) holderCount += 1;
  });
  console.log(all);
  console.log(holderCount);
};

export { logAxiosError, writeToFile, sleep, getHoldersCount };
