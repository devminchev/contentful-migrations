import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	const dxPlayerRewardTermsCriteriaGroup = migration
		.createContentType('dxPlayerRewardTermsCriteriaGroup')
		.name('Dx Player Reward Terms Criteria Group')
		.description(`Digital Experience (Dx) Player Reward Terms Criteria Group responsible for grouping player reward terms criteria properties.`)
		.displayField('entryTitle');

	dxPlayerRewardTermsCriteriaGroup
		.createField('entryTitle')
		.name('entryTitle')
		.type('Symbol')
		.required(true);
	dxPlayerRewardTermsCriteriaGroup.changeFieldControl('entryTitle', 'builtin', 'singleLine', {
		helpText: 'The entryTitle should follow the following format: [entry title] [brand] [jurisdiction] [product] [platform] e.g. player rewards terms criteria group [ballybet] [US-AZ] [SPORTS] [WEB]'
	});

	dxPlayerRewardTermsCriteriaGroup
		.createField('title')
		.name('Title')
		.localized(true)
		.type('Symbol')
	dxPlayerRewardTermsCriteriaGroup.changeFieldControl('title', 'builtin', 'singleLine', {
		helpText: 'The title for the player reward terms criteria group'
	});

	dxPlayerRewardTermsCriteriaGroup
		.createField('criteria')
		.name('Criteria')
		.required(true)
		.type('Array')
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxLocalisation"],
				},
			],
		});
	dxPlayerRewardTermsCriteriaGroup.changeFieldControl('criteria', 'builtin', 'entryLinksEditor', {
		helpText: `Determines which reward type properties need to be templated to display within the T&C's modal. Can contain dynamic values from the player reward data.`
	});

	// Dx Player Reward Terms update.

	const dxPlayerRewardTerms = migration.editContentType('dxPlayerRewardTerms');

	dxPlayerRewardTerms
		.createField('expiresIn')
		.name('Expires In')
		.localized(true)
		.required(true)
		.type('Symbol');
	dxPlayerRewardTerms.changeFieldControl('expiresIn', 'builtin', 'singleLine', {
		helpText: 'The text to display for the expires in section on the player reward terms modal. Example: "Expires In"'
	});
	dxPlayerRewardTerms.moveField('expiresIn').afterField('rewardType');

	dxPlayerRewardTerms
		.createField('description')
		.name('Description')
		.localized(true)
		.type('Text')
	dxPlayerRewardTerms.changeFieldControl('description', 'builtin', 'singleLine', {
		helpText: 'The description for the player reward terms. Can contain dynamic values from the player reward data.'
	});
	dxPlayerRewardTerms.moveField('description').afterField('expiresIn');

	dxPlayerRewardTerms
		.createField('criteriaGroups')
		.name('Criteria Groups')
		.required(true)
		.type('Array')
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxPlayerRewardTermsCriteriaGroup"],
				},
			],
		});
	dxPlayerRewardTerms.changeFieldControl('criteriaGroups', 'builtin', 'entryLinksEditor', {
		helpText: `Determines which reward type criteria groups need to display within the T&C's modal.`
	});
	dxPlayerRewardTerms.moveField('criteriaGroups').afterField('description');

	// Remove criteria field from the Dx Player Reward Terms model as we now have criteria groups
	dxPlayerRewardTerms.deleteField('criteria');

}) as MigrationFunction;
