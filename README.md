## DevPort

Personal developer portfolio built with Next.js 16, Tailwind CSS, MongoDB, and NextAuth (Google login). Data is managed through secure API routes and a forthcoming `/admin` dashboard.

## Local development

```bash
pnpm install
pnpm dev
```

App runs on [http://localhost:3000](http://localhost:3000).

## Required environment variables

Create a `.env.local` with the following secrets:

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `GITHUB_TOKEN` | GitHub GraphQL token for activity heatmap |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth credentials for Google login |
| `NEXTAUTH_SECRET` | Used by NextAuth for JWT encryption |
| `AUTHORIZED_EMAIL` | Admin Google account (e.g. `ssachinsingh99@gmail.com`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name used for uploads |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset for Cloudinary |

Restart the dev server whenever you change env vars.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint on the project |
