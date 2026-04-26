## Bughive

Bughive is a Next.js issue tracker backed by Prisma and MySQL, with Google login handled through NextAuth.

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Required local environment variables are listed in `.env.example`:

```bash
DATABASE_URL=""
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Production Database

This project is already configured for MySQL in `prisma/schema.prisma`. For production, use a managed MySQL database and set the full connection string in `DATABASE_URL`.

Example Aiven connection string:

```bash
mysql://avnadmin:YOUR_PASSWORD@bughive-db-bughive.c.aivencloud.com:24851/defaultdb?ssl-mode=REQUIRED
```

Keep the `?ssl-mode=REQUIRED` portion intact when using Aiven.

## Deploying On Vercel

Before the first production deployment, add these environment variables in the Vercel project settings:

```bash
DATABASE_URL="mysql://avnadmin:YOUR_PASSWORD@bughive-db-bughive.c.aivencloud.com:24851/defaultdb?ssl-mode=REQUIRED"
NEXTAUTH_URL="https://your-production-domain.vercel.app"
NEXTAUTH_SECRET="your-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Use a strong random value for `NEXTAUTH_SECRET`. If you use a custom domain, set `NEXTAUTH_URL` to that domain instead of the default Vercel URL.

### Apply Prisma Migrations

This repository already includes Prisma migrations under `prisma/migrations`, so production schema changes should be applied with `prisma migrate deploy`.

Run this against the production database before the first live deployment:

```bash
DATABASE_URL="mysql://avnadmin:YOUR_PASSWORD@bughive-db-bughive.c.aivencloud.com:24851/defaultdb?ssl-mode=REQUIRED" npm run prisma:migrate:deploy
```

Do not use `prisma db push` for production in this project.

### Suggested Vercel Build Command

Set the Vercel build command to:

```bash
npm run vercel-build
```

That command runs:

1. `prisma generate`
2. `prisma migrate deploy`
3. `next build`

If you prefer to keep migrations outside the Vercel build step, run `npm run prisma:migrate:deploy` manually from a trusted machine or CI pipeline before deploying, and leave the build command as the default `next build`.

## Useful Scripts

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
npm run vercel-build
```

## Post-Deploy Smoke Check

After deployment:

1. Open the app.
2. Create an issue and confirm it appears in the issue list.
3. Test Google sign-in and confirm authentication works.
