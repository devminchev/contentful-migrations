import { readFile, writeFile } from 'node:fs/promises';
import { setField } from './setField.js';

const DEFAULT_LOCALE = 'en-GB';

const copyNativeCategories = (async (environment, locale, venture, sourceVenture, partner, targetPartner) => {
  try {
    const getAllVentureCategories = (envvv) => {
      const promises = [];

      for (let i = 0; i < 1; i++) {
        promises.push(envvv.getEntries({
          'content_type': 'categories',
          'fields.venture.sys.id': sourceVenture.items[0].sys.id,
          'fields.partner': true,
          'fields.native': true,
          'sys.archivedAt[exists]': false,
          'limit': 1000,
          'skip': i * 1000
        }));
      }

      return Promise.all(promises);
    };

    const allVentureCategories = await getAllVentureCategories(environment);
    let flatAllVentureCategories = [];

    allVentureCategories.forEach((batch) => {
      flatAllVentureCategories = flatAllVentureCategories.concat(batch.items);
    });

    const categories = flatAllVentureCategories[0];

    console.log(new Date().toLocaleTimeString(), `COPYING CATEGORIES ${ categories.fields.entryTitle[DEFAULT_LOCALE] } to ${ partner }`);

    const newCategoriesFields = {...categories.fields};

    setField(newCategoriesFields, 'entryTitle', DEFAULT_LOCALE,
      categories.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner).replace(' [partner]', ''));
    setField(newCategoriesFields, 'partner', DEFAULT_LOCALE, false);
    setField(newCategoriesFields, 'venture', DEFAULT_LOCALE, { sys: { type: 'link', linkType: 'Entry', id: targetPartner.sys.id } });

    const categoryIDMap = {}

    for(let category of categories.fields.categories[DEFAULT_LOCALE]) {
      const oldCategory = await environment.getEntry(category.sys.id);
      console.log(new Date().toLocaleTimeString(), `COPYING CATEGORY ${ oldCategory.fields.entryTitle[DEFAULT_LOCALE] } to ${ partner }`);

      const newCategoryFields = {...oldCategory.fields};

      setField(newCategoryFields, 'entryTitle', DEFAULT_LOCALE,
        oldCategory.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner).replace(' [partner]', ''));

      const newCategory = await environment.createEntry('category', {
        fields: newCategoryFields
      });
      await newCategory.publish();

      categoryIDMap[oldCategory.sys.id] = newCategory.sys.id;
    }

    newCategoriesFields.categories[DEFAULT_LOCALE].forEach((cat, i) => {
      newCategoriesFields.categories[DEFAULT_LOCALE][i].sys.id = categoryIDMap[newCategoriesFields.categories[DEFAULT_LOCALE][i].sys.id]
    });

    const newCategories = await environment.createEntry('categories', {
      fields: newCategoriesFields
    });
    await newCategories.publish();

    // @ts-ignore
    await writeFile(`${ __dirname }/categoryIDMapNative.json`, JSON.stringify(categoryIDMap, null, 2), err => { console.error(err) });
  } catch (e) {
   console.error(e)
  }
})

export default copyNativeCategories;
