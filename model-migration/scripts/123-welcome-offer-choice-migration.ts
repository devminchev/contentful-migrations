import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const welcomeOfferRules = migration
    .createContentType('welcomeOfferRules')
    .name('Welcome Offer Rules')
    .description('')
    .displayField('title')
  welcomeOfferRules.createField('title').name('title').type('Text').localized(true)
  welcomeOfferRules.createField('rules').name('rules').type('Text').localized(true)

  const welcomeOffer = migration
    .createContentType('welcomeOffer')
    .name('Welcome Offer')
    .description('')
    .displayField('offerTitle')
  welcomeOffer.createField('offerId').name('offerId').type('Text').localized(true)
  welcomeOffer.createField('offerTitle').name('offerTitle').type('Text').localized(true)
  welcomeOffer.createField('offerDescription').name('offerDescription').type('Text').localized(true)
  welcomeOffer.createField('channelIDs').name('channelIDs').type("Text").localized(true)

  const welcomeOfferChoice = migration
    .createContentType('welcomrOfferChoice')
    .name('Welcome Offer Choice')
    .description('')
    .displayField('title')
  welcomeOfferChoice
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([{ linkContentType: ['venture'] }])
    .linkType('Entry');
  welcomeOfferChoice
    .createField('welcomeOfferRules')
    .name('welcomeOfferRules')
    .type('Link')
    .validations([{ linkContentType: ['welcomeOfferRules'] }])
    .linkType('Entry');
  welcomeOfferChoice
    .createField('welcomeOfferChoices')
    .name('welcomeOfferChoices')
    .type('Link')
    .validations([{ linkContentType: ['welcomeOfferChoices'] }])
    .linkType('Entry');
  welcomeOfferChoice.createField('selectedText').name('selectedText').type('Text').localized(true);
  welcomeOfferChoice.createField('title').name('title').type('Text').localized(true);
  welcomeOfferChoice.createField('noOfferText').name('noOfferText').type('Text').localized(true);
  welcomeOfferChoice.createField('rulesLink').name('rulesLink').type('Text').localized(true);
  welcomeOfferChoice.createField('rulesLinkUri').name('rulesLinkUri').type('Text').localized(true);

}) as MigrationFunction;
