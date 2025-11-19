import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
    const seoGame = migration.editContentType('seoGame');

    seoGame.createField('backgroundColour')
    .name('Background Colour')
    .type('Symbol')
    .required(false);
    // 4Vy3oAINwRgnxakoTz06tG is the ID for the Color Picker App
    seoGame.changeFieldControl('backgroundColour', 'app', '4Vy3oAINwRgnxakoTz06tG', {
      helpText: 'The background color to appear behind the Game image at the top of the page.',
    });

    seoGame.createField('overlay')
    .name('Overlay')
    .type('Symbol')
    .required(false)
    .localized(true);
    seoGame.changeFieldControl("overlay", "builtin", "singleLine", {
      helpText: "Add an overlay to appear at the top of the Game tile.",
    });

    seoGame.moveField('backgroundColour').afterField('bynderImage');
    seoGame.moveField('overlay').afterField('backgroundColour');


}) as MigrationFunction;