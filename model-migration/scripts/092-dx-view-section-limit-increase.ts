import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	const dxView = migration.editContentType('dxView');

	// Removing any section limit validations as they're not required anymore and we need to add more than 5 components per section
	// Currently we're looking at 1002 out of 11000 for the X-Contentful-Graphql-Query-Cost
	dxView.editField('topContent').validations([]);
	dxView.editField('primaryContent').validations([]);
	dxView.editField('leftNavigationContent').validations([]);
	dxView.editField('secondaryContent').validations([]);
	dxView.editField('primaryEmptyContent').validations([]);

}) as MigrationFunction;
