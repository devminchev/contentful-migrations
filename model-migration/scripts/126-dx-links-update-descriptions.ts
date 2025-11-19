
import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    // Update description on isNew field
    const dxLinks = migration.editContentType('dxLink');

    dxLinks.changeFieldControl('isNew', 'builtin', 'radio', {
        helpText: "Whether to assign 'Is New' icon to the Digital Experience (DX) Link. Note: this field is not used as part of the current site/app. Any changes to this field will not be reflected on the front end."
    });

    // Update description on segmentation field

    dxLinks.changeFieldControl('segmentation', 'builtin', 'checkbox', {
        helpText: "The segment(s) where the Digital Experience (DX) Link should be active. Note: this field is not used as part of the current site/app. Any changes to this field will not be reflected on the front end."
    });


}) as MigrationFunction;
