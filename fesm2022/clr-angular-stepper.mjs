import * as i4 from '@angular/common';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { ChangeDetectionStrategy, Component, Injectable, PLATFORM_ID, HostBinding, ContentChildren, ViewChild, Inject, Optional, Input, Directive, HostListener, NgModule } from '@angular/core';
import { CollapsiblePanelModel, CollapsiblePanelGroupModel, CollapsiblePanelService, CollapsiblePanel, collapsiblePanelAnimation } from '@clr/angular/collapsible-panel';
import * as i1 from '@clr/angular/utils';
import { triggerAllFormControlValidation, IfExpandService, WillyWonka, OompaLoompa } from '@clr/angular/utils';
import { map, distinctUntilChanged, tap, filter, skipUntil, startWith } from 'rxjs/operators';
import * as i2 from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, angleIcon, exclamationCircleIcon, checkCircleIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var StepperPanelStatus;
(function (StepperPanelStatus) {
    StepperPanelStatus["Inactive"] = "inactive";
    StepperPanelStatus["Error"] = "error";
    StepperPanelStatus["Complete"] = "complete";
})(StepperPanelStatus || (StepperPanelStatus = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStepDescription {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepDescription, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrStepDescription, isStandalone: false, selector: "clr-step-description", host: { properties: { "class.clr-stepper-description": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepDescription, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-step-description',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-stepper-description]': 'true' },
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
class StepperPanelModel extends CollapsiblePanelModel {
    constructor() {
        super(...arguments);
        this.status = StepperPanelStatus.Inactive;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class StepperModel extends CollapsiblePanelGroupModel {
    constructor() {
        super(...arguments);
        this._panels = {};
        this.stepperModelInitialize = false;
    }
    get panels() {
        return Object.keys(this._panels).map(id => this._panels[id]);
    }
    get allPanelsCompleted() {
        return this.panels.length && this.getNumberOfIncompletePanels() === 0 && this.getNumberOfOpenPanels() === 0;
    }
    get shouldOpenFirstPanel() {
        return !this.initialPanel || (this._panels && Object.keys(this._panels).length && !this._panels[this.initialPanel]);
    }
    addPanel(id, open = false) {
        const panel = new StepperPanelModel(id, this.panelGroupCount);
        panel.open = open;
        panel.disabled = true;
        this._panels[id] = panel;
    }
    updatePanelOrder(ids) {
        super.updatePanelOrder(ids);
        if (this.stepperModelInitialize === false) {
            this.openFirstPanel();
        }
    }
    togglePanel(panelId) {
        if (this._panels[panelId]?.status === StepperPanelStatus.Complete) {
            this._panels[panelId].open = !this._panels[panelId].open;
        }
    }
    navigateToPreviousPanel(currentPanelId) {
        this.openPreviousPanel(this._panels[currentPanelId].id);
    }
    navigateToNextPanel(currentPanelId, currentPanelValid = true) {
        if (currentPanelValid) {
            this.completePanel(currentPanelId);
            this.openNextPanel(this._panels[currentPanelId].id);
        }
        else {
            this.setPanelError(currentPanelId);
        }
    }
    overrideInitialPanel(panelId) {
        this.initialPanel = panelId;
        this.panels
            .filter(() => this._panels[panelId] !== undefined)
            .forEach(panel => {
            if (panel.index < this._panels[panelId].index) {
                this.completePanel(panel.id);
            }
            else if (panel.id === panelId) {
                this._panels[panel.id].open = true;
            }
            else {
                this._panels[panel.id].open = false;
            }
        });
    }
    setPanelValid(panelId) {
        this._panels[panelId].status = StepperPanelStatus.Complete;
    }
    setPanelInvalid(panelId) {
        this._panels[panelId].status = StepperPanelStatus.Error;
    }
    setPanelsWithErrors(ids) {
        ids.forEach(id => this.setPanelError(id));
    }
    resetPanels() {
        this.stepperModelInitialize = false;
        this.panels.forEach(p => this.resetPanel(p.id));
        this.openFirstPanel();
    }
    getNextPanel(currentPanelId) {
        return this.panels.find(s => s.index === this._panels[currentPanelId].index + 1);
    }
    getPreviousPanel(currentPanelId) {
        return this.panels.find(s => s.index === this._panels[currentPanelId].index - 1);
    }
    resetAllFuturePanels(panelId) {
        this.panels.filter(panel => panel.index >= this._panels[panelId].index).forEach(panel => this.resetPanel(panel.id));
    }
    resetPanel(panelId) {
        this._panels[panelId].status = StepperPanelStatus.Inactive;
        this._panels[panelId].open = false;
        this._panels[panelId].disabled = true;
    }
    openFirstPanel() {
        if (!this.shouldOpenFirstPanel) {
            return;
        }
        const firstPanel = this.getFirstPanel();
        if (!firstPanel) {
            return;
        }
        this._panels[firstPanel.id].open = true;
        this._panels[firstPanel.id].disabled = true;
        this.stepperModelInitialize = true;
    }
    completePanel(panelId) {
        this._panels[panelId].status = StepperPanelStatus.Complete;
        this._panels[panelId].disabled = false;
        this._panels[panelId].open = false;
    }
    openNextPanel(currentPanelId) {
        const nextPanel = this.getNextPanel(currentPanelId);
        if (nextPanel) {
            this.resetAllFuturePanels(nextPanel.id);
            this._panels[nextPanel.id].open = true;
            this._panels[nextPanel.id].disabled = true;
        }
    }
    openPreviousPanel(currentPanelId) {
        const prevPanel = this.getPreviousPanel(currentPanelId);
        if (prevPanel) {
            this._panels[currentPanelId].open = false;
            this._panels[currentPanelId].disabled = false;
            this._panels[prevPanel.id].open = true;
            this._panels[prevPanel.id].disabled = true;
        }
    }
    setPanelError(panelId) {
        this.resetAllFuturePanels(panelId);
        this._panels[panelId].open = true;
        this._panels[panelId].status = StepperPanelStatus.Error;
    }
    getFirstPanel() {
        return this.panels.find(panel => panel.index === 0);
    }
    getNumberOfIncompletePanels() {
        return this.panels.reduce((prev, next) => (next.status !== StepperPanelStatus.Complete ? prev + 1 : prev), 0);
    }
    getNumberOfOpenPanels() {
        return this.panels.reduce((prev, next) => (next.open !== false ? prev + 1 : prev), 0);
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class StepperService extends CollapsiblePanelService {
    constructor() {
        super();
        this.panelsCompleted = this.getAllCompletedPanelChanges();
        this.panelGroup = new StepperModel();
        this._activeStepChanges = new Subject();
        this.activeStep = this._activeStepChanges.asObservable();
    }
    resetPanels() {
        this.panelGroup.resetPanels();
        this.emitUpdatedPanels();
    }
    setPanelValid(panelId) {
        this.panelGroup.setPanelValid(panelId);
        this.emitUpdatedPanels();
    }
    setPanelInvalid(panelId) {
        this.panelGroup.setPanelInvalid(panelId);
        this.emitUpdatedPanels();
    }
    setPanelsWithErrors(ids) {
        this.panelGroup.setPanelsWithErrors(ids);
        this.emitUpdatedPanels();
    }
    navigateToPreviousPanel(currentPanelId) {
        this.panelGroup.navigateToPreviousPanel(currentPanelId);
        this.updatePreviousStep(currentPanelId);
        this.emitUpdatedPanels();
    }
    navigateToNextPanel(currentPanelId, currentPanelValid = true) {
        this.panelGroup.navigateToNextPanel(currentPanelId, currentPanelValid);
        this.updateNextStep(currentPanelId, currentPanelValid);
        this.emitUpdatedPanels();
    }
    overrideInitialPanel(panelId) {
        this.panelGroup.overrideInitialPanel(panelId);
        this.emitUpdatedPanels();
    }
    updateNextStep(currentPanelId, currentPanelValid) {
        const nextPanel = this.panelGroup.getNextPanel(currentPanelId);
        if (currentPanelValid && nextPanel) {
            this._activeStepChanges.next(nextPanel.id);
        }
        else if (currentPanelValid) {
            this._activeStepChanges.next(currentPanelId);
        }
    }
    updatePreviousStep(currentPanelId) {
        const prevPanel = this.panelGroup.getPreviousPanel(currentPanelId);
        if (prevPanel) {
            this._activeStepChanges.next(prevPanel.id);
        }
    }
    getAllCompletedPanelChanges() {
        return this._panelsChanges.pipe(map(() => this.panelGroup.allPanelsCompleted), distinctUntilChanged());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStepperPanel extends CollapsiblePanel {
    constructor(platformId, commonStrings, formGroupName, ngModelGroup, stepperService, ifExpandService, cdr) {
        super(stepperService, ifExpandService, cdr);
        this.platformId = platformId;
        this.commonStrings = commonStrings;
        this.formGroupName = formGroupName;
        this.ngModelGroup = ngModelGroup;
        this.stepperService = stepperService;
        this.disabled = false;
        this.PanelStatus = StepperPanelStatus;
        this.subscriptions = [];
    }
    get id() {
        return this.formGroupName ? this.formGroupName.name.toString() : this.ngModelGroup.name;
    }
    set id(_value) {
        // overriding parent id required empty setter
    }
    get panelNumber() {
        return this._panelIndex + 1;
    }
    get formGroup() {
        return this.formGroupName ? this.formGroupName.control : this.ngModelGroup.control;
    }
    getPanelStatus(panel) {
        return panel.status;
    }
    getPanelStateClasses(panel) {
        return `clr-stepper-panel-${this.getPanelStatus(panel)} ${panel.open ? 'clr-stepper-panel-open' : ''}`;
    }
    getContentId(id) {
        return `clr-stepper-content-${id}`;
    }
    getHeaderId(id) {
        return `clr-stepper-header-${id}`;
    }
    ngOnInit() {
        super.ngOnInit();
        this.panel = this.panel.pipe(tap(panel => this.triggerAllFormControlValidationIfError(panel)));
        this.stepperService.disablePanel(this.id, true);
        this.listenToFocusChanges();
        // not all stepper panels are guaranteed to have a form (i.e. empty template-driven)
        if (this.formGroup) {
            // set panel status on form status change only after the form becomes invalid
            const invalidStatusTrigger = this.formGroup.statusChanges.pipe(filter(status => status === 'INVALID'));
            this.subscriptions.push(this.formGroup.statusChanges.pipe(skipUntil(invalidStatusTrigger), distinctUntilChanged()).subscribe(status => {
                if (!this.formGroup.touched) {
                    return;
                }
                if (status === 'VALID') {
                    this.stepperService.setPanelValid(this.id);
                }
                else if (status === 'INVALID') {
                    this.stepperService.setPanelInvalid(this.id);
                }
            }));
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    stepCompleteText(panelNumber) {
        return this.commonStrings.parse(this.commonStrings.keys.stepComplete, { STEP: panelNumber.toString() });
    }
    stepErrorText(panelNumber) {
        return this.commonStrings.parse(this.commonStrings.keys.stepError, { STEP: panelNumber.toString() });
    }
    listenToFocusChanges() {
        this.subscriptions.push(this.stepperService.activeStep
            .pipe(filter(panelId => isPlatformBrowser(this.platformId) && panelId === this.id))
            .subscribe(() => {
            this.headerButton.nativeElement.focus();
        }));
    }
    triggerAllFormControlValidationIfError(panel) {
        if (panel.status === StepperPanelStatus.Error) {
            triggerAllFormControlValidation(this.formGroup);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepperPanel, deps: [{ token: PLATFORM_ID }, { token: i1.ClrCommonStringsService }, { token: i2.FormGroupName, optional: true }, { token: i2.NgModelGroup, optional: true }, { token: StepperService }, { token: i1.IfExpandService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrStepperPanel, isStandalone: false, selector: "clr-stepper-panel", host: { properties: { "class.clr-stepper-panel": "true", "class.clr-stepper-panel-disabled": "this.disabled" } }, providers: [IfExpandService], queries: [{ propertyName: "stepDescription", predicate: ClrStepDescription }], viewQueries: [{ propertyName: "headerButton", first: true, predicate: ["headerButton"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (panel | async; as panel) {\n<div [ngClass]=\"getPanelStateClasses(panel)\">\n  <div class=\"clr-stepper-header\">\n    <button\n      type=\"button\"\n      class=\"clr-stepper-header-button\"\n      (click)=\"togglePanel()\"\n      [id]=\"getHeaderId(panel.templateId)\"\n      [attr.aria-disabled]=\"panel.disabled\"\n      [attr.aria-controls]=\"getContentId(panel.templateId)\"\n      [attr.aria-expanded]=\"panel.open\"\n      [class.clr-stepper-header-has-description]=\"(stepDescription.changes | async)?.length || stepDescription.length\"\n      #headerButton\n    >\n      <span class=\"clr-step-status\">\n        <cds-icon shape=\"angle\" direction=\"right\" class=\"clr-stepper-angle clr-step-angle\"></cds-icon>\n        <span class=\"clr-step-status-icon\">\n          @if (getPanelStatus(panel) === PanelStatus.Error) {\n          <cds-icon status=\"danger\" shape=\"exclamation-circle\" class=\"clr-step-error-icon\"></cds-icon>\n          } @if (getPanelStatus(panel) === PanelStatus.Complete) {\n          <cds-icon status=\"success\" shape=\"check-circle\" class=\"clr-step-complete-icon\"></cds-icon>\n          }\n        </span>\n      </span>\n      <span class=\"clr-step-title-wrapper\">\n        <span class=\"clr-step-number\">{{panelNumber}}.</span>\n        <ng-content select=\"clr-step-title\"></ng-content>\n      </span>\n      <ng-content select=\"clr-step-description\"></ng-content>\n    </button>\n    <div class=\"clr-sr-only\" role=\"status\">\n      @if (getPanelStatus(panel) === PanelStatus.Error) { {{ stepErrorText(panelNumber)}} } @if (getPanelStatus(panel)\n      === PanelStatus.Complete) { {{ stepCompleteText(panelNumber)}} }\n    </div>\n  </div>\n  <div\n    @skipInitialRender\n    role=\"region\"\n    class=\"clr-stepper-content-region\"\n    [id]=\"getContentId(panel.templateId)\"\n    [attr.aria-hidden]=\"!panel.open\"\n    [attr.aria-labelledby]=\"getHeaderId(panel.templateId)\"\n  >\n    @if (panel.open) {\n    <div @toggle (@toggle.done)=\"collapsePanelOnAnimationDone(panel)\" class=\"clr-stepper-content\">\n      <div class=\"clr-stepper-inner-content\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n    }\n  </div>\n</div>\n}\n", dependencies: [{ kind: "directive", type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }], animations: collapsiblePanelAnimation, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepperPanel, decorators: [{
            type: Component,
            args: [{ selector: 'clr-stepper-panel', host: { '[class.clr-stepper-panel]': 'true' }, changeDetection: ChangeDetectionStrategy.OnPush, animations: collapsiblePanelAnimation, providers: [IfExpandService], standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (panel | async; as panel) {\n<div [ngClass]=\"getPanelStateClasses(panel)\">\n  <div class=\"clr-stepper-header\">\n    <button\n      type=\"button\"\n      class=\"clr-stepper-header-button\"\n      (click)=\"togglePanel()\"\n      [id]=\"getHeaderId(panel.templateId)\"\n      [attr.aria-disabled]=\"panel.disabled\"\n      [attr.aria-controls]=\"getContentId(panel.templateId)\"\n      [attr.aria-expanded]=\"panel.open\"\n      [class.clr-stepper-header-has-description]=\"(stepDescription.changes | async)?.length || stepDescription.length\"\n      #headerButton\n    >\n      <span class=\"clr-step-status\">\n        <cds-icon shape=\"angle\" direction=\"right\" class=\"clr-stepper-angle clr-step-angle\"></cds-icon>\n        <span class=\"clr-step-status-icon\">\n          @if (getPanelStatus(panel) === PanelStatus.Error) {\n          <cds-icon status=\"danger\" shape=\"exclamation-circle\" class=\"clr-step-error-icon\"></cds-icon>\n          } @if (getPanelStatus(panel) === PanelStatus.Complete) {\n          <cds-icon status=\"success\" shape=\"check-circle\" class=\"clr-step-complete-icon\"></cds-icon>\n          }\n        </span>\n      </span>\n      <span class=\"clr-step-title-wrapper\">\n        <span class=\"clr-step-number\">{{panelNumber}}.</span>\n        <ng-content select=\"clr-step-title\"></ng-content>\n      </span>\n      <ng-content select=\"clr-step-description\"></ng-content>\n    </button>\n    <div class=\"clr-sr-only\" role=\"status\">\n      @if (getPanelStatus(panel) === PanelStatus.Error) { {{ stepErrorText(panelNumber)}} } @if (getPanelStatus(panel)\n      === PanelStatus.Complete) { {{ stepCompleteText(panelNumber)}} }\n    </div>\n  </div>\n  <div\n    @skipInitialRender\n    role=\"region\"\n    class=\"clr-stepper-content-region\"\n    [id]=\"getContentId(panel.templateId)\"\n    [attr.aria-hidden]=\"!panel.open\"\n    [attr.aria-labelledby]=\"getHeaderId(panel.templateId)\"\n  >\n    @if (panel.open) {\n    <div @toggle (@toggle.done)=\"collapsePanelOnAnimationDone(panel)\" class=\"clr-stepper-content\">\n      <div class=\"clr-stepper-inner-content\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n    }\n  </div>\n</div>\n}\n" }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.ClrCommonStringsService }, { type: i2.FormGroupName, decorators: [{
                    type: Optional
                }] }, { type: i2.NgModelGroup, decorators: [{
                    type: Optional
                }] }, { type: StepperService }, { type: i1.IfExpandService }, { type: i0.ChangeDetectorRef }], propDecorators: { headerButton: [{
                type: ViewChild,
                args: ['headerButton']
            }], stepDescription: [{
                type: ContentChildren,
                args: [ClrStepDescription]
            }], disabled: [{
                type: HostBinding,
                args: ['class.clr-stepper-panel-disabled']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStepper {
    constructor(formGroup, ngForm, stepperService) {
        this.formGroup = formGroup;
        this.ngForm = ngForm;
        this.stepperService = stepperService;
        this.subscriptions = [];
    }
    ngOnInit() {
        if (!this.formGroup && !this.ngForm) {
            throw new Error('To use stepper a Reactive or Template Form is required.');
        }
        this.form = this.formGroup ? this.formGroup : this.ngForm;
        this.subscriptions.push(this.listenForPanelsCompleted());
        this.subscriptions.push(this.listenForFormResetChanges());
    }
    ngOnChanges(changes) {
        if (changes.initialPanel &&
            !changes.initialPanel.firstChange &&
            changes.initialPanel.currentValue !== changes.initialPanel.previousValue) {
            this.stepperService.overrideInitialPanel(this.initialPanel);
        }
    }
    ngAfterViewInit() {
        this.subscriptions.push(this.listenForDOMChanges());
    }
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    listenForFormResetChanges() {
        return fromControlReset(this.form.form).subscribe(() => this.stepperService.resetPanels());
    }
    listenForPanelsCompleted() {
        return this.stepperService.panelsCompleted.subscribe(panelsCompleted => {
            if (panelsCompleted && this.form.valid) {
                this.form.ngSubmit.emit();
            }
            else if (!this.form.valid && this.form.touched) {
                this.setPanelsWithFormErrors();
            }
        });
    }
    setPanelsWithFormErrors() {
        const panelsWithErrors = this.panels.reduce((panels, p) => (p.formGroup.invalid ? [...panels, p.id] : panels), []);
        this.stepperService.setPanelsWithErrors(panelsWithErrors);
    }
    listenForDOMChanges() {
        return this.panels.changes.pipe(startWith(this.panels)).subscribe((panels) => {
            this.stepperService.updatePanelOrder(panels.toArray().map(p => p.id));
            if (this.initialPanel) {
                this.stepperService.overrideInitialPanel(this.initialPanel);
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepper, deps: [{ token: i2.FormGroupDirective, optional: true }, { token: i2.NgForm, optional: true }, { token: StepperService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrStepper, isStandalone: false, selector: "form[clrStepper]", inputs: { initialPanel: ["clrInitialStep", "initialPanel"] }, host: { properties: { "class.clr-stepper-forms": "true" } }, providers: [StepperService, { provide: CollapsiblePanelService, useExisting: StepperService }], queries: [{ propertyName: "panels", predicate: ClrStepperPanel }], usesOnChanges: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepper, decorators: [{
            type: Component,
            args: [{
                    selector: 'form[clrStepper]',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-stepper-forms]': 'true',
                    },
                    providers: [StepperService, { provide: CollapsiblePanelService, useExisting: StepperService }],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i2.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i2.NgForm, decorators: [{
                    type: Optional
                }] }, { type: StepperService }], propDecorators: { initialPanel: [{
                type: Input,
                args: ['clrInitialStep']
            }], panels: [{
                type: ContentChildren,
                args: [ClrStepperPanel]
            }] } });
function fromControlReset(control) {
    return new Observable(observer => {
        const unpatchedControlReset = control.reset;
        control.reset = () => {
            observer.next();
            unpatchedControlReset.apply(control);
        };
        return () => {
            control.reset = unpatchedControlReset;
        };
    });
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class StepperWillyWonka extends WillyWonka {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperWillyWonka, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: StepperWillyWonka, isStandalone: false, selector: "form[clrStepper]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperWillyWonka, decorators: [{
            type: Directive,
            args: [{
                    selector: 'form[clrStepper]',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class StepperOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, ifExpandService) {
        if (!willyWonka) {
            throw new Error('clr-stepper-panel should only be used inside of clrStepper');
        }
        super(cdr, willyWonka);
        this.expand = ifExpandService;
    }
    get flavor() {
        return this.expand.expanded;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: StepperWillyWonka, optional: true }, { token: i1.IfExpandService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: StepperOompaLoompa, isStandalone: false, selector: "clr-stepper-panel, [clrStepButton]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-stepper-panel, [clrStepButton]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: StepperWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: i1.IfExpandService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrStepButtonType;
(function (ClrStepButtonType) {
    ClrStepButtonType["Next"] = "next";
    ClrStepButtonType["Previous"] = "previous";
    ClrStepButtonType["Submit"] = "submit";
})(ClrStepButtonType || (ClrStepButtonType = {}));
class ClrStepButton {
    constructor(clrStep, stepperService) {
        this.clrStep = clrStep;
        this.stepperService = stepperService;
        this.type = ClrStepButtonType.Next;
        this.submitButton = false;
        this.previousButton = false;
    }
    ngOnInit() {
        this.submitButton = this.type === ClrStepButtonType.Submit;
        this.previousButton = this.type === ClrStepButtonType.Previous;
    }
    navigateToNextPanel() {
        if (this.previousButton) {
            this.stepperService.navigateToPreviousPanel(this.clrStep.id);
            return;
        }
        this.stepperService.navigateToNextPanel(this.clrStep.id, this.clrStep.formGroup.valid);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepButton, deps: [{ token: ClrStepperPanel }, { token: StepperService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrStepButton, isStandalone: false, selector: "[clrStepButton]", inputs: { type: ["clrStepButton", "type"] }, host: { listeners: { "click": "navigateToNextPanel()" }, properties: { "class.clr-step-button": "true", "class.btn": "true", "type": "'button'", "class.btn-success": "this.submitButton", "class.btn-link": "this.previousButton" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepButton, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrStepButton]',
                    host: {
                        '[class.clr-step-button]': 'true',
                        '[class.btn]': 'true',
                        '[type]': "'button'",
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrStepperPanel }, { type: StepperService }], propDecorators: { type: [{
                type: Input,
                args: ['clrStepButton']
            }], submitButton: [{
                type: HostBinding,
                args: ['class.btn-success']
            }], previousButton: [{
                type: HostBinding,
                args: ['class.btn-link']
            }], navigateToNextPanel: [{
                type: HostListener,
                args: ['click']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStepContent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepContent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrStepContent, isStandalone: false, selector: "clr-step-content", ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-step-content',
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
class ClrStepTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepTitle, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrStepTitle, isStandalone: false, selector: "clr-step-title", host: { properties: { "class.clr-stepper-title": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepTitle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-step-title',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-stepper-title]': 'true' },
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
const declarations = [
    ClrStepper,
    ClrStepButton,
    ClrStepTitle,
    ClrStepDescription,
    ClrStepContent,
    ClrStepperPanel,
    StepperOompaLoompa,
    StepperWillyWonka,
];
class ClrStepperModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon, exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrStepperModule, declarations: [ClrStepper,
            ClrStepButton,
            ClrStepTitle,
            ClrStepDescription,
            ClrStepContent,
            ClrStepperPanel,
            StepperOompaLoompa,
            StepperWillyWonka], imports: [CommonModule, ClrIcon], exports: [ClrStepper,
            ClrStepButton,
            ClrStepTitle,
            ClrStepDescription,
            ClrStepContent,
            ClrStepperPanel,
            StepperOompaLoompa,
            StepperWillyWonka, ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepperModule, imports: [CommonModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon],
                    declarations: [...declarations],
                    exports: [...declarations, ClrIcon],
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

export { ClrStepButton, ClrStepButtonType, ClrStepContent, ClrStepDescription, ClrStepTitle, ClrStepper, ClrStepperModule, ClrStepperPanel, StepperPanelModel, StepperPanelStatus, StepperService, StepperOompaLoompa as ÇlrStepperOompaLoompa, StepperWillyWonka as ÇlrStepperWillyWonka };
//# sourceMappingURL=clr-angular-stepper.mjs.map
