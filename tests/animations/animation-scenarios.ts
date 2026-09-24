/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * An element of the story, found with a CSS selector.
 *
 * - `text`: keep the elements whose trimmed text content starts with this text,
 * - `index`: pick the n-th remaining element (the first one by default),
 * - `child`: then descend to the first element matching this selector inside it.
 */
export interface ElementQuery {
  selector: string;
  text?: string;
  index?: number;
  child?: string;
}

/** An element whose geometry, opacity and transform are sampled on every animation frame. */
export interface TrackedElement extends ElementQuery {
  label: string;
}

export type ScenarioStep =
  /** Clicks an element. */
  | { click: ElementQuery }
  /** Types a value in a form field. */
  | { fill: ElementQuery; value: string }
  /** Updates the args of the story, like the Storybook controls do. */
  | { args: Record<string, unknown> }
  /** Waits, in milliseconds. */
  | { wait: number };

export interface AnimationScenario {
  /** Unique name, used for the output directory. */
  name: string;
  /** Storybook story id. */
  story: string;
  /** Steps bringing the story to the state to animate from. They are not recorded. */
  setup?: ScenarioStep[];
  /** Steps triggering the animation. The recording time starts with the first of them. */
  trigger: ScenarioStep[];
  track: TrackedElement[];
  /** How long to record after the trigger, in milliseconds. */
  duration?: number;
}

const openModal: ScenarioStep = { click: { selector: 'button', text: 'Open Modal' } };
const openSidePanel: ScenarioStep = { click: { selector: 'button', text: 'Open Side Panel' } };
const closeModal: ScenarioStep = { click: { selector: '.modal .close' } };
const settle: ScenarioStep = { wait: 1000 };

const modalElements: TrackedElement[] = [
  { label: 'dialog', selector: '.modal-dialog' },
  { label: 'backdrop', selector: '.modal-backdrop' },
];

const accordionHeader: ScenarioStep = { click: { selector: '.clr-accordion-header-button' } };
const accordionElements: TrackedElement[] = [
  { label: 'panel 1 content', selector: 'clr-accordion-panel', child: '.clr-accordion-content' },
  { label: 'panel 2', selector: 'clr-accordion-panel', index: 1 },
];

const stepperElements: TrackedElement[] = [
  { label: 'step 1 content', selector: 'clr-stepper-panel', child: '.clr-stepper-content' },
  { label: 'step 2 content', selector: 'clr-stepper-panel', index: 1, child: '.clr-stepper-content' },
  { label: 'step 3', selector: 'clr-stepper-panel', index: 2 },
];

const treeCaret: ScenarioStep = { click: { selector: 'clr-tree-node', text: 'styles', child: '.clr-treenode-caret' } };
const treeElements: TrackedElement[] = [
  { label: 'children', selector: 'clr-tree-node', text: 'styles', child: '.clr-treenode-children' },
  { label: 'next node', selector: 'clr-tree-node', text: 'index.html' },
];

const navGroupTrigger: ScenarioStep = { click: { selector: '.nav-group-trigger' } };
const navGroupElements: TrackedElement[] = [
  { label: 'children', selector: '.nav-group-children' },
  { label: 'group', selector: 'clr-vertical-nav-group' },
];

const stackBlockLabel: ScenarioStep = { click: { selector: '.stack-block-label' } };
const stackBlockElements: TrackedElement[] = [
  { label: 'children', selector: '.stack-children' },
  { label: 'block', selector: 'clr-stack-block' },
];

const rowCaret: ScenarioStep = { click: { selector: '.datagrid-expandable-caret-button' } };
const rowElements: TrackedElement[] = [
  { label: 'row 1', selector: '.datagrid-row-scrollable' },
  { label: 'row 2', selector: 'clr-dg-row', index: 1 },
];

// `ClrLoadingState` values
const LOADING = 1;
const SUCCESS = 2;
const loadingButtonElements: TrackedElement[] = [
  { label: 'button', selector: 'button.btn-primary:not(.btn-sm)' },
  { label: 'spinner', selector: 'button.btn-primary:not(.btn-sm) .spinner' },
  { label: 'content', selector: 'button.btn-primary:not(.btn-sm) > span > span:not(.spinner)' },
];

const cardSettings: ScenarioStep = { click: { selector: '.settings-btn' } };
const firstCardCheckbox: ScenarioStep = { click: { selector: '.container-settings input[type=checkbox]' } };
// The first setting shows / hides the last card.
const cardElements: TrackedElement[] = [
  { label: 'card 1', selector: 'appfx-card' },
  { label: 'card 3', selector: 'appfx-card', index: 2 },
  { label: 'card 4', selector: 'appfx-card', index: 3 },
  { label: 'card 4 content', selector: 'appfx-card', index: 3, child: '.appfx-card' },
];

/**
 * The components whose animations moved from `@angular/animations` to native CSS animations.
 * Each opening / expanding scenario has its closing / collapsing counterpart.
 */
export const animationScenarios: AnimationScenario[] = [
  { name: 'modal-open', story: 'modal-modal--modal', trigger: [openModal], track: modalElements },
  {
    name: 'modal-close',
    story: 'modal-modal--modal',
    setup: [openModal, settle],
    trigger: [closeModal],
    track: modalElements,
  },
  { name: 'side-panel-open', story: 'modal-side-panel--side-panel', trigger: [openSidePanel], track: modalElements },
  {
    name: 'side-panel-close',
    story: 'modal-side-panel--side-panel',
    setup: [openSidePanel, settle],
    trigger: [closeModal],
    track: modalElements,
  },
  // The bottom side panel story renders the side panel open.
  {
    name: 'side-panel-bottom-open',
    story: 'modal-side-panel--side-panel-bottom-medium',
    setup: [closeModal, settle],
    trigger: [openSidePanel],
    track: modalElements,
  },
  {
    name: 'side-panel-bottom-close',
    story: 'modal-side-panel--side-panel-bottom-medium',
    trigger: [closeModal],
    track: modalElements,
  },
  {
    name: 'accordion-expand',
    story: 'accordion-accordion--default',
    trigger: [accordionHeader],
    track: accordionElements,
  },
  {
    name: 'accordion-collapse',
    story: 'accordion-accordion--default',
    setup: [accordionHeader, settle],
    trigger: [accordionHeader],
    track: accordionElements,
  },
  {
    name: 'stepper-next-step',
    story: 'stepper-stepper--stepper',
    setup: [{ fill: { selector: 'clr-stepper-panel input' }, value: 'Step 1' }],
    trigger: [{ click: { selector: '.clr-step-button' } }],
    track: stepperElements,
  },
  { name: 'tree-node-toggle', story: 'tree-tree--tree-view', trigger: [treeCaret], track: treeElements },
  {
    name: 'tree-node-toggle-back',
    story: 'tree-tree--tree-view',
    setup: [treeCaret, settle],
    trigger: [treeCaret],
    track: treeElements,
  },
  {
    name: 'vertical-nav-group-expand',
    story: 'vertical-nav-vertical-nav-group--nav-group-collapsed-with-icons',
    trigger: [navGroupTrigger],
    track: navGroupElements,
  },
  {
    name: 'vertical-nav-group-collapse',
    story: 'vertical-nav-vertical-nav-group--nav-group-expanded-with-icons',
    trigger: [navGroupTrigger],
    track: navGroupElements,
  },
  {
    name: 'stack-block-expand',
    story: 'stack-view-stack-block--stack-view-collapsed',
    trigger: [stackBlockLabel],
    track: stackBlockElements,
  },
  {
    name: 'stack-block-collapse',
    story: 'stack-view-stack-block--stack-view-expanded',
    trigger: [stackBlockLabel],
    track: stackBlockElements,
  },
  {
    name: 'datagrid-row-expand',
    story: 'datagrid-expandable-rows--expandable-rows',
    trigger: [rowCaret],
    track: rowElements,
  },
  {
    name: 'datagrid-row-collapse',
    story: 'datagrid-expandable-rows--expanded-expandable-rows',
    trigger: [rowCaret],
    track: rowElements,
  },
  {
    name: 'loading-button-loading',
    story: 'button-button-loading-states--button-loading-states',
    trigger: [{ args: { validateState: LOADING } }],
    track: loadingButtonElements,
  },
  {
    name: 'loading-button-success',
    story: 'button-button-loading-states--button-loading-states',
    setup: [{ args: { validateState: LOADING } }, settle],
    trigger: [{ args: { validateState: SUCCESS } }],
    track: loadingButtonElements,
    duration: 1500,
  },
  {
    name: 'card-hide',
    story: 'addons-card-container--default',
    setup: [cardSettings, settle],
    trigger: [firstCardCheckbox],
    track: cardElements,
  },
  {
    name: 'card-show',
    story: 'addons-card-container--default',
    setup: [cardSettings, settle, firstCardCheckbox, settle],
    trigger: [firstCardCheckbox],
    track: cardElements,
  },
];
