import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	// Dx Player Reward Terms
	const dxPlayerRewardTerms = migration
		.createContentType('dxPlayerRewardTerms')
		.name('Dx Player Reward Terms')
		.description(`Digital Experience (Dx) Player Reward Terms responsible for displaying the player reward T&C's.`)
		.displayField('entryTitle');

	dxPlayerRewardTerms
		.createField('entryTitle')
		.name('entryTitle')
		.type('Symbol')
		.required(true);
	dxPlayerRewardTerms.changeFieldControl('entryTitle', 'builtin', 'singleLine', {
		helpText: 'The entryTitle should follow the following format: [entry title] [brand] [jurisdiction] [product] [platform] e.g. player rewards terms [ballybet] [US-AZ] [SPORTS] [WEB]'
	});

	dxPlayerRewardTerms
		.createField('rewardType')
		.name('Reward Type')
		.type('Text')
		.localized(false)
		.required(true)
		.validations([
			{
				"in": [
					"PROFIT_BOOST",
					"FREE_BET",
					"SECOND_CHANCE"
				]
			}
		])
		.defaultValue({
			[LOCALE]: "FREE_BET"
		})
	dxPlayerRewardTerms.changeFieldControl('rewardType', 'builtin', 'dropdown', {
		helpText: `The reward type the T&C's modal applies to`,
	});

	dxPlayerRewardTerms
		.createField('criteria')
		.name('Criteria')
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
	dxPlayerRewardTerms.changeFieldControl('criteria', 'builtin', 'entryLinksEditor', {
		helpText: `Determines which reward type properties need to be templated to display within the T&C's modal`
	});

	dxPlayerRewardTerms
		.createField('content')
		.name('Content')
		.type('Object')
		.localized(true)
		.required(false);
	dxPlayerRewardTerms.changeFieldControl('content', 'app', 'z2LsIOTTtkiEsfv1iiqtr', {
		helpText: `Any additional content that needs to display within the T&C's reward modal`,
	});

	dxPlayerRewardTerms
		.createField('brand')
		.name('Brand')
		.type('Link')
		.required(true)
		.linkType('Entry')
		.validations([
			{
				linkContentType: ['dxBrand'],
			}
		]);
	dxPlayerRewardTerms.changeFieldControl('brand', 'builtin', 'entryLinkEditor', {
		helpText: 'The brand the Dx Player Reward Terms content applies to. e.g. ballybet, jackpotjoy etc.'
	})

	dxPlayerRewardTerms
		.createField("jurisdiction")
		.name("Jurisdiction")
		.type("Array")
		.localized(false)
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxJurisdiction"],
				},
			],
		});


	dxPlayerRewardTerms.changeFieldControl('jurisdiction', 'builtin', 'entryLinksEditor', {
		helpText: "The jurisdiction the Dx Player Reward Terms content applies to. e.g. US-AZ, CA-ON, UK, IE"
	});

	dxPlayerRewardTerms
		.createField("platform")
		.name("Platform")
		.type("Array")
		.localized(false)
		.required(true)
		.validations([])
		.items({
			type: "Symbol",
			validations: [{
				in: ['WEB', 'ANDROID', 'IOS']
			}]
		});

	dxPlayerRewardTerms.changeFieldControl("platform", "builtin", "checkbox", {
		helpText: "The platform the Dx Player Reward Terms content applies to. e.g. WEB, IOS, ANDROID",
	});

	// Dx Localisation
	const dxLocalisation = migration.editContentType('dxLocalisation');

	dxLocalisation.editField('brand')
		.required(false);

	dxLocalisation.editField('product')
		.required(false);

	dxLocalisation.editField('platform')
		.required(false);
}) as MigrationFunction;
