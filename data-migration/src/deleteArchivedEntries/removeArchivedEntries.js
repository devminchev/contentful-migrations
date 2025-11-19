import contentful from "contentful-management";

import { createInterface } from "readline";

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});
const errorIds = [];

export const script = async (accessToken, env, spaceID) => {
	const client = contentful.createClient({
		accessToken: accessToken,
	});
	const space = await client.getSpace(spaceID);
	const environment = await space.getEnvironment(env);
	const LOCALE = spaceID === "nw2595tc1jdx" ? "en-GB" : "en-US";
	let entriesToDelete = [];
	let moreToDelete = true;
	let skip = 0;
	console.log("Collecting all Archived Entries...");
	while (moreToDelete) {
		const entries = await environment.getEntries({
			limit: 1000,
			"sys.archivedAt[exists]": true,
			skip: skip,
		});
		entriesToDelete.push(entries.items);
		skip += 1000;
		moreToDelete = entries.total / 1000 > entriesToDelete.length;
		await delay(500);
	}
	let archivedEntries = entriesToDelete.flat();
	await checkReferences(archivedEntries, environment, LOCALE);
	rl.question(`Do you want to delete ${archivedEntries.length} archived items? 'y' or 'n' `, async function (response) {
		if (response.toLowerCase() === "y") {
			let progress = 0;
			for (let i = 0; i < archivedEntries.length; i++) {
				progress = (i / archivedEntries.length) * 100;
				try {
					await environment.deleteEntry(archivedEntries[i].sys.id);
					await delay(50);
					process.stdout.clearLine();
					process.stdout.cursorTo(0);
					process.stdout.write("Deleting archived entries... " + progress.toFixed(1) + "% ");
				} catch (error) {
					console.log(`${error} unable to delete entry: ${archivedEntries[i].sys.id} `);
					i++;
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

export async function checkReferences(archivedEntries, environment, LOCALE) {
	let i = 0;
	for (const archivedEntry of archivedEntries) {
		i++;
		progress = (i / archivedEntries.length) * 100;
		process.stdout.cursorTo(2);
		process.stdout.write("updating references... " + progress.toFixed(2) + "% ");
		try {
			let links = await environment.getEntries({
				links_to_entry: archivedEntry.sys.id,
				limit: 1000,
				"sys.archivedAt[exists]": false,
			});
			await delay(250);
			if (links.items.length > 0) {
				for (const link of links.items) {
					if (!link.isArchived()) {
                        await delay(300);
						let parentReferences = await link.references({
							limit: 1000,
						});
						for (const reference of parentReferences.includes.Entry) {
							if (reference.sys.id === archivedEntry.sys.id) {
								updateReferences(
									link.sys.id,
									archivedEntries.map((obj) => obj.sys.id),
									archivedEntry.sys.id,
									LOCALE,
									environment
								);
							}
						}
					}
				}
			}
		} catch (error) {
			const errorMessage = JSON.parse(error.message);
			const idOfArchivedEntry = errorMessage.request.url.split("/")[6];
			if (!errorIds.includes(idOfArchivedEntry)) {
				errorIds.push(idOfArchivedEntry);
				if (errorMessage.status === 400) {
					console.log(`error removing references for ${idOfArchivedEntry}, trying again...`);
					await removeReferencesFromLargeLinks(
						idOfArchivedEntry,
						environment,
						archivedEntries.map((obj) => obj.sys.id),
						LOCALE
					);
				}
			}
		}
	}
}

export async function updateReferences(parentId, archivedEntriesIds, childId, LOCALE, environment) {
	let updated = false;
	let entryToUpdate = await environment.getEntry(parentId);
	for (const field in entryToUpdate.fields) {
		if (entryToUpdate.fields[field][LOCALE]) {
			let idCheck = entryToUpdate.fields[field][LOCALE].hasOwnProperty("sys");
			let isArrayOfEntries = Array.isArray(entryToUpdate.fields[field][LOCALE]);
			if (isArrayOfEntries && typeof entryToUpdate.fields[field][LOCALE][0] === "object" && entryToUpdate.fields[field][LOCALE][0].hasOwnProperty("sys")) {
				entryToUpdate.fields[field] = getAllArchivedEntriesInField(archivedEntriesIds, entryToUpdate.fields[field][LOCALE], entryToUpdate.fields[field]);
				updated = true;
			} else if (idCheck && entryToUpdate.fields[field][LOCALE].sys.id == childId) {
				delete entryToUpdate.fields[field];
				updated = true;
			}
		}
	}
	await updateParent(updated, entryToUpdate, environment);
}

export function getAllArchivedEntriesInField(archivedEntriesIds, parentEntryFieldLocale, parentEntryField) {
	const idsToRemove = [];
	parentEntryFieldLocale.forEach((element, index) => {
		const elementId = element.sys.id;
		if (archivedEntriesIds.includes(elementId)) {
			idsToRemove.push({ elementId: index });
		}
	});
	idsToRemove.reverse().forEach((element) => {
		parentEntryFieldLocale.splice(element.elementId, 1);
		if (parentEntryFieldLocale == null) {
			delete parentEntryField;
		}
	});
	return parentEntryField;
}

async function removeReferencesFromLargeLinks(idOfParentEntry, environment, archivedEntriesIds, LOCALE) {
	const parentEntry = await environment.getEntry(idOfParentEntry);
	let updated = false;
	for (const field in parentEntry.fields) {
		if (parentEntry.fields[field][LOCALE]) {
			let isArrayOfEntries = Array.isArray(parentEntry.fields[field][LOCALE]);
			if (isArrayOfEntries && typeof parentEntry.fields[field][LOCALE][0] === "object" && parentEntry.fields[field][LOCALE][0].hasOwnProperty("sys")) {
				parentEntry.fields[field] = getAllArchivedEntriesInField(archivedEntriesIds, parentEntry.fields[field][LOCALE], parentEntry.fields[field]);
				updated = true;
			}
		}
	}
	await updateParent(updated, parentEntry, environment);
}

export async function updateParent(updated, entryToUpdate, environment) {
	if (updated) {
		try {
			await entryToUpdate.update();
			await delay(500);
			entryToUpdate = await environment.getEntry(entryToUpdate.sys.id);
			await delay(500);
			const isEntryPublished = await entryToUpdate.isPublished();
			if (isEntryPublished) await entryToUpdate.publish();
		} catch (error) {
			console.log(error);
		}
	}
}

export function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
