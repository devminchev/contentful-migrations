import { MigrationFunction} from 'contentful-migration';

export = ((migration) => {
    const dxFooter = migration.editContentType('dxFooter');

    dxFooter.editField('brandIcon').required(false);

    dxFooter.editField('navigationLinks').required(false);

    dxFooter.editField('footerIcons').required(false);
    
}) as MigrationFunction;