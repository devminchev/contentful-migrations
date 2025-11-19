#!/usr/bin/env node
// @deno-types="npm:@types/minimist"
import minimist from 'minimist';
import * as dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
dotenv.config();

const args = minimist(process.argv.slice(2));
const script = args._[0];

if (!script) {
  console.error('Please specify a script to run.');
  process.exit(1);
}

if (args.help) {
  console.log(`
Usage: yarn migrate <script> [options]

Scripts:
  gameModelV2   Run the game model V2 migration script

Options:
  --space       Contentful space ID (default: from .env file)
  --accessToken Contentful access token (default: from .env file)
  --env         Environment (default: from .env file)
  --help        Show this help message

Examples:
  yarn migrate gameModelV2 --space=mySpaceID --accessToken=myAccessToken --env=myEnv
  yarn migrate gameModelV2
`);
  process.exit(0);
}

const space = args.space || process.env.SPACE;
const accessToken = args.accessToken || process.env.ACCESS_TOKEN;
const env = args.env || process.env.ENV;

if (!space || !accessToken || !env) {
  console.error('Missing required arguments: --space, --accessToken, or --env.');
  process.exit(1);
}

const runScript = async () => { 
  try {
    const scriptPathTs = path.resolve(`./src/${script}/index.ts`);
    const scriptPathJs = path.resolve(`./src/${script}/index.js`);

    let module;
    if (fs.existsSync(scriptPathTs)) {
      module = await import(scriptPathTs);
    } else if (fs.existsSync(scriptPathJs)) {
      module = await import(scriptPathJs);
    } else {
      throw new Error(`Neither index.ts nor index.js found in ./src/${script}`);
    }

    module.default({ space, accessToken, env });
  } catch (error) {
    console.error(`Failed to load script: ${script}`);
    console.error(error);
    process.exit(1);
  }
};


runScript();

