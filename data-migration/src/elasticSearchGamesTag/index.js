import contentful from "contentful-management";
const SITE_GAME_V2 = "siteGameV2";
const GAME_V2 = "gameV2";
const TAG = "elasticsearchGames";

const script = async ({ accessToken, env, spaceId }) => {
	const client = await contentful.createClient({ accessToken });
	const space = await client.getSpace(spaceId);
	const environment = await space.getEnvironment(env);

	const siteGamesV2 = await getAllEntries(environment, SITE_GAME_V2);
	const gamesV2 = await getAllEntries(environment, GAME_V2);
	const allElasticSearchGames = [...siteGamesV2, ...gamesV2];

	for (const game of allElasticSearchGames) {
		await addTagToEntry(game);
	}

	console.log(" ---------------- ");
	console.log(` fin. `);
};

const getAllEntries = async (environment, model) => {
	const allEntries = [];
	let skip = 0;
	let moreToFetch = true;

	while (moreToFetch) {
		const entries = await environment.getEntries({
			limit: 500,
			content_type: model,
			skip: skip,
		});

		allEntries.push(...entries.items);

		skip += 500;
		moreToFetch = allEntries.length <= entries.total;
		console.log(
			`Fetched ${allEntries.length} ${model} entries out of ${entries.total} entries`
		);
		await delay(1000);
	}

	return allEntries;
};

const addTagToEntry = async (entry) => {
	if (!entry.metadata.tags) {
		entry.metadata.tags = [];
	}
	entry.metadata.tags.push({
		sys: {
			id: TAG,
			linkType: "Tag",
			type: "Link",
		},
	});

	try {
		const updatedEntry = await entry.update();
		await updatedEntry.publish();
		delay(300);

		const entryTitle =
			updatedEntry.fields.entryTitle["en-GB"] ??
			updatedEntry.fields.entryTitle["en-US"];
		console.log(`Entry: ${entryTitle} updated`);

		return updatedEntry;
	} catch (error) {
		console.error(error);
	}
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default script;
