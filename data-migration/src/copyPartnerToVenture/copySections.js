import { readFile, writeFile } from 'node:fs/promises';
import { setField } from './setField.js';

const DEFAULT_LOCALE = 'en-GB';

const copySections = (async (environment, locale, venture, sourceVenture, partner, targetPartner) => {
  try {
    const siteGameIDMap = JSON.parse(await readFile(`${ __dirname }/siteGameIDMap.json`, 'utf-8'));
    const getAllVentureLayouts = (envvv) => {
      const promises = [];

      for (let i = 0; i < 1; i++) {
        promises.push(envvv.getEntries({
          'content_type': 'layout',
          'fields.venture.sys.id': sourceVenture.items[0].sys.id,
          'fields.partner': true,
          'sys.archivedAt[exists]': false,
          'limit': 1000,
          'skip': i * 1000
        }));
      }

      return Promise.all(promises);
    };

    const allVentureLayouts = await getAllVentureLayouts(environment);
    let flatAllVentureLayouts = [];

    allVentureLayouts.forEach((batch) => {
      flatAllVentureLayouts = flatAllVentureLayouts.concat(batch.items);
    });

    const allSectionIDs = [];

    for(let layout of flatAllVentureLayouts) {
      for(let section of layout.fields.sections[DEFAULT_LOCALE]) {
        allSectionIDs.push(section.sys.id);
      }
    }

    const uniqueSectionIDs = [...new Set(allSectionIDs)];

    const sectionIDMap = {}

    for(let sectionID of uniqueSectionIDs) {
      const section = await environment.getEntry(sectionID);

      console.log(new Date().toLocaleTimeString(), `COPYING SECTION ${ section.fields.entryTitle[DEFAULT_LOCALE] } to ${ partner }`);

      const newSectionFields = {...section.fields};

      setField(newSectionFields, 'entryTitle', DEFAULT_LOCALE,
        section.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner).replace(' [partner]', ''));

      if (section?.fields?.games?.[DEFAULT_LOCALE].length) {
        section.fields.games[DEFAULT_LOCALE].forEach((game, i) => {
          newSectionFields.games[DEFAULT_LOCALE][i].sys.id = siteGameIDMap[section.fields.games[DEFAULT_LOCALE][i].sys.id]
        });
      }

      const newSection = await environment.createEntry('section', {
        fields: newSectionFields
      });
      await newSection.publish();

      sectionIDMap[section.sys.id] = newSection.sys.id;
    }

    // @ts-ignore
    await writeFile(`${ __dirname }/sectionIDMap.json`, JSON.stringify(sectionIDMap, null, 2), err => { console.error(err) });
  } catch (e) {
   console.error(e)
  }
})

export default copySections;
