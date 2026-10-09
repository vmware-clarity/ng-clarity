/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const domino = require('domino');
const parseFrontMatter = require('front-matter');
const { minify } = require('html-minifier-terser');
const { marked } = require('marked');
const { gfmHeadingId } = require('marked-gfm-heading-id');
const { markedHighlight } = require('marked-highlight');
const prismjs = require('prismjs');
const { parse: parseMarkdown, Syntax } = require('@textlint/markdown-to-ast');

const { LIBS, collectSkills, getAgentsFile } = require('../../../scripts/ai-files');

// add languages for code highlighting
require('prismjs/components/prism-bash');
require('prismjs/components/prism-json');
require('prismjs/components/prism-typescript');

// heading ids
marked.use(gfmHeadingId());

// code highlight
marked.use(
  markedHighlight({
    highlight: (code, lang) =>
      prismjs.languages[lang] ? prismjs.highlight(code, prismjs.languages[lang], lang) : code,
  })
);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://clarity.design';

main();

async function main() {
  const compiledContentPath = path.join(PROJECT_ROOT, 'src/compiled-content');
  fs.mkdirSync(compiledContentPath, { recursive: true });

  const aiFiles = collectAiFiles();
  writeAiStaticFiles(aiFiles);

  writeJson('nav.json', await compileNav());
  writeJson('pages.json', await compilePages(aiFiles));
  writeJson('style-docs.json', await compileStyleDocs());
  writeJson('ai-docs.json', await compileAiDocs(aiFiles));
  writeJson('ai-agents.json', await compileAiAgents(aiFiles));
  writeJson('stackblitz-example-template.json', await compileStackBlitzExampleTemplate());

  function writeJson(filename, data) {
    fs.writeFileSync(path.join(compiledContentPath, filename), JSON.stringify(data, undefined, 2));
  }
}

async function compileNav() {
  const nav = {};

  for (const navFilePath of glob.sync(path.join(PROJECT_ROOT, 'content/nav/*.md'), { windowsPathsNoEscape: true })) {
    const slug = path.parse(navFilePath).name;
    const { attributes } = parseFrontMatter(fs.readFileSync(navFilePath).toString());

    nav[slug] = attributes.groups;
  }

  return nav;
}

async function compilePages(aiFiles) {
  const pages = {};

  for (const pageFilePath of glob.sync(path.join(PROJECT_ROOT, 'content/pages/*.md'), { windowsPathsNoEscape: true })) {
    const slug = path.parse(pageFilePath).name;
    const { attributes, body } = parseFrontMatter(fs.readFileSync(pageFilePath).toString());

    const extraTransformers = attributes.addLevel3HeadingsToToc ? [addLevel3HeadingsToToc] : [];

    pages[slug] = {
      title: attributes['title'],
      html: await compileMarkdown(replaceAiPlaceholders(body, aiFiles), extraTransformers),
    };
  }

  return pages;
}

// Reads AGENTS.md and SKILL.md files from source (not dist) so the website works without a library build.
function collectAiFiles() {
  const agents = [];
  const skills = [];
  const errors = [];

  for (const lib of Object.keys(LIBS)) {
    const agentsFile = getAgentsFile(lib);
    if (agentsFile) {
      agents.push({ lib, packageName: LIBS[lib].packageName, url: `/ai/${lib}/AGENTS.md`, raw: agentsFile.raw });
    }

    const result = collectSkills(lib);
    skills.push(...result.skills.map(skill => ({ ...skill, url: `/ai/skills/${skill.name}/SKILL.md` })));
    errors.push(...result.errors);
  }

  if (errors.length) {
    throw new Error(`Invalid AI skill files:\n${errors.join('\n')}`);
  }

  return { agents, skills };
}

// Writes raw files served as-is by the website: /ai/**, /llms.txt, /llms-full.txt
function writeAiStaticFiles({ agents, skills }) {
  const outputPath = path.join(PROJECT_ROOT, 'src/compiled-ai');
  fs.rmSync(outputPath, { recursive: true, force: true });

  const write = (url, content) => {
    const filePath = path.join(outputPath, url);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  };

  for (const { url, raw } of [...agents, ...skills]) {
    write(url, raw);
  }

  const agentLinks = agents.map(
    a => `- [${a.packageName} AGENTS.md](${SITE_URL}${a.url}): rules for all ${a.packageName} UI`
  );
  const skillLinks = skills.map(s => `- [${s.name}](${SITE_URL}${s.url}): ${s.description}`);
  write(
    'llms.txt',
    [
      '# Clarity Design System',
      '',
      '> Angular UI components (@clr/angular) and AppFX addons (@clr/addons). The files below are written for AI coding agents; the same files ship in the npm packages under `ai/`.',
      '',
      `Usage guide: ${SITE_URL}/pages/ai`,
      '',
      '## AGENTS.md',
      '',
      ...agentLinks,
      '',
      '## Skills',
      '',
      ...skillLinks,
      '',
    ].join('\n')
  );
  write('llms-full.txt', [...agents, ...skills].map(({ raw }) => raw.trim()).join('\n\n---\n\n') + '\n');
}

// Placeholders usable in content/pages/*.md:
//   <!-- ai:skills:<lib> -->    table of the skills of one library
//   <!-- ai:agents -->          accordion with the AGENTS.md of every library (see AiAgentsComponent)
function replaceAiPlaceholders(markdown, { skills }) {
  return markdown
    .replace(/<!-- ai:skills:([a-z]+) -->/g, (placeholder, lib) => {
      const libSkills = skills.filter(s => s.lib === lib);
      if (!libSkills.length) {
        throw new Error(`${placeholder}: no skills found for "${lib}"`);
      }
      // HTML instead of a markdown table so the description column can be given most of the width
      const rows = libSkills.map(s => {
        const name = s.docs ? `<a href="${s.docs}/ai">${s.name}</a>` : s.name;
        return `<tr><td class="left">${name}</td><td class="left">${inlineMarkdownToHtml(s.description)}</td><td class="left"><a href="${s.url}">SKILL.md</a></td></tr>`;
      });
      return [
        '<table>',
        '<thead><tr><th class="left" style="width: 20%">Skill</th><th class="left" style="width: 65%">Use it for</th><th class="left" style="width: 15%">Files</th></tr></thead>',
        `<tbody>${rows.join('')}</tbody>`,
        '</table>',
      ].join('\n');
    })
    .replace(/<!-- ai:agents -->/g, '<app-ai-agents></app-ai-agents>');
}

function inlineMarkdownToHtml(text) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/`([^`]+)`/g, '<code cds-text="code">$1</code>');
}

async function compileAiAgents({ agents }) {
  const aiAgents = [];

  for (const { lib, packageName, url, raw } of agents) {
    // drop the managed-block marker lines and nest headings two levels below the page section (h4 and below)
    const markdown = raw.replace(/^<!-- (?:clarity|appfx):(?:start|end)\b[^\n]*-->\n?/gm, '').trim();
    aiAgents.push({
      packageName,
      url,
      html: await compileMarkdown(markdown, [
        leftAlignTables,
        incrementHeadingLevels,
        incrementHeadingLevels,
        document => prefixHeadingIds(document, `agents-${lib}`),
      ]),
    });
  }

  return aiAgents;
}

async function compileAiDocs({ skills }) {
  const aiDocs = {};
  const extraTransformers = [removeFirstH1, incrementHeadingLevels];

  for (const { name, packageName, description, url, raw, body } of skills) {
    aiDocs[name] = {
      packageName,
      description,
      url,
      raw,
      html: await compileMarkdown(body, [...extraTransformers, document => prefixHeadingIds(document, name)]),
    };
  }

  return aiDocs;
}

async function compileStyleDocs() {
  const styleDocsPath = path.resolve(PROJECT_ROOT, '../../dist/clr-ui/STYLES.md');
  if (!fs.existsSync(styleDocsPath)) {
    console.warn('STYLES.md not found at', styleDocsPath, '- skipping style docs compilation');
    return {};
  }
  const styleDocs = fs.readFileSync(styleDocsPath).toString();
  const styleDocsAst = parseMarkdown(styleDocs);
  const componentHeaderNodes = styleDocsAst.children.filter(node => node.type === Syntax.Header && node.depth === 1);

  const styleDocsMap = {};
  const extraTransformers = [leftAlignTables, addCssClassWarning, incrementHeadingLevels];

  for (let i = 0; i < componentHeaderNodes.length; i++) {
    const componentHeaderNode = componentHeaderNodes[i];
    const componentName = componentHeaderNode.children[0].raw;

    const componentStyleDocsStart = componentHeaderNode.range[1];
    const componentStyleDocsEnd =
      i === componentHeaderNodes.length - 1 ? styleDocs.length : componentHeaderNodes[i + 1].range[0];

    const componentStyleDocs = styleDocs.substring(componentStyleDocsStart, componentStyleDocsEnd).trim();

    styleDocsMap[componentName] = await compileMarkdown(componentStyleDocs, extraTransformers);
  }

  return styleDocsMap;
}

async function compileStackBlitzExampleTemplate() {
  const files = {};

  const templateDir = path.join(PROJECT_ROOT, 'stackblitz-example-template');
  for (const filePath of glob.sync(templateDir + '/**/*.*', { windowsPathsNoEscape: true })) {
    const relativeFilePath = path.relative(templateDir, filePath);

    files[relativeFilePath.split(path.sep).join('/')] = fs.readFileSync(filePath).toString();
  }

  const repoPackageManifest = require(path.resolve(PROJECT_ROOT, '../../package.json'));
  const repoDeps = { ...repoPackageManifest.dependencies, ...repoPackageManifest.devDependencies };
  const templatePackageManifest = JSON.parse(files['package.json']);

  const clarityPackages = ['@clr/angular', '@clr/ui', '@clr/addons'];

  for (const dependency of Object.keys(templatePackageManifest.dependencies || {})) {
    if (clarityPackages.includes(dependency)) {
      // @clr/* versions stay as CLARITY_VERSION_PLACEHOLDER and are patched
      // post-release in the CI workflow with the actual released version
      continue;
    }
    if (repoDeps[dependency]) {
      templatePackageManifest.dependencies[dependency] = repoDeps[dependency];
    }
  }

  if (templatePackageManifest.devDependencies) {
    for (const devDependency of Object.keys(templatePackageManifest.devDependencies)) {
      if (repoDeps[devDependency]) {
        templatePackageManifest.devDependencies[devDependency] = repoDeps[devDependency];
      }
    }
  }

  files['package.json'] = JSON.stringify(templatePackageManifest, undefined, 2);

  return files;
}

async function compileMarkdown(markdown, extraTransformers) {
  const document = domino.createDocument(marked(markdown, { mangle: false }));

  styleTables(document);
  styleInlineCode(document);
  openExternalLinksInNewTab(document);
  openStaticFileLinksInNewTab(document);

  if (extraTransformers) {
    for (const transform of extraTransformers) {
      transform(document);
    }
  }

  styleText(document);

  return await minify(document.body.innerHTML);
}

function styleTables(document) {
  for (const tableElement of Array.from(document.querySelectorAll('table'))) {
    tableElement.classList.add('table');
  }
}

function styleInlineCode(document) {
  for (const codeElement of Array.from(document.querySelectorAll('code:not(pre code)'))) {
    codeElement.setAttribute('cds-text', 'code');
  }
}

function openExternalLinksInNewTab(document) {
  for (const linkElement of Array.from(document.querySelectorAll('a[href]'))) {
    if (!linkElement.href.startsWith('/')) {
      linkElement.setAttribute('rel', 'noopener');
      linkElement.setAttribute('target', '_blank');
    }
  }
}

// Static files (e.g. /llms.txt, /ai/**/SKILL.md) must not go through the Angular router.
function openStaticFileLinksInNewTab(document) {
  for (const linkElement of Array.from(document.querySelectorAll('a[href^="/"]'))) {
    if (/\.(md|txt)$/.test(linkElement.getAttribute('href'))) {
      linkElement.setAttribute('target', '_blank');
    }
  }
}

function leftAlignTables(document) {
  for (const tableCellElement of Array.from(document.querySelectorAll('table th, table td'))) {
    tableCellElement.classList.add('left');
  }
}

function addCssClassWarning(document) {
  const cssHeadingElement = document.querySelector('#css-classes');
  if (cssHeadingElement) {
    const alertElement = document.createElement('div');
    cssHeadingElement.parentNode.insertBefore(alertElement, cssHeadingElement.nextSibling);
    alertElement.outerHTML = `
      <div cds-layout="m-t:lg" cds-text="body" class="alert alert-warning">
        <div class="alert-items">
          <div class="alert-item">
            <span class="alert-text">
              The list of classes below is included for users of <code cds-text="code">@clr/ui</code> without using
              <code cds-text="code">@clr/angular</code>. Using these classes in your Angular components to override
              internal component styling is not supported. It should only be done in cases where you're prepared to
              deal with changes and conflicts in minor or patch releases.
            </span>
          </div>
        </div>
      </div>`;
  }
}

function incrementHeadingLevels(document) {
  const h6Element = document.querySelector('h6');

  if (h6Element) {
    throw new Error(`Cannot increment heading levels if an h6 element is present: ${h6Element.outerHTML}`);
  }

  for (const headingElement of Array.from(document.querySelectorAll('h1, h2, h3, h4, h5'))) {
    const headingLevel = +headingElement.tagName.substring(1);

    const newHeadingElement = document.createElement(`h${headingLevel + 1}`);
    newHeadingElement.id = headingElement.id;
    newHeadingElement.innerHTML = headingElement.innerHTML;

    headingElement.parentNode.replaceChild(newHeadingElement, headingElement);
  }
}

function removeFirstH1(document) {
  document.querySelector('h1')?.remove();
}

// Avoids id collisions when a skill is rendered inside a component page.
function prefixHeadingIds(document, prefix) {
  for (const headingElement of Array.from(document.querySelectorAll('[id]'))) {
    headingElement.id = `${prefix}-${headingElement.id}`;
  }
}

function styleText(document) {
  const defaultAttributes = {
    h1: [
      { attributeName: 'cds-text', attributeValue: 'headline' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:xxl' },
    ],
    h2: [
      { attributeName: 'cds-text', attributeValue: 'title' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:xl' },
    ],
    h3: [
      { attributeName: 'cds-text', attributeValue: 'section' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:lg' },
    ],
    h4: [
      { attributeName: 'cds-text', attributeValue: 'subsection' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    h5: [
      { attributeName: 'cds-text', attributeValue: 'subsection light' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    h6: [
      { attributeName: 'cds-text', attributeValue: 'body bold' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    p: [
      { attributeName: 'cds-text', attributeValue: 'body' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    table: [
      { attributeName: 'cds-text', attributeValue: 'body' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md' },
    ],
    'li > ul, li > ol': [{ attributeName: 'cds-layout', attributeValue: 'm-y:md m-l:lg' }],
    ol: [
      { attributeName: 'cds-text', attributeValue: 'body' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md m-l:xs' },
    ],
    ul: [
      { attributeName: 'cds-text', attributeValue: 'body' },
      { attributeName: 'cds-layout', attributeValue: 'm-t:md m-l:xs' },
    ],
    li: [{ attributeName: 'cds-layout', attributeValue: 'm-t:xs' }],
    img: [{ attributeName: 'cds-layout', attributeValue: 'm-t:xxl' }],
    strong: [{ attributeName: 'cds-text', attributeValue: 'medium' }],
  };

  for (const [rawSelector, attributes] of Object.entries(defaultAttributes)) {
    for (const { attributeName, attributeValue } of attributes) {
      const selector = rawSelector
        .split(/,\s*/g)
        .map(singleSelector => `${singleSelector}:not([${attributeName}])`)
        .join(', ');

      for (const element of Array.from(document.querySelectorAll(selector))) {
        element.setAttribute(attributeName, attributeValue);
      }
    }
  }
}

function addLevel3HeadingsToToc(document) {
  for (const h3Element of Array.from(document.querySelectorAll('h3'))) {
    h3Element.setAttribute('data-toc-item', '');
  }
}
