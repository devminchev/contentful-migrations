import { MigrationFunction } from "contentful-migration";

const locale = "en-GB";
export = ((migration) => {
  const igBrazePromosSection = migration.editContentType(
    "igBrazePromosSection"
  );

  // Make the classification field not hidden
  igBrazePromosSection.editField("classification").disabled(false);

  // Update the field
  igBrazePromosSection
    .editField("classification")
    .validations([
      {
        in: ["BrazePromosSection", "DXMarqueeSection"],
      },
    ])
    .defaultValue({
      [locale]: "BrazePromosSection",
    });

  // Change the field to be a dropdown (uses validations as options)
  igBrazePromosSection.changeFieldControl(
    "classification",
    "builtin",
    "dropdown",
    {
      helpText: "Select classification type for this promotions section",
    }
  );
}) as MigrationFunction;
