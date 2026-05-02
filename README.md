# [decrypt.im](https://decrypt.im)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDecryptu%2Fdecrypt-portfolio&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN)

My personal website, built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Upstash](https://upstash.com?ref=decrypt.im), [Velite](https://velite.js.org/) and deployed to [Vercel](https://vercel.com/).

![I am Designer logo](public/IamDesigner!English.png)

## Running Locally

Create a `.env` file similar to [`.env.example`](https://github.com/Decryptu/decrypt-portfolio/blob/main/.env.example).

Then install dependencies and run the development server:

```sh-session
bun install
bun dev
```

## Cloning / Forking

Please remove all of my personal information (projects, images, etc.) before deploying your own version of this site.

## Service pages (`/automations`, `/ai-chat`)

Two service pages live under `src/app/automations` and `src/app/ai-chat`. Both
forms submit through a shared Server Action at `src/lib/contact-actions.ts`,
which sends an HTML summary email via [Resend](https://resend.com).

### Resend setup

1. Create an account at [resend.com](https://resend.com).
2. Verify the domain you want to send from (Domains → Add domain → DNS records).
3. Generate an API key (API Keys → Create API key).
4. Add the following environment variables to Vercel
   (Project → Settings → Environment Variables):

   | Variable | Example | Notes |
   | --- | --- | --- |
   | `RESEND_API_KEY` | `re_xxx…` | API key from step 3. |
   | `CONTACT_EMAIL` | `you@example.com` | Where form submissions land. |
   | `RESEND_FROM` | `noreply@yourdomain.com` | Optional. Defaults to `onboarding@resend.dev` (Resend's shared sender). Use a verified-domain address in production. |

   Add the same variables to your local `.env` for development.

### Where to replace placeholder images

All placeholders are uniform gray `.webp` files in
`public/placeholders/`. Replace these with the real assets when ready:

- Subscription logos on `/automations` —
  `public/placeholders/placeholder-logo.webp` (rendered 40×40 in the
  calculator). To use distinct per-subscription logos, drop them in
  `public/placeholders/<sub-id>.webp` and update
  `src/app/automations/savings-calculator.tsx` to pick a different `src`
  per card.
- Cryptoast before/after thumbnails on `/automations` —
  `public/placeholders/placeholder-wide.webp`
  (referenced from `src/app/automations/case-study.tsx`).
- AI Chat UI mockup on `/ai-chat` —
  `public/placeholders/placeholder-square.webp`
  (referenced from `src/app/ai-chat/page.tsx`).

### Adjusting calculator defaults

The default annual prices for every subscription on `/automations` live in
`src/app/automations/data.ts`. Edit the `subscriptions` array (and the
`SAVINGS_RATIO` constant if you want a different "with automations" estimate).

## Original Work

This repo was forked from [chronark](https://github.com/chronark/chronark.com).
