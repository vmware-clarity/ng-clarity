import * as i0 from '@angular/core';
import { Input, Component } from '@angular/core';
import { ClrBadge } from '@clr/angular/emphasis/badge';
import { Type } from '@clr/angular/emphasis/common';

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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLabel, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrLabel, isStandalone: true, selector: "clr-label", inputs: { color: ["clrColor", "color"], badgeText: ["clrBadgeText", "badgeText"], textContent: ["clrText", "textContent"], clickable: ["clrClickable", "clickable"], disabled: ["clrDisabled", "disabled"], type: ["clrType", "type"] }, host: { properties: { "class.clickable": "clickable", "class.disabled": "disabled", "class.solid": "isSolid", "class": "colorClass" }, classAttribute: "label" }, ngImport: i0, template: `@if (textContent) {
      <span class="text">{{ textContent }}</span>
    }

    @if (badgeText) {
      <clr-badge>{{ badgeText }}</clr-badge>
    }

    <ng-content></ng-content>`, isInline: true, dependencies: [{ kind: "component", type: ClrBadge, selector: "clr-badge", inputs: ["clrColor", "clrType"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLabel, decorators: [{
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
                    imports: [ClrBadge],
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

/**
 * Generated bundle index. Do not edit.
 */

export { ClrLabel, ClrLabelColors };
//# sourceMappingURL=clr-angular-emphasis-label.mjs.map
