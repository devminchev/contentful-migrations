import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

    const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

    // Edit sportsClientGrouping

    const sportsClientGrouping = migration.editContentType('sportsClientGrouping')

    sportsClientGrouping
        .createField('canPaginate')
        .name('Can Paginate')
        .type('Boolean')
        .localized(false)
        .required(true)
        .defaultValue({
            [LOCALE]: true
        });

        sportsClientGrouping.changeFieldControl('canPaginate', 'builtin', 'radio', {
        helpText: 'Specifies if the fixtures should be paginated or display a fixed number of fixtures.',
    });
}) as MigrationFunction;