# Rohit Portfolio

Portfolio website for Rohit Chauhan with a public recruiter-facing site and a hidden admin panel at `/rohit/admin`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres through `pg`
- Brevo contact email
- Groq AI text enhancement
- Zod validation

## Local Setup

```bash
npm install
npm run dev
```

Create `.env` or `.env.local` from `.env.example`.

## Environment Variables

Required for production on Vercel:

```env
NEXT_PUBLIC_SITE_URL="https://your-vercel-domain.vercel.app"
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
BREVO_API_KEY=""
BREVO_SENDER_EMAIL=""
BREVO_SENDER_NAME="Rohit Chauhan Portfolio"
CONTACT_TO_EMAIL="rohitchauhan6232@gmail.com"
ADMIN_SESSION_SECRET=""
GROQ_API_KEY=""
GROQ_MODELS="llama-3.3-70b-versatile,groq/compound-mini"
```

Notes:

- `DATABASE_URL` must be a Supabase pooled Postgres connection string for Vercel/serverless.
- `ADMIN_SESSION_SECRET` should be a long random string.
- `GROQ_API_KEY` and `GROQ_MODELS` enable admin AI enhancement for grammar and portfolio copy.
- Do not commit `.env` or `.env.local`.

## Database

Run the idempotent schema/seed migration:

```bash
npm run db:migrate
```

Create or update an admin user:

```bash
npm run admin:create -- your@email.com "your-strong-password"
```

The migration is safe to run more than once. It creates tables, RLS policies, public read grants, private admin/message tables, initial portfolio content, and duplicate-prevention indexes.

## Admin

Open:

```text
/rohit/admin
```

Admin supports:

- Profile and social links
- Projects
- Skills
- Experience
- Education
- Achievements
- Contact messages
- AI enhancement with before/after review for portfolio copy fields

## Vercel Deployment

Recommended Vercel settings:

- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave default
- Development Command: leave default

Before deployment:

1. Push the project to GitHub.
2. Add all production environment variables in Vercel.
3. Run `npm run db:migrate` locally against the production database.
4. Run `npm run admin:create -- your@email.com "your-password"` locally against the production database.
5. Deploy on Vercel.

After first deploy, update `NEXT_PUBLIC_SITE_URL` to the final Vercel/custom domain and redeploy.

## Contact Email

The contact form stores messages in Postgres and sends an email through Brevo. In development, if Brevo values are missing, messages are logged instead.
