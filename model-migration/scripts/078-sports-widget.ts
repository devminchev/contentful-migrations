import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsWidget = migration.createContentType('sportsWidget').name('Sports Widget').description('Sports Widget that will be injected into a specific Target Area in Sports Kambi View based on its order as well as depending on various visibility factors.').displayField('entryTitle');
  sportsWidget.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  sportsWidget
    .createField('component')
    .name('Component')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .localized(true)
    .validations([
      {
        linkContentType: ['dxBanners']
      }
    ]);

  sportsWidget
    .createField('eventId')
    .name('Event Id')
    .type('Number')
    .required(false);
  sportsWidget.changeFieldControl('eventId', 'builtin', 'numberEditor', {
    helpText: 'Only required if "eventGroupListItem" is selected as Target Area.',
  });

  sportsWidget
    .createField('filter')
    .name('Filter')
    .type('Symbol')
    .required(false);

  sportsWidget
    .createField('order')
    .name('Order')
    .type('Symbol')
    .required(false)
    .validations([
      {
        regexp: {
          pattern: "^(\\d+|(bottom)|(top))$"
        }
      }
    ]);
  sportsWidget.changeFieldControl('order', 'builtin', 'singleLine', {
    helpText: 'Order can only be an integer, "bottom" or "top" ',
  });

  sportsWidget
    .createField('segmentation')
    .name('Segmentation')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['showWhenLoggedIn', 'showWhenLoggedOut'],
        }
      ],
    })
    .defaultValue({
      "en-US": [
        "showWhenLoggedIn",
        "showWhenLoggedOut"
      ]
    });
  sportsWidget.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'If the Sports Widget should be active when a User is logged in or not',
  });

  sportsWidget
    .createField('showCount')
    .name('Show Count')
    .type('Number')
    .localized(false)
    .required(false);
    sportsWidget.changeFieldControl('showCount', 'builtin', 'numberEditor', {
      helpText: 'The amount of times the user should see the Sports Widget per session.',
    });

}) as MigrationFunction;