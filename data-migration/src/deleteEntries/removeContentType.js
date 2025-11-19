import * as contentful from "contentful-management";

import { get } from "lodash";

const PUBLISH = true;

const script = async (accessToken, env, spaceID, model, removeModel) => {
	try {
		const client = contentful.createClient({
			accessToken,
		});
		const space = await client.getSpace(spaceID);
		const environment = await space.getEnvironment(env);
		const locale = spaceID === "nw2595tc1jdx" ? "en-GB" : "en-US";

		const promises = [];
		promises.push(
			new Promise(async (resolve, reject) => {
				console.log(`Processing model ${model}`);

				const limit = 500;
				let skip = 0;
				let entriesCollection;
				try {
					entriesCollection = await environment.getEntries({ content_type: model, limit, skip });
				} catch (err) {
					console.log(`Could not getEntries for model ${model} (does it exist?)`);
					return resolve();
				}
				let entries = entriesCollection.items;
				const total = entriesCollection.total;

				while (skip < total) {
					skip += limit;
					entriesCollection = await environment.getEntries({ content_type: model, limit, skip });
					entries = entries.concat(entriesCollection.items);
				}

				for (let entry of entries) {
					if (entry.isPublished()) {
						try {
							console.log(`Unpublishing ${JSON.stringify(get(entry, ["fields", "entryTitle", locale]), null, 2)}...`);
							entry = PUBLISH && (await entry.unpublish());
						} catch (err) {
							console.log({ err });
						}
					}

					try {
						console.log(`Deleting ${JSON.stringify(get(entry, ["fields", "entryTitle", locale]), null, 2)}...`);
						PUBLISH && (await entry.delete());
					} catch (error) {
						console.log({ error });
					}
				}

				if (removeModel.toLowerCase() === 'true') {
					let contentType = await environment.getContentType(model);

					try {
						if (contentType.isPublished()) {
							try {
								console.log(`Unpublishing model ${model}...`);
								contentType = PUBLISH && (await contentType.unpublish());
							} catch (error) {
								console.log({ error });
							}
						}

						console.log(`Deleting model ${model}...`);
						PUBLISH && (await contentType.delete());
					} catch (error) {
						console.log({ error });
					}
				}
			})
		);

		await Promise.all(promises);
		console.log("Finished!");
	} catch (err) {
		console.log({ err });
	}
};

export default script;
