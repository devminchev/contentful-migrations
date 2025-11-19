import { getEntries } from "../api/managementApi";
import { readJSONFile } from "./fileOperations";

export const retrieveModelRecords = async (model: string, spaceFolder: string, filepath?: string) => {
    let data;
    const path = filepath || `./src/igLobbyMigrations/data/${model}/${spaceFolder}/${model}.json`;

    try {
        const fileData = await readJSONFile(path);
        data = fileData?.entries;

    } catch (err) {
        // console.warn('ERROR reading from file: ', err);
        // No log needed, this is just a safety catch so we know if we need to fetch records or not.
    }
    finally {
        if (!data) {
            data = await getEntries(model);
        }
    }
    return data;
};
