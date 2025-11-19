import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
    const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

    const dxMarquee = migration.editContentType('dxMarquee');
    
    dxMarquee.createField('type')
        .name('Type')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
              in: ['default', 'full_width'],
            },
          ])
          .defaultValue({
            [LOCALE]: 'default',
          });

    dxMarquee.changeFieldControl('type', 'builtin', 'radio', {
        helpText: 'Select the Type to be used for the marquee.',
    });

    dxMarquee.moveField('type').afterField('size');

    //Setting all marquee types to Default
    migration.transformEntries({
		contentType: 'dxMarquee',
		from: ['type'],
		to: ['type'],
		transformEntryForLocale: async () => {
			return {
				type: 'default'
			}
		}
	});
    

}) as MigrationFunction;