# Figma Webhook — Cloudflare Worker

This zero-cost Cloudflare Worker bridges Figma's `LIBRARY_PUBLISH` webhook to a GitHub `repository_dispatch` event, triggering the [`figma-sync`](../.github/workflows/figma-sync.yml) workflow automatically.

## One-time Setup

### 1. Deploy the worker

```bash
cd figma-webhook
npx wrangler login
npx wrangler deploy
```

### 2. Set secrets

```bash
npx wrangler secret put FIGMA_WEBHOOK_PASSCODE   # any strong random string
npx wrangler secret put GITHUB_PAT               # GitHub PAT with repo:write
npx wrangler secret put GITHUB_OWNER             # e.g. vmware-clarity
npx wrangler secret put GITHUB_REPO              # e.g. ng-clarity
```

### 3. Register the Figma webhook

Use the Figma REST API to register the webhook against your team:

```bash
curl -X POST "https://api.figma.com/v2/webhooks" \
  -H "X-Figma-Token: $FIGMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "LIBRARY_PUBLISH",
    "team_id": "<YOUR_FIGMA_TEAM_ID>",
    "endpoint": "https://clarity-figma-webhook.<your-account>.workers.dev",
    "passcode": "<FIGMA_WEBHOOK_PASSCODE value above>",
    "description": "Trigger token sync on Clarity library publish"
  }'
```

## Flow

```
Figma designer publishes library
  → POST https://<worker>.workers.dev
    → worker validates passcode
    → worker POSTs repository_dispatch{event_type: "figma-tokens-updated"} to GitHub
      → .github/workflows/figma-sync.yml runs
        → extracts tokens → runs Style Dictionary → opens PR
```
