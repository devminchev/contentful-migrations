import { log } from "../../naNewLobbyDesign/utils/logging.js";
import {
    IG_CAROUSEL_A_SECTIONS,
    IG_CAROUSEL_B_SECTIONS,
    IG_JACKPOTS_SECTION,
    IG_GRID_A_SECTION,
    IG_GRID_B_SECTION,
    IG_GRID_C_SECTION,
    IG_GRID_D_SECTION,
    IG_GRID_E_SECTION,
    IG_GRID_F_SECTION,
    IG_GRID_G_SECTION,
    GAME_V2,
    SITE_GAME_V2

} from "../../naNewLobbyDesign/constants.js";
import { getEntries } from "../../naNewLobbyDesign/api/managementApi.js";
import { storeFile } from "../../naNewLobbyDesign/save/index.js";
import { retrieveModelRecords } from "../../naNewLobbyDesign/utils/igPropertyUtils.js";

const JUNE_WH_LAUNCH_CODES = [
    "WHSALMIGHTY777SGLORYJACKPOTROYALEEXPRESS",
    "NYXHUFFNMOREPUFF",
    "NYXHUFFNMOREPUFF",
    "NYXHUFFNMOREPUFF",
    "NYXHUFFNMOREPUFF",
    "PARSECRETSOFTHEPHOENIXBLAZE",
    "PARSECRETSOFTHEPHOENIXBLAZE",
    "PARSECRETSOFTHEPHOENIXBLAZE",
    "GTTAKEOFF",
    "GTCLEOPATRAMINES",
    "GTCLEOPATRAMINES",
    "GTCLEOPATRAMINES",
    "GTCLEOPATRAMINES",
    "NYXCOMBOCASHSECRETTREASURES",
    "NYXCOMBOCASHSECRETTREASURES",
    "NYXCOMBOCASHSECRETTREASURES",
    "EVSTARBURSTGALAXY",
    "BPTHEGOONIESMEGAWAYSQUESTFORTREASUREJACKPOTKING",
    "PARCASHEXPRESSLUXURYLINEBUFFALO",
    "PARCASHEXPRESSLUXURYLINEBUFFALO",
    "PARCASHEXPRESSLUXURYLINEBUFFALO",
    "EVCASHGODDESS",
    "EVCASHGODDESS",
    "EVCASHGODDESS",
    "EVCASHGODDESS",
    "MGGOLDBLITZFORTUNES",
    "EVINFINITEBETSTACKERBLACKJACK",
    "EVINFINITEBETSTACKERBLACKJACK",
    "WHSLIGHTNINGGOLDJACKPOTROYALE",
    "WHSLIGHTNINGGOLDJACKPOTROYALE",
    "GGLHYPERSTRICKDIAMONDDRUMS",
    "GGLHYPERSTRICKDIAMONDDRUMS",
    "GGLHYPERSTRICKDIAMONDDRUMS",
    "WHSALMIGHTYBEARMEGAWAYS",
    "WHSALMIGHTYBEARMEGAWAYS",
    "WHSALMIGHTYBEARMEGAWAYS",
    "WHSSAINTFISHED",
    "GGLBISONMOONULTRALINKANDWIN",
    "GGLBISONMOONULTRALINKANDWIN",
    "GGLBISONMOONULTRALINKANDWIN",
    "GTCASHERUPTIONPOWERSURGE",
    "GTCASHERUPTIONPOWERSURGE",
    "GTCASHERUPTIONPOWERSURGE",
    "GTCASHERUPTIONPOWERSURGE",
    "PMCASINOHOLDEM",
    "GTFORTUNECOINFEVERSPINS",
    "GTFORTUNECOINFEVERSPINS",
    "GTFORTUNECOINFEVERSPINS",
    "BPMAJESTICFURYUNLEASED",
    "EVBIGBUCKSDELUXE",
    "EVBIGBUCKSDELUXE",
    "EVBIGBUCKSDELUXE",
    "NYX10000WONDERS10KWAYS",
    "MGBISONPRIMEPOWERCOMBO",
    "EVFAFABABIES2",
    "EVFAFABABIES2",
    "EVFAFABABIES2",
    "GTRISEOFTHESABERTOOTH",
    "GTTAKEOFF",
    "GTTAKEOFF",
    "GTTAKEOFF",
    "GTTAKEOFF",
    "GGL3X2XAMERICANGOLD",
    "GGL3X2XAMERICANGOLD",
    "GGL3X2XAMERICANGOLD",
    "GGLGOLDBLITZULTIMATE",
    "GGLGOLDBLITZULTIMATE",
    "GGLGOLDBLITZULTIMATE",
    "WHSRICKANDMORTYSTRIKEBACKJACKPOTROYALEEXPRESS",
    "EVBIGBUCKSDELUXE",
    "NYXCHEERYPOWERBOOST",
    "NYXCHEERYPOWERBOOST",
    "MGWOLFBLAZEGOLDBLITZFORTUNETOWER",
    "NYXDEMONSGOLD",
    "NYXDEMONSGOLD",
    "NYXDOLPHINTHUNDERWAYS",
    "NYXDOLPHINTHUNDERWAYS",
    "NYXDOLPHINTHUNDERWAYS",
    "GTFORTUNECOINFEVERSPINS",
    "WHSSAINTFISHED",
    "WHSSAINTFISHED",
    "WHSSAINTFISHED",
    "EVPARTHENONQUESTFORIMMORTALITY"
];

//Update function to unlink specific games based on launch code from section
export const unlinkWHSiteGames = async (spaceLocale: string | number, spaceFolder: any) => {
    try {
        const gamesV2 = await getEntries(GAME_V2);
        const siteGamesV2 = await getEntries(SITE_GAME_V2);

        const whGames = getWhiteHatRecords(gamesV2, spaceLocale, JUNE_WH_LAUNCH_CODES);
        const whGamesID = whGames.flatMap((item) => item?.sys?.id);

        const whSiteGames = getWhiteHatSiteGames(siteGamesV2, spaceLocale, whGamesID);
        const whSiteGamesIds = whSiteGames.flatMap((item) => item?.sys?.id);
        const whSiteGamesIdsSet = new Set(whSiteGamesIds);

        let IGSectionMap = await createIgSectionMap();
        let updatedSections = [];
        const unlinkedGames = [];

        IGSectionMap = IGSectionMap.map((section) => {
            const sectionEntries = section.fields;

            if (!sectionEntries.games) {
                console.error('Missing games property in section, cannot process this section:', section.sys.id);
                return section;
            }

            const sectionGames = sectionEntries?.games[spaceLocale];
            const retainedGames = sectionGames.filter(game => !whSiteGamesIdsSet.has(game?.sys?.id));
            const removedGames = sectionGames.filter(game => whSiteGamesIdsSet.has(game?.sys?.id));

            if (removedGames.length > 0) {
                const sectionTitle = sectionEntries.entryTitle?.[spaceLocale];
                const removedGameIds = removedGames.map(game => game?.sys?.id);

                console.log(`Section title: ${sectionTitle}`);
                removedGameIds.forEach(id => console.log(`Removed game ID: ${id}`));

                sectionEntries.games[spaceLocale] = retainedGames;
                updatedSections.push(section);

                // Log removed games
                unlinkedGames.push({
                    entryTitle: sectionTitle,
                    gamesRemoved: removedGameIds,
                });
            }
        });

        await storeFile(updatedSections, `./src/unlinkWHGamesFromSection/data/section/${spaceFolder}/updatedSections.json`);
        await storeFile(unlinkedGames, `./src/unlinkWHGamesFromSection/data/section/${spaceFolder}/removedGames.json`);

    } catch (error) {
        log(`Error processing ventures: ${error}`);
        throw error;
    }
};

const getWhiteHatRecords = (gamesV2: any[], spaceLocale: string | number, launchCodes: string | any[]) => {
    return gamesV2.filter((item) => {
        const launchCode = item?.fields?.launchCode?.[spaceLocale];
        return launchCodes.includes(launchCode);
    });
}

const getWhiteHatSiteGames = (siteGames: any[], spaceLocale: string | number, whiteHatGameIds: string | any[]) => {
    return siteGames.filter((item) => {
        const siteGame = item?.fields?.game?.[spaceLocale]?.sys?.id;

        return whiteHatGameIds.includes(siteGame);
    });
}

const getAllIgSectionsWithGames = async () => {
    const igGridA = await retrieveModelRecords(IG_GRID_A_SECTION);
    const igGridB = await retrieveModelRecords(IG_GRID_B_SECTION);
    const igGridC = await retrieveModelRecords(IG_GRID_C_SECTION);
    const igGridD = await retrieveModelRecords(IG_GRID_D_SECTION);
    const igGridE = await retrieveModelRecords(IG_GRID_E_SECTION);
    const igGridF = await retrieveModelRecords(IG_GRID_F_SECTION);
    const igGridG = await retrieveModelRecords(IG_GRID_G_SECTION);
    const igCarouselA = await retrieveModelRecords(IG_CAROUSEL_A_SECTIONS);
    const igCarouselB = await retrieveModelRecords(IG_CAROUSEL_B_SECTIONS);
    const igJackpots = await retrieveModelRecords(IG_JACKPOTS_SECTION);

    return { igGridA, igGridB, igGridC, igGridD, igGridE, igGridF, igGridG, igCarouselA, igCarouselB, igJackpots }
}

const createIgSectionMap = async () => {
    const {
        igGridA = [],
        igGridB = [],
        igGridC = [],
        igGridD = [],
        igGridE = [],
        igGridF = [],
        igGridG = [],
        igCarouselA = [],
        igCarouselB = [],
        igJackpots = []
    } = await getAllIgSectionsWithGames();

    const allSections = [
        igGridA,
        igGridB,
        igGridC,
        igGridD,
        igGridE,
        igGridF,
        igGridG,
        igCarouselA,
        igCarouselB,
        igJackpots
    ];

    const flattened = allSections.flatMap(sectionList =>
        sectionList.map(item => ({
            ...item
        }))
    );
    return flattened;
}
