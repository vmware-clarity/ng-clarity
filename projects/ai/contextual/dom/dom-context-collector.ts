/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextAction, ClrContextSnapshotOptions } from '../interfaces/context.interface';

/**
 * Default budgets applied while building a snapshot, tuned to keep snapshots compact
 * enough for an AI agent's context window.
 */
export const CLR_CONTEXT_DEFAULT_OPTIONS: Required<ClrContextSnapshotOptions> = {
  maxTextLength: 100,
  maxItemsPerCollection: 25,
  maxComponents: 100,
  includeDomComponents: true,
  includeActions: true,
};

/**
 * Teaches the collector how to describe one kind of component found in the DOM.
 *
 * Extractors are what make the engine UI-library agnostic: Clarity ships a built-in set
 * for its own components, and any other UI library rendering on the same page can
 * contribute extractors for its components through
 * `ClrContextualEngineService.registerDomExtractor`.
 */
export interface ClrContextDomExtractor {
  /** CSS selector matching the elements this extractor understands. */
  selector: string;
  /** Describes the element's current state, or returns `null` when there is nothing to report. */
  extract(element: HTMLElement, options: Required<ClrContextSnapshotOptions>): ClrComponentContext | null;
}

const ALERT_TYPE_CLASSES = ['danger', 'warning', 'success', 'info', 'neutral', 'loading'];

/**
 * The built-in extractors for Clarity's own components. They only report state that is
 * true at the moment they run, reading it from the live DOM: components that are
 * destroyed, hidden or closed simply produce nothing.
 */
const CLARITY_DOM_EXTRACTORS: ClrContextDomExtractor[] = [
  {
    selector: 'clr-modal, clr-side-panel',
    extract: (element, options) => {
      const dialog = element.querySelector('.modal-dialog');
      if (!dialog) {
        // The dialog content only exists in the DOM while the modal is open.
        return null;
      }
      return {
        type: element.tagName.toLowerCase() === 'clr-side-panel' ? 'side-panel' : 'modal',
        label: textOf(element.querySelector('.modal-title'), options),
        state: { open: true },
        actions: collectActions(element.querySelector('.modal-footer'), options),
      };
    },
  },
  {
    selector: 'clr-wizard',
    extract: (element, options) => {
      const dialog = element.querySelector('.modal-dialog');
      if (!dialog) {
        return null;
      }
      const steps = Array.from(element.querySelectorAll('.clr-wizard-stepnav-link-title'))
        .slice(0, options.maxItemsPerCollection)
        .map(step => textOf(step, options));
      return {
        type: 'wizard',
        label: textOf(element.querySelector('clr-wizard-title'), options),
        state: {
          open: true,
          steps,
          currentStep: textOf(element.querySelector('.clr-nav-link.active .clr-wizard-stepnav-link-title'), options),
        },
        actions: collectActions(element.querySelector('.clr-wizard-footer'), options),
      };
    },
  },
  {
    selector: 'clr-alert',
    extract: (element, options) => {
      const alert = element.querySelector('.alert');
      if (!alert) {
        return null;
      }
      const severity = ALERT_TYPE_CLASSES.find(type => alert.classList.contains(`alert-${type}`));
      return {
        type: 'alert',
        label: textOf(element.querySelector('.alert-text') || element.querySelector('.alert-items'), options),
        state: severity ? { severity } : undefined,
      };
    },
  },
  {
    selector: 'clr-datagrid',
    extract: (element, options) => {
      const columns = Array.from(element.querySelectorAll('clr-dg-column'))
        .slice(0, options.maxItemsPerCollection)
        .map(column => textOf(column.querySelector('.datagrid-column-title') || column, options));
      const rows = element.querySelectorAll('clr-dg-row:not(.datagrid-row-loading)');
      const sortedColumn = element.querySelector(
        'clr-dg-column[aria-sort="ascending"], clr-dg-column[aria-sort="descending"]'
      );
      const state: Record<string, unknown> = {
        columns,
        visibleRows: rows.length,
        selectedRows: element.querySelectorAll('clr-dg-row.datagrid-selected').length,
      };
      if (sortedColumn) {
        state.sortedBy = textOf(sortedColumn.querySelector('.datagrid-column-title') || sortedColumn, options);
        state.sortOrder = sortedColumn.getAttribute('aria-sort');
      }
      const footer = textOf(element.querySelector('clr-dg-footer'), options);
      if (footer) {
        state.footer = footer;
      }
      return {
        type: 'datagrid',
        label: element.getAttribute('aria-label') || undefined,
        state,
      };
    },
  },
  {
    selector: 'clr-tabs',
    extract: (element, options) => {
      const tabs = Array.from(element.querySelectorAll('[role=tab]')).slice(0, options.maxItemsPerCollection);
      return {
        type: 'tabs',
        state: {
          tabs: tabs.map(tab => textOf(tab, options)),
          activeTab: textOf(
            tabs.find(tab => tab.getAttribute('aria-selected') === 'true'),
            options
          ),
        },
      };
    },
  },
  {
    selector: 'clr-accordion, clr-stepper',
    extract: (element, options) => {
      const panels = Array.from(element.querySelectorAll('.clr-accordion-header-button'))
        .slice(0, options.maxItemsPerCollection)
        .map(button => ({
          type: 'panel',
          label: textOf(button, options),
          state: { expanded: button.getAttribute('aria-expanded') === 'true' },
        }));
      return {
        type: element.tagName.toLowerCase() === 'clr-stepper' ? 'stepper' : 'accordion',
        children: panels,
      };
    },
  },
  {
    selector: 'clr-vertical-nav',
    extract: (element, options) => {
      const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('a.nav-link'))
        .filter(link => isVisible(link))
        .slice(0, options.maxItemsPerCollection);
      return {
        type: 'navigation',
        state: {
          activeLink: textOf(
            links.find(link => link.classList.contains('active')),
            options
          ),
        },
        actions: links.map(link => linkAction(link, options)),
      };
    },
  },
  {
    selector: 'form[clrForm]',
    extract: (element, options) => {
      const fields = Array.from(element.querySelectorAll('.clr-form-control'))
        .slice(0, options.maxItemsPerCollection)
        .map(field => {
          const control = field.querySelector<HTMLElement>('input, select, textarea, [role=combobox]');
          const state: Record<string, unknown> = {};
          if (control?.hasAttribute('required')) {
            state.required = true;
          }
          if (field.classList.contains('clr-form-control-disabled')) {
            state.disabled = true;
          }
          if (field.querySelector('.clr-error')) {
            state.invalid = true;
            state.error = textOf(field.querySelector('clr-control-error'), options);
          }
          return {
            type: controlType(control),
            label: textOf(field.querySelector('.clr-control-label'), options),
            state: Object.keys(state).length ? state : undefined,
          };
        });
      // Field values are intentionally never collected: they can contain sensitive user
      // input, and agents that need them can read the focused control directly.
      return {
        type: 'form',
        label: element.getAttribute('aria-label') || undefined,
        children: fields,
      };
    },
  },
];

/** Clarity elements that are presentational or structural only and never carry useful context. */
const GENERIC_DENY_LIST = ['clr-icon', 'clr-spinner', 'clr-main-container'];

/**
 * Clarity elements that are reported but do not hide the elements nested inside them,
 * because they are containers whose content is independently interesting.
 */
const GENERIC_TRANSPARENT_LIST = ['clr-header'];

/**
 * Scans the rendered DOM for Clarity components and describes their current state.
 *
 * The scan is a pure function of the DOM at the moment of the call: only visible,
 * attached elements are reported, so the result can never describe UI that has been
 * closed, destroyed or navigated away from.
 */
export function collectClrDomContexts(
  root: ParentNode,
  options?: ClrContextSnapshotOptions,
  customExtractors: ClrContextDomExtractor[] = []
): ClrComponentContext[] {
  const resolved: Required<ClrContextSnapshotOptions> = { ...CLR_CONTEXT_DEFAULT_OPTIONS, ...options };
  const contexts: ClrComponentContext[] = [];
  const capturedElements: HTMLElement[] = [];
  const handledElements: HTMLElement[] = [];

  for (const extractor of [...customExtractors, ...CLARITY_DOM_EXTRACTORS]) {
    for (const element of Array.from(root.querySelectorAll<HTMLElement>(extractor.selector))) {
      if (contexts.length >= resolved.maxComponents) {
        return contexts;
      }
      // An extractor owns every element its selector matches: when it reports nothing
      // (e.g. a closed wizard), the element must not resurface as a generic entry.
      handledElements.push(element);
      if (!isVisible(element)) {
        continue;
      }
      const context = extractor.extract(element, resolved);
      if (context) {
        contexts.push(pruneEmpty(context));
        capturedElements.push(element);
      }
    }
  }

  // Any other visible Clarity element gets a generic entry, unless it is part of a
  // component that was already described above.
  for (const element of Array.from(root.querySelectorAll<HTMLElement>('*'))) {
    if (contexts.length >= resolved.maxComponents) {
      return contexts;
    }
    const tagName = element.tagName.toLowerCase();
    if (!tagName.startsWith('clr-') || GENERIC_DENY_LIST.includes(tagName)) {
      continue;
    }
    if (handledElements.includes(element) || capturedElements.some(captured => captured.contains(element))) {
      continue;
    }
    if (element.parentElement?.closest(tagName)) {
      // Only report the outermost element of nested same-type structures.
      continue;
    }
    if (!isVisible(element)) {
      continue;
    }
    contexts.push(
      pruneEmpty({
        type: tagName.replace(/^clr-/, ''),
        label:
          element.getAttribute('aria-label') ||
          textOf(element.querySelector('h1, h2, h3, h4, h5, h6, label, .nav-text, .dropdown-toggle'), resolved),
      })
    );
    if (!GENERIC_TRANSPARENT_LIST.includes(tagName)) {
      capturedElements.push(element);
    }
  }

  return contexts;
}

/**
 * Collects the currently visible page-level buttons and links. Actions inside modal and
 * wizard footers are skipped because those components already report their own actions.
 */
export function collectClrDomActions(root: ParentNode, options?: ClrContextSnapshotOptions): ClrContextAction[] {
  const resolved: Required<ClrContextSnapshotOptions> = { ...CLR_CONTEXT_DEFAULT_OPTIONS, ...options };
  return Array.from(root.querySelectorAll<HTMLElement>('button.btn, a.btn'))
    .filter(element => isVisible(element) && !element.closest('.modal-footer, .clr-wizard-footer, clr-vertical-nav'))
    .slice(0, resolved.maxItemsPerCollection)
    .map(element => buttonOrLinkAction(element, resolved));
}

function buttonOrLinkAction(element: HTMLElement, options: Required<ClrContextSnapshotOptions>): ClrContextAction {
  if (element.tagName.toLowerCase() === 'a') {
    return linkAction(element as HTMLAnchorElement, options);
  }
  const action: ClrContextAction = {
    label: textOf(element, options) || element.getAttribute('aria-label') || '',
    kind: 'button',
  };
  if ((element as HTMLButtonElement).disabled) {
    action.disabled = true;
  }
  return action;
}

function linkAction(link: HTMLAnchorElement, options: Required<ClrContextSnapshotOptions>): ClrContextAction {
  const action: ClrContextAction = {
    label: textOf(link, options) || link.getAttribute('aria-label') || '',
    kind: 'link',
  };
  const href = link.getAttribute('href');
  if (href) {
    action.href = truncate(href, options.maxTextLength);
  }
  return action;
}

function collectActions(root: Element | null, options: Required<ClrContextSnapshotOptions>): ClrContextAction[] {
  if (!root) {
    return [];
  }
  return Array.from(root.querySelectorAll<HTMLElement>('button, a'))
    .filter(element => isVisible(element))
    .slice(0, options.maxItemsPerCollection)
    .map(element => buttonOrLinkAction(element, options));
}

function controlType(control: HTMLElement | null): string {
  if (!control) {
    return 'field';
  }
  const tagName = control.tagName.toLowerCase();
  if (tagName === 'input') {
    return control.getAttribute('type') || 'text';
  }
  return tagName === 'select' || tagName === 'textarea' ? tagName : 'combobox';
}

function isVisible(element: HTMLElement): boolean {
  if (typeof element.checkVisibility === 'function') {
    return element.checkVisibility();
  }
  return element.getClientRects().length > 0;
}

function textOf(element: Element | null | undefined, options: Required<ClrContextSnapshotOptions>): string {
  return truncate(element?.textContent || '', options.maxTextLength);
}

function truncate(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
}

/** Removes empty labels, states, actions and children so snapshots stay minimal. */
function pruneEmpty(context: ClrComponentContext): ClrComponentContext {
  const pruned: ClrComponentContext = { type: context.type };
  if (context.label) {
    pruned.label = context.label;
  }
  if (context.state && Object.keys(context.state).length) {
    pruned.state = context.state;
  }
  if (context.actions?.length) {
    pruned.actions = context.actions.filter(action => action.label || action.href);
    if (!pruned.actions.length) {
      delete pruned.actions;
    }
  }
  if (context.children?.length) {
    pruned.children = context.children.map(child => pruneEmpty(child));
  }
  return pruned;
}
