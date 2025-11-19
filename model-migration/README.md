

# Model Migration

This repository contains scripts and configurations to run Contentful migration scripts. The process is managed using `ts-node`, `node-pty`, and other dependencies, and can be configured using environment variables.

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
   cd model-migration
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

## Configuration

### Environment Variables

Create a `.env` file at the root of the `model-migration` directory to store your environment variables. This file should contain the following:

```env
ACCESS_TOKEN=<your-contentful-management-access-token>
SPACE=<your-contentful-space-id>
ENV=<your-contentful-environment>
SCRIPT_NUMBER=<default-script-number>
```

Replace the placeholder values with your actual Contentful credentials and desired script number.

## Running Migrations

You can run migration scripts using the `yarn migrate` command. The script number can be specified as a command-line argument or taken from the `.env` file.

### Using Command-Line Argument

To run a specific migration script by providing the script number as a command-line argument:

```bash
yarn migrate --script=<script-number>
```

Example:

```bash
yarn migrate --script=042
```

### Using `.env` File

If the script number is not provided in the command line, it will default to the value specified in the `.env` file:

```bash
yarn migrate
```

## Environment Variables

The following environment variables are used in the migration process:

- **ACCESS_TOKEN**: Your Contentful Management API access token.
- **SPACE**: The Contentful space ID.
- **ENV**: The Contentful environment.
- **SCRIPT_NUMBER**: The default script number to run if not specified in the command line.

## Scripts

### `prepare-migration.js`

This script prepares the environment and arguments for running the migration script. It reads the script number from the command line arguments or falls back to the `.env` file.

### `migrate.js`

This script executes the migration using the prepared environment variables and the specified script number.

## Example `.env` File

```env
ACCESS_TOKEN=CFPAT-xxxxxxxxxxxxxxxxxxxx
SPACE=nw2595tc1jdx
ENV=clone50
SCRIPT_NUMBER=042
```
