import { readFile, writeFile } from 'node:fs/promises';
import XLSX from 'xlsx';

function readExcelFile(filePath: string) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);
    return excelData.slice(1);
}

const readJSONFile = async (path: string) => {
    const data = await readFile(path, 'utf-8');
    return JSON.parse(data);
};

const writeJSONFile = async (path: string, data: any) => {
    await writeFile(path, JSON.stringify(data));
};

export { readJSONFile, writeJSONFile, readExcelFile };
