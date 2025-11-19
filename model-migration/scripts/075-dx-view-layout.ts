import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// View updates
	const dxView = migration.editContentType('dxView');

	dxView.createField('layout').name('Layout').type('Symbol');
	dxView.changeFieldControl('layout', 'builtin', 'singleLine', {
		helpText: "Determines the site layout for the view. For example, 'HeaderFooter' would render the main content of the view in between a Header and a Footer, or 'HeaderOnly'."
	});

	dxView.moveField('layout').afterField('path');

}) as MigrationFunction;
