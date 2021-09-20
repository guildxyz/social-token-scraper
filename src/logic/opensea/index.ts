/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import { logAxiosError, saveToFile } from "../../utils/utils";

const baseApiUrl = "https://api.opensea.io/api/v1";

const getCollection = async (collectionName: string) => {
  try {
    const response = await axios.get(
      `${baseApiUrl}/collection/${collectionName}`
    );
    return response.data.collection;
  } catch (error) {
    logAxiosError(error);
    throw error;
  }
};

const formatData = (collection: any) => {
  const result = {};

  const { traits } = collection;
  const traitNames = Object.keys(traits);
  traitNames.forEach((key) => {
    const trait = traits[key];
    const traitOptions = Object.keys(trait).sort();
    result[key] = traitOptions;
  });

  return result;
};

const scrapeCollection = async (collectionName: string) => {
  const collection = await getCollection(collectionName);
  const formattedCollection = formatData(collection);
  return formattedCollection;
};

(async () => {
  const collectionNames = process.argv.slice(2, process.argv.length);

  const collectionList = [];
  for (const collectionName of collectionNames) {
    collectionList.push(await scrapeCollection(collectionName));
  }

  saveToFile(collectionList);
})();
