import * as i0 from '@angular/core';
import { NgModule, Injectable, EventEmitter, Input, Output, Optional, Component, Directive, ContentChildren } from '@angular/core';
import { ClrAlertModule as ClrAlertModule$1 } from '@clr/angular/emphasis/alert';
import { ClrBadge as ClrBadge$1 } from '@clr/angular/emphasis/badge';
import { ClrLabel as ClrLabel$1 } from '@clr/angular/emphasis/label';
import * as i1 from '@clr/angular/utils';
import { Subject } from 'rxjs';
import * as i4 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, errorStandardIcon, helpIcon, infoStandardIcon, noteIcon, successStandardIcon, warningStandardIcon, windowCloseIcon, ClrIcon } from '@clr/angular/icon';
import * as i3 from '@clr/angular/progress/spinner';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';
import { Type } from '@clr/angular/emphasis/common';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrEmphasisModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEmphasisModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrEmphasisModule, imports: [ClrBadge$1, ClrLabel$1], exports: [ClrAlertModule$1, ClrBadge$1, ClrLabel$1] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEmphasisModule, imports: [ClrBadge$1, ClrLabel$1, ClrAlertModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEmphasisModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ClrBadge$1, ClrLabel$1],
                    exports: [ClrAlertModule$1, ClrBadge$1, ClrLabel$1],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// @TODO Make this an enum
const ALERT_TYPES = ['info', 'warning', 'danger', 'success', 'neutral', 'unknown', 'loading'];

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class AlertIconAndTypesService {
    constructor(commonStrings) {
        this.commonStrings = commonStrings;
        this.defaultIconShape = 'info-standard';
        this._alertIconShape = '';
        this._alertType = 'info';
    }
    get alertType() {
        return this._alertType;
    }
    set alertType(val) {
        if (ALERT_TYPES.indexOf(val) > -1) {
            this._alertType = val;
        }
    }
    get alertIconShape() {
        if ('' === this._alertIconShape) {
            return this.iconInfoFromType(this._alertType).shape;
        }
        return this._alertIconShape;
    }
    set alertIconShape(val) {
        if (!val) {
            this._alertIconShape = '';
        }
        else if (val !== this._alertIconShape) {
            this._alertIconShape = val;
        }
    }
    get alertIconTitle() {
        return this.iconInfoFromType(this._alertType).title;
    }
    iconInfoFromType(type) {
        const returnObj = { shape: '', cssClass: '', title: '' };
        switch (type) {
            case 'warning':
                returnObj.shape = 'warning-standard';
                returnObj.cssClass = 'alert-warning';
                returnObj.title = this.commonStrings.keys.warning;
                break;
            case 'danger':
                returnObj.shape = 'error-standard';
                returnObj.cssClass = 'alert-danger';
                returnObj.title = this.commonStrings.keys.danger;
                break;
            case 'success':
                returnObj.shape = 'success-standard';
                returnObj.cssClass = 'alert-success';
                returnObj.title = this.commonStrings.keys.success;
                break;
            case 'neutral':
                returnObj.shape = 'note';
                returnObj.cssClass = 'alert-neutral';
                returnObj.title = this.commonStrings.keys.neutral;
                break;
            case 'unknown':
                returnObj.shape = 'help';
                returnObj.cssClass = 'alert-neutral';
                returnObj.title = this.commonStrings.keys.unknown;
                break;
            case 'loading':
                returnObj.shape = 'loading';
                returnObj.cssClass = 'alert-neutral';
                returnObj.title = this.commonStrings.keys.unknown;
                break;
            default:
                returnObj.shape = this.defaultIconShape;
                returnObj.cssClass = 'alert-info';
                returnObj.title = this.commonStrings.keys.info;
                break;
        }
        return returnObj;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AlertIconAndTypesService, deps: [{ token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AlertIconAndTypesService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AlertIconAndTypesService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.ClrCommonStringsService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MultiAlertService {
    constructor() {
        this._change = new Subject();
    }
    /**
     * The Observable that lets other classes subscribe to changes
     */
    get changes() {
        return this._change.asObservable();
    }
    get current() {
        return this._current;
    }
    set current(index) {
        if (index !== this._current) {
            this._current = index;
            this._change.next(index);
        }
    }
    get activeAlerts() {
        return this.allAlerts && this.allAlerts.filter(alert => !alert._closed);
    }
    get currentAlert() {
        return this.activeAlerts && this.activeAlerts[this.current];
    }
    set currentAlert(alert) {
        this.current = this.activeAlerts.indexOf(alert);
    }
    get count() {
        return (this.activeAlerts && this.activeAlerts.length) || 0;
    }
    manage(alerts) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.allAlerts = alerts;
        // After receiving alerts' QueryList,
        // we are picking index 0 as current by default if a user hasn't any index
        this.current = typeof this._current === 'number' ? this._current : 0;
        // we have to also broadcast that initial index
        this._change.next(this.current);
        this.subscription = this.allAlerts.changes.subscribe(() => {
            if (this.current >= this.allAlerts.length) {
                this.current = Math.max(0, this.allAlerts.length - 1);
            }
        });
    }
    next() {
        this._current = this.current === this.activeAlerts.length - 1 ? 0 : this.current + 1;
        this._change.next(this._current);
    }
    previous() {
        if (this.activeAlerts.length === 0) {
            return;
        }
        this._current = this.current === 0 ? this.activeAlerts.length - 1 : this.current - 1;
        this._change.next(this._current);
    }
    open() {
        if (this.activeAlerts.length === 0) {
            return;
        }
        if (!this.currentAlert) {
            this._current = 0;
        }
        this._change.next(this._current);
    }
    close(isCurrentAlert) {
        if (this.activeAlerts.length === 0) {
            return;
        }
        if (isCurrentAlert) {
            this._current = Math.max(0, this.current - 1);
        }
        this._change.next(this._current);
    }
    destroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MultiAlertService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MultiAlertService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MultiAlertService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAlert {
    constructor(iconService, cdr, multiAlertService, commonStrings, renderer, hostElement) {
        this.iconService = iconService;
        this.cdr = cdr;
        this.multiAlertService = multiAlertService;
        this.commonStrings = commonStrings;
        this.renderer = renderer;
        this.hostElement = hostElement;
        this.isSmall = false;
        this.closable = true;
        this.isAppLevel = false;
        this.clrCloseButtonAriaLabel = this.commonStrings.keys.alertCloseButtonAriaLabel;
        this._closedChanged = new EventEmitter(false);
        this._closed = false;
        this.subscriptions = [];
        this._isLightweight = false;
    }
    get isLightweight() {
        return this._isLightweight;
    }
    set isLightweight(val) {
        this._isLightweight = val;
        this.configAlertType(this._origAlertType);
    }
    get alertType() {
        return this.iconService.alertType;
    }
    set alertType(val) {
        this._origAlertType = val;
        this.configAlertType(val);
    }
    set alertIconShape(value) {
        this.iconService.alertIconShape = value;
    }
    set closed(value) {
        if (value && !this._closed) {
            this.close();
        }
        else if (!value && this._closed) {
            this.open();
        }
    }
    get alertClass() {
        return this.iconService.iconInfoFromType(this.iconService.alertType).cssClass;
    }
    get hidden() {
        return this._hidden;
    }
    set hidden(value) {
        if (value !== this._hidden) {
            this._hidden = value;
            // CDE-1249 @HostBinding('class.alert-hidden') decoration will raise error in console https://angular.io/errors/NG0100
            if (this._hidden) {
                this.renderer.addClass(this.hostElement.nativeElement, 'alert-hidden');
            }
            else {
                this.renderer.removeClass(this.hostElement.nativeElement, 'alert-hidden');
            }
            this.cdr.detectChanges();
        }
    }
    ngOnInit() {
        if (this.multiAlertService) {
            this.subscriptions.push(this.multiAlertService.changes.subscribe(() => {
                this.hidden = this.multiAlertService.currentAlert !== this;
            }));
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    configAlertType(val) {
        this.iconService.alertType = val;
    }
    open() {
        this._closed = false;
        if (this.multiAlertService) {
            this.multiAlertService.open();
        }
        this._closedChanged.emit(false);
    }
    close() {
        if (!this.closable) {
            return;
        }
        const isCurrentAlert = this.multiAlertService?.currentAlert === this;
        this._closed = true;
        if (this.multiAlertService?.activeAlerts) {
            this.multiAlertService.close(isCurrentAlert);
        }
        this._closedChanged.emit(true);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlert, deps: [{ token: AlertIconAndTypesService }, { token: i0.ChangeDetectorRef }, { token: MultiAlertService, optional: true }, { token: i1.ClrCommonStringsService }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrAlert, isStandalone: false, selector: "clr-alert", inputs: { isSmall: ["clrAlertSizeSmall", "isSmall"], closable: ["clrAlertClosable", "closable"], isAppLevel: ["clrAlertAppLevel", "isAppLevel"], clrCloseButtonAriaLabel: "clrCloseButtonAriaLabel", isLightweight: ["clrAlertLightweight", "isLightweight"], alertType: ["clrAlertType", "alertType"], alertIconShape: ["clrAlertIcon", "alertIconShape"], closed: ["clrAlertClosed", "closed"] }, outputs: { _closedChanged: "clrAlertClosedChange" }, providers: [AlertIconAndTypesService], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (!_closed) {\n<div\n  class=\"alert\"\n  [ngClass]=\"alertClass\"\n  [class.alert-sm]=\"isSmall\"\n  [class.alert-lightweight]=\"isLightweight\"\n  [class.alert-app-level]=\"isAppLevel\"\n>\n  <div class=\"alert-items\">\n    <ng-content></ng-content>\n  </div>\n  @if (closable) {\n  <button type=\"button\" class=\"close\" (click)=\"close()\" [attr.aria-label]=\"clrCloseButtonAriaLabel\">\n    <cds-icon shape=\"times\"></cds-icon>\n  </button>\n  }\n</div>\n}\n", dependencies: [{ kind: "directive", type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlert, decorators: [{
            type: Component,
            args: [{ selector: 'clr-alert', providers: [AlertIconAndTypesService], standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (!_closed) {\n<div\n  class=\"alert\"\n  [ngClass]=\"alertClass\"\n  [class.alert-sm]=\"isSmall\"\n  [class.alert-lightweight]=\"isLightweight\"\n  [class.alert-app-level]=\"isAppLevel\"\n>\n  <div class=\"alert-items\">\n    <ng-content></ng-content>\n  </div>\n  @if (closable) {\n  <button type=\"button\" class=\"close\" (click)=\"close()\" [attr.aria-label]=\"clrCloseButtonAriaLabel\">\n    <cds-icon shape=\"times\"></cds-icon>\n  </button>\n  }\n</div>\n}\n" }]
        }], ctorParameters: () => [{ type: AlertIconAndTypesService }, { type: i0.ChangeDetectorRef }, { type: MultiAlertService, decorators: [{
                    type: Optional
                }] }, { type: i1.ClrCommonStringsService }, { type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { isSmall: [{
                type: Input,
                args: ['clrAlertSizeSmall']
            }], closable: [{
                type: Input,
                args: ['clrAlertClosable']
            }], isAppLevel: [{
                type: Input,
                args: ['clrAlertAppLevel']
            }], clrCloseButtonAriaLabel: [{
                type: Input
            }], _closedChanged: [{
                type: Output,
                args: ['clrAlertClosedChange']
            }], isLightweight: [{
                type: Input,
                args: ['clrAlertLightweight']
            }], alertType: [{
                type: Input,
                args: ['clrAlertType']
            }], alertIconShape: [{
                type: Input,
                args: ['clrAlertIcon']
            }], closed: [{
                type: Input,
                args: ['clrAlertClosed']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAlertItem {
    constructor(iconService) {
        this.iconService = iconService;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertItem, deps: [{ token: AlertIconAndTypesService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrAlertItem, isStandalone: false, selector: "clr-alert-item", host: { classAttribute: "alert-item" }, ngImport: i0, template: `
    <div class="alert-icon-wrapper">
      @if (iconService.alertIconShape === 'loading') {
        <clr-spinner class="alert-spinner" clrInline></clr-spinner>
      }
      @if (iconService.alertIconShape !== 'loading') {
        <cds-icon
          class="alert-icon"
          role="img"
          [shape]="iconService.alertIconShape"
          [attr.aria-label]="iconService.alertIconTitle"
        ></cds-icon>
      }
    </div>
    <ng-content></ng-content>
  `, isInline: true, dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i3.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertItem, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-alert-item',
                    template: `
    <div class="alert-icon-wrapper">
      @if (iconService.alertIconShape === 'loading') {
        <clr-spinner class="alert-spinner" clrInline></clr-spinner>
      }
      @if (iconService.alertIconShape !== 'loading') {
        <cds-icon
          class="alert-icon"
          role="img"
          [shape]="iconService.alertIconShape"
          [attr.aria-label]="iconService.alertIconTitle"
        ></cds-icon>
      }
    </div>
    <ng-content></ng-content>
  `,
                    host: { class: 'alert-item' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: AlertIconAndTypesService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * @remark
 * This directive is used only of selectin alert text.
 */
class ClrAlertText {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertText, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrAlertText, isStandalone: false, selector: ".alert-text", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertText, decorators: [{
            type: Directive,
            args: [{
                    selector: '.alert-text',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAlertsPager {
    constructor(multiAlertService, commonStrings) {
        this.multiAlertService = multiAlertService;
        this.commonStrings = commonStrings;
        this.currentAlertChange = new EventEmitter(false);
        this.currentAlertIndexChange = new EventEmitter();
    }
    /**
     * Input/Output to support two way binding on current alert instance
     */
    get currentAlert() {
        return this.multiAlertService.currentAlert;
    }
    set currentAlert(alert) {
        if (alert) {
            this.multiAlertService.currentAlert = alert;
        }
    }
    /**
     * Input/Output to support two way binding on current alert index
     */
    get currentAlertIndex() {
        return this.multiAlertService.current;
    }
    set currentAlertIndex(index) {
        this.multiAlertService.current = index;
    }
    get previousAlertAriaLabel() {
        const CURRENT = this.currentAlertIndex + 1;
        return this.commonStrings.parse(this.commonStrings.keys.alertPreviousAlertAriaLabel, {
            CURRENT: (CURRENT === 1 ? this.multiAlertService.count : CURRENT - 1).toString(),
            COUNT: this.multiAlertService.count.toString(),
        });
    }
    get nextAlertAriaLabel() {
        const CURRENT = this.currentAlertIndex + 1;
        return this.commonStrings.parse(this.commonStrings.keys.alertNextAlertAriaLabel, {
            CURRENT: (CURRENT === this.multiAlertService.count ? 1 : CURRENT + 1).toString(),
            COUNT: this.multiAlertService.count.toString(),
        });
    }
    ngOnInit() {
        this.multiAlertServiceChanges = this.multiAlertService.changes.subscribe(index => {
            this.currentAlertIndexChange.emit(index);
            this.currentAlertChange.emit(this.multiAlertService.activeAlerts[index]);
        });
    }
    ngOnDestroy() {
        this.multiAlertServiceChanges.unsubscribe();
    }
    pageUp() {
        this.multiAlertService.next();
    }
    pageDown() {
        this.multiAlertService.previous();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertsPager, deps: [{ token: MultiAlertService }, { token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrAlertsPager, isStandalone: false, selector: "clr-alerts-pager", inputs: { currentAlert: ["clrCurrentAlert", "currentAlert"], currentAlertIndex: ["clrCurrentAlertIndex", "currentAlertIndex"] }, outputs: { currentAlertChange: "clrCurrentAlertChange", currentAlertIndexChange: "clrCurrentAlertIndexChange" }, host: { properties: { "class.alerts-pager": "true" } }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"alerts-pager-control\">\n  <div class=\"alerts-page-down\">\n    <button class=\"alerts-pager-button\" type=\"button\" (click)=\"pageDown()\" [attr.aria-label]=\"previousAlertAriaLabel\">\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.previous\"></cds-icon>\n    </button>\n  </div>\n  <div class=\"alerts-pager-text\">{{multiAlertService.current+1}} / {{multiAlertService.count}}</div>\n  <div class=\"alerts-page-up\">\n    <button class=\"alerts-pager-button\" type=\"button\" (click)=\"pageUp()\" [attr.aria-label]=\"nextAlertAriaLabel\">\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.next\"></cds-icon>\n    </button>\n  </div>\n</div>\n", dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertsPager, decorators: [{
            type: Component,
            args: [{ selector: 'clr-alerts-pager', host: { '[class.alerts-pager]': 'true' }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"alerts-pager-control\">\n  <div class=\"alerts-page-down\">\n    <button class=\"alerts-pager-button\" type=\"button\" (click)=\"pageDown()\" [attr.aria-label]=\"previousAlertAriaLabel\">\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.previous\"></cds-icon>\n    </button>\n  </div>\n  <div class=\"alerts-pager-text\">{{multiAlertService.current+1}} / {{multiAlertService.count}}</div>\n  <div class=\"alerts-page-up\">\n    <button class=\"alerts-pager-button\" type=\"button\" (click)=\"pageUp()\" [attr.aria-label]=\"nextAlertAriaLabel\">\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.next\"></cds-icon>\n    </button>\n  </div>\n</div>\n" }]
        }], ctorParameters: () => [{ type: MultiAlertService }, { type: i1.ClrCommonStringsService }], propDecorators: { currentAlertChange: [{
                type: Output,
                args: ['clrCurrentAlertChange']
            }], currentAlertIndexChange: [{
                type: Output,
                args: ['clrCurrentAlertIndexChange']
            }], currentAlert: [{
                type: Input,
                args: ['clrCurrentAlert']
            }], currentAlertIndex: [{
                type: Input,
                args: ['clrCurrentAlertIndex']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAlerts {
    constructor(multiAlertService) {
        this.multiAlertService = multiAlertService;
        this.currentAlertChange = new EventEmitter(false);
        this.currentAlertIndexChange = new EventEmitter(false);
        this.subscriptions = [];
    }
    set allAlerts(value) {
        this.multiAlertService.manage(value); // provide alerts
    }
    /**
     * Input/Output to support two way binding on current alert index
     */
    set _inputCurrentIndex(index) {
        if (Number.isInteger(index) && index >= 0) {
            this.multiAlertService.current = index;
        }
    }
    get currentAlertIndex() {
        return this.multiAlertService.current;
    }
    set currentAlertIndex(index) {
        this.multiAlertService.current = index;
    }
    /**
     * Input/Output to support two way binding on current alert instance
     */
    get currentAlert() {
        return this.multiAlertService.currentAlert;
    }
    set currentAlert(alert) {
        if (alert) {
            this.multiAlertService.currentAlert = alert;
        }
    }
    /**
     * Ensure we are only dealing with alerts that have not been closed yet
     */
    get alerts() {
        return this.allAlerts.filter(alert => {
            return alert.hidden === false;
        });
    }
    get currentAlertType() {
        if (this.multiAlertService.currentAlert) {
            return this.multiAlertService.currentAlert.alertType;
        }
        return '';
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.multiAlertService.changes.subscribe(index => {
            this.currentAlertIndexChange.next(index);
            this.currentAlertChange.next(this.multiAlertService.currentAlert);
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.multiAlertService.destroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlerts, deps: [{ token: MultiAlertService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrAlerts, isStandalone: false, selector: "clr-alerts", inputs: { _inputCurrentIndex: ["clrCurrentAlertIndex", "_inputCurrentIndex"], currentAlert: ["clrCurrentAlert", "currentAlert"] }, outputs: { currentAlertChange: "clrCurrentAlertChange", currentAlertIndexChange: "clrCurrentAlertIndexChange" }, host: { properties: { "class.alerts": "true", "class.alert-danger": "this.currentAlertType == 'danger'", "class.alert-info": "this.currentAlertType == 'info'", "class.alert-success": "this.currentAlertType == 'success'", "class.alert-warning": "this.currentAlertType == 'warning'", "class.alert-neutral": "this.currentAlertType == 'neutral'" } }, providers: [MultiAlertService], queries: [{ propertyName: "allAlerts", predicate: ClrAlert }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"alerts-wrapper\">\n  @if (multiAlertService.count > 1) {\n  <clr-alerts-pager [clrCurrentAlertIndex]=\"currentAlertIndex\"></clr-alerts-pager>\n  }\n  <ng-content select=\"clr-alert\"></ng-content>\n</div>\n", styles: [":host{display:block}\n"], dependencies: [{ kind: "component", type: ClrAlertsPager, selector: "clr-alerts-pager", inputs: ["clrCurrentAlert", "clrCurrentAlertIndex"], outputs: ["clrCurrentAlertChange", "clrCurrentAlertIndexChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlerts, decorators: [{
            type: Component,
            args: [{ selector: 'clr-alerts', providers: [MultiAlertService], host: {
                        '[class.alerts]': 'true',
                        '[class.alert-danger]': "this.currentAlertType == 'danger'",
                        '[class.alert-info]': "this.currentAlertType == 'info'",
                        '[class.alert-success]': "this.currentAlertType == 'success'",
                        '[class.alert-warning]': "this.currentAlertType == 'warning'",
                        '[class.alert-neutral]': "this.currentAlertType == 'neutral'",
                    }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"alerts-wrapper\">\n  @if (multiAlertService.count > 1) {\n  <clr-alerts-pager [clrCurrentAlertIndex]=\"currentAlertIndex\"></clr-alerts-pager>\n  }\n  <ng-content select=\"clr-alert\"></ng-content>\n</div>\n", styles: [":host{display:block}\n"] }]
        }], ctorParameters: () => [{ type: MultiAlertService }], propDecorators: { currentAlertChange: [{
                type: Output,
                args: ['clrCurrentAlertChange']
            }], currentAlertIndexChange: [{
                type: Output,
                args: ['clrCurrentAlertIndexChange']
            }], allAlerts: [{
                type: ContentChildren,
                args: [ClrAlert]
            }], _inputCurrentIndex: [{
                type: Input,
                args: ['clrCurrentAlertIndex']
            }], currentAlert: [{
                type: Input,
                args: ['clrCurrentAlert']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_ALERT_DIRECTIVES = [ClrAlert, ClrAlertItem, ClrAlerts, ClrAlertsPager, ClrAlertText];
class ClrAlertModule {
    constructor() {
        ClarityIcons.addIcons(errorStandardIcon, helpIcon, infoStandardIcon, noteIcon, successStandardIcon, warningStandardIcon, windowCloseIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertModule, declarations: [ClrAlert, ClrAlertItem, ClrAlerts, ClrAlertsPager, ClrAlertText], imports: [CommonModule, ClrIcon, ClrDropdownModule, ClrSpinnerModule], exports: [ClrAlert, ClrAlertItem, ClrAlerts, ClrAlertsPager, ClrAlertText] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertModule, imports: [CommonModule, ClrIcon, ClrDropdownModule, ClrSpinnerModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAlertModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrDropdownModule, ClrSpinnerModule],
                    declarations: [CLR_ALERT_DIRECTIVES],
                    exports: [CLR_ALERT_DIRECTIVES],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrBadgeColors;
(function (ClrBadgeColors) {
    ClrBadgeColors["None"] = "";
    ClrBadgeColors["Info"] = "info";
    ClrBadgeColors["Warning"] = "warning";
    ClrBadgeColors["Danger"] = "danger";
    ClrBadgeColors["Success"] = "success";
    ClrBadgeColors["Gray"] = "gray";
    ClrBadgeColors["Blue"] = "blue";
    ClrBadgeColors["LightBlue"] = "light-blue";
    ClrBadgeColors["Orange"] = "orange";
    ClrBadgeColors["Purple"] = "purple";
})(ClrBadgeColors || (ClrBadgeColors = {}));
class ClrBadge {
    constructor() {
        this.color = ClrBadgeColors.None;
        this.type = Type.Solid;
    }
    get isOutlined() {
        return this.type === Type.Outlined;
    }
    get colorClass() {
        return this.color ? `badge-${this.color}` : '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrBadge, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrBadge, isStandalone: true, selector: "clr-badge", inputs: { color: ["clrColor", "color"], type: ["clrType", "type"] }, host: { properties: { "class.outlined": "isOutlined", "class": "colorClass" }, classAttribute: "badge" }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrBadge, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-badge',
                    template: `<ng-content></ng-content>`,
                    host: {
                        class: 'badge',
                        '[class.outlined]': 'isOutlined',
                        '[class]': 'colorClass',
                    },
                }]
        }], propDecorators: { color: [{
                type: Input,
                args: ['clrColor']
            }], type: [{
                type: Input,
                args: ['clrType']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrLabelColors;
(function (ClrLabelColors) {
    ClrLabelColors["None"] = "";
    ClrLabelColors["Info"] = "info";
    ClrLabelColors["Warning"] = "warning";
    ClrLabelColors["Danger"] = "danger";
    ClrLabelColors["Success"] = "success";
    ClrLabelColors["Gray"] = "gray";
    ClrLabelColors["Blue"] = "blue";
    ClrLabelColors["LightBlue"] = "light-blue";
    ClrLabelColors["Orange"] = "orange";
    ClrLabelColors["Purple"] = "purple";
})(ClrLabelColors || (ClrLabelColors = {}));
class ClrLabel {
    constructor() {
        this.color = ClrLabelColors.None;
        this.badgeText = '';
        this.textContent = '';
        this.clickable = false;
        this.disabled = false;
        this.type = Type.Outlined;
    }
    get isSolid() {
        return this.type === Type.Solid;
    }
    get colorClass() {
        return this.color ? `label-${this.color}` : '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrLabel, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrLabel, isStandalone: true, selector: "clr-label", inputs: { color: ["clrColor", "color"], badgeText: ["clrBadgeText", "badgeText"], textContent: ["clrText", "textContent"], clickable: ["clrClickable", "clickable"], disabled: ["clrDisabled", "disabled"], type: ["clrType", "type"] }, host: { properties: { "class.clickable": "clickable", "class.disabled": "disabled", "class.solid": "isSolid", "class": "colorClass" }, classAttribute: "label" }, ngImport: i0, template: `@if (textContent) {
      <span class="text">{{ textContent }}</span>
    }

    @if (badgeText) {
      <clr-badge>{{ badgeText }}</clr-badge>
    }

    <ng-content></ng-content>`, isInline: true, dependencies: [{ kind: "component", type: ClrBadge$1, selector: "clr-badge", inputs: ["clrColor", "clrType"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrLabel, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-label',
                    template: `@if (textContent) {
      <span class="text">{{ textContent }}</span>
    }

    @if (badgeText) {
      <clr-badge>{{ badgeText }}</clr-badge>
    }

    <ng-content></ng-content>`,
                    host: {
                        class: 'label',
                        '[class.clickable]': 'clickable',
                        '[class.disabled]': 'disabled',
                        '[class.solid]': 'isSolid',
                        '[class]': 'colorClass',
                    },
                    imports: [ClrBadge$1],
                }]
        }], propDecorators: { color: [{
                type: Input,
                args: ['clrColor']
            }], badgeText: [{
                type: Input,
                args: ['clrBadgeText']
            }], textContent: [{
                type: Input,
                args: ['clrText']
            }], clickable: [{
                type: Input,
                args: ['clrClickable']
            }], disabled: [{
                type: Input,
                args: ['clrDisabled']
            }], type: [{
                type: Input,
                args: ['clrType']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ALERT_TYPES, CLR_ALERT_DIRECTIVES, ClrAlert, ClrAlertItem, ClrAlertModule, ClrAlertText, ClrAlerts, ClrAlertsPager, ClrBadge, ClrBadgeColors, ClrEmphasisModule, ClrLabel, ClrLabelColors };
//# sourceMappingURL=clr-angular-emphasis.mjs.map
