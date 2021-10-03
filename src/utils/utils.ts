import fs from "fs";
import logger from "./logger";

const extractAxiosErrorMsg = (error: {
  response: { data: { errors: string | any[] } };
}) => {
  if (error.response?.data?.errors?.length > 0) {
    return JSON.stringify(error.response.data.errors);
  }

  if (error.response?.data) {
    return JSON.stringify(error.response.data);
  }

  return JSON.stringify(error);
};

const logAxiosError = (error: {
  response: { data: { errors: string | any[] } };
}) => {
  logger.error(extractAxiosErrorMsg(error));
};

const writeToFile = (data: any, fileName: string) => {
  const dirName = "results";
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  fs.writeFile(`${dirName}/${fileName}.json`, JSON.stringify(data), (err) => {
    if (err) logger.error(err);
  });
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

const saveToFile = (data: any) => {
  const fileName = getDateString();
  logger.info("Writing data to file.");
  writeToFile(data, fileName);
  logger.info(`"${fileName}.json" created.`);
};

export { logAxiosError, saveToFile, sleep };
