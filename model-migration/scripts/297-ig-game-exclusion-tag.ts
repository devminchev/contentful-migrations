import { MigrationFunction } from 'contentful-migration';

const tagId = 'exclude_recently_played';
const tagName = 'exclude:recently-played';

export = ((migration) => {
    migration.createTag(tagId, {
        name: tagName
    }, 'public');
}) as MigrationFunction;
