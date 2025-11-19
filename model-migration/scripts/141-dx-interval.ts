import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  // Create model Dx Interval
  const dxInterval = migration.createContentType('dxInterval').name('Dx Interval').description('Digital Experience (Dx) Interval allows managing events that recur on specific days of the week.').displayField('entryTitle');

  dxInterval.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  dxInterval.createField('startTime')
    .name('Start Time')
    .type('Symbol')
    .required(true)
    .validations([
      {
        regexp: {
          pattern: '^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$'
        },
        message: 'Time needs to be in HH:mm 24h format.',
      },
    ])
    .defaultValue({ [LOCALE]: '00:00' })

  dxInterval.changeFieldControl('startTime', 'builtin', 'singleLine', {
    helpText: "Specifies the event's start time in UTC.",
  });

  dxInterval.createField('endTime')
    .name('End Time')
    .type('Symbol')
    .required(true)
    .validations([
      {
        regexp: {
          pattern: '^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$'
        },
        message: 'Time needs to be in HH:mm 24h format.',
      },
    ])
    .defaultValue({ [LOCALE]: '23:59' })

  dxInterval.changeFieldControl('endTime', 'builtin', 'singleLine', {
    helpText: "Specifies the event's end time in UTC.",
  });

  dxInterval
    .createField("days")
    .name("Days")
    .type("Array")
    .localized(false)
    .required(true)
    .items({
      type: "Symbol",
      validations: [{
        in: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }]
    });

  dxInterval.changeFieldControl("days", "builtin", "checkbox", {
    helpText: "The days of the week on which the event recurs. Please ensure the selected days are consecutive.",
  });

  // Add model to Sports Match List

  const sportsMatchList = migration.editContentType('sportsMatchList')

  sportsMatchList
    .createField('schedule')
    .required(false)
    .name('Schedule')
    .type('Link')
    .validations([
      {
        linkContentType: ['dxInterval'],
      },
    ])
    .linkType('Entry');

  sportsMatchList.changeFieldControl('schedule', 'builtin', 'entryLinkEditor', {
    helpText: 'Days and time of the week this Match List should recur.',
  });

}) as MigrationFunction;