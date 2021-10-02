/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import { OpenseaAsset } from "../../../types/openseaTypes";
import { logAxiosError, saveToFile } from "../../../utils/utils";
import { baseApiUrl } from "../common";

const getAssets = async (
  collection: string,
  offset: number
): Promise<OpenseaAsset[]> => {
  try {
    const response = await axios.get(
      `${baseApiUrl}/assets?collection=${collection}&limit=50&offset=${offset}`
    );
    return response.data.assets;
  } catch (error) {
    logAxiosError(error);
    throw error;
  }
};

const getAssetsOfCommunity = async (collection: string) => {
  let assets: OpenseaAsset[] = [];
  let i = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const resultAssets = await getAssets(collection, i);
    assets = [...assets, ...resultAssets];
    if (resultAssets.length === 50) {
      i += 50;
    } else {
      break;
    }
  }
  return assets;
};

const getAssetTraitsOfCollection = async (collection: string) => {
  const result: object = {};
  const assets = await getAssetsOfCommunity(collection);
  assets.forEach((a) => {
    result[a.token_id] = a.traits.map((t) => ({
      trait_type: t.trait_type,
      value: t.value,
    }));
  });
  return result;
};

(async () => {
  const collections = process.argv.slice(2, process.argv.length);

  const AssetsTraitsList = [];
  for (const collection of collections) {
    AssetsTraitsList.push(await getAssetTraitsOfCollection(collection));
  }

  saveToFile(AssetsTraitsList);
})();
