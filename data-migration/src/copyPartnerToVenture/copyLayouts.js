import { readFile, writeFile } from 'node:fs/promises';
import { setField } from './setField.js';

const DEFAULT_LOCALE = 'en-GB';

const copyLayouts = (async (environment, locale, venture, sourceVenture, partner, targetPartner) => {
  try {
    const sectionIDMap = JSON.parse(await readFile(`${ __dirname }/sectionIDMap.json`, 'utf-8'));
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

    const layoutIDMap = {}

    for(let layout of flatAllVentureLayouts) {
      console.log(new Date().toLocaleTimeString(), `COPYING LAYOUT ${ layout.fields.entryTitle[DEFAULT_LOCALE] } to ${ partner }`);

      const newLayoutFields = {...layout.fields};

      setField(newLayoutFields, 'entryTitle', DEFAULT_LOCALE,
        layout.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner).replace(' [partner]', ''));
      setField(newLayoutFields, 'partner', DEFAULT_LOCALE, false);
      setField(newLayoutFields, 'venture', DEFAULT_LOCALE, { sys: { type: 'link', linkType: 'Entry', id: targetPartner.sys.id } });

      if (layout?.fields?.sections?.[DEFAULT_LOCALE].length) {
        layout.fields.sections[DEFAULT_LOCALE].forEach((section, i) => {
          newLayoutFields.sections[DEFAULT_LOCALE][i].sys.id = sectionIDMap[layout.fields.sections[DEFAULT_LOCALE][i].sys.id]
        });
      }

      const newLayout = await environment.createEntry('layout', {
        fields: newLayoutFields
      });
      await newLayout.publish();

      layoutIDMap[layout.sys.id] = newLayout.sys.id;
    }

    // @ts-ignore
    await writeFile(`${ __dirname }/layoutIDMap.json`, JSON.stringify(layoutIDMap, null, 2), err => { console.error(err) });
  } catch (e) {
   console.error(e)
  }
})

export default copyLayouts;
