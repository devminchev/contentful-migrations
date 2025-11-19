import contentfulExport from 'contentful-export';

const CONTENT_TYPES = [
    { name: "sportsParticipant", model: "sportsParticipant", query: [] },
    { name: "sportsParticipantLogo", model: "sportsParticipantLogo", query: [] }
];

const script = (async (variables) => {

    try {
        for (contentType of CONTENT_TYPES) {
            const { model, name } = contentType;
            console.log(`--------------------------------`)
            console.log(`Writing ${model} file...`);
            console.log(`--------------------------------`)

            await contentfulExport({
                managementToken: variables.accessToken,
                spaceId: variables.space,
                environmentId: variables.env,
                contentFile: `./src/participantsDataMigration/dataMigrationToProd/extract/${name}.json`,
                skipContentModel: true,
                queryEntries: [`content_type=${name}`],
                contentOnly: true,
                errorLogFile: `./src/participantsDataMigration/dataMigrationToProd/extract/${name}-error.log`,
                useVerboseRenderer: true,
                maxAllowedLimit: 500,
                rateLimit: 5
            });
        }
    } catch (e) {
        console.error(e)
    }
});

export default script;
