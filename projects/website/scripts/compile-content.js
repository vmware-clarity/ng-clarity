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

main();

async function main() {
  const compiledContentPath = path.join(PROJECT_ROOT, 'src/compiled-content');
  fs.mkdirSync(compiledContentPath, { recursive: true });

  writeJson('nav.json', await compileNav());
  writeJson('pages.json', await compilePages());
  writeJson('style-docs.json', await compileStyleDocs());
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

async function compilePages() {
  const pages = {};

  for (const pageFilePath of glob.sync(path.join(PROJECT_ROOT, 'content/pages/*.md'), { windowsPathsNoEscape: true })) {
    const slug = path.parse(pageFilePath).name;
    const { attributes, body } = parseFrontMatter(fs.readFileSync(pageFilePath).toString());

    const extraTransformers = attributes.addLevel3HeadingsToToc ? [addLevel3HeadingsToToc] : [];

    pages[slug] = {
      title: attributes['title'],
      html: await compileMarkdown(body, extraTransformers),
    };
  }

  return pages;
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
