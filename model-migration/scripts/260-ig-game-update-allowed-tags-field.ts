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

const TAGS_TO_ADD_TO_ALLOWED_VALUES = ['EXCLUSIVO'];

// Helper to get the current allowed values from Contentful before editing the field
const getCurrentAllowedTagValues = async (context: any): Promise<string[]> => {
  try {
    const contentType = await context.makeRequest({ method: 'GET', url: `/content_types/gameV2` });
    const tagsField = contentType?.fields?.find((f: any) => f.id === 'tags');
    const validations = tagsField?.items?.validations || [];
    const inRule = validations.find((v: any) => Array.isArray(v?.in));
    return Array.isArray(inRule?.in) ? inRule.in : [];
  } catch (e) {
    return [];
  }
};

export = (async (migration, context) => {
  const existingAllowed = await getCurrentAllowedTagValues(context);

  const IN_VALUES = Array.from(new Set([
    ...existingAllowed,
    ...TAGS_TO_ADD_TO_ALLOWED_VALUES
  ]));
  const gameV2 = migration.editContentType('gameV2');


  // Update the existing tags field
  gameV2.editField('tags')
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
          in: IN_VALUES
        }
      ]
    });
}) as MigrationFunction;
