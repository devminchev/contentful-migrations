import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
    const cashierGameConfig = migration.editContentType('cashierGameConfig');

    cashierGameConfig.deleteField('spainReportable');


}) as MigrationFunction;

