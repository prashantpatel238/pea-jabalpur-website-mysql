# Hostinger deployment and persistent uploads

Runtime uploads must live separately from the Git checkout. The application keeps the existing public URLs (`/uploads/members/<filename>` and `/uploads/site/<filename>`) but stores their files under `UPLOAD_ROOT/members` and `UPLOAD_ROOT/site`.

## Production setup

1. In Hostinger's terminal, choose a directory outside the application/Git deployment directory and create it:

   ```sh
   mkdir -p /absolute/persistent/path/for/uploads/{members,site}
   chmod 750 /absolute/persistent/path/for/uploads
   chmod 750 /absolute/persistent/path/for/uploads/{members,site}
   ```

   Replace the example path with a path owned and writable by the account that runs Node.js. Do not put this directory under the repository, `public`, or a release directory.

2. Set the same absolute path in the production environment (Hostinger Node.js environment variables or the production `.env`, which must not be committed):

   ```dotenv
   UPLOAD_ROOT=/absolute/persistent/path/for/uploads
   ```

3. Before the first restart with this release, copy any legacy files that still exist. From the application directory, with `UPLOAD_ROOT` configured, run:

   ```sh
   npm run uploads:migrate
   ```

   The migration never overwrites a same-named destination file and never deletes source files. Verify representative member, logo, and favicon URLs after starting the application. Keep the source copy until verification and a backup are complete.

4. Restart the Node.js application. Production startup intentionally fails if `UPLOAD_ROOT` is missing, relative, or inside the deployed application tree.

The persistent upload directory and the MySQL database must both be included in the server backup strategy. A database backup alone does not contain uploaded images. Files already absent from the legacy directory cannot be reconstructed from their database URL; restore those files from a server backup, previous server copy, or the user's original image.

## Local development

When `NODE_ENV` is not `production` and `UPLOAD_ROOT` is unset, uploads use the ignored `data/uploads` directory. Developers may set `UPLOAD_ROOT` to another location when testing deployment behavior.
