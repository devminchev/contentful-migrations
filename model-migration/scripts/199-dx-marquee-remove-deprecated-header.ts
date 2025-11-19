import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
	const dxMarquee = migration.editContentType('dxMarquee');

	// This has been deprecated in favour of the headerV2 field.
	// Enough time has passed that it can now be removed.
	dxMarquee.deleteField('header');

}) as MigrationFunction;
