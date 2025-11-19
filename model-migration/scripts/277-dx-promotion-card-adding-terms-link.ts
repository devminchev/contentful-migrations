import { MigrationFunction } from 'contentful-migration';

export = (migration => {
    const  dxPromotionContentCard = migration.editContentType('dxPromotionContentCard');

    dxPromotionContentCard
        .createField('termsV2')
        .name('Terms')
        .type('Text')
        .localized(true)
        .required(false)
        .validations([
            {
                size: {
                    max: 426
                }
            }
        ])

    dxPromotionContentCard
        .createField('termsLink')
        .name('Terms Link')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([
            {
                regexp: {
                    pattern: `^(http:\\/\\/|https:\\/\\/|\\/)(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\\-\\/]))?$`
                  },
                  message: 'Input does not match the expected format. Example: url "https://play.ballybet.com/sports" or a relative path starting with "/". Please edit and try again.'
            }
        ])
    dxPromotionContentCard.changeFieldControl('termsLink', 'builtin', 'singleLine', {
        helpText: 'Link to terms and conditions page. This will make the terms text clickable in the marquee.'
    });
    

    migration.transformEntries({
        contentType: 'dxPromotionContentCard',
        from: ['terms'],
        to: ['termsV2'],
        transformEntryForLocale: async (from, locale) => {
            if(from?.terms?.[locale]){
                return { termsV2: from.terms[locale] }
            }
        }
    });

    dxPromotionContentCard.deleteField('terms');
        
    dxPromotionContentCard.changeFieldId('termsV2', 'terms');

    dxPromotionContentCard.moveField('terms').afterField('description');

    dxPromotionContentCard.moveField('termsLink').afterField('terms');
    

}) as MigrationFunction;