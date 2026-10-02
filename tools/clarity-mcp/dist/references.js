/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { resolveComponent } from './resolve.js';
import { collectRequiredModules, toModuleName } from './scaffold.js';
const MAX_SNIPPET = 1400;
const MAX_EXAMPLES = 6;
const MAX_TOKENS = 40;
const CLARITY_CLASS = /^(btn|label|badge|alert|card|spinner|progress|clr-|dropdown|signpost|tooltip|nav)/;
// Grid / spacing utilities and demo-only classes are page scaffolding, not component API.
const NOISE_CLASS = /^clr-(col|row|offset|m[trblxy]?-|p[trblxy]?-|sr-only)|example/;
/** Parse documentation-routes.ts into the authoritative { route name -> demo folder } list. */
export function parseRoutes(content) {
    const re = /routePath:\s*['"`]([a-z0-9-]+)[^'"`]*['"`][\s\S]{0,160}?import\(\s*['"`]\.\/demos\/([a-z0-9-]+)\//g;
    const out = [];
    const seen = new Set();
    for (const match of content.matchAll(re)) {
        const name = match[1];
        if (!seen.has(name)) {
            seen.add(name);
            out.push({ name, folder: match[2] });
        }
    }
    return out;
}
function uniqueSorted(values) {
    return [...new Set(values)].sort();
}
function clamp(text) {
    const trimmed = text.trim();
    return trimmed.length > MAX_SNIPPET ? `${trimmed.slice(0, MAX_SNIPPET)}\n<!-- …truncated… -->` : trimmed;
}
/** Strip license comments and the demos' StackBlitz harness so snippets show only real usage. */
function cleanSnippet(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<app-stackblitz-example[\s\S]*?<\/app-stackblitz-example>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
async function readIfExists(root, rel) {
    try {
        return await readFile(join(root, rel), 'utf8');
    }
    catch {
        return null;
    }
}
async function listEntries(root, rel) {
    try {
        const entries = await readdir(join(root, rel), { withFileTypes: true });
        return entries.map(entry => ({ name: entry.name, dir: entry.isDirectory() }));
    }
    catch {
        return [];
    }
}
/** Concatenate every demo template so the API surface can be extracted from real usage. */
async function readAllHtml(root, demoDirs) {
    const parts = [];
    for (const dir of demoDirs) {
        for (const entry of await listEntries(root, dir)) {
            if (!entry.dir && entry.name.endsWith('.html')) {
                const content = await readIfExists(root, `${dir}/${entry.name}`);
                if (content) {
                    parts.push(content);
                }
            }
            else if (entry.dir) {
                for (const sub of await listEntries(root, `${dir}/${entry.name}`)) {
                    if (!sub.dir && sub.name.endsWith('.html')) {
                        const content = await readIfExists(root, `${dir}/${entry.name}/${sub.name}`);
                        if (content) {
                            parts.push(content);
                        }
                    }
                }
            }
        }
    }
    return parts.join('\n');
}
function extractApi(html) {
    const elements = uniqueSorted((html.match(/<((?:clr|cds)-[a-z0-9-]+)/g) ?? []).map(token => token.slice(1)).filter(element => !element.includes('demo')));
    const directives = uniqueSorted(html.match(/\bclr[A-Z][A-Za-z0-9]*\b/g) ?? []);
    const classes = uniqueSorted((html.match(/class="[^"]*"/g) ?? [])
        .flatMap(attr => attr.slice(7, -1).split(/\s+/))
        .filter(Boolean)
        .filter(cls => CLARITY_CLASS.test(cls) && !NOISE_CLASS.test(cls)));
    return { elements, directives, classes };
}
function isExampleFile(name) {
    return name.endsWith('.html') && !name.endsWith('.demo.html') && !name.startsWith('example.component');
}
async function pickFeatureHtml(root, dir, feature) {
    const files = (await listEntries(root, `${dir}/${feature}`)).filter(entry => !entry.dir).map(entry => entry.name);
    const html = files.find(name => name === `${feature}.html`) ??
        files.find(name => name.endsWith('.html') && !name.startsWith('example.component')) ??
        files.find(name => name.endsWith('.html'));
    return html ? `${dir}/${feature}/${html}` : null;
}
/** Examples come in two demo layouts: flat template files (buttons) and per-feature subfolders (datagrid). */
async function collectExamples(root, demoDirs) {
    const examples = [];
    const seen = new Set();
    for (const dir of demoDirs) {
        const entries = await listEntries(root, dir);
        for (const entry of entries) {
            if (!entry.dir && isExampleFile(entry.name)) {
                const label = entry.name.replace(/\.html$/, '');
                if (!seen.has(label)) {
                    seen.add(label);
                    examples.push({ label, path: `${dir}/${entry.name}` });
                }
            }
        }
        for (const entry of entries) {
            if (entry.dir && entry.name !== 'utils' && !seen.has(entry.name)) {
                const path = await pickFeatureHtml(root, dir, entry.name);
                if (path) {
                    seen.add(entry.name);
                    examples.push({ label: entry.name, path });
                }
            }
        }
    }
    return examples;
}
function bullets(label, values) {
    if (values.length === 0) {
        return `- ${label}: _(none observed)_`;
    }
    const shown = values.slice(0, MAX_TOKENS).map(value => `\`${value}\``).join(', ');
    const more = values.length > MAX_TOKENS ? ` …(+${values.length - MAX_TOKENS} more)` : '';
    return `- ${label}: ${shown}${more}`;
}
/**
 * Render a distilled, ready-to-load Markdown reference for one component from its live demos.
 * Returns null when the component has no demo folder (nothing to distill).
 */
export async function renderReference(root, name, folderHint) {
    const resolved = await resolveComponent(root, name, true);
    const demoDirs = resolved.demoDirs.length > 0
        ? resolved.demoDirs
        : folderHint
            ? [`projects/website/src/app/documentation/demos/${folderHint}`]
            : [];
    if (demoDirs.length === 0) {
        return null;
    }
    const api = extractApi(await readAllHtml(root, demoDirs));
    const modules = await collectRequiredModules(root, demoDirs);
    const suggestedModule = toModuleName(name);
    const examples = await collectExamples(root, demoDirs);
    const snippets = [];
    for (const example of examples.slice(0, MAX_EXAMPLES)) {
        const content = await readIfExists(root, example.path);
        if (content) {
            snippets.push(`### ${example.label}\n\n\`\`\`html\n${clamp(cleanSnippet(content))}\n\`\`\`\n\n_source: ${example.path}_`);
        }
    }
    const moduleLine = modules.length > 0 ? modules.map(module => `\`${module}\``).join(', ') : '_none — basic usage is CSS classes only_';
    const allLabels = examples.map(example => example.label);
    return [
        `# ${name} — @clr/angular usage`,
        '',
        '> Generated from the live demos by `npm run generate:references`. Do not edit by hand.',
        `> Source of truth: ${demoDirs.map(dir => `\`${dir}\``).join(', ')}`,
        '',
        '## Import',
        '',
        `- Modules used in the demos: ${moduleLine}`,
        `- Granular module for a lean bundle: \`${suggestedModule}\` (confirm in the API report below)`,
        '- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.',
        '',
        '## API observed in the demos',
        '',
        bullets('Elements', api.elements),
        bullets('Directives / inputs', api.directives),
        bullets('CSS classes', api.classes),
        '',
        '## Examples',
        '',
        snippets.length > 0 ? snippets.join('\n\n') : '_No example templates found; see the demo folder._',
        '',
        '## More',
        '',
        `- All documented examples: ${allLabels.length > 0 ? allLabels.map(label => `\`${label}\``).join(', ') : '_none_'}`,
        `- Full public API report: \`${resolved.apiRefPath ?? 'projects/angular/clarity.api.md'}\``,
        `- Deep / live example: call the MCP tool \`scaffold_clarity_component { componentName: "${name}", features: [...] }\``,
        '',
    ].join('\n');
}
