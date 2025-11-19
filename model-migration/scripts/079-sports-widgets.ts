import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsWidgets = migration.createContentType('sportsWidgets').name('Sports Widgets').description('Sports Widgets allows a collection of Sports Widget with differing properties to be displayed in the Sports Kambi View using a selected target area.').displayField('entryTitle');
  sportsWidgets.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  sportsWidgets
    .createField('targetArea')
    .name('Target Area')
    .type('Symbol')
    .required(true)
    .localized(false)
    .validations([
      {
        in: [
          'betHistoryBeforeCoupons',
          'betHistoryBottom',
          'betHistoryBottomNotLoggedIn',
          'betHistoryTop',
          'betHistoryTopNotLoggedIn',
          'betslipMain',
          'betslipReceipt',
          'betslipReceiptMiddle',
          'coreUxWidgetBetweenSections1',
          'coreUxWidgetBetweenSections2',
          'coreUxWidgetBottom',
          'coreUxWidgetTop',
          'eventBeforeBetOffers',
          'eventBetOffersCategories',
          'eventBottom',
          'eventColumn2Placeholder',
          'eventColumn2Placeholder2',
          'eventGroupAboveFilterTabs',
          'eventGroupBottom',
          'eventGroupListItem',
          'eventGroupTop',
          'eventLiveStats',
          'eventStreaming',
          'eventTop',
          'eventTopBelowBreadcrumb',
          'eventVisualisation',
          'filterHubAboveSandwichFilter',
          'sandwichFilterHomeAboveMenu',
          'sandwichFilterHomeBelowList',
          'sandwichFilterHomeBelowMenu',
          'sandwichFilterLiveRightNowAboveMenu',
          'sandwichFilterSportsHubAboveMenu',
          'sandwichFilterSportsHubBelowList',
          'sandwichFilterSportsHubBelowMenu',
          'sandwichFilterStartingSoonAboveMenu',
          'sandwichFilterStartingSoonBelowList',
          'sandwichFilterStartingSoonBelowMenu',
          'sportsHubAboveBrowseSports',
          'sportsHubBelowBrowseSports',
          'sportsHubMiddleBrowseSports'
        ]
      }
    ]);
  sportsWidgets.changeFieldControl('targetArea', 'builtin', 'dropdown', {
    helpText: 'The location of the Sports Widgets in the Sports Kambi View. If "eventGroupListItem" is selected, please enter in an Event Id below.',
  });

  sportsWidgets
    .createField('widget')
    .name('Widget')
    .type('Array')
    .required(true)
    .localized(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsWidget']
        }
      ]
    });

}) as MigrationFunction;