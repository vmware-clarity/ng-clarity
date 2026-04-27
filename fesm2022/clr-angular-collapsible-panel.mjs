import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Directive } from '@angular/core';
import * as i2 from '@clr/angular/utils';
import { uniqueIdFactory, defaultAnimationTiming } from '@clr/angular/utils';
import { map, filter, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CollapsiblePanelService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CollapsiblePanelService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CollapsiblePanelService, decorators: [{
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
        this._id = uniqueIdFactory();
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
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CollapsiblePanel, deps: [{ token: CollapsiblePanelService }, { token: i2.IfExpandService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: CollapsiblePanel, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CollapsiblePanel, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: CollapsiblePanelService }, { type: i2.IfExpandService }, { type: i0.ChangeDetectorRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const skipInitialRenderTrigger = trigger('skipInitialRender', [transition(':enter', [])]);
const panelExpandTransition = transition('void => *', [
    style({ display: 'block', height: 0 }),
    animate(defaultAnimationTiming, style({ height: '*' })),
]);
const panelCollapseTransition = transition('* => void', [
    style({ display: 'block' }),
    animate(defaultAnimationTiming, style({ height: 0, display: 'none' })),
]);
const collapsiblePanelExpandAnimation = [skipInitialRenderTrigger, trigger('toggle', [panelExpandTransition])];
const collapsiblePanelAnimation = [
    skipInitialRenderTrigger,
    trigger('toggle', [panelExpandTransition, panelCollapseTransition]),
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
