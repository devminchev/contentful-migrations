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

export = (function (migration) {
  const siteGameV2 = migration.editContentType('siteGameV2');

  siteGameV2.deleteField('environment');

  siteGameV2.resetFieldControl('environment');
} as MigrationFunction);
