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

// Directory name to route path mapping for website documentation (reused from ApiIndexer)
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
 * Indexes component documentation from the documentation routes
 */
class ComponentIndexer extends BaseIndexer {
  constructor(projectRoot) {
    super('component');
    this.projectRoot = projectRoot || path.resolve(__dirname, '../..');
  }

  async extract() {
    const documents = [];

    // Extract components from documentation routes
    const components = this.extractComponentRoutes();

    // Reverse map ROUTE -> DIRECTORY to find demo source folders
    const routeToDirMap = {};
    for (const [dir, route] of Object.entries(DIRECTORY_TO_ROUTE)) {
      routeToDirMap[route] = dir;
    }

    const demosPath = path.join(this.projectRoot, 'src/app/documentation/demos');

    for (const component of components) {
      const folderName = routeToDirMap[component.name] || component.name;
      const componentFolder = path.join(demosPath, folderName);

      // Glob all html and ts files in the component folder recursively
      const fileGlob = path.join(componentFolder, '**/*.{html,ts}');
      const files = glob.sync(fileGlob, { windowsPathsNoEscape: true });

      const tabTextParts = {
        overview: [],
        code: [],
        api: [],
        design: [],
        accessibility: [],
        themes: [],
        colors: [],
        shapes: [],
      };

      const discoveredTabs = new Set();

      for (const file of files) {
        try {
          const fileContent = fs.readFileSync(file, 'utf8');

          if (fileContent.includes('<app-doc-tab')) {
            // This is a main routing file containing tab sections
            for (const tab of Object.keys(tabTextParts)) {
              const tabRegex = new RegExp(`<app-doc-tab tab=["']${tab}["']>[\\s\\S]*?<\\/app-doc-tab>`, 'i');
              const match = fileContent.match(tabRegex);
              if (match) {
                discoveredTabs.add(tab);
                const innerHtml = match[0].replace(/^<app-doc-tab[^>]*>/i, '').replace(/<\/app-doc-tab>$/i, '');
                const plainText = this.htmlToText(innerHtml);
                if (plainText) {
                  tabTextParts[tab].push(plainText);
                }
              }
            }
          } else {
            // This is an examples helper file (*.ts or *.html in a sub-folder/sub-component)
            // Examples naturally represent the implementation 'code' tab
            if (file.endsWith('.html')) {
              const plainText = this.htmlToText(fileContent);
              if (plainText) {
                tabTextParts['code'].push(plainText);
              }
            } else if (file.endsWith('.ts')) {
              // Extract comments, component selectors, and clean typescript strings
              const cleanTs = fileContent
                .replace(/\/\*[\s\S]*?\*\//g, '') // strip block comments
                .replace(/\/\/.*/g, '') // strip line comments
                .replace(/\s+/g, ' ') // normalize whitespace
                .trim();
              if (cleanTs) {
                tabTextParts['code'].push(cleanTs);
              }
            }
          }
        } catch {
          // Graceful fallback for file read issues
        }
      }

      // If 'code' has parts but isn't explicitly in discovered tabs, add it if the directory has demos
      if (tabTextParts['code'].length > 0) {
        discoveredTabs.add('code');
      }

      // Main component document (always index this as the overview)
      // We will populate its content with the actual extracted overview text, falling back to description
      const overviewText = tabTextParts['overview'].join(' ');
      const mainContent = overviewText
        ? `${this.formatComponentName(component.name)} component overview. ${overviewText}`
        : `${this.formatComponentName(component.name)} component. ${component.description}`;

      documents.push(
        this.createDocument({
          id: `${component.name}-overview`,
          title: this.formatComponentName(component.name),
          content: mainContent,
          url: `/documentation/${component.name}`,
          component: component.name,
          tags: this.generateComponentTags(component.name),
          metadata: {
            category: component.category,
            hasDemo: true,
          },
        })
      );

      // Dynamically add search documents for discovered, visible tabs ONLY
      for (const tab of Array.from(discoveredTabs)) {
        // Skip 'overview' because it represents the main landing component page (covered above)
        if (tab === 'overview') {
          continue;
        }

        const tabContentText = tabTextParts[tab].join(' ');
        const tabContent = tabContentText
          ? `${this.formatComponentName(component.name)} ${tab} documentation. ${tabContentText}`
          : `${this.formatComponentName(component.name)} ${tab} documentation and examples.`;

        documents.push(
          this.createDocument({
            id: `${component.name}-${tab}`,
            title: `${this.formatComponentName(component.name)} - ${this.formatTabName(tab)}`,
            content: tabContent,
            url: `/documentation/${component.name}/${tab}`,
            component: component.name,
            tags: [...this.generateComponentTags(component.name), tab],
            metadata: {
              category: component.category,
              tab: tab,
            },
          })
        );
      }
    }

    return documents;
  }

  /**
   * Extract component routes from the documentation routes file
   */
  extractComponentRoutes() {
    // Hardcoded list of components based on documentation-routes.ts
    // In a real implementation, we could parse the routes file dynamically
    const components = [
      { name: 'accordion', category: 'layout', description: 'Collapsible content panels for organizing information' },
      { name: 'alert', category: 'feedback', description: 'Contextual feedback messages for user actions' },
      { name: 'app-layout', category: 'layout', description: 'Application layout structure and containers' },
      { name: 'badge', category: 'data', description: 'Small status indicators and labels' },
      { name: 'breadcrumbs', category: 'navigation', description: 'Navigation trail showing user location' },
      { name: 'button', category: 'forms', description: 'Interactive elements for user actions' },
      { name: 'button-group', category: 'forms', description: 'Grouped button collections' },
      { name: 'card', category: 'layout', description: 'Flexible content containers' },
      { name: 'charts', category: 'data', description: 'Data visualization components' },
      { name: 'checkbox', category: 'forms', description: 'Selection input controls' },
      { name: 'color', category: 'design', description: 'Color palette and theming' },
      { name: 'combobox', category: 'forms', description: 'Searchable dropdown selection' },
      {
        name: 'datagrid',
        category: 'data',
        description: 'Advanced data table with sorting, filtering, and pagination',
      },
      { name: 'datalist', category: 'forms', description: 'Simple data selection lists' },
      { name: 'datepicker', category: 'forms', description: 'Date selection input controls' },
      { name: 'date-range-picker', category: 'forms', description: 'Date range selection controls' },
      { name: 'dropdown', category: 'forms', description: 'Menu selection components' },
      { name: 'file-picker', category: 'forms', description: 'File upload and selection' },
      { name: 'forms', category: 'forms', description: 'Form controls and validation' },
      { name: 'grid', category: 'layout', description: 'CSS Grid layout system' },
      { name: 'header', category: 'layout', description: 'Application header and navigation' },
      { name: 'icons', category: 'design', description: 'Icon library and usage' },
      { name: 'input', category: 'forms', description: 'Text input controls' },
      { name: 'internationalization', category: 'utilities', description: 'i18n and localization support' },
      { name: 'layout-utilities', category: 'utilities', description: 'CSS layout helper classes' },
      { name: 'label', category: 'forms', description: 'Form field labels and indicators' },
      { name: 'list', category: 'data', description: 'Structured content lists' },
      { name: 'login', category: 'patterns', description: 'Authentication page patterns' },
      { name: 'modal', category: 'overlay', description: 'Dialog and popup windows' },
      { name: 'side-panel', category: 'overlay', description: 'Sliding panel overlays' },
      { name: 'multi-step-workflow', category: 'patterns', description: 'Multi-step process patterns' },
      { name: 'navigation', category: 'navigation', description: 'Navigation components and patterns' },
      { name: 'onboarding', category: 'patterns', description: 'User onboarding patterns' },
      { name: 'notifications', category: 'feedback', description: 'System notification messages' },
      { name: 'password', category: 'forms', description: 'Password input controls' },
      { name: 'popover', category: 'overlay', description: 'Contextual popup content' },
      { name: 'progress', category: 'feedback', description: 'Progress indicators and bars' },
      { name: 'radio', category: 'forms', description: 'Radio button selection controls' },
      { name: 'range', category: 'forms', description: 'Range slider input controls' },
      { name: 'select', category: 'forms', description: 'Dropdown selection controls' },
      { name: 'signpost', category: 'overlay', description: 'Contextual help and information' },
      { name: 'spacing', category: 'design', description: 'Spacing system and utilities' },
      { name: 'spinner', category: 'feedback', description: 'Loading indicators' },
      { name: 'stack-view', category: 'data', description: 'Stackable data views' },
      { name: 'stepper', category: 'navigation', description: 'Step-by-step navigation' },
      { name: 'table', category: 'data', description: 'Basic data tables' },
      { name: 'tabs', category: 'navigation', description: 'Tabbed content organization' },
      { name: 'textarea', category: 'forms', description: 'Multi-line text input' },
      { name: 'themes', category: 'design', description: 'Theme customization and dark mode' },
      { name: 'density', category: 'design', description: 'Content density options' },
      { name: 'timeline', category: 'data', description: 'Chronological data display' },
      { name: 'toggle-switch', category: 'forms', description: 'Toggle switch controls' },
      { name: 'tokens', category: 'design', description: 'Design tokens and CSS variables' },
      { name: 'tooltip', category: 'overlay', description: 'Hover information tooltips' },
      { name: 'tree-view', category: 'data', description: 'Hierarchical data display' },
      { name: 'typography', category: 'design', description: 'Text styling and typography' },
      { name: 'vertical-nav', category: 'navigation', description: 'Vertical navigation menus' },
      { name: 'wizard', category: 'patterns', description: 'Multi-step form wizards' },
      { name: 'a11y', category: 'utilities', description: 'Accessibility utilities and features' },
      { name: 'advanced-datagrid', category: 'data', description: 'Advanced datagrid features and extensions' },
      { name: 'drag-and-drop', category: 'utilities', description: 'Drag and drop interactions' },
      { name: 'translate', category: 'utilities', description: 'Translation and localization utilities' },
    ];

    return components;
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

  /**
   * Format tab name for display
   */
  formatTabName(tab) {
    return tab.charAt(0).toUpperCase() + tab.slice(1);
  }

  /**
   * Generate component-specific tags
   */
  generateComponentTags(componentName) {
    const tags = [componentName];

    // Add specific component tags
    const specificTags = {
      button: ['click', 'action', 'submit'],
      input: ['text', 'field', 'value'],
      modal: ['dialog', 'popup', 'overlay'],
      datagrid: ['table', 'sort', 'filter', 'pagination'],
      datepicker: ['date', 'calendar', 'time'],
      alert: ['message', 'warning', 'error', 'success'],
      tooltip: ['hover', 'help', 'info'],
      dropdown: ['select', 'menu', 'option'],
      checkbox: ['check', 'selection', 'multiple'],
      radio: ['choice', 'selection', 'single'],
      tabs: ['navigation', 'panel', 'content'],
      accordion: ['collapse', 'expand', 'fold'],
    };

    if (specificTags[componentName]) {
      tags.push(...specificTags[componentName]);
    }

    return tags;
  }
}

module.exports = ComponentIndexer;
