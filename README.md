# Contentful Migrations

This repository hosts two complementary toolchains that automate and script Contentful migrations. It enables teams to both refactor existing entries ("data migrations") and evolve content models ("model migrations") across environments in a repeatable, version-controlled way.

- **Non-technical overview** – Treat the repository as the automation hub for Contentful housekeeping. When new ventures launch or layouts change, the scripts here export live content, transform it offline, and publish the result back to Contentful so you do not have to click through the UI.
- **Technical overview** – The codebase contains a Node/Deno ETL pipeline for entry-level data moves plus a TypeScript-based migration runner that executes Contentful's official `contentful-migration` scripts. Each package can be invoked independently but they share configuration via `.env` files that describe which space, environment, and token to target.

## Tech stack

| Area | Technologies |
| --- | --- |
| Runtime & tooling | Node.js 20+, optional Deno runtime, Yarn/NPM scripts |
| Contentful access | `contentful-management`, `contentful-export`, `contentful-import`, `contentful-migration` |
| Scripting & utilities | TypeScript, modern ECMAScript modules, `ts-node`, `dotenv`, `minimist`, `axios`, `bottleneck` |
| Formatting & linting | ESLint for the data-migration workspace |

## Architectural overview

```
root
├── data-migration/        # Entry-level ETL scripts (e.g., game model v2)
└── model-migration/       # Content model migrations built with contentful-migration
```

### Data-migration workspace

The `data-migration` package is an ETL runner that executes a named script folder under `src/`.

1. [`src/index.js`](data-migration/src/index.js) parses CLI arguments, loads `.env`, and dynamically imports the requested script (preferring `index.ts` when available). It passes `space`, `env`, and `accessToken` to the script entry point so each migration is self-contained.
2. A typical migration (for example [`src/gameModelV2`](data-migration/src/gameModelV2/index.js)) orchestrates:
   - `api/managementApi.js` for authenticated Contentful Management API access.
   - `extract/` modules that export filtered datasets via `contentful-export`.
   - `transform/` logic that reshapes the exported JSON into the new schema.
   - `load/` helpers that re-import transformed entities and publish them via the Management API.
3. Supporting utilities (`constants.js`, `utils/logging.js`, etc.) describe shared Contentful identifiers and logging conventions.

Because each script lives in its own folder, the workspace scales to dozens of migrations without editing the runner. Deno support is provided (`yarn migrate:deno`) for teams that prefer TypeScript-first execution without a build step.

### Model-migration workspace

The `model-migration` package wraps Contentful's official migration tooling:

1. [`prepare-migration.js`](model-migration/prepare-migration.js) reads either `script=<nnn>` CLI arguments or `SCRIPT_NUMBER` from `.env`. It can expand ranges like `164...172` and runs each script sequentially, capturing failures without halting the entire batch.
2. [`run-migration.js`](model-migration/run-migration.js) resolves the numeric identifier (e.g., `042`) to an actual file in [`scripts/`](model-migration/scripts) and launches `ts-node contentful-migration` with the configured `SPACE`, `ACCESS_TOKEN`, and `ENV`.
3. The `scripts/` directory contains chronological TypeScript files (e.g., [`001-games-migration.ts`](model-migration/scripts/001-games-migration.ts)) that call Contentful's migration API to create/update content types and fields.

This separation keeps irreversible model changes reviewable, while still letting you run batches of migrations safely.

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd contentful-migrations
   ```

2. **Install dependencies per workspace**
   ```bash
   cd data-migration && yarn install
   cd ../model-migration && yarn install
   ```

3. **Configure environment variables**
   Create `.env` files inside each workspace. At minimum set:
   ```ini
   ACCESS_TOKEN=CFPAT-xxxx
   SPACE=<space-id>
   ENV=<environment>
   # data-migration only
   # optional defaults such as SCRIPT=gameModelV2
   # model-migration only
   SCRIPT_NUMBER=001
   ```

   Keep API tokens out of version control.

## Usage

### Running data migrations

From `data-migration/`, invoke one of the script folders listed in `src/`:

```bash
yarn migrate gameModelV2 --space=<space-id> --env=<environment> --accessToken=<token>
```

- Omit the flags to fall back to `.env`.
- Use `yarn migrate:deno` to execute the same entry point via Deno.
- Each script defines its own workflow. For instance, `gameModelV2` exports legacy entries (`CONTENT_TYPES`), transforms them into the `gameV2`/`siteGameV2` schema, and optionally repopulates Contentful.

### Running model migrations

From `model-migration/`, execute one or multiple numbered migrations:

```bash
yarn migrate --script=042      # single
SCRIPT_NUMBER=164...172 yarn migrate   # range via .env
```

The runner will look for `042-*.ts` inside `scripts/`, spawn `ts-node contentful-migration`, and stream the CLI output. Any failed script numbers are reported once the batch finishes so you can rerun only the problematic ones.

## Contributing

1. Open an issue or internal ticket describing the desired migration.
2. For **data changes**, scaffold a new folder under `data-migration/src/` and export `default({ space, accessToken, env }) => Promise<void>` so the main runner can execute it.
3. For **model changes**, add a sequential `NNN-description.ts` file under `model-migration/scripts/` that exports a Contentful migration function.
4. Add/adjust documentation (like this README) and test against a sandbox environment before targeting production.
5. Submit a pull request that explains the migration's intent, verification steps, and rollback plan.

Following these conventions will keep migrations auditable and reproducible for every environment.
