import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the AI Project Copilot landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /AI Project Copilot/);
  assert.match(html, /actionable team knowledge/i);
  assert.match(html, /Open Workspace/);
});

test("renders the public workspace and project PIN route", async () => {
  const workspace = await render("/workspace");
  assert.equal(workspace.status, 200);
  const workspaceHtml = await workspace.text();
  assert.match(workspaceHtml, /Create New Project/);
  assert.match(workspaceHtml, /Open Project/);
  assert.match(workspaceHtml, /\/project\/csit205-genai-assignment-2\/access/);

  const access = await render("/project/csit205-genai-assignment-2/access");
  assert.equal(access.status, 200);
  const accessHtml = await access.text();
  assert.match(accessHtml, /Enter Project PIN/);
  assert.match(accessHtml, /No external account is required/);
});
