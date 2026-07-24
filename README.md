# AI Project Copilot

AI Project Copilot transforms project documents into actionable team knowledge.

## Stack

- JavaScript and JSX
- React
- Next.js App Router
- Tailwind CSS

## Project structure

- `app/` contains the landing, workspace, project, dashboard, and settings routes.
- `components/` contains focused layout, dashboard, and shared UI components.
- `data/mockData.js` contains realistic prototype data.
- `lib/helpers.js` contains small shared helpers.

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

Prototype interactions use local React state, `localStorage`, and
`sessionStorage`, so the product can be presented without a backend or external
account. The standard Next.js project can be deployed directly to Vercel.

---

## Google Calendar + Gmail deadline reminders

This project now contains two Google features:

1. **Add to Google Calendar** — the meeting button opens a pre-filled Google Calendar event. The member reviews it and presses **Save**. This method does not require the website to access the member's Google account or store their password/token.
2. **Gmail deadline reminders** — a protected server route checks the project deadline every day. It sends an email 3, 2, and 1 day before the deadline using the group leader's Gmail account.

### A. Update the meeting and member information

Edit `data/mockData.js`:

- Replace every `example.com` member email with the real team email.
- Set `project.deadline` using `YYYY-MM-DD`.
- Set `project.deadlineDisplay` to the wording shown in email.
- Set `meeting.start` and `meeting.end` as ISO dates with Singapore offset `+08:00`.

Example:

```js
start: "2026-07-24T10:00:00+08:00",
end: "2026-07-24T11:00:00+08:00",
```

### B. Create Google Cloud credentials

1. Open Google Cloud Console and create/select a project.
2. Enable **Gmail API**.
3. Configure the **OAuth consent screen**. During testing, add the group leader's Gmail address as a test user.
4. Create an **OAuth client ID** with type **Web application**.
5. Add this authorised redirect URI exactly:

```text
http://localhost:3001/oauth2/callback
```

6. Copy `.env.example` to `.env.local` and enter `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### C. Generate the leader Gmail refresh token

In the project folder, run:

```bash
npm run google:token
```

Open the URL printed in the terminal, log in with the Gmail account that will send reminders, and approve the `gmail.send` permission. Copy the refresh token printed in the terminal into:

```text
GOOGLE_REFRESH_TOKEN=...
GMAIL_SENDER_EMAIL=the-same-leader-email@gmail.com
```

Never commit `.env.local` or paste these secret values into source code.

### D. Test the reminder locally

The route only sends when the deadline is 1–3 days away. Temporarily set the deadline to a date within the next three days, start the app, then open:

```text
http://localhost:3000/api/reminders/send
```

In production the route requires this header:

```text
Authorization: Bearer YOUR_CRON_SECRET
```

### E. Add environment variables in Vercel

In **Vercel → Project → Settings → Environment Variables**, add:

- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GMAIL_SENDER_EMAIL`
- `CRON_SECRET`

Redeploy after saving them.

`vercel.json` runs `/api/reminders/send` every day at `01:00 UTC`, which is `09:00 Singapore time`. Vercel automatically sends the `CRON_SECRET` authorisation header when that environment variable is configured.

### Important prototype limitation

The reminder list is currently stored in `data/mockData.js`. For a real multi-project system, store projects, deadlines, member emails, and reminder history in a database such as Supabase/PostgreSQL. A database is also needed to guarantee that a manually retried cron request cannot send a duplicate email on the same day.
