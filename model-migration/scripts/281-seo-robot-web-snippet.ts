import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
    const seoPage = migration.editContentType('seoPage');
    const seoBlog = migration.editContentType('seoBlog');

    seoPage
        .createField('maxSnippetLength')
        .name('Robot Web Max Snippet Length')
        .type('Integer')
        .required(false)
        .validations([
            {
                range: {
                    min: -1,
                    max: 160
                }
            }
        ]);
    seoPage.changeFieldControl('maxSnippetLength', 'builtin', 'numberEditor', {
        helpText: 'Max snippet length for robots meta. There are 3 options available and the range you can select from is -1 to 160. Option 1: Prevent snippets entirely (max-snippet: 0). Option 2: Remove the limit, allowing search engines to decide (max-snippet: -1). Option 3: Specify the maximum snippet length in characters (max-snippet: 160).',
    });
    seoPage.moveField('maxSnippetLength').beforeField('canonical');

    seoBlog
        .createField('maxSnippetLength')
        .name('Robot Web Max Snippet Length')
        .type('Integer')
        .required(false)
        .validations([
            {
                range: {
                    min: -1,
                    max: 160
                }
            }
        ]);
    seoBlog.changeFieldControl('maxSnippetLength', 'builtin', 'numberEditor', {
        helpText: 'Max snippet length for robots meta. There are 3 options available and the range you can select from is -1 to 160. Option 1: Prevent snippets entirely (max-snippet: 0). Option 2: Remove the limit, allowing search engines to decide (max-snippet: -1). Option 3: Specify the maximum snippet length in characters (max-snippet: 160).',
    });
    seoBlog.moveField('maxSnippetLength').beforeField('canonical');

}) as MigrationFunction;