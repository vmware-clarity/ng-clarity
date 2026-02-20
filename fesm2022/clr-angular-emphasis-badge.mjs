import * as i0 from '@angular/core';
import { Input, Component } from '@angular/core';
import { Type } from '@clr/angular/emphasis/common';

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

/**
 * Generated bundle index. Do not edit.
 */

export { ClrBadge, ClrBadgeColors };
//# sourceMappingURL=clr-angular-emphasis-badge.mjs.map
