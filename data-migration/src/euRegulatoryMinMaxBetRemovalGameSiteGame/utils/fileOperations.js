import { readFile, writeFile } from 'node:fs/promises';
import xlsx from 'xlsx';
import { getEntries } from '../api/managementApi.js';

export function readExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = xlsx.utils.sheet_to_json(worksheet);
    return excelData.slice(1);
}

export const readJSONFile = async (path) => {
    const data = await readFile(path, 'utf-8');
    return JSON.parse(data);
};

export const writeJSONFile = async (path, data) => {
    await writeFile(path, JSON.stringify(data));
};

export const retrieveModelRecords = async (model) => {
    let data;
    try {
        const fileData = await readJSONFile(`./src/euRegulatoryMinMaxBetRemovalGameSiteGame/data/${model}/production/${model}.json`);
        data = fileData?.entries;

    } catch (err) {
        // console.warn('ERROR reading from file: ', err);
        // No log needed, this is just a safety catch so we know if we need to fetch venture records or not.
    }
    finally {
        if (!data) {
            data = await getEntries(model);
        }
    }
    return data;
};

