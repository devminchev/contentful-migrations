import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
    const validation = {
        regexp: {
          pattern: `^(http:\\/\\/|https:\\/\\/|\\/)(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\\-\\/]))?|\/$`
        },
        message: 'Input does not match the expected format. Example: url "https://play.ballybet.com/sports" or a relative path starting with "/". Please edit and try again.'
    }

    const seoRedirect = migration.editContentType('seoRedirect');
    seoRedirect.editField('toPath').validations([validation]);

    const dxLink = migration.editContentType('dxLink');
    dxLink.editField('url').validations([validation]);

  }) as MigrationFunction;