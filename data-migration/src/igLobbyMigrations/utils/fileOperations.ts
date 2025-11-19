import { readFile, writeFile } from 'node:fs/promises';
import { log } from "./logging";
import * as XLSX from 'xlsx';

export const readExcelFile = (filePath: string) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);
    return excelData.slice(1);
};

export const readJSONFile = async (path: string) => {
    const data = await readFile(path, 'utf-8');
    return JSON.parse(data);
};

export const safeReadJSONFile = async <T = any>(path: string, fallback: T): Promise<T> => {
    try {
        return await readJSONFile(path);
    } catch (err) {
        log?.(`Could not read or parse file at "${path}", using fallback. Reason: ${err.message}`);
        return fallback;
    }
};

export const writeJSONFile = async (path: string, data: string|any) => {
    await writeFile(path, JSON.stringify(data));
};
