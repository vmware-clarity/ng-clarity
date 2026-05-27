/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const BaseIndexer = require('./base-indexer');

// Directory name to route path mapping for website documentation
const DIRECTORY_TO_ROUTE = {
  accordion: 'accordion',
  alert: 'alert',
  'app-layout': 'app-layout',
  badges: 'badge',
  breadcrumbs: 'breadcrumbs',
  buttons: 'button',
  'button-group': 'button-group',
  card: 'card',
  charts: 'charts',
  checkboxes: 'checkbox',
  color: 'color',
  combobox: 'combobox',
  datagrid: 'datagrid',
  datalist: 'datalist',
  datepicker: 'datepicker',
  'date-range-picker': 'date-range-picker',
  dropdown: 'dropdown',
  'file-picker': 'file-picker',
  forms: 'forms',
  grid: 'grid',
  header: 'header',
  icons: 'icons',
  input: 'input',
  labels: 'label',
  lists: 'list',
  login: 'login',
  modal: 'modal',
  'side-panel': 'side-panel',
  'multi-step-workflow': 'multi-step-workflow',
  nav: 'navigation',
  onboarding: 'onboarding',
  notifications: 'notifications',
  password: 'password',
  popover: 'popover',
  'progress-bars': 'progress',
  radio: 'radio',
  range: 'range',
  select: 'select',
  signposts: 'signpost',
  spacing: 'spacing',
  spinners: 'spinner',
  'stack-view': 'stack-view',
  stepper: 'stepper',
  tables: 'table',
  tabs: 'tabs',
  textarea: 'textarea',
  themes: 'themes',
  density: 'density',
  timeline: 'timeline',
  toggles: 'toggle-switch',
  tokens: 'tokens',
  tooltips: 'tooltip',
  translate: 'translate',
  'tree-view': 'tree-view',
  typography: 'typography',
  'vertical-nav': 'vertical-nav',
  wizard: 'wizard',
  a11y: 'a11y',
  'advanced-datagrid': 'advanced-datagrid',
  'drag-and-drop': 'drag-and-drop',
};

/**
 * Indexes API documentation dynamically from the demo HTML and TS files
 */
class ApiIndexer extends BaseIndexer {
  constructor(styleDocsMap, projectRoot) {
    super('api');
    this.styleDocsMap = styleDocsMap || {};
    this.projectRoot = projectRoot || path.resolve(__dirname, '../..');
  }

  async extract() {
    const documents = [];
    const apiTermsMap = new Map(); // routePath -> Map<term, tabName>

    const demosPath = path.join(this.projectRoot, 'src/app/documentation/demos');
    const globPattern = path.join(demosPath, '**/*.{html,ts}');

    // Find all demo HTML and TS files
    const files = glob.sync(globPattern, { windowsPathsNoEscape: true });

    for (const filePath of files) {
      const relativePath = path.relative(demosPath, filePath);
      const pathParts = relativePath.split(path.sep);

      if (pathParts.length < 2) {
        continue;
      }

      const dirName = pathParts[0];
      const routePath = DIRECTORY_TO_ROUTE[dirName] || dirName;

      if (!apiTermsMap.has(routePath)) {
        apiTermsMap.set(routePath, new Map());
      }

      const termsMap = apiTermsMap.get(routePath);
      const content = fs.readFileSync(filePath, 'utf8');

      const processContent = (text, currentTab) => {
        // 1. Extract Angular bindings (inputs, outputs, directives) e.g., clrDgFilter, clrDgSelected, clrTabs
        const bindingRegex = /(?:\[|\[\(|\()?(clr[A-Z][A-Za-z0-9]+)(?:\]|\]\)|\))?/g;
        let match;
        while ((match = bindingRegex.exec(text)) !== null) {
          const term = match[1];
          if (term && term.length > 3 && this.isValidBindingForRoute(term, routePath)) {
            const existingTab = termsMap.get(term);
            termsMap.set(term, this.getHighestPriorityTab(existingTab, currentTab));
          }
        }

        // 2. Extract Clarity CSS classes and custom element tags (e.g., clr-datagrid, clr-dg-cell)
        const classRegex = /\b(clr-[a-z0-9-]+|cds-[a-z0-9-]+)\b/g;
        while ((match = classRegex.exec(text)) !== null) {
          const term = match[1];
          if (term && term.length > 3 && !this.isUtilityClass(term) && this.isValidClassForRoute(term, routePath)) {
            const existingTab = termsMap.get(term);
            termsMap.set(term, this.getHighestPriorityTab(existingTab, currentTab));
          }
        }
      };

      const tabMatches = content.split(/<app-doc-tab tab="([^"]+)">/);

      if (tabMatches.length === 1) {
        // No tabs found, assume 'code' for sub-components/examples, or '' for main files
        const defaultTab = filePath.endsWith('.demo.html') && !path.basename(filePath).includes('-') ? '' : 'code';
        processContent(content, defaultTab);
      } else {
        processContent(tabMatches[0], ''); // content before first tab
        for (let i = 1; i < tabMatches.length; i += 2) {
          const tabName = tabMatches[i];
          const tabContent = tabMatches[i + 1];
          processContent(tabContent, tabName);
        }
      }
    }

    // Convert extracted unique terms into search documents
    for (const [routePath, termsMap] of apiTermsMap.entries()) {
      const componentName = this.formatComponentName(routePath);

      for (const [term, tab] of termsMap.entries()) {
        const isClass = term.startsWith('clr-') || term.startsWith('cds-');
        const displayType = isClass ? 'CSS Class / Selector' : 'Angular Directive / Property';

        // Construct the URL: append the specific tab if one was found
        const url = tab ? `/documentation/${routePath}/${tab}` : `/documentation/${routePath}`;

        documents.push(
          this.createDocument({
            id: `api-${routePath}-${term}`,
            title: term,
            content: `${term} ${displayType} for the Clarity ${componentName} component API documentation and usage guidelines.`,
            url: url,
            component: routePath,
            tags: ['api', 'property', 'binding', 'selector', 'class', routePath, term],
            metadata: {
              apiType: isClass ? 'css-class' : 'angular-property',
              component: routePath,
              term: term,
              tab: tab,
            },
          })
        );
      }
    }

    return documents;
  }

  /**
   * Determine the highest priority tab to link to for a given API term
   */
  getHighestPriorityTab(currentTab, newTab) {
    const TAB_PRIORITY = { api: 4, code: 3, usage: 2, overview: 1, '': 0 };
    if (!currentTab) {
      return newTab;
    }
    if (!newTab) {
      return currentTab;
    }
    return (TAB_PRIORITY[newTab] || 0) > (TAB_PRIORITY[currentTab] || 0) ? newTab : currentTab;
  }

  /**
   * Determine if an Angular binding term is valid for the current routePath documentation
   */
  isValidBindingForRoute(term, routePath) {
    // 1. Strict prefix matching
    const strictPrefixes = {
      clrDg: ['datagrid', 'advanced-datagrid'],
      clrAccordion: ['accordion'],
      clrCombobox: ['combobox'],
      clrDatalist: ['datalist'],
      clrDate: ['datepicker', 'date-range-picker'],
      clrDropdown: ['dropdown'],
      clrWizard: ['wizard'],
      clrStep: ['stepper'],
      clrTimeline: ['timeline'],
      clrTree: ['tree-view'],
      clrVerticalNav: ['vertical-nav'],
      clrAlert: ['alert'],
    };

    for (const [prefix, routes] of Object.entries(strictPrefixes)) {
      if (term.startsWith(prefix)) {
        return routes.includes(routePath);
      }
    }

    // 2. Multi-component shared bindings whitelists
    const sharedBindings = {
      clrIfActive: ['tabs', 'accordion', 'vertical-nav', 'navigation'],
      clrIfOpen: ['dropdown', 'modal', 'signpost', 'popover'],
      clrIfExpanded: ['tree-view', 'accordion'],
      clrLoading: ['button', 'datagrid', 'spinner', 'progress'],
    };

    if (sharedBindings[term]) {
      return sharedBindings[term].includes(routePath);
    }

    // 3. Fallback: If it is a generic/global binding, don't let it bloat unrelated pages
    // Only index on the exact page or pages with that term name in their route
    const lowerTerm = term.toLowerCase();
    if (lowerTerm.includes(routePath) || routePath.includes(lowerTerm)) {
      return true;
    }

    // Skip general bindings in unrelated component directories
    return false;
  }

  /**
   * Determine if a CSS class / Selector term is valid for the current routePath documentation
   */
  isValidClassForRoute(term, routePath) {
    // 1. Strict prefix matching for CSS/Selectors
    const strictPrefixes = {
      'clr-dg': ['datagrid', 'advanced-datagrid'],
      'clr-datagrid': ['datagrid', 'advanced-datagrid'],
      'clr-accordion': ['accordion'],
      'clr-combobox': ['combobox'],
      'clr-timeline': ['timeline'],
      'clr-wizard': ['wizard'],
      'clr-stepper': ['stepper'],
      'clr-modal': ['modal'],
      'clr-alert': ['alert'],
      'clr-dropdown': ['dropdown'],
      'clr-tree': ['tree-view'],
      'clr-nav': ['navigation', 'vertical-nav'],
    };

    for (const [prefix, routes] of Object.entries(strictPrefixes)) {
      if (term.startsWith(prefix)) {
        return routes.includes(routePath);
      }
    }

    // 2. Global icons/spinners/labels/badges can be used everywhere, but only index them under their dedicated pages
    const globalUIElements = {
      'clr-icon': 'icons',
      'clr-spinner': 'spinner',
      'clr-badge': 'badge',
      'clr-label': 'label',
    };

    if (globalUIElements[term]) {
      return globalUIElements[term] === routePath;
    }

    // 3. Match terms that naturally belong to the component route
    const strippedTerm = term.replace(/^(clr-|cds-)/, '');
    if (strippedTerm.includes(routePath) || routePath.includes(strippedTerm)) {
      return true;
    }

    return false;
  }

  /**
   * Check if class name is a spacing, grid or utility layout class that should be skipped
   */
  isUtilityClass(className) {
    const utilityPrefixes = [
      'clr-mt-',
      'clr-mb-',
      'clr-my-',
      'clr-mx-',
      'clr-ms-',
      'clr-me-',
      'clr-pt-',
      'clr-pb-',
      'clr-py-',
      'clr-px-',
      'clr-ps-',
      'clr-pe-',
      'clr-col-',
      'clr-row',
      'clr-align-',
      'clr-justify-',
      'clr-flex-',
      'cds-text-',
      'cds-layout-',
      'clr-example',
      'clr-mt-48px',
      'clr-mt-16px',
      'clr-mt-32px',
      'clr-mb-16px',
      'clr-mt-24px',
      'clr-mt-8px',
    ];

    return utilityPrefixes.some(prefix => className.startsWith(prefix)) || className.length < 4;
  }

  /**
   * Format component name for display
   */
  formatComponentName(name) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

module.exports = ApiIndexer;
