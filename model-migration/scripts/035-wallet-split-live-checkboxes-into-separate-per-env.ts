import { MigrationFunction } from 'contentful-migration';

var newItems = [
  'AZ - Arizona',
  'EU - Europe',
  'IN - Indiana',
  'NJ - New Jersey',
  'NY - New York',
  'ON - Ontario',
  'PA - Pennsylvania'
];
var newRegulatedItems = [
  'EU - Europe'
];

export = ((migration) => {
  const cashierGameConfig = migration.editContentType('cashierGameConfig');
  const cashierRegulatoryDataGameConfig = migration.editContentType('cashierRegulatoryDataGameConfig');

  // 1 Add new items, keep old
  cashierGameConfig.editField('live').items({
    type: 'Symbol',
    validations: [
      {
        in: ['yes', ...newItems]
      }
    ]
  });

  cashierRegulatoryDataGameConfig.editField('live').items({
    type: 'Symbol',
    validations: [
      {
        in: ['yes', ...newRegulatedItems]
      }
    ]
  });

  // 2 Set all new items if 'yes' was set before
  migration.transformEntries({
    contentType: 'cashierGameConfig',
    from: ['live'],
    to: ['live'],
    transformEntryForLocale: function(fromFields, currentLocale) {
      if (fromFields && fromFields['live'] && fromFields['live'][currentLocale] && fromFields['live'][currentLocale].length > 0) {
        return {
          live: newItems
        };
      }
      return {live:[]};
    }
  });

  migration.transformEntries({
    contentType: 'cashierRegulatoryDataGameConfig',
    from: ['live'],
    to: ['live'],
    transformEntryForLocale: function(fromFields, currentLocale) {
      if (fromFields && fromFields['live'] && fromFields['live'][currentLocale] && fromFields['live'][currentLocale].length > 0) {
        return {
          live: newRegulatedItems
        };
      }
      return {live:[]};
    }
  });

  // 3 Remove 'yes' item
  cashierGameConfig.editField('live').items({
    type: 'Symbol',
    validations: [
      {
        in: newItems
      }
    ]
  });

  cashierRegulatoryDataGameConfig.editField('live').items({
    type: 'Symbol',
    validations: [
      {
        in: newRegulatedItems
      }
    ]
  });
}) as MigrationFunction;
