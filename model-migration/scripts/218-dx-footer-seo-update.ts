import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	// Update Dx Content
	const dxContent = migration.editContentType('dxContent');

	dxContent
		.createField('title')
		.name('Title')
		.type('Symbol')
		.required(false)
		.localized(true)
	dxContent.changeFieldControl("title", "builtin", "singleLine", {
		helpText: "The Title to be displayed at the top of the Content section that will be used to toggle the Content section.",
	});
	dxContent.moveField('title').afterField('entryTitle');

	dxContent
		.createField("contentToggle")
		.name("Content Toggle")
		.type("Boolean")
		.localized(false)
		.required(false)
		.defaultValue({
			[LOCALE]: true
		});
	dxContent.changeFieldControl("contentToggle", "builtin", "radio", {
		helpText: "Used to determine if the Content field can be collapsable or not.",
		trueLabel: "Collapsable",
		falseLabel: "Static"
	});
	dxContent.moveField('contentToggle').afterField('title');


	// Add Dx Content to Dx Footer
	const dxFooter = migration.editContentType('dxFooter');
	dxFooter
		.createField('bonusInformation')
		.name('Bonus Information')
		.required(false)
		.type('Link')
		.linkType('Entry')
		.validations([
			{
				linkContentType: ['dxContent'],
			}
		]);

	dxFooter.moveField('bonusInformation').afterField('legalInfo');

}) as MigrationFunction;
