import {  MigrationFunction } from "contentful-migration";

// Find bynder app id at https://app.contentful.com/spaces/{SPACE_ID}/apps/list/installed?app=bynder
const BYNDER_APP_ID = '5KySdUzG7OWuCE2V3fgtIa';

export = ((migration) => {
  const igJackpotsSection = migration.editContentType("igJackpotsSection");
  igJackpotsSection
    .createField("pot4ImageBynder")
    .name("Pot4 Bynder Image")
    .type("Object")
    .required(false)
    .localized(false)
    .validations([]);

  igJackpotsSection
    .createField("pot4Image")
    .name("Pot4 Image")
    .type("Symbol")
    .required(false)
    .localized(false)
    .validations([]);

  igJackpotsSection.changeFieldControl(
    "pot4ImageBynder",
    "app",
    BYNDER_APP_ID,
    { helpText: "Configure pot4 image" }
  );
  igJackpotsSection.moveField("pot4ImageBynder").afterField("pot3ImageBynder");

  igJackpotsSection.changeFieldControl(
    "pot4Image",
    "builtin",
    "singleLine",
    { helpText: "Configure pot4 image" }
  );
  igJackpotsSection.moveField("pot4Image").afterField("pot3Image");
  
}) as MigrationFunction;
