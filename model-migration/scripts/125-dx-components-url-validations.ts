import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    const validation = {
        regexp: {
            pattern: `^(http:\\/\\/|https:\\/\\/|\\/)(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\\-\\/]))?$`
        },
        message: 'Input does not match the expected format. Example: url "https://play.ballybet.com/sports" or a relative path starting with "/". Please edit and try again.'
    }

    // Dx Link
    const link = migration.editContentType('dxLink');

    link.editField('url').validations([validation]);

    // Dx Banner
    const bannerUrl = migration.editContentType('dxBanner');

    bannerUrl.editField('url').validations([validation]);

    // Dx Controlled Banner
    const controlledBannerUrl = migration.editContentType('dxControlledBanner');

    controlledBannerUrl.editField('url').validations([validation]);

    // Dx Marquee Custom Tile
    const marqueeCustomTile = migration.editContentType('dxMarqueeCustomTile');

    marqueeCustomTile.editField('url').validations([validation]);

}) as MigrationFunction;
