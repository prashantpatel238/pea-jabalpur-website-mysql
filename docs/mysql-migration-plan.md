# MySQL Migration Plan

## Scope completed in this phase

- Preserve the existing Express + EJS route and view structure.
- Replace the MongoDB connection bootstrap with a reusable `mysql2/promise` pool.
- Switch environment parsing from `MONGODB_URI` to Hostinger-friendly `DB_*` variables.
- Remove MongoDB-backed session startup wiring.
- Remove boot-time assumptions that seed Mongo-backed models before the SQL layer exists.

## MongoDB-dependent areas identified

- `src/models/*.js`
  Mongoose schema definitions for `Admin`, `Counter`, `Member`, `Notice`, and `SiteSetting`.
- `src/controllers/*.js`
  Controllers call Mongoose model APIs such as `find`, `findOne`, `findById`, `create`, `save`, and `lean`.
- `src/services/adminBootstrap.js`
  Seeds the first admin with the `Admin` Mongoose model.
- `src/services/siteSettingsService.js`
  Reads and writes site settings via the `SiteSetting` Mongoose model.
- `src/services/leadershipService.js`
  Builds leadership queries with the `Member` Mongoose model.
- `src/utils/memberId.js`
  Uses `Counter.findOneAndUpdate` for atomic member ID generation.

## Next migration order

1. Create MySQL schema and SQL migration scripts for `admins`, `members`, `notices`, `site_settings`, and `counters`.
2. Replace each Mongoose model with a repository module that uses `mysql2/promise`.
3. Update controllers and services to call repository methods instead of Mongoose document APIs.
4. Reintroduce startup bootstrap tasks for initial admin and default site settings using MySQL repositories.
5. Add a production session store that does not depend on MongoDB.
6. Add integration tests for login, member management, notices, and site settings against MySQL.
