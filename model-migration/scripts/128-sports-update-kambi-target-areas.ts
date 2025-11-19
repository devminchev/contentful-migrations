import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    const sportsWidgets = migration.editContentType('sportsWidgets');

  sportsWidgets.editField('targetArea')
  .validations([
    {
      in: [
        'betHistoryBeforeCoupons',
        'betHistoryBottom',
        'betHistoryBottomNotLoggedIn',
        'betHistoryTop',
        'betHistoryTopNotLoggedIn',
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
        'eventTop',
        'sandwichFilterCouponAboveMenu',
        'sandwichFilterCouponBelowList',
        'sandwichFilterCouponBelowMenu',
        'sandwichFilterHomeAboveMenu',
        'sandwichFilterHomeBelowList',
        'sandwichFilterHomeBelowMenu',
        'sandwichFilterLiveRightNowAboveMenu',
        'sandwichFilterLiveRightNowBelowList',
        'sandwichFilterLiveRightNowBelowMenu',
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

}) as MigrationFunction;