import * as i0 from '@angular/core';
import { Injectable, EventEmitter, inject, DestroyRef, afterNextRender, Directive } from '@angular/core';
import * as i2 from '@clr/angular/utils';
import { uniqueIdFactory, noopAnimations, expandHeight, animateHeight, measureHeight, defaultAnimationTiming } from '@clr/angular/utils';
import { map, filter, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let panelGroupCount = 0;
class CollapsiblePanelModel {
    constructor(id, groupId) {
        this.id = id;
        this.groupId = groupId;
        this.index = null;
        this.disabled = false;
        this.open = false;
        this.templateId = `${this.id}-${this.groupId}`;
    }
}
class CollapsiblePanelGroupModel {
    constructor() {
        this.panelGroupCount = panelGroupCount++;
        this._panels = {};
    }
    get panels() {
        return Object.keys(this._panels).map(id => this._panels[id]);
    }
    updatePanelOrder(ids) {
        ids.forEach((id, index) => {
            if (this._panels[id]) {
                this._panels[id].index = index;
            }
        });
        this.removeOldPanels(ids);
    }
    addPanel(id, open = false) {
        this._panels[id] = new CollapsiblePanelModel(id, this.panelGroupCount);
        this._panels[id].open = open;
    }
    togglePanel(panelId, open) {
        if (!this._panels[panelId]) {
            return;
        }
        const panelIsOpen = this._panels[panelId].open;
        this._panels[panelId].open = open !== undefined ? open : !panelIsOpen;
    }
    disablePanel(panelId, disabled) {
        if (!this._panels[panelId]) {
            return;
        }
        this._panels[panelId].disabled = disabled;
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
class CollapsiblePanelService {
    constructor() {
        this.panelGroup = new CollapsiblePanelGroupModel();
        this._panelsChanges = new BehaviorSubject(this.panelGroup.panels);
    }
    getPanelChanges(panelId) {
        return this._panelsChanges.pipe(map(panels => panels.find(s => s.id === panelId)));
    }
    addPanel(panelId, open = false) {
        this.panelGroup.addPanel(panelId, open);
        this.emitUpdatedPanels();
    }
    togglePanel(panelId, open) {
        this.panelGroup.togglePanel(panelId, open);
        this.emitUpdatedPanels();
    }
    disablePanel(panelId, disabled) {
        this.panelGroup.disablePanel(panelId, disabled);
        this.emitUpdatedPanels();
    }
    updatePanelOrder(ids) {
        this.panelGroup.updatePanelOrder(ids);
        this.emitUpdatedPanels();
    }
    emitUpdatedPanels() {
        this._panelsChanges.next(this.panelGroup.panels);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CollapsiblePanelService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CollapsiblePanelService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CollapsiblePanelService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class CollapsiblePanel {
    constructor(panelService, ifExpandService, cdr) {
        this.panelService = panelService;
        this.ifExpandService = ifExpandService;
        this.cdr = cdr;
        this.panelOpen = false;
        this.panelOpenChange = new EventEmitter();
        /**
         * Set to `true` to collapse the content of a closing panel: the template keeps the content while `contentCollapsing`
         * is set, and the projected content is removed once the content is collapsed.
         */
        this.animatesCollapse = false;
        /** Set while the content of a closing panel collapses. */
        this.contentCollapsing = false;
        this._id = uniqueIdFactory();
        this.panelRendered = false;
        this.noopPanelAnimations = noopAnimations();
        this.panelDestroyRef = inject(DestroyRef);
        // The content of a panel open on the first render shows without animation.
        afterNextRender(() => (this.panelRendered = true));
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    ngOnInit() {
        this.panelService.addPanel(this.id, this.panelOpen);
        this.panelService.disablePanel(this.id, this.disabled);
        this.panel = this.panelService.getPanelChanges(this.id).pipe(filter(panel => !!panel), tap(panel => this.emitPanelChange(panel)));
    }
    togglePanel() {
        this.panelService.togglePanel(this.id);
    }
    collapsePanelOnAnimationDone(panel) {
        if (!panel.open) {
            this.ifExpandService.expanded = false;
        }
    }
    /** `animate.enter` handler of the content. */
    expandContent(event) {
        if (this.noopPanelAnimations) {
            return;
        }
        this.collapsibleContent = event.target;
        if (this.panelRendered) {
            expandHeight(event);
        }
    }
    handlePanelInputChanges(changes) {
        if (this.panel && changes.panelOpen && changes.panelOpen.currentValue !== changes.panelOpen.previousValue) {
            this.panelService.togglePanel(this.id, changes.panelOpen.currentValue);
        }
        if (this.panel && changes.disabled && changes.disabled.currentValue !== changes.disabled.previousValue) {
            this.panelService.disablePanel(this.id, changes.disabled.currentValue);
        }
    }
    emitPanelChange(panel) {
        if (panel.index !== this._panelIndex) {
            this._panelIndex = panel.index;
            this.cdr.detectChanges();
        }
        if (panel.open !== this.panelOpen) {
            this.panelOpenChange.emit(panel.open);
            this.panelOpen = panel.open;
        }
        if (panel.open) {
            this.ifExpandService.expanded = true;
            if (this.contentCollapsing) {
                this.contentCollapsing = false;
                animateHeight(this.collapsibleContent, { from: measureHeight(this.collapsibleContent) });
            }
        }
        else if (this.animatesCollapse && this.collapsibleContent) {
            if (!this.contentCollapsing) {
                this.collapseContent();
            }
        }
        else {
            this.removeClosedContent();
        }
    }
    /**
     * Not an `animate.leave` handler: Angular cancels the leave animation of an element when the same element of another
     * instance of the template enters, as the content of the next step does when a step closes.
     */
    collapseContent() {
        const animation = animateHeight(this.collapsibleContent, { from: measureHeight(this.collapsibleContent), to: 0 });
        if (!animation) {
            this.removeClosedContent();
            return;
        }
        this.contentCollapsing = true;
        animation.finished.then(() => {
            if (this.panelDestroyRef.destroyed) {
                return;
            }
            this.contentCollapsing = false;
            this.removeClosedContent();
            this.cdr.markForCheck();
        }, () => {
            // Canceled: the panel opened again.
        });
    }
    removeClosedContent() {
        if (!this.panelOpen) {
            this.collapsibleContent = null;
            this.ifExpandService.expanded = false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CollapsiblePanel, deps: [{ token: CollapsiblePanelService }, { token: i2.IfExpandService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: CollapsiblePanel, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CollapsiblePanel, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: CollapsiblePanelService }, { type: i2.IfExpandService }, { type: i0.ChangeDetectorRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// The objects below are the ones `trigger()`, `transition()`, `style()` and `animate()` of `@angular/animations`
// return (see `ClrAnimationStyles`), written out so that Clarity does not need that package.
/**
 * @deprecated Clarity panels no longer use Angular animations: bind `expandContent` of `CollapsiblePanel` to the
 * `animate.enter` of the panel content instead.
 */
const skipInitialRenderTrigger = {
    type: 7,
    name: 'skipInitialRender',
    definitions: [{ type: 1, expr: ':enter', animation: [], options: null }],
    options: {},
};
/** @deprecated see {@link skipInitialRenderTrigger} */
const panelExpandTransition = {
    type: 1,
    expr: 'void => *',
    animation: [
        { type: 6, styles: { display: 'block', height: 0 }, offset: null },
        { type: 4, timings: defaultAnimationTiming, styles: { type: 6, styles: { height: '*' }, offset: null } },
    ],
    options: null,
};
/** @deprecated see {@link skipInitialRenderTrigger} */
const panelCollapseTransition = {
    type: 1,
    expr: '* => void',
    animation: [
        { type: 6, styles: { display: 'block' }, offset: null },
        {
            type: 4,
            timings: defaultAnimationTiming,
            styles: { type: 6, styles: { height: 0, display: 'none' }, offset: null },
        },
    ],
    options: null,
};
/** @deprecated see {@link skipInitialRenderTrigger} */
const collapsiblePanelExpandAnimation = [
    skipInitialRenderTrigger,
    { type: 7, name: 'toggle', definitions: [panelExpandTransition], options: {} },
];
/** @deprecated see {@link skipInitialRenderTrigger} */
const collapsiblePanelAnimation = [
    skipInitialRenderTrigger,
    { type: 7, name: 'toggle', definitions: [panelExpandTransition, panelCollapseTransition], options: {} },
];

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CollapsiblePanel, CollapsiblePanelGroupModel, CollapsiblePanelModel, CollapsiblePanelService, collapsiblePanelAnimation, collapsiblePanelExpandAnimation, panelCollapseTransition, panelExpandTransition, skipInitialRenderTrigger };
//# sourceMappingURL=clr-angular-collapsible-panel.mjs.map
