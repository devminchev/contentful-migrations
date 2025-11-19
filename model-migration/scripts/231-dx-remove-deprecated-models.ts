import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
	migration.deleteContentType('sportsPlaceholder');
	migration.deleteContentType('dxContentDocument')
}) as MigrationFunction;
