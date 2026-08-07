import * as i0 from '@angular/core';
import { ChangeDetectionStrategy, Component, EventEmitter, ContentChildren, Input, Output, HostBinding, Injectable, Directive, Optional, NgModule } from '@angular/core';
import { CollapsiblePanel, collapsiblePanelExpandAnimation, CollapsiblePanelGroupModel, CollapsiblePanelService } from '@clr/angular/collapsible-panel';
import { startWith } from 'rxjs/operators';
import * as i2$1 from '@clr/angular/utils';
import { IfExpandService, WillyWonka, OompaLoompa } from '@clr/angular/utils';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2 from '@clr/angular/icon';
import { ClarityIcons, angleIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAccordionDescription {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionDescription, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrAccordionDescription, isStandalone: false, selector: "clr-accordion-description", host: { properties: { "class.clr-accordion-description": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionDescription, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-accordion-description',
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
class ClrAccordionPanel extends CollapsiblePanel {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.panelOpen = false;
        this.panelOpenChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        this.handlePanelInputChanges(changes);
    }
    getPanelStateClasses(panel) {
        return panel.open ? 'clr-accordion-panel-open' : 'clr-accordion-panel-closed';
    }
    getContentId(id) {
        return `clr-accordion-content-${id}`;
    }
    getHeaderId(id) {
        return `clr-accordion-header-${id}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionPanel, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrAccordionPanel, isStandalone: false, selector: "clr-accordion-panel", inputs: { disabled: ["clrAccordionPanelDisabled", "disabled"], panelOpen: ["clrAccordionPanelOpen", "panelOpen"], explicitHeadingLevel: ["clrAccordionPanelHeadingLevel", "explicitHeadingLevel"] }, outputs: { panelOpenChange: "clrAccordionPanelOpenChange" }, host: { properties: { "class.clr-accordion-panel": "true", "class.clr-accordion-panel-disabled": "this.disabled" } }, providers: [IfExpandService], queries: [{ propertyName: "accordionDescription", predicate: ClrAccordionDescription }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (panel | async; as panel) {\n<div [ngClass]=\"getPanelStateClasses(panel)\">\n  <div\n    class=\"clr-accordion-header\"\n    [attr.role]=\"explicitHeadingLevel ? 'heading' : null\"\n    [attr.aria-level]=\"explicitHeadingLevel ? explicitHeadingLevel : null\"\n  >\n    <button\n      type=\"button\"\n      class=\"clr-accordion-header-button\"\n      (click)=\"togglePanel()\"\n      [id]=\"getHeaderId(panel.templateId)\"\n      [disabled]=\"panel.disabled\"\n      [attr.aria-controls]=\"!panel.disabled && panel.open ? getContentId(panel.templateId) : null\"\n      [attr.aria-expanded]=\"panel.open\"\n      [class.clr-accordion-header-has-description]=\"(accordionDescription.changes | async)?.length || accordionDescription.length\"\n      #headerButton\n    >\n      <span class=\"clr-accordion-status\">\n        <cds-icon shape=\"angle\" direction=\"right\" class=\"clr-accordion-angle\"></cds-icon>\n      </span>\n      <ng-content select=\"clr-accordion-title\"></ng-content>\n      <ng-content select=\"clr-accordion-description\"></ng-content>\n    </button>\n  </div>\n  <div\n    @skipInitialRender\n    role=\"region\"\n    class=\"clr-accordion-content-region\"\n    [id]=\"getContentId(panel.templateId)\"\n    [attr.aria-hidden]=\"!panel.open\"\n    [attr.aria-labelledby]=\"getHeaderId(panel.templateId)\"\n  >\n    @if (panel.open) {\n    <div @toggle (@toggle.done)=\"collapsePanelOnAnimationDone(panel)\" class=\"clr-accordion-content\">\n      <div class=\"clr-accordion-inner-content\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n    }\n  </div>\n</div>\n}\n", dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i2.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "pipe", type: i1.AsyncPipe, name: "async" }], animations: collapsiblePanelExpandAnimation, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionPanel, decorators: [{
            type: Component,
            args: [{ selector: 'clr-accordion-panel', host: { '[class.clr-accordion-panel]': 'true' }, changeDetection: ChangeDetectionStrategy.OnPush, animations: collapsiblePanelExpandAnimation, providers: [IfExpandService], standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (panel | async; as panel) {\n<div [ngClass]=\"getPanelStateClasses(panel)\">\n  <div\n    class=\"clr-accordion-header\"\n    [attr.role]=\"explicitHeadingLevel ? 'heading' : null\"\n    [attr.aria-level]=\"explicitHeadingLevel ? explicitHeadingLevel : null\"\n  >\n    <button\n      type=\"button\"\n      class=\"clr-accordion-header-button\"\n      (click)=\"togglePanel()\"\n      [id]=\"getHeaderId(panel.templateId)\"\n      [disabled]=\"panel.disabled\"\n      [attr.aria-controls]=\"!panel.disabled && panel.open ? getContentId(panel.templateId) : null\"\n      [attr.aria-expanded]=\"panel.open\"\n      [class.clr-accordion-header-has-description]=\"(accordionDescription.changes | async)?.length || accordionDescription.length\"\n      #headerButton\n    >\n      <span class=\"clr-accordion-status\">\n        <cds-icon shape=\"angle\" direction=\"right\" class=\"clr-accordion-angle\"></cds-icon>\n      </span>\n      <ng-content select=\"clr-accordion-title\"></ng-content>\n      <ng-content select=\"clr-accordion-description\"></ng-content>\n    </button>\n  </div>\n  <div\n    @skipInitialRender\n    role=\"region\"\n    class=\"clr-accordion-content-region\"\n    [id]=\"getContentId(panel.templateId)\"\n    [attr.aria-hidden]=\"!panel.open\"\n    [attr.aria-labelledby]=\"getHeaderId(panel.templateId)\"\n  >\n    @if (panel.open) {\n    <div @toggle (@toggle.done)=\"collapsePanelOnAnimationDone(panel)\" class=\"clr-accordion-content\">\n      <div class=\"clr-accordion-inner-content\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n    }\n  </div>\n</div>\n}\n" }]
        }], propDecorators: { disabled: [{
                type: Input,
                args: ['clrAccordionPanelDisabled']
            }, {
                type: HostBinding,
                args: ['class.clr-accordion-panel-disabled']
            }], panelOpen: [{
                type: Input,
                args: ['clrAccordionPanelOpen']
            }], panelOpenChange: [{
                type: Output,
                args: ['clrAccordionPanelOpenChange']
            }], explicitHeadingLevel: [{
                type: Input,
                args: ['clrAccordionPanelHeadingLevel']
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
/**
 * Controls how many panels can be open simultaneously within an accordion.
 */
var AccordionStrategy;
(function (AccordionStrategy) {
    /** Only one panel can be open at a time. Opening a panel closes any previously open panel. */
    AccordionStrategy["Single"] = "single";
    /** Multiple panels can be open simultaneously. */
    AccordionStrategy["Multi"] = "multi";
})(AccordionStrategy || (AccordionStrategy = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class AccordionModel extends CollapsiblePanelGroupModel {
    constructor() {
        super(...arguments);
        this.strategy = AccordionStrategy.Single;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    togglePanel(panelId, open) {
        if (!this._panels[panelId]) {
            return;
        }
        const panelIsOpen = this._panels[panelId].open;
        const newOpenState = open !== undefined ? open : !panelIsOpen;
        if (newOpenState && this.strategy === AccordionStrategy.Single) {
            this.closeAllPanels();
        }
        this._panels[panelId].open = newOpenState;
    }
    closeAllPanels() {
        this.panels.forEach(panel => (this._panels[panel.id].open = false));
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class AccordionService extends CollapsiblePanelService {
    constructor() {
        super(...arguments);
        this.panelGroup = new AccordionModel();
    }
    setStrategy(strategy) {
        this.panelGroup.setStrategy(strategy);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AccordionService, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
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
        if (changes.multiPanel &&
            !changes.multiPanel.firstChange &&
            changes.multiPanel.currentValue !== changes.multiPanel.previousValue) {
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
        const strategy = this.multiPanel ? AccordionStrategy.Multi : AccordionStrategy.Single;
        this.accordionService.setStrategy(strategy);
    }
    listenForDOMChanges() {
        return this.panels.changes
            .pipe(startWith(this.panels))
            .subscribe((panels) => this.accordionService.updatePanelOrder(panels.toArray().map(p => p.id)));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordion, deps: [{ token: AccordionService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrAccordion, isStandalone: false, selector: "clr-accordion", inputs: { multiPanel: ["clrAccordionMultiPanel", "multiPanel"] }, host: { properties: { "class.clr-accordion": "true" } }, providers: [AccordionService, { provide: CollapsiblePanelService, useExisting: AccordionService }], queries: [{ propertyName: "panels", predicate: ClrAccordionPanel }], usesOnChanges: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordion, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-accordion',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-accordion]': 'true' },
                    providers: [AccordionService, { provide: CollapsiblePanelService, useExisting: AccordionService }],
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrAccordionTitle, isStandalone: false, selector: "clr-accordion-title", host: { properties: { "class.clr-accordion-title": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionTitle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-accordion-title',
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrAccordionContent, isStandalone: false, selector: "clr-accordion-content", ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAccordionContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-accordion-content',
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AccordionOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: AccordionWillyWonka, optional: true }, { token: i2$1.IfExpandService }], target: i0.ɵɵFactoryTarget.Directive }); }
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
                }] }, { type: i2$1.IfExpandService }] });

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
        ClarityIcons.addIcons(angleIcon);
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

export { AccordionModel, AccordionOompaLoompa, AccordionService, AccordionStrategy, AccordionWillyWonka, ClrAccordion, ClrAccordionContent, ClrAccordionDescription, ClrAccordionModule, ClrAccordionPanel, ClrAccordionTitle };
//# sourceMappingURL=clr-angular-accordion.mjs.map
