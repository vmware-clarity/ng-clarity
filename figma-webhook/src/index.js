/**
 * Cloudflare Worker — Figma → GitHub dispatch bridge
 *
 * Deploy with: npx wrangler deploy
 *
 * Required Worker secrets (set via `wrangler secret put <NAME>`):
 *   FIGMA_WEBHOOK_PASSCODE  - the passcode you set when registering the Figma webhook
 *   GITHUB_PAT              - a GitHub Personal Access Token with repo:write scope
 *   GITHUB_OWNER            - repo owner, e.g. "vmware-clarity"
 *   GITHUB_REPO             - repo name, e.g. "ng-clarity"
 */

const ALLOWED_EVENT_TYPE = 'LIBRARY_PUBLISH';

export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @returns {Promise<Response>}
   */
  async fetch(request, env) {
    // Figma only sends POST requests
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response('Bad Request: invalid JSON', { status: 400 });
    }

    // Validate the security passcode Figma attaches to every webhook delivery.
    // Figma docs: https://www.figma.com/developers/api#webhooks_v2-passcode
    const passcode = payload?.passcode ?? '';
    if (!env.FIGMA_WEBHOOK_PASSCODE || passcode !== env.FIGMA_WEBHOOK_PASSCODE) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Only act on LIBRARY_PUBLISH events; acknowledge everything else silently.
    // Figma expects a 2xx within a few seconds or will retry.
    if (payload?.event_type !== ALLOWED_EVENT_TYPE) {
      return new Response('OK — event ignored', { status: 200 });
    }

    // Respond 200 to Figma immediately before doing async work so we don't time out.
    const responseToFigma = new Response('OK', { status: 200 });

    // Dispatch to GitHub in the background (Cloudflare Workers `waitUntil` pattern).
    const ctx = { waitUntil: promise => promise }; // fallback; real ctx passed by runtime
    void dispatchGitHubEvent(env, payload).catch(err => console.error('GitHub dispatch failed:', err));

    return responseToFigma;
  },
};

/**
 * Triggers the `figma-tokens-updated` repository_dispatch event on GitHub.
 * @param {Env} env
 * @param {object} figmaPayload  - the raw Figma webhook payload
 */
async function dispatchGitHubEvent(env, figmaPayload) {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/dispatches`;

  const body = JSON.stringify({
    event_type: 'figma-tokens-updated',
    client_payload: {
      file_key: figmaPayload?.file_key ?? '',
      triggered_at: new Date().toISOString(),
      published_by: figmaPayload?.created_by?.handle ?? 'unknown',
    },
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_PAT}`,
      'Content-Type': 'application/json',
      'User-Agent': 'clarity-figma-webhook/1.0',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub dispatch returned ${response.status}: ${text}`);
  }
}
