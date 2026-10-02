/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * A step that starts an animation:
 * - a string: clicks the first visible element matching this Playwright selector (CSS, or `text=...`),
 * - an object: updates the args of the story, like the Storybook controls do.
 */
export type AnimationStep = string | Record<string, unknown>;

export interface AnimationScenario {
  /** Storybook story id, as in the Storybook URL. */
  story: string;
  /**
   * The steps by name (the name of their snapshots directory), run in order: each step is tested from the state the
   * previous one ended in.
   */
  steps: Record<string, AnimationStep>;
}

// `ClrLoadingState` values
const LOADING = 1;
const SUCCESS = 2;

/** The components whose animations moved from `@angular/animations` to CSS animations, by name. */
export const animationScenarios: Record<string, AnimationScenario> = {
  modal: {
    story: 'modal-modal--modal',
    steps: { open: 'text=Open Modal', close: '.modal .close' },
  },
  'side-panel': {
    story: 'modal-side-panel--side-panel',
    steps: { open: 'text=Open Side Panel', close: '.modal .close' },
  },
  // The story renders the side panel open.
  'side-panel-bottom': {
    story: 'modal-side-panel--side-panel-bottom-medium',
    steps: { close: '.modal .close', open: 'text=Open Side Panel' },
  },
  accordion: {
    story: 'accordion-accordion--default',
    steps: { expand: '.clr-accordion-header-button', collapse: '.clr-accordion-header-button' },
  },
  // A nested stepper: each step opens the next step of the inner stepper, then of the outer stepper.
  stepper: {
    story: 'stepper-stepper--nested-stepper',
    steps: { 'inner-step-2': 'text=next', 'outer-step-2': 'text=next', 'outer-step-3': 'text=next' },
  },
  tree: {
    story: 'tree-tree--tree-view',
    steps: { expand: '.clr-treenode-caret', collapse: '.clr-treenode-caret' },
  },
  // Collapses the whole vertical nav to the left, then expands it.
  'vertical-nav': {
    story: 'vertical-nav-vertical-nav--collapsible-with-icons',
    steps: { collapse: '.nav-trigger', expand: '.nav-trigger' },
  },
  'vertical-nav-group': {
    story: 'vertical-nav-vertical-nav-group--nav-group-collapsed-with-icons',
    steps: { expand: '.nav-group-trigger', collapse: '.nav-group-trigger' },
  },
  'stack-block': {
    story: 'stack-view-stack-block--stack-view-collapsed',
    steps: { expand: '.stack-block-label', collapse: '.stack-block-label' },
  },
  'datagrid-row': {
    story: 'datagrid-expandable-rows--expandable-rows',
    steps: { expand: '.datagrid-expandable-caret-button', collapse: '.datagrid-expandable-caret-button' },
  },
  'loading-button': {
    story: 'button-button-loading-states--button-loading-states',
    steps: { loading: { validateState: LOADING }, success: { validateState: SUCCESS } },
  },
  // The first setting of the dropdown shows / hides the last card.
  card: {
    story: 'addons-card-container--default',
    steps: {
      'open-settings': '.settings-btn',
      'hide-card': '.container-settings input[type=checkbox]',
      'show-card': '.container-settings input[type=checkbox]',
    },
  },
};
