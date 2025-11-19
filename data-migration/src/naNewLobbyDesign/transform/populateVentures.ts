import { readJSONFile } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { retrieveModelRecords } from "../utils/igPropertyUtils";
import { VENTURE, JURISDICTION } from "../constants";
import {storeFile} from "../save";

const VENTURES_LIST = [
    'ballybetpa',
    'ballybeton',
    'ballybetnj',
    'ballybetri',
    'monopolycasinonj',
    'monopolycasinoon',
    'monopolycasinopa'
];

const VENTURE_RECORDS = {
    'ballybetpa': {
        entryTitle: 'Bally Bet PA',
        name: 'ballybetpa',
        jurisdiction: 'pa'
    },
    'ballybetnj': {
        entryTitle: 'Bally Bet NJ',
        name: 'ballybetnj',
        jurisdiction: 'nj'
    },
    'ballybetri': {
        entryTitle: 'Bally Bet RI',
        name: 'ballybetri',
        jurisdiction: 'ri'
    },
    'ballybeton': {
        entryTitle: 'Bally Bet ON',
        name: 'ballybeton',
        jurisdiction: 'on'
    },
    'monopolycasinonj': {
        entryTitle: 'Monopolycasino NJ',
        name: 'monopolycasinonj',
        jurisdiction: 'nj'
    },
    'monopolycasinopa': {
        entryTitle: 'Monopolycasino PA',
        name: 'monopolycasinopa',
        jurisdiction: 'pa'
    },
    'monopolycasinoon': {
        entryTitle: 'Monopolycasino ON',
        name: 'monopolycasinoon',
        jurisdiction: 'on'
    },
};

export const fn = async (spaceLocale: string, spaceFolder: string) => {
    try {
        const jurisdictions = await retrieveModelRecords(JURISDICTION);
        const jurisdictionMap = jurisdictions.reduce((map, entry) => {
            const name = entry.fields?.name?.[spaceLocale];
            if (name) {
                map[name] = entry.sys.id;
            }
            return map;
        }, {});
        
        // Read the existing ventures file
        const ventures = await readJSONFile(`./src/naNewLobbyDesign/data/${VENTURE}/na/${VENTURE}.json`);

        // Create a Set of existing venture names using map/filter
        const existingVentureNames: Set<any> = new Set(
            (ventures.entries || [])
                .map(({ fields }) => fields.name?.[spaceLocale])
                .filter(Boolean)
        );

        log(`Existing ventures: ${[...existingVentureNames].join(', ')}`);

        // Filter out ventures already present, and build payloads for those to add
        const ventureEntries: any[] = VENTURES_LIST
            .filter(name => !existingVentureNames.has(name))
            .reduce((acc, name) => {
                const record = VENTURE_RECORDS[name];
                if (!record) {
                    log(`No record found for ${name}, skipping`);
                    return acc;
                }
                const jurisditionId = jurisdictionMap[record.jurisdiction] || '';
                
                acc.push({
                    fields: {
                        entryTitle: {[spaceLocale]: record.entryTitle},
                        name: { [spaceLocale]: record.name},
                        jurisdiction: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": jurisditionId } } }
                    }
                });
                log(`Adding venture: ${name}`);
                return acc;
            }, []);

        await storeFile(ventureEntries, `./src/naNewLobbyDesign/data/${VENTURE}/${spaceFolder}/${VENTURE}-data.json`);
    } catch (error) {
        log(`Error processing ventures: ${error}`);
        throw error;
    }
};
