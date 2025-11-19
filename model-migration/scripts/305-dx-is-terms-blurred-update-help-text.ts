import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
    const dxPromotionContentCard = migration.editContentType('dxPromotionContentCard');

    dxPromotionContentCard.changeFieldControl("isTermsBlurred", "builtin", "radio", {
		helpText: "When enabled, the background for the terms section is blurred allowing the text to be easier to read.",
		trueLabel: "Yes",
		falseLabel: "No"
	});
}) as MigrationFunction;