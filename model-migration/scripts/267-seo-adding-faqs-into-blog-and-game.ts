import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
    const seoBlog = migration.editContentType('seoBlog');
    const seoGame = migration.editContentType('seoGame');

    seoBlog.createField('faqs')
        .name('FAQs')
        .type('Array')
        .localized(false)
        .required(false)
        .items({
            type: 'Link',
            linkType: 'Entry',
            validations: [
                {
                    linkContentType: ['seoFAQs']
                }
            ]
        })

    seoBlog.changeFieldControl('faqs', 'builtin', 'entryLinksEditor', {
        helpText: 'This field will allow you to add multiple SEO FAQs entries, which include question and answer set up to be displayed on a Blog.'
    });

    seoBlog.moveField('faqs').afterField('content');

    seoGame.createField('faqs')
        .name('FAQs')
        .type('Array')
        .localized(false)
        .required(false)
        .items({
            type: 'Link',
            linkType: 'Entry',
            validations: [
                {
                    linkContentType: ['seoFAQs']
                }
            ]
        })

    seoGame.changeFieldControl('faqs', 'builtin', 'entryLinksEditor', {
        helpText: 'This field will allow you to add multiple SEO FAQs entries, which include question and answer set up to be displayed on a Game.'
    });

    seoGame.moveField('faqs').afterField('content');
}) as MigrationFunction;