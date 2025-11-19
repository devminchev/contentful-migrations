import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    const dxView = migration.editContentType('dxView');

    dxView.editField('brand').required(false);

    dxView.changeFieldControl('brand', 'builtin', 'entryLinkEditor', {
        helpText: 'The brand where the Digital Experience (Dx) View should be active. This field can be left empty if the view is meant to apply to all brands.'
    });

	dxView.changeFieldControl('jurisdiction', 'builtin', 'entryLinkEditor', {
        helpText: 'The jurisdiction where the Digital Experience (Dx) View should be active. This field can be left empty if the view is meant to apply to all jurisdictions.'
    });

}) as MigrationFunction;
