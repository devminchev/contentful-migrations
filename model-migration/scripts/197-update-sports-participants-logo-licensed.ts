import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

    const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

    const sportsParticipantLogo = migration.editContentType('sportsParticipantLogo')

    sportsParticipantLogo
        .createField('isUnlicensed')
        .name('Logo License')
        .type('Boolean')
        .required(true)
        .defaultValue({
            [LOCALE]: false
        });

    sportsParticipantLogo.changeFieldControl("isUnlicensed", "builtin", "radio", {
        helpText:
            "Used to identify if the logo asset is licensed. This is used by the FE to apply styling changes.",
        trueLabel:"Unlicensed",
        falseLabel:"Licensed"
    });
    
    sportsParticipantLogo.moveField('isUnlicensed').afterField('logo')

}) as MigrationFunction;