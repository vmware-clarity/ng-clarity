import * as i0 from '@angular/core';
import { EventEmitter, Input, ViewChild, Output, Inject, Optional, Component, NgModule } from '@angular/core';
import * as i3 from '@clr/addons/a11y';
import { ZoomLevel } from '@clr/addons/a11y';
import * as i4 from '@clr/addons/tabs';
import { Tabs, AppfxTabsModule } from '@clr/addons/tabs';
import * as i2 from '@clr/addons/var';
import { TabLayout, StepValidationState, formatError, modalServiceToken, WorkflowModelMonitor, AppfxWorkflowCoreModule } from '@clr/addons/var';
import * as i1 from '@clr/addons/workflow/strings';
import { Subscription, of, isObservable } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import * as i5 from '@clr/angular/modal';
import { ClrModalModule } from '@clr/angular/modal';
import * as i6 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3$1 from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i2$1 from '@clr/angular/forms/checkbox';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import * as i1$1 from '@clr/angular/forms/common';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A multi page dialog implemented as a single modal dialog with clarity tabs where
 * each step(page) is in a separate tab.
 * A custom component can be added in the dialog header (appfx-dialog-header) if it is
 * needed. See the example below:
 *
 * @example
 * <appfx-dialog
 *             [loading]="loading"
 *             [steps]="steps"
 *             [model]="dialogModel"
 *             [title]="options.title"
 *             [subTitle]="subTitle"
 *             [defaultButton]="submit"
 *             [okButtonLabel]="okButtonLabel"
 *             [disableTabsContent]="!toggleStateEnabled"
 *             [closeHandler]="closeHandler">
 *       <appfx-dialog-header>
 *          <appfx-toggle
 *                [label]="label"
 *                [toggleId]="'myToggleControlId'"
 *                [(toggleState)]="toggleStateEnabled">
 *          </appfx-toggle>
 *       </appfx-dialog-header>
 * </appfx-dialog>
 */
class DialogComponent {
    #opened;
    #subTitle$;
    constructor(cdr, workflowStrings, configService, 
    /**
     * openModalComponent = undefined - Dialog used without ModalService
     * openModalComponent = true  - opened using ModalService.openModalComponent API
     * openModalComponent = false - opened using ModalService.openModal API
     */
    openModalComponent, zoomLevelService) {
        this.cdr = cdr;
        this.workflowStrings = workflowStrings;
        this.configService = configService;
        this.zoomLevelService = zoomLevelService;
        /** The tabs layout. The default value is horizontal if it is not specified. */
        this.tabLayout = TabLayout.horizontal;
        /** Display loading indicator. */
        this.loading = false;
        /**
         * Show Tab Links (true by default)
         * Set this to false if you want to hide the tab links.
         * You can set this to false if you have only one step.
         */
        this.showTabLinks = true;
        /** Dispatches when any of the workflow state's variables changes. */
        this.onModelChange = new EventEmitter();
        /**
         * Dispatched when the dialog is closed (in all three cases: via the close button
         * (on the top right corner) or the OK/Cancel buttons).
         */
        this.onClose = new EventEmitter();
        /** Emits when opened input is changed. */
        this.openedChange = new EventEmitter();
        this.errorIconVisibleList = [];
        this.closeHandlerValidationState = new StepValidationState();
        this.currentZoomLevel = ZoomLevel.none;
        this.ZoomLevel = ZoomLevel;
        this.tabLinksOpened = false;
        this.subscriptions = new Subscription();
        this.defaultMinHeight = '545px';
        this.#opened = true;
        if (openModalComponent === false) {
            throw new Error('AppFx Dialog must be opened using ModalService.openModalComponent method.');
        }
        this.cancelButtonLabel = workflowStrings.defaultCancelButtonLabel ?? '';
        this.okButtonLabel = workflowStrings.defaultOkButtonLabel ?? '';
    }
    /**
     * The sub title of the dialog.
     */
    set subTitle(subTitle) {
        if (typeof subTitle === 'string') {
            this.#subTitle$ = of(subTitle);
        }
        else if (isObservable(subTitle)) {
            this.#subTitle$ = subTitle;
        }
    }
    /** Controls dialog open/close state. */
    get opened() {
        return this.#opened;
    }
    set opened(value) {
        this.#opened = value;
        this.openedChange.emit(value);
        if (!value) {
            this.onClose.emit();
        }
    }
    get subTitle$() {
        return this.#subTitle$;
    }
    get isVerticalLayout() {
        return this.tabLayout === TabLayout.vertical;
    }
    get showAppfxTabLinks() {
        return this.showTabLinks && this.isVerticalLayout && this.currentZoomLevel !== ZoomLevel.none;
    }
    get showTabLinksInAppfxTabs() {
        return this.showAppfxTabLinks ? this.tabLinksOpened : this.showTabLinks;
    }
    get heightStyle() {
        if (this.currentZoomLevel !== ZoomLevel.none) {
            return {};
        }
        if (this.height) {
            return { height: `${this.height}` };
        }
        return { 'min-height': `${this.defaultMinHeight}` };
    }
    get isLoading() {
        return this.loading || this.tabs.isLoading;
    }
    get isOkButtonDisabled() {
        return this.isLoading || !this.tabs.isReady;
    }
    get isSignPostOpen() {
        return !!(this.debugPopup && this.debugPopup.isOpen);
    }
    ngOnInit() {
        if (this.zoomLevelService) {
            this.subscriptions.add(this.zoomLevelService.onChange.subscribe((level) => {
                this.currentZoomLevel = level;
                this.cdr.detectChanges();
            }));
        }
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    onOkButtonClick() {
        this.tabs
            .validate$()
            .pipe(take(1), filter(isValid => isValid))
            .subscribe(() => this.submitDialog());
    }
    onCancelButtonClick() {
        const close$ = this.closeHandler && this.closeHandler.onCancel ? this.closeHandler.onCancel() : of(false);
        this.subscribeForCloseHandler(close$);
    }
    onModalOpenChange(opened) {
        if (opened) {
            this.opened = true;
        }
        else {
            this.onCancelButtonClick();
        }
    }
    submitDialog() {
        const close$ = this.closeHandler && this.closeHandler.onSubmit ? this.closeHandler.onSubmit() : of(true);
        this.subscribeForCloseHandler(close$);
    }
    subscribeForCloseHandler(close$) {
        this.loading = true;
        close$.pipe(take(1)).subscribe({
            error: (error) => {
                this.loading = false;
                if (error !== notDisplayedError) {
                    this.closeHandlerValidationState.errors = [
                        formatError(error).data.message || this.workflowStrings.defaultDialogSubmitError,
                    ];
                }
            },
            complete: () => {
                this.loading = false;
                this.closeHandlerValidationState.errors = [];
                this.closeModal();
            },
        });
    }
    closeModal() {
        this.opened = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DialogComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.WorkflowStrings }, { token: i2.WorkflowConfigurationService }, { token: modalServiceToken, optional: true }, { token: i3.ZoomLevelService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: DialogComponent, isStandalone: false, selector: "appfx-dialog", inputs: { title: "title", size: "size", height: "height", defaultButton: "defaultButton", cancelButtonLabel: "cancelButtonLabel", okButtonLabel: "okButtonLabel", tabLayout: "tabLayout", disableTabsContent: "disableTabsContent", loading: "loading", steps: "steps", model: "model", closeHandler: "closeHandler", showTabLinks: "showTabLinks", subTitle: "subTitle", opened: "opened" }, outputs: { onModelChange: "onModelChange", onClose: "onClose", openedChange: "openedChange" }, viewQueries: [{ propertyName: "tabs", first: true, predicate: Tabs, descendants: true, static: true }, { propertyName: "debugPopup", first: true, predicate: WorkflowModelMonitor, descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-modal\n  [clrModalStaticBackdrop]=\"true\"\n  [clrModalOpen]=\"opened\"\n  (clrModalOpenChange)=\"onModalOpenChange($event)\"\n  [clrModalSize]=\"size || ''\"\n  class=\"appfx-dialog\"\n  [ngClass]=\"tabLayout\"\n  [class.debug-popup]=\"isSignPostOpen\"\n  [class.zoom2x]=\"currentZoomLevel === ZoomLevel.x2\"\n  [class.zoom4x]=\"currentZoomLevel === ZoomLevel.x4\"\n  [class.tab-links-opened]=\"tabLinksOpened\"\n  [class.show-tab-content]=\"!tabLinksOpened\"\n>\n  <div class=\"modal-title\">\n    <appfx-model-popup *ngIf=\"configService.debug\" [modelMgr]=\"appfxTabs.modelMgr\"> </appfx-model-popup>\n    <appfx-tab-links *ngIf=\"showAppfxTabLinks\" [(opened)]=\"tabLinksOpened\" [title]=\"appfxTabs.activeTabStep.title\">\n    </appfx-tab-links>\n    <ng-container *ngIf=\"subTitle$ | async as st; else noSubTitle\">\n      <h1 class=\"modal-title p-0 primaryTitle\" [textContent]=\"title\"></h1>\n      <div class=\"separator\"></div>\n      <h2 class=\"secondaryTitle\" [textContent]=\"st\"></h2>\n    </ng-container>\n    <ng-template #noSubTitle>\n      <h1 class=\"modal-title p-0 primaryTitle secondaryTitleIsEmpty\" [textContent]=\"title\"></h1>\n    </ng-template>\n  </div>\n\n  <div class=\"modal-body\" [ngStyle]=\"heightStyle\">\n    <appfx-spinner *ngIf=\"isLoading\" [message]=\"workflowStrings.loading\"></appfx-spinner>\n    <appfx-validation-banner [state]=\"closeHandlerValidationState\"> </appfx-validation-banner>\n\n    <ng-content select=\"appfx-dialog-header\"></ng-content>\n\n    <appfx-tabs\n      #appfxTabs\n      [tabs]=\"steps\"\n      [model]=\"model\"\n      [disableTabsContent]=\"disableTabsContent\"\n      [tabLayout]=\"tabLayout\"\n      [showTabLinks]=\"showTabLinksInAppfxTabs\"\n      [showLoadingIndicator]=\"false\"\n      [autoCollapseTabLinks]=\"false\"\n      (onModelChange)=\"onModelChange.emit($event)\"\n      (tabLinksOpenedChange)=\"tabLinksOpened = $event\"\n    >\n    </appfx-tabs>\n  </div>\n  <div class=\"modal-footer\">\n    <button\n      type=\"button\"\n      data-test-id=\"cancelBtn\"\n      class=\"btn\"\n      [class.btn-primary]=\"defaultButton === 'close'\"\n      [class.btn-outline]=\"defaultButton !== 'close'\"\n      (click)=\"onCancelButtonClick()\"\n    >\n      {{ cancelButtonLabel }}\n    </button>\n    <button\n      type=\"button\"\n      data-test-id=\"submitBtn\"\n      [disabled]=\"isOkButtonDisabled\"\n      class=\"btn\"\n      [class.btn-primary]=\"defaultButton === 'submit'\"\n      [class.btn-outline]=\"defaultButton !== 'submit'\"\n      (click)=\"onOkButtonClick()\"\n    >\n      {{ okButtonLabel }}\n    </button>\n  </div>\n</clr-modal>\n", styles: [":root :host ::ng-deep .tab-content{display:inline}.center-dialog-content{position:absolute;inset:0;z-index:1;pointer-events:none;display:flex;flex-direction:column;justify-content:center;align-items:center}.modal-title .primaryTitle.secondaryTitleIsEmpty{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.modal-title{display:flex;align-items:flex-start;padding-left:0}.modal-title .primaryTitle{flex-shrink:0;font-size:24px}.modal-title .primaryTitle.secondaryTitleIsEmpty{flex-shrink:1}.modal-title .primaryTitle:not(.secondaryTitleIsEmpty){max-width:65%}.modal-title .secondaryTitle{display:block;word-break:break-all;margin-top:0;margin-bottom:0;line-height:24px;font-size:18px}.modal-title .separator{content:\"\";border-left:1px solid #ccc;margin:0 18px;height:22px}.div-disabled{pointer-events:none;cursor:not-allowed;opacity:.6}.div-disabled .div-disabled{opacity:1}.debug-popup ::ng-deep div.modal-dialog.modal-xl{margin-left:350px}clr-tabs ::ng-deep section{flex:1 1 auto}\n", ".appfx-dialog.zoom2x ::ng-deep .modal,.appfx-dialog.zoom4x ::ng-deep .modal{overflow:visible}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper{display:flex;flex-direction:row;flex:1 1 100%;height:100%;width:100%;max-height:100%}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content{display:flex;flex-direction:column;flex:2 2 auto;align-items:flex-start;padding:0;overflow:hidden;border:none;border-radius:0}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible{flex:0 0 auto;width:100%;padding:1.2rem;display:flex;justify-content:space-between;align-items:flex-start}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper{width:calc(100% - 1.2rem)}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title{flex-direction:column;max-width:100%}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title .separator,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title .separator{display:none}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-body,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-body{flex:1 1 auto;width:100%;height:100%;padding:0 1.2rem}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-footer,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-footer{padding-right:1.2rem;display:block;height:4.2rem;min-height:4.2rem;max-height:4.2rem;width:100%;flex:0 0 4.2rem}.appfx-dialog.zoom2x .secondaryTitle,.appfx-dialog.zoom4x .secondaryTitle{white-space:pre-line}.appfx-dialog.zoom2x ::ng-deep .modal-dialog{height:75vh}.appfx-dialog.zoom4x ::ng-deep .modal{padding:0}.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog{width:100%;height:100%;margin:0}.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content{display:block;overflow-y:auto}.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-body{overflow-y:hidden;max-height:unset;height:unset}.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-footer{position:sticky;bottom:0;background-color:inherit;min-height:3.2rem;height:3.2rem;padding-top:.7rem;z-index:1000}.appfx-dialog.zoom4x .primaryTitle{max-width:55%}.appfx-dialog.vertical.zoom2x:not(.tab-links-opened) .primaryTitle,.appfx-dialog.vertical.zoom4x:not(.tab-links-opened) .primaryTitle{display:none}.appfx-dialog.vertical.zoom2x:not(.tab-links-opened) .secondaryTitle,.appfx-dialog.vertical.zoom4x:not(.tab-links-opened) .secondaryTitle{white-space:pre-line}.appfx-dialog.vertical.zoom2x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible,.appfx-dialog.vertical.zoom4x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible{flex-direction:row}.appfx-dialog.vertical.zoom2x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title,.appfx-dialog.vertical.zoom4x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title{flex-direction:initial}.appfx-dialog.vertical.zoom2x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .close,.appfx-dialog.vertical.zoom4x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .close{display:none}.appfx-dialog.vertical.zoom2x.tab-links-opened .primaryTitle,.appfx-dialog.vertical.zoom4x.tab-links-opened .primaryTitle{width:100%;max-width:100%}.appfx-dialog.vertical.zoom2x.tab-links-opened .separator,.appfx-dialog.vertical.zoom2x.tab-links-opened .secondaryTitle,.appfx-dialog.vertical.zoom4x.tab-links-opened .separator,.appfx-dialog.vertical.zoom4x.tab-links-opened .secondaryTitle{display:none}.appfx-dialog.vertical.zoom2x .secondaryTitle,.appfx-dialog.vertical.zoom4x .secondaryTitle{padding-left:1.5rem}:host .appfx-dialog.show-tab-content ::ng-deep .tab-content{display:flex}:host .appfx-dialog:not(.show-tab-content) ::ng-deep .tab-content{display:none!important}\n"], dependencies: [{ kind: "component", type: i4.TabsComponent, selector: "appfx-tabs", inputs: ["disableTabsContent", "loading", "tabLayout", "showLoadingIndicator", "autoCollapseTabLinks", "showTabLinks", "tabs", "model"], outputs: ["onModelChange", "tabLinksOpenedChange", "activeTabChange"] }, { kind: "component", type: i4.TabLinksComponent, selector: "appfx-tab-links", inputs: ["opened", "title"], outputs: ["openedChange"] }, { kind: "component", type: i2.ValidationBannerComponent, selector: "appfx-validation-banner", inputs: ["state", "closable"] }, { kind: "component", type: i2.WorkflowModelMonitorComponent, selector: "appfx-model-popup", inputs: ["modelMgr"] }, { kind: "component", type: i2.SpinnerComponent, selector: "appfx-spinner", inputs: ["message", "politeness", "isModal", "progressDetails", "showActionButton", "actionButtonLabel"], outputs: ["actionClick"] }, { kind: "component", type: i5.ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "directive", type: i5.ClrModalBody, selector: ".modal-body" }, { kind: "directive", type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "pipe", type: i6.AsyncPipe, name: "async" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-dialog', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-modal\n  [clrModalStaticBackdrop]=\"true\"\n  [clrModalOpen]=\"opened\"\n  (clrModalOpenChange)=\"onModalOpenChange($event)\"\n  [clrModalSize]=\"size || ''\"\n  class=\"appfx-dialog\"\n  [ngClass]=\"tabLayout\"\n  [class.debug-popup]=\"isSignPostOpen\"\n  [class.zoom2x]=\"currentZoomLevel === ZoomLevel.x2\"\n  [class.zoom4x]=\"currentZoomLevel === ZoomLevel.x4\"\n  [class.tab-links-opened]=\"tabLinksOpened\"\n  [class.show-tab-content]=\"!tabLinksOpened\"\n>\n  <div class=\"modal-title\">\n    <appfx-model-popup *ngIf=\"configService.debug\" [modelMgr]=\"appfxTabs.modelMgr\"> </appfx-model-popup>\n    <appfx-tab-links *ngIf=\"showAppfxTabLinks\" [(opened)]=\"tabLinksOpened\" [title]=\"appfxTabs.activeTabStep.title\">\n    </appfx-tab-links>\n    <ng-container *ngIf=\"subTitle$ | async as st; else noSubTitle\">\n      <h1 class=\"modal-title p-0 primaryTitle\" [textContent]=\"title\"></h1>\n      <div class=\"separator\"></div>\n      <h2 class=\"secondaryTitle\" [textContent]=\"st\"></h2>\n    </ng-container>\n    <ng-template #noSubTitle>\n      <h1 class=\"modal-title p-0 primaryTitle secondaryTitleIsEmpty\" [textContent]=\"title\"></h1>\n    </ng-template>\n  </div>\n\n  <div class=\"modal-body\" [ngStyle]=\"heightStyle\">\n    <appfx-spinner *ngIf=\"isLoading\" [message]=\"workflowStrings.loading\"></appfx-spinner>\n    <appfx-validation-banner [state]=\"closeHandlerValidationState\"> </appfx-validation-banner>\n\n    <ng-content select=\"appfx-dialog-header\"></ng-content>\n\n    <appfx-tabs\n      #appfxTabs\n      [tabs]=\"steps\"\n      [model]=\"model\"\n      [disableTabsContent]=\"disableTabsContent\"\n      [tabLayout]=\"tabLayout\"\n      [showTabLinks]=\"showTabLinksInAppfxTabs\"\n      [showLoadingIndicator]=\"false\"\n      [autoCollapseTabLinks]=\"false\"\n      (onModelChange)=\"onModelChange.emit($event)\"\n      (tabLinksOpenedChange)=\"tabLinksOpened = $event\"\n    >\n    </appfx-tabs>\n  </div>\n  <div class=\"modal-footer\">\n    <button\n      type=\"button\"\n      data-test-id=\"cancelBtn\"\n      class=\"btn\"\n      [class.btn-primary]=\"defaultButton === 'close'\"\n      [class.btn-outline]=\"defaultButton !== 'close'\"\n      (click)=\"onCancelButtonClick()\"\n    >\n      {{ cancelButtonLabel }}\n    </button>\n    <button\n      type=\"button\"\n      data-test-id=\"submitBtn\"\n      [disabled]=\"isOkButtonDisabled\"\n      class=\"btn\"\n      [class.btn-primary]=\"defaultButton === 'submit'\"\n      [class.btn-outline]=\"defaultButton !== 'submit'\"\n      (click)=\"onOkButtonClick()\"\n    >\n      {{ okButtonLabel }}\n    </button>\n  </div>\n</clr-modal>\n", styles: [":root :host ::ng-deep .tab-content{display:inline}.center-dialog-content{position:absolute;inset:0;z-index:1;pointer-events:none;display:flex;flex-direction:column;justify-content:center;align-items:center}.modal-title .primaryTitle.secondaryTitleIsEmpty{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.modal-title{display:flex;align-items:flex-start;padding-left:0}.modal-title .primaryTitle{flex-shrink:0;font-size:24px}.modal-title .primaryTitle.secondaryTitleIsEmpty{flex-shrink:1}.modal-title .primaryTitle:not(.secondaryTitleIsEmpty){max-width:65%}.modal-title .secondaryTitle{display:block;word-break:break-all;margin-top:0;margin-bottom:0;line-height:24px;font-size:18px}.modal-title .separator{content:\"\";border-left:1px solid #ccc;margin:0 18px;height:22px}.div-disabled{pointer-events:none;cursor:not-allowed;opacity:.6}.div-disabled .div-disabled{opacity:1}.debug-popup ::ng-deep div.modal-dialog.modal-xl{margin-left:350px}clr-tabs ::ng-deep section{flex:1 1 auto}\n", ".appfx-dialog.zoom2x ::ng-deep .modal,.appfx-dialog.zoom4x ::ng-deep .modal{overflow:visible}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper{display:flex;flex-direction:row;flex:1 1 100%;height:100%;width:100%;max-height:100%}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content{display:flex;flex-direction:column;flex:2 2 auto;align-items:flex-start;padding:0;overflow:hidden;border:none;border-radius:0}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible{flex:0 0 auto;width:100%;padding:1.2rem;display:flex;justify-content:space-between;align-items:flex-start}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper{width:calc(100% - 1.2rem)}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title{flex-direction:column;max-width:100%}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title .separator,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title .separator{display:none}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-body,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-body{flex:1 1 auto;width:100%;height:100%;padding:0 1.2rem}.appfx-dialog.zoom2x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-footer,.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-footer{padding-right:1.2rem;display:block;height:4.2rem;min-height:4.2rem;max-height:4.2rem;width:100%;flex:0 0 4.2rem}.appfx-dialog.zoom2x .secondaryTitle,.appfx-dialog.zoom4x .secondaryTitle{white-space:pre-line}.appfx-dialog.zoom2x ::ng-deep .modal-dialog{height:75vh}.appfx-dialog.zoom4x ::ng-deep .modal{padding:0}.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog{width:100%;height:100%;margin:0}.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content{display:block;overflow-y:auto}.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-body{overflow-y:hidden;max-height:unset;height:unset}.appfx-dialog.zoom4x ::ng-deep .modal .modal-dialog .modal-content-wrapper .modal-content .modal-footer{position:sticky;bottom:0;background-color:inherit;min-height:3.2rem;height:3.2rem;padding-top:.7rem;z-index:1000}.appfx-dialog.zoom4x .primaryTitle{max-width:55%}.appfx-dialog.vertical.zoom2x:not(.tab-links-opened) .primaryTitle,.appfx-dialog.vertical.zoom4x:not(.tab-links-opened) .primaryTitle{display:none}.appfx-dialog.vertical.zoom2x:not(.tab-links-opened) .secondaryTitle,.appfx-dialog.vertical.zoom4x:not(.tab-links-opened) .secondaryTitle{white-space:pre-line}.appfx-dialog.vertical.zoom2x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible,.appfx-dialog.vertical.zoom4x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible{flex-direction:row}.appfx-dialog.vertical.zoom2x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title,.appfx-dialog.vertical.zoom4x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .modal-title-wrapper .modal-title{flex-direction:initial}.appfx-dialog.vertical.zoom2x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .close,.appfx-dialog.vertical.zoom4x.tab-links-opened ::ng-deep .modal-dialog .modal-content-wrapper .modal-content .modal-header--accessible .close{display:none}.appfx-dialog.vertical.zoom2x.tab-links-opened .primaryTitle,.appfx-dialog.vertical.zoom4x.tab-links-opened .primaryTitle{width:100%;max-width:100%}.appfx-dialog.vertical.zoom2x.tab-links-opened .separator,.appfx-dialog.vertical.zoom2x.tab-links-opened .secondaryTitle,.appfx-dialog.vertical.zoom4x.tab-links-opened .separator,.appfx-dialog.vertical.zoom4x.tab-links-opened .secondaryTitle{display:none}.appfx-dialog.vertical.zoom2x .secondaryTitle,.appfx-dialog.vertical.zoom4x .secondaryTitle{padding-left:1.5rem}:host .appfx-dialog.show-tab-content ::ng-deep .tab-content{display:flex}:host .appfx-dialog:not(.show-tab-content) ::ng-deep .tab-content{display:none!important}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i1.WorkflowStrings }, { type: i2.WorkflowConfigurationService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [modalServiceToken]
                }, {
                    type: Optional
                }] }, { type: i3.ZoomLevelService, decorators: [{
                    type: Optional
                }] }], propDecorators: { title: [{
                type: Input
            }], size: [{
                type: Input
            }], height: [{
                type: Input
            }], defaultButton: [{
                type: Input
            }], cancelButtonLabel: [{
                type: Input
            }], okButtonLabel: [{
                type: Input
            }], tabLayout: [{
                type: Input
            }], disableTabsContent: [{
                type: Input
            }], loading: [{
                type: Input
            }], steps: [{
                type: Input
            }], model: [{
                type: Input
            }], closeHandler: [{
                type: Input
            }], showTabLinks: [{
                type: Input
            }], onModelChange: [{
                type: Output
            }], onClose: [{
                type: Output
            }], openedChange: [{
                type: Output
            }], tabs: [{
                type: ViewChild,
                args: [Tabs, { static: true }]
            }], debugPopup: [{
                type: ViewChild,
                args: [WorkflowModelMonitor, { static: false }]
            }], subTitle: [{
                type: Input
            }], opened: [{
                type: Input
            }] } });
const notDisplayedError = new Object();

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A multi page dialog's header component.
 * It can be used for adding custom components (for example: a toggle button or alerts).
 */
class DialogHeaderComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DialogHeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: DialogHeaderComponent, isStandalone: false, selector: "appfx-dialog-header", ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DialogHeaderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-dialog-header',
                    standalone: false,
                    template: `<ng-content></ng-content>`,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A toggle with a label control that can be used in the
 * multi page dialog's header section.
 */
class ToggleComponent {
    static { this.instanceCount = 0; }
    constructor() {
        /** Dispatched when the toggle enabled state is changed. */
        this.toggleStateChange = new EventEmitter();
        /** The enabled toggle state - true or false. */
        this.toggleState = false;
        ToggleComponent.instanceCount++;
        this.toggleId = 'toggle_' + ToggleComponent.instanceCount;
    }
    /**
     * Triggered when the toggle state has changed.
     * @param state The current state
     */
    onToggleStateChanged(state) {
        this.toggleStateChange.emit(state);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ToggleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ToggleComponent, isStandalone: false, selector: "appfx-toggle", inputs: { toggleState: "toggleState", toggleId: "toggleId", label: "label", disabled: "disabled" }, outputs: { toggleStateChange: "toggleStateChange" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"clr-row toggle-header\">\n  <label class=\"toggle-label\" for=\"{{ toggleId }}\">{{ label }}</label>\n  <clr-checkbox-wrapper>\n    <input\n      type=\"checkbox\"\n      clrToggle\n      id=\"{{ toggleId }}\"\n      [(ngModel)]=\"toggleState\"\n      (ngModelChange)=\"onToggleStateChanged(toggleState)\"\n      [attr.disabled]=\"disabled\"\n    />\n  </clr-checkbox-wrapper>\n</div>\n", styles: [".toggle-header{display:flex;margin-left:0;margin-bottom:5px}.toggle-label{margin-right:5px}\n"], dependencies: [{ kind: "directive", type: i1$1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i2$1.ClrCheckbox, selector: "[clrCheckbox],[clrToggle]" }, { kind: "component", type: i2$1.ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper" }, { kind: "directive", type: i3$1.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i3$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-toggle', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"clr-row toggle-header\">\n  <label class=\"toggle-label\" for=\"{{ toggleId }}\">{{ label }}</label>\n  <clr-checkbox-wrapper>\n    <input\n      type=\"checkbox\"\n      clrToggle\n      id=\"{{ toggleId }}\"\n      [(ngModel)]=\"toggleState\"\n      (ngModelChange)=\"onToggleStateChanged(toggleState)\"\n      [attr.disabled]=\"disabled\"\n    />\n  </clr-checkbox-wrapper>\n</div>\n", styles: [".toggle-header{display:flex;margin-left:0;margin-bottom:5px}.toggle-label{margin-right:5px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { toggleStateChange: [{
                type: Output
            }], toggleState: [{
                type: Input
            }], toggleId: [{
                type: Input
            }], label: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const components = [DialogComponent, DialogHeaderComponent, ToggleComponent];
class AppfxMultiPageDialogModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxMultiPageDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxMultiPageDialogModule, declarations: [DialogComponent, DialogHeaderComponent, ToggleComponent], imports: [AppfxTabsModule,
            AppfxWorkflowCoreModule,
            ClrCheckboxModule,
            ClrModalModule,
            CommonModule,
            FormsModule,
            ReactiveFormsModule], exports: [DialogComponent, DialogHeaderComponent, ToggleComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxMultiPageDialogModule, imports: [AppfxTabsModule,
            AppfxWorkflowCoreModule,
            ClrCheckboxModule,
            ClrModalModule,
            CommonModule,
            FormsModule,
            ReactiveFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxMultiPageDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        AppfxTabsModule,
                        AppfxWorkflowCoreModule,
                        ClrCheckboxModule,
                        ClrModalModule,
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                    ],
                    declarations: [...components],
                    exports: [...components],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppfxMultiPageDialogModule, DialogComponent as Dialog, DialogComponent, DialogHeaderComponent as DialogHeader, DialogHeaderComponent, ToggleComponent as Toggle, ToggleComponent, notDisplayedError };
//# sourceMappingURL=clr-addons-dialog.mjs.map
