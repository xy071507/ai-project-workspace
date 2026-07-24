import http from "node:http";
import { URL } from "node:url";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = "http://localhost:3001/oauth2/callback";
const scope = "https://www.googleapis.com/auth/gmail.send";

if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first.");
  process.exit(1);
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope,
  access_type: "offline",
  prompt: "consent",
}).toString();

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, redirectUri);
  if (requestUrl.pathname !== "/oauth2/callback") {
    res.writeHead(404).end("Not found");
    return;
  }

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("Missing authorization code.");
    return;
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(JSON.stringify(tokenData, null, 2));
    return;
  }

  console.log("\nCopy this value into GOOGLE_REFRESH_TOKEN:\n");
  console.log(tokenData.refresh_token || "No refresh token returned. Revoke access and run again.");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Google connection completed. Return to the terminal and copy the refresh token.");
  server.close();
});

server.listen(3001, () => {
  console.log("\nOpen this URL in your browser and sign in with the group leader Gmail account:\n");
  console.log(authUrl.toString());
  console.log("\nWaiting for Google callback on http://localhost:3001/oauth2/callback ...\n");
});
