import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {

	const dxView = migration.editContentType('dxQuickLinks');

	// Secondary Content
	dxView.editField('type')
		.validations([
			{
				in: ['carousel', 'grid', 'list', 'carousel-pill'],
			},
		])
		.defaultValue({
			'en-US': 'carousel',
		});

}) as MigrationFunction;
