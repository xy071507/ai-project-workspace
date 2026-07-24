# ProjectFlow AI

A full-stack starter website that converts uploaded project documents into an interactive project workspace.

## Included

- Main page with Create Project and Join by PIN
- Unique six-digit project PIN validation
- Project dashboard
- PDF, DOCX, TXT, PNG and JPG upload
- OCR for images
- AI/fallback extraction into project fields
- Project progress and summary
- Tasks with assignee and status updates
- Meeting history that appends new meetings
- Project-only AI assistant
- JSON-file persistence for a hackathon prototype

## Run locally

Open the project folder in VS Code, then run:

```bash
npm install
npm run install:all
```

Create `server/.env` by copying `server/.env.example`.

For real AI analysis, add your API key:

```env
OPENAI_API_KEY=your_key_here
```

Then run both frontend and backend:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Important

- Without an API key, the website still runs using a simple rule-based fallback, but extraction quality is limited.
- This prototype stores project data in `server/data/projects.json`. For production, replace it with PostgreSQL, Supabase, or another managed database.
- Project PINs are access codes, not strong authentication. Do not store confidential documents until proper authentication, authorization, encryption, rate limiting, and secure storage are added.
