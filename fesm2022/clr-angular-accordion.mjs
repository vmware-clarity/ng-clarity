import * as i0 from '@angular/core';
import { ChangeDetectionStrategy, Component, Injectable, EventEmitter, ContentChildren, Output, Input, HostBinding, Optional, SkipSelf, Directive, NgModule } from '@angular/core';
import { map, tap, startWith } from 'rxjs/operators';
import * as i1 from '@clr/angular/utils';
import { defaultAnimationTiming, uniqueIdFactory, IfExpandService, WillyWonka, OompaLoompa } from '@clr/angular/utils';
import { trigger, transition, style, animate } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i4 from '@clr/angular/icon';
import { ClarityIcons, angleIcon, exclamationCircleIcon, checkCircleIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAccordionDescription {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionDescription, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrAccordionDescription, isStandalone: false, selector: "clr-accordion-description, clr-step-description", host: { properties: { "class.clr-accordion-description": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionDescription, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-accordion-description, clr-step-description',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-accordion-description]': 'true' },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const panelAnimation = [
    trigger('skipInitialRender', [transition(':enter', [])]),
    trigger('toggle', [
        transition('void => *', [
            style({ display: 'block', height: 0 }),
            animate(defaultAnimationTiming, style({ height: '*' })),
        ]),
    ]),
];
const stepAnimation = [
    trigger('skipInitialRender', [transition(':enter', [])]),
    trigger('toggle', [
        transition('void => *', [
            style({ display: 'block', height: 0 }),
            animate(defaultAnimationTiming, style({ height: '*' })),
        ]),
        transition('* => void', [
            style({ display: 'block' }),
            animate(defaultAnimationTiming, style({ height: 0, display: 'none' })),
        ]),
    ]),
];

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var AccordionStatus;
(function (AccordionStatus) {
    AccordionStatus["Inactive"] = "inactive";
    AccordionStatus["Error"] = "error";
    AccordionStatus["Complete"] = "complete";
})(AccordionStatus || (AccordionStatus = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var AccordionStrategy;
(function (AccordionStrategy) {
    AccordionStrategy["Default"] = "default";
    AccordionStrategy["Multi"] = "multi";
})(AccordionStrategy || (AccordionStrategy = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let accordionCount = 0;
class AccordionPanelModel {
    constructor(id, accordionId) {
        this.id = id;
        this.accordionId = accordionId;
        this.status = AccordionStatus.Inactive;
        this.index = null;
        this.disabled = false;
        this.open = false;
        this.templateId = `${this.id}-${this.accordionId}`;
    }
}
class AccordionModel {
    constructor() {
        this.strategy = AccordionStrategy.Default;
        this.accordionCount = accordionCount++;
        this._panels = {};
    }
    get panels() {
        return Object.keys(this._panels).map(id => this._panels[id]);
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    updatePanelOrder(ids) {
        ids.forEach((id, index) => (this._panels[id].index = index));
        this.removeOldPanels(ids);
    }
    addPanel(id, open = false) {
        this._panels[id] = new AccordionPanelModel(id, this.accordionCount);
        this._panels[id].open = open;
    }
    togglePanel(panelId, open) {
        const panelIsOpen = this._panels[panelId].open;
        const newOpenState = open !== undefined ? open : !panelIsOpen;
        if (newOpenState && this.strategy === AccordionStrategy.Default) {
            this.closeAllPanels();
        }
        this._panels[panelId].open = newOpenState;
    }
    disablePanel(panelId, disabled) {
        this._panels[panelId].disabled = disabled;
    }
    closeAllPanels() {
        this.panels.forEach(panel => (this._panels[panel.id].open = false));
    }
    removeOldPanels(ids) {
        this.panels
            .filter(panel => ids.find(id => id === panel.id) === undefined)
            .forEach(panel => delete this._panels[panel.id]);
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class AccordionService {
    constructor() {
        this.accordion = new AccordionModel();
        this._panelsChanges = new BehaviorSubject(this.accordion.panels);
    }
    getPanelChanges(panelId) {
        return this._panelsChanges.pipe(map(panels => panels.find(s => s.id === panelId)));
    }
    setStrategy(strategy) {
        this.accordion.setStrategy(strategy);
    }
    addPanel(panelId, open = false) {
        this.accordion.addPanel(panelId, open);
        this.emitUpdatedPanels();
    }
    togglePanel(panelId, open) {
        this.accordion.togglePanel(panelId, open);
        this.emitUpdatedPanels();
    }
    disablePanel(panelId, disabled) {
        this.accordion.disablePanel(panelId, disabled);
        this.emitUpdatedPanels();
    }
    updatePanelOrder(ids) {
        this.accordion.updatePanelOrder(ids);
        this.emitUpdatedPanels();
    }
    emitUpdatedPanels() {
        this._panelsChanges.next(this.accordion.panels);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AccordionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AccordionService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AccordionService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAccordionPanel {
    constructor(parent, commonStrings, accordionService, ifExpandService, cdr) {
        this.parent = parent;
        this.commonStrings = commonStrings;
        this.accordionService = accordionService;
        this.ifExpandService = ifExpandService;
        this.cdr = cdr;
        this.disabled = false;
        this.panelOpen = false;
        this.panelOpenChange = new EventEmitter();
        this._id = uniqueIdFactory();
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get panelNumber() {
        return this._panelIndex + 1;
    }
    ngOnInit() {
        this.panel = this.accordionService.getPanelChanges(this.id).pipe(tap(panel => this.emitPanelChange(panel)));
        this.accordionService.addPanel(this.id, this.panelOpen);
        this.accordionService.togglePanel(this.id, this.panelOpen);
        this.accordionService.disablePanel(this.id, this.disabled);
    }
    ngOnChanges(changes) {
        if (this.panel && changes.panelOpen && changes.panelOpen.currentValue !== changes.panelOpen.previousValue) {
            this.accordionService.togglePanel(this.id, changes.panelOpen.currentValue);
        }
        if (this.panel && changes.disabled && changes.disabled.currentValue !== changes.disabled.previousValue) {
            this.accordionService.disablePanel(this.id, changes.disabled.currentValue);
        }
    }
    togglePanel() {
        this.accordionService.togglePanel(this.id);
    }
    collapsePanelOnAnimationDone(panel) {
        if (!panel.open) {
            this.ifExpandService.expanded = false;
        }
    }
    getPanelStateClasses(panel) {
        return `clr-accordion-panel-${panel.status} ${panel.open ? 'clr-accordion-panel-open' : ''}`;
    }
    getAccordionContentId(id) {
        return `clr-accordion-content-${id}'`;
    }
    getAccordionHeaderId(id) {
        return `clr-accordion-header-${id}`;
    }
    stepCompleteText(panelNumber) {
        return this.commonStrings.parse(this.commonStrings.keys.stepComplete, { STEP: panelNumber.toString() });
    }
    stepErrorText(panelNumber) {
        return this.commonStrings.parse(this.commonStrings.keys.stepError, { STEP: panelNumber.toString() });
    }
    emitPanelChange(panel) {
        if (panel.index !== this._panelIndex) {
            this._panelIndex = panel.index;
            // The whole chain of updates leading to this line starts in a ngAfterViewInit subscription in accordion.ts,
            // listening for DOM changes. It seems to only fails in tests, but as this is not a frequently called code,
            // I prefer to stay on the safe side and initiate a detection cycle here.
            this.cdr.detectChanges();
        }
        if (panel.open !== this.panelOpen) {
            this.panelOpenChange.emit(panel.open);
            /**
             * @Note: this line below is needed because we don't want to use another value to track
             * for changes of the panel. Because we use BehaviorSubject this emit event is trigger on
             * init (that is not needed - there is no change of the original value) - in some cases this
             * lead to duplicate events.
             *
             * To prevent this we try to emit only when the value is changed and keep the value in sync
             * even that is used only into the Initial Lifecycle (ngOnInit).
             */
            this.panelOpen = panel.open;
        }
        if (panel.open) {
            this.ifExpandService.expanded = true;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionPanel, deps: [{ token: ClrAccordionPanel, optional: true, skipSelf: true }, { token: i1.ClrCommonStringsService }, { token: AccordionService }, { token: i1.IfExpandService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrAccordionPanel, isStandalone: false, selector: "clr-accordion-panel", inputs: { disabled: ["clrAccordionPanelDisabled", "disabled"], panelOpen: ["clrAccordionPanelOpen", "panelOpen"], explicitHeadingLevel: ["clrAccordionPanelHeadingLevel", "explicitHeadingLevel"] }, outputs: { panelOpenChange: "clrAccordionPanelOpenChange" }, host: { properties: { "class.clr-accordion-panel": "true", "class.clr-accordion-panel-disabled": "this.disabled" } }, providers: [IfExpandService], queries: [{ propertyName: "accordionDescription", predicate: ClrAccordionDescription }], usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (panel | async; as panel) {\n<div [ngClass]=\"getPanelStateClasses(panel)\">\n  <div\n    class=\"clr-accordion-header\"\n    [attr.role]=\"explicitHeadingLevel ? 'heading' : null\"\n    [attr.aria-level]=\"explicitHeadingLevel ? explicitHeadingLevel : null\"\n  >\n    <button\n      type=\"button\"\n      class=\"clr-accordion-header-button\"\n      (click)=\"togglePanel()\"\n      [id]=\"getAccordionHeaderId(panel.templateId)\"\n      [disabled]=\"panel.disabled\"\n      [attr.aria-controls]=\"!panel.disabled && panel.open ? getAccordionContentId(panel.templateId) : null\"\n      [attr.aria-expanded]=\"panel.open\"\n      [class.clr-accordion-header-has-description]=\"(accordionDescription.changes | async)?.length || accordionDescription.length\"\n      #headerButton\n    >\n      <span class=\"clr-accordion-status\">\n        <cds-icon shape=\"angle\" direction=\"right\" class=\"clr-accordion-angle\"></cds-icon>\n      </span>\n      <ng-content select=\"clr-accordion-title, clr-step-title\"></ng-content>\n      <ng-content select=\"clr-accordion-description, clr-step-description\"></ng-content>\n    </button>\n  </div>\n  <div\n    @skipInitialRender\n    role=\"region\"\n    class=\"clr-accordion-content-region\"\n    [id]=\"getAccordionContentId(panel.templateId)\"\n    [attr.aria-hidden]=\"!panel.open\"\n    [attr.aria-labelledby]=\"getAccordionHeaderId(panel.templateId)\"\n  >\n    @if (panel.open) {\n    <div @toggle (@toggle.done)=\"collapsePanelOnAnimationDone(panel)\" class=\"clr-accordion-content\">\n      <div class=\"clr-accordion-inner-content\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n    }\n  </div>\n</div>\n}\n", dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i4.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }], animations: panelAnimation, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionPanel, decorators: [{
            type: Component,
            args: [{ selector: 'clr-accordion-panel', host: { '[class.clr-accordion-panel]': 'true' }, changeDetection: ChangeDetectionStrategy.OnPush, animations: panelAnimation, providers: [IfExpandService], standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (panel | async; as panel) {\n<div [ngClass]=\"getPanelStateClasses(panel)\">\n  <div\n    class=\"clr-accordion-header\"\n    [attr.role]=\"explicitHeadingLevel ? 'heading' : null\"\n    [attr.aria-level]=\"explicitHeadingLevel ? explicitHeadingLevel : null\"\n  >\n    <button\n      type=\"button\"\n      class=\"clr-accordion-header-button\"\n      (click)=\"togglePanel()\"\n      [id]=\"getAccordionHeaderId(panel.templateId)\"\n      [disabled]=\"panel.disabled\"\n      [attr.aria-controls]=\"!panel.disabled && panel.open ? getAccordionContentId(panel.templateId) : null\"\n      [attr.aria-expanded]=\"panel.open\"\n      [class.clr-accordion-header-has-description]=\"(accordionDescription.changes | async)?.length || accordionDescription.length\"\n      #headerButton\n    >\n      <span class=\"clr-accordion-status\">\n        <cds-icon shape=\"angle\" direction=\"right\" class=\"clr-accordion-angle\"></cds-icon>\n      </span>\n      <ng-content select=\"clr-accordion-title, clr-step-title\"></ng-content>\n      <ng-content select=\"clr-accordion-description, clr-step-description\"></ng-content>\n    </button>\n  </div>\n  <div\n    @skipInitialRender\n    role=\"region\"\n    class=\"clr-accordion-content-region\"\n    [id]=\"getAccordionContentId(panel.templateId)\"\n    [attr.aria-hidden]=\"!panel.open\"\n    [attr.aria-labelledby]=\"getAccordionHeaderId(panel.templateId)\"\n  >\n    @if (panel.open) {\n    <div @toggle (@toggle.done)=\"collapsePanelOnAnimationDone(panel)\" class=\"clr-accordion-content\">\n      <div class=\"clr-accordion-inner-content\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n    }\n  </div>\n</div>\n}\n" }]
        }], ctorParameters: () => [{ type: ClrAccordionPanel, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1.ClrCommonStringsService }, { type: AccordionService }, { type: i1.IfExpandService }, { type: i0.ChangeDetectorRef }], propDecorators: { disabled: [{
                type: Input,
                args: ['clrAccordionPanelDisabled']
            }, {
                type: HostBinding,
                args: ['class.clr-accordion-panel-disabled']
            }], panelOpen: [{
                type: Input,
                args: ['clrAccordionPanelOpen']
            }], explicitHeadingLevel: [{
                type: Input,
                args: ['clrAccordionPanelHeadingLevel']
            }], panelOpenChange: [{
                type: Output,
                args: ['clrAccordionPanelOpenChange']
            }], accordionDescription: [{
                type: ContentChildren,
                args: [ClrAccordionDescription]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAccordion {
    constructor(accordionService) {
        this.accordionService = accordionService;
        this.multiPanel = false;
        this.subscriptions = [];
    }
    ngOnInit() {
        this.setAccordionStrategy();
    }
    ngOnChanges(changes) {
        if (changes.multiPanel.currentValue !== changes.multiPanel.previousValue) {
            this.setAccordionStrategy();
        }
    }
    ngAfterViewInit() {
        this.subscriptions.push(this.listenForDOMChanges());
    }
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    setAccordionStrategy() {
        const strategy = this.multiPanel ? AccordionStrategy.Multi : AccordionStrategy.Default;
        this.accordionService.setStrategy(strategy);
    }
    listenForDOMChanges() {
        return this.panels.changes
            .pipe(startWith(this.panels))
            .subscribe((panels) => this.accordionService.updatePanelOrder(panels.toArray().map(p => p.id)));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordion, deps: [{ token: AccordionService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrAccordion, isStandalone: false, selector: "clr-accordion", inputs: { multiPanel: ["clrAccordionMultiPanel", "multiPanel"] }, host: { properties: { "class.clr-accordion": "true" } }, providers: [AccordionService], queries: [{ propertyName: "panels", predicate: ClrAccordionPanel }], usesOnChanges: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordion, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-accordion',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-accordion]': 'true' },
                    providers: [AccordionService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: AccordionService }], propDecorators: { multiPanel: [{
                type: Input,
                args: ['clrAccordionMultiPanel']
            }], panels: [{
                type: ContentChildren,
                args: [ClrAccordionPanel]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAccordionTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionTitle, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrAccordionTitle, isStandalone: false, selector: "clr-accordion-title, clr-step-title", host: { properties: { "class.clr-accordion-title": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionTitle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-accordion-title, clr-step-title',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-accordion-title]': 'true' },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAccordionContent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionContent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrAccordionContent, isStandalone: false, selector: "clr-accordion-content, clr-step-content", ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-accordion-content, clr-step-content',
                    template: `<ng-content></ng-content>`,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class AccordionWillyWonka extends WillyWonka {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AccordionWillyWonka, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: AccordionWillyWonka, isStandalone: false, selector: "clr-accordion", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AccordionWillyWonka, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-accordion',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class AccordionOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, ifExpandService) {
        if (!willyWonka) {
            throw new Error('clr-accordion-panel should only be used inside of clr-accordion');
        }
        super(cdr, willyWonka);
        this.expand = ifExpandService;
    }
    get flavor() {
        return this.expand.expanded;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AccordionOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: AccordionWillyWonka, optional: true }, { token: i1.IfExpandService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: AccordionOompaLoompa, isStandalone: false, selector: "clr-accordion-panel", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AccordionOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-accordion-panel',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: AccordionWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: i1.IfExpandService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const declarations = [
    ClrAccordion,
    ClrAccordionPanel,
    ClrAccordionTitle,
    ClrAccordionDescription,
    ClrAccordionContent,
    AccordionOompaLoompa,
    AccordionWillyWonka,
];
class ClrAccordionModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon, exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionModule, declarations: [ClrAccordion,
            ClrAccordionPanel,
            ClrAccordionTitle,
            ClrAccordionDescription,
            ClrAccordionContent,
            AccordionOompaLoompa,
            AccordionWillyWonka], imports: [CommonModule, ClrIcon], exports: [ClrAccordion,
            ClrAccordionPanel,
            ClrAccordionTitle,
            ClrAccordionDescription,
            ClrAccordionContent,
            AccordionOompaLoompa,
            AccordionWillyWonka] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionModule, imports: [CommonModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon],
                    declarations: [...declarations],
                    exports: [...declarations],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AccordionModel, AccordionPanelModel, AccordionService, AccordionStatus, AccordionStrategy, ClrAccordion, ClrAccordionContent, ClrAccordionDescription, ClrAccordionModule, ClrAccordionPanel, ClrAccordionTitle, panelAnimation, stepAnimation, AccordionOompaLoompa as ÇlrAccordionOompaLoompa, AccordionWillyWonka as ÇlrAccordionWillyWonka };
//# sourceMappingURL=clr-angular-accordion.mjs.map
