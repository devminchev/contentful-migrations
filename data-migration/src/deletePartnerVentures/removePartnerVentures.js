import { CONTENT_TYPES } from "../common/constants/index.js";
import contentful from "contentful-management";
import { createInterface } from "readline";

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

const script = async (accessToken, env, spaceID, ventureToRemove) => {
	const client = contentful.createClient({
		accessToken: accessToken,
	});
	const space = await client.getSpace(spaceID);
	const environment = await space.getEnvironment(env);
	const LOCALE = spaceID === "nw2595tc1jdx" ? "en-GB" : "en-US";
	let ventureToRemoveContentfulID = "";
	try {
		const ventureEntry = await environment.getEntries({
			content_type: "venture",
			query: `${ventureToRemove}`,
		});
		ventureToRemoveContentfulID = ventureEntry.items[0].sys.id;
	} catch {
		console.log(`venture ${ventureToRemove} cannot be found on contentful`);
		process.exit();
	}
	rl.question(`Would you like to remove the venture ${ventureToRemove} AND all its content? y or n: `, async function (response) {
		if (response.toLowerCase() === "y") {
			for (let i = 0; i < CONTENT_TYPES.length; i++) {
				try {
					let entriesToDelete = await getEntries(
						CONTENT_TYPES[i].contentType,
						ventureToRemove,
						environment,
						CONTENT_TYPES[i].hasVentureProperty,
						ventureToRemoveContentfulID,
						LOCALE
					);
					if (entriesToDelete) await deleteType(entriesToDelete, ventureToRemove, CONTENT_TYPES[i].contentType, environment);
					await delay(50);
					console.log(`deleted: ${ventureToRemove}'s contentType: ${CONTENT_TYPES[i].contentType}`);
				} catch (error) {
					console.log(`${error} unable to delete entry: ${CONTENT_TYPES[i].contentType} `);
				}
			}
			process.stdout.cursorTo(1);
			console.log("All items deleted");
			process.exit();
		} else {
			console.log("Cancelling...");
		}
		rl.close();
	});
};

async function deleteType(entriesToDelete, ventureToRemove, contentType, environment) {
	for (let i = 0; i < entriesToDelete.length; i++) {
		let entry = await environment.getEntry(entriesToDelete[i].sys.id);
		progress = (i / entriesToDelete.length) * 100;
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(`deleting ${contentType} from ${ventureToRemove}: ${progress.toFixed(1)} % `);
		await delay(100);
		if (entry.isPublished()) {
			await entry.unpublish();
			await delay(100);
			entry = await environment.getEntry(entry.sys.id);
			await delay(100);
		}
		await environment.deleteEntry(entry.sys.id);
		await delay(100);
	}
	process.stdout.cursorTo(1);
}

async function getEntries(contentType, ventureToRemove, environment, hasVenture, ventureToRemoveContentfulID, LOCALE) {
	let entriesToDelete = [];
	let moreToDelete = true;
	let skip = 0;
	while (moreToDelete) {
		const entries = await environment.getEntries({
			limit: 1000,
			content_type: contentType,
			query: `[${ventureToRemove}]`,
			skip: skip,
		});
		entriesToDelete.push(entries.items);
		skip += 1000;
		moreToDelete = entries.total / 1000 > entriesToDelete.length;
		await delay(500);
	}
	return entriesToDelete[0].length > 0 ? filterOutNonPartnerEntries(entriesToDelete.flat(), ventureToRemove, hasVenture, ventureToRemoveContentfulID, LOCALE) : [];
}

function filterOutNonPartnerEntries(entryList, ventureToRemove, hasVenture, ventureToRemoveContentfulID, LOCALE) {
	let filteredEntries = [];
	if (hasVenture) {
		for (const entry of entryList) {
			if (entry.fields.venture[LOCALE].sys.id == ventureToRemoveContentfulID) {
				filteredEntries.push(entry);
			}
		}
		return filteredEntries;
	} else {
		return entryList.filter((entry) => entry.fields.entryTitle[LOCALE].toLowerCase().includes(`[${ventureToRemove}]` || `[${ventureToRemove} partner]`));
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default script;
