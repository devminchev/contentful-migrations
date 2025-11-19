import { readFile, writeFile } from 'node:fs/promises';
import * as XLSX  from 'xlsx';

export function readExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);
    return excelData.slice(1);
}

export const readJSONFile = async (path) => {
    const data = await readFile(path, 'utf-8');
    return JSON.parse(data);
};

export const writeJSONFile = async (path, data) => {
    await writeFile(path, JSON.stringify(data));
};

