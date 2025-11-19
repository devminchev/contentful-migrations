import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    const dxToolTip = migration.editContentType('dxTooltip');

    dxToolTip.editField('icon').required(false);
    
    dxToolTip.editField('description').required(false);

    dxToolTip
        .createField('tags')
        .name('Tags')
        .type('Array')
        .localized(false)
        .required(false)
        .items({
            type: 'Symbol'
        });

    dxToolTip.changeFieldControl('tags', 'builtin', 'tagEditor', {
        helpText: 'Sports associated with the content e.g. "BASKETBALL", "TENNIS", "FOOTBALL".'
    });

    dxToolTip
		.createField("link")
		.name("Link")
		.type("Link")
		.localized(false)
		.required(false)
		.validations([
			{
				linkContentType: ["dxLink"],
			},
		])
		.linkType("Entry");

}) as MigrationFunction;