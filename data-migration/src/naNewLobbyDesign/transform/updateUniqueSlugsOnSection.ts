import { log } from "../utils/logging";
import {
    IG_CAROUSEL_A_SECTIONS,
    IG_CAROUSEL_B_SECTIONS,
    IG_COLLAB_BASED_SECTIONS,
    IG_JACKPOTS_SECTION,
    IG_SIMILARITY_SECTIONS,
    IG_GRID_A_SECTION,
    IG_GRID_B_SECTION,
    IG_GRID_C_SECTION,
    IG_GRID_D_SECTION,
    IG_GRID_E_SECTION,
    IG_GRID_F_SECTION,
    IG_GRID_G_SECTION,

} from "../constants";
import { getEntries } from "../api/managementApi";
import { storeFile } from "../save";

//Update function to make sure slugs are unique on all sections per venture
export const updateUniqueSlugsOnSection = async (spaceLocale: string, spaceFolder: string) => {
    const igSectionModels = [
        IG_CAROUSEL_A_SECTIONS,
        IG_CAROUSEL_B_SECTIONS,
        IG_GRID_A_SECTION,
        IG_GRID_B_SECTION,
        IG_GRID_C_SECTION,
        IG_GRID_D_SECTION,
        IG_GRID_E_SECTION,
        IG_GRID_F_SECTION,
        IG_GRID_G_SECTION,
        IG_JACKPOTS_SECTION,
        IG_COLLAB_BASED_SECTIONS,
        IG_SIMILARITY_SECTIONS
    ];
    try {
        // Shared map to track slugs across all sections
        const ventureSlugMaps = new Map<string, Map<string, number>>();
        const uniqueSlugsMap = new Map<string, Set<string>>();

        for (const igModel of igSectionModels) {
            console.log(`Processing section: ${igModel}`);
            const entries = await getEntries(igModel);
            const updatedEntries = updateEntriesWithUniqueSlugs(entries, ventureSlugMaps, spaceLocale, uniqueSlugsMap);
            const sortableUniqueSlugsData = Array.from(uniqueSlugsMap.entries()).map(([ventureId, slugs]) => ({
                ventureId,
                slugs: Array.from(slugs).sort()
            }));
            await storeFile(updatedEntries, `./src/naNewLobbyDesign/data/${igModel}/${spaceFolder}/${igModel}.json`);
            await storeFile(sortableUniqueSlugsData, `./src/naNewLobbyDesign/data/section/${spaceFolder}/uniqueSlugs.json`);
        }
    } catch (error) {
        log(`Error processing ventures: ${error}`);
        throw error;
    }
};

function updateEntriesWithUniqueSlugs(
    entries: any[],
    ventureSlugMaps: Map<string, Map<string, number>>,
    spaceLocale: string,
    uniqueSlugsMap: Map<string, Set<string>>
) {
    return entries.map(item => {
        const ventureId = item.fields.venture?.[spaceLocale]?.sys?.id;
        const baseSlug = item.fields.slug?.[spaceLocale];

        if (!ventureId) {
            console.warn(`Missing venture ID in item:`, item?.sys?.id);
            return item;
        }
        if (!baseSlug) {
            console.warn(`Missing slug in item:`, item?.sys?.id);
            return item;
        }
        if (!ventureSlugMaps.has(ventureId)) {
            ventureSlugMaps.set(ventureId, new Map<string, number>());
        }
        const uniqueSlug = createUniqueSlug(baseSlug, ventureSlugMaps.get(ventureId)!);
        if (!uniqueSlugsMap.has(ventureId)) {
            uniqueSlugsMap.set(ventureId, new Set<string>());
        }
        const ventureSlugs = uniqueSlugsMap.get(ventureId)!;
        ventureSlugs.add(uniqueSlug);

        const updatedFields = {
            ...item.fields,
            slug: {
                ...item.fields.slug,
                [spaceLocale]: uniqueSlug
            }
        };
        return {
            ...item,
            fields: updatedFields
        };
    });
}

function createUniqueSlug(baseSlug: string, ventureSlugMap: Map<string, number>): string {
    let slug = baseSlug;
    if (ventureSlugMap.has(baseSlug)) {
        const count = ventureSlugMap.get(baseSlug)! + 1;
        slug = `${baseSlug}-${count}`;
        ventureSlugMap.set(baseSlug, count);
    } else {
        ventureSlugMap.set(baseSlug, 1);
    }
    return slug;
}