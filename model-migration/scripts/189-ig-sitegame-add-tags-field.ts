import { MigrationFunction } from 'contentful-migration';

const parseArgs = (args: string[], acceptedArgs: string[]) => {
  return args.reduce((acc, curr, idx) => {
    if (acceptedArgs.includes(curr)) {
      acc[curr] = args[idx + 1];
    }
    return acc;
  }, {} as { [key: string]: string });
};

const parsedArgs = parseArgs(process.argv.slice(2), ['-s', '-a', '-e']);
const spaceId = parsedArgs['-s'];
const locale = spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

const ALLOWED_TAG_VALUES = ['hot', 'HOT', 'free', 'FREE', 'new', 'NEW!', 'suggested', 'SUGGESTED', 'bingo', 'BINGO', 'exclusive', 'EXCLUSIVE', 'TABLE 1', 'TABLE 2', 'TABLE 3', 'TABLE 4', 'TABLE 5', 'TABLE 6',' TABLE 7', 'TABLE 8',' TABLE 9', 'TABLE 10' ];

export = ((migration) => {
  const siteGameV2 = migration.editContentType('siteGameV2');

  // Create the new tags field
  siteGameV2.createField('tags')
    .name('tags')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ALLOWED_TAG_VALUES
        }
      ]
    });

  // Configure the editor widget for tags
  siteGameV2.changeFieldControl(
    'tags',
    'builtin',
    'tagEditor',
    {
      helpText: 'Additional tags to show on the site for that game'
    }
  );
}) as MigrationFunction;
