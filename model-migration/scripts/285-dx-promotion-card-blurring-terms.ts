import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

    const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

    const dxPromotionContentCard = migration.editContentType('dxPromotionContentCard');

    
    dxPromotionContentCard
        .createField('isTermsBlurred')
        .name('Is Terms Blurred')
        .type('Boolean')
        .localized(false)
        .required(true)
        .defaultValue({
            [LOCALE]: false
        });

    dxPromotionContentCard.changeFieldControl("isTermsBlurred", "builtin", "radio", {
		helpText: "When enabled, the terms text is blurred.",
		trueLabel: "Yes",
		falseLabel: "No"
	});

    migration.transformEntries({
        contentType: 'dxPromotionContentCard',
        from: ['isTermsBlurred'],
        to: ['isTermsBlurred'],
        transformEntryForLocale: async (from) => {
            if (from.isTermsBlurred === undefined) {
                return { isTermsBlurred: false };
            }
        }
    });

    
    migration.transformEntries({
        contentType: 'dxPromotionContentCard',
        from: ['segmentation'],
        to: ['segmentation'],
        transformEntryForLocale: async (from, locale) => {
            const value = from?.segmentation?.[locale];
            if(!value){
                return { segmentation: ['showWhenLoggedIn', 'showWhenLoggedOut'] }
            }
        }
    });

    dxPromotionContentCard.moveField('isTermsBlurred').afterField('terms');
    
}) as MigrationFunction;