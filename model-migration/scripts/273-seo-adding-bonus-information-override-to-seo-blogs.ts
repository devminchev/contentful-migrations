import { MigrationFunction } from "contentful-migration";

export =((migration) => {
  const seoBlog = migration.editContentType('seoBlog');

  seoBlog.createField('bonusInformationOverride')
    .name('Bonus Information Override')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([
      {
        linkContentType: ['dxContent']
      }
    ]);

  seoBlog.changeFieldControl('bonusInformationOverride', 'builtin', 'entryLinkEditor', {
    helpText: 'The Bonus Information to be displayed within the Footer this will override the bonusInformation field set by the /footer endpoint. If left blank the original bonusInformation data will be used.',
  });
  // Relocate the Meta title and description:
  seoBlog.moveField('metaTitle').beforeField('canonical');
  seoBlog.moveField('metaDescription').beforeField('canonical');

  // Locate the Bonus Information Override:
  seoBlog.moveField('bonusInformationOverride').beforeField('metaTitle');
}) as MigrationFunction;