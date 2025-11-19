
# Data Migration

This repository contains scripts and configurations to run Contentful migration scripts. The process is managed using Node.js, and other dependencies, and can be configured using environment variables.

## Table of Contents

- [Setup](#setup)
- [Configuration](#configuration)
- [Running Migrations](#running-migrations)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd data-migration
   ```

2. Install deno (Optional)
   ```bash
   brew install deno
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

## Configuration

### Environment Variables

Create a `.env` file at the root of the `data-migration` directory to store your environment variables. This file should contain the following:

```env
ACCESS_TOKEN=<your-contentful-management-access-token>
SPACE=<your-contentful-space-id>
ENV=<your-contentful-environment>
```

Replace the placeholder values with your actual Contentful credentials.

## Running Migrations

You can run migration scripts using the `yarn migrate` command. The script name can be specified as a command-line argument or taken from the `.env` file.

### Using Command-Line Argument

To run a specific JS migration script by providing the script name as a command-line argument:

```bash
yarn migrate <script-name>
```

To run a specific TS migration script by providing the script name as a command-line argument:

```bash
yarn migrate:deno <script-name>
```
The Deno runtime will perform inline compilation of the TypeScript file and execute your script. We highly recommend using Deno because it is faster and allows you to debug your code directly in your editor. If you prefer not to use Deno, you will need to compile your TypeScript into JavaScript using the standard compilation method.

Example:

```bash
yarn migrate gameModelV2
```

### Using `.env` File

If the script name is not provided in the command line, it will default to the value specified in the `.env` file:

```bash
yarn migrate
```

## Environment Variables

The following environment variables are used in the migration process:

- **ACCESS_TOKEN**: Your Contentful Management API access token.
- **SPACE**: The Contentful space ID.
- **ENV**: The Contentful environment.

## Scripts

### `src/index.js`

This script prepares the environment and arguments for running the migration script. It reads the script name from the command line arguments or falls back to the `.env` file.

### `gameModelV2.js`

An example migration script that can be run using the `yarn migrate gameModelV2` command.

## Example `.env` File

```env
ACCESS_TOKEN=CFPAT-xxxxxxxxxxxxxxxxxxxx
SPACE=nw2595tc1jdx
ENV=test
```
