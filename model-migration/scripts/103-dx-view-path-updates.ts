import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
	// View updates
	const dxView = migration.editContentType('dxView');

	dxView.createField('paths')
		.name('Paths')
		.type('Array')
		.required(false)
		.items({
			type: 'Symbol'
		});

	dxView.changeFieldControl('paths', 'builtin', 'tagEditor', {
		helpText: "Used to determine which group or fixture pages this view should apply to. Only required for views with a key of 'group' or 'fixture'. Example: '/football/england/premier_league'"
	});

	dxView.moveField('paths').afterField('path');

}) as MigrationFunction;
