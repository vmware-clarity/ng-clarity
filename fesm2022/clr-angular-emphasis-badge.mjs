import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Type } from "@clr/angular/emphasis/common";
var ClrBadgeColors;
(function(ClrBadgeColors) {
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
var ClrBadge = class ClrBadge {
	constructor() {
		this.color = ClrBadgeColors.None;
		this.type = Type.Solid;
	}
	get isOutlined() {
		return this.type === Type.Outlined;
	}
	get colorClass() {
		return this.color ? `badge-${this.color}` : "";
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrBadge,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrBadge,
			isStandalone: true,
			selector: "clr-badge",
			inputs: {
				color: ["clrColor", "color"],
				type: ["clrType", "type"]
			},
			host: {
				properties: {
					"class.outlined": "isOutlined",
					"class": "colorClass"
				},
				classAttribute: "badge"
			},
			ngImport: i0,
			template: `<ng-content></ng-content>`,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrBadge,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-badge",
			template: `<ng-content></ng-content>`,
			host: {
				class: "badge",
				"[class.outlined]": "isOutlined",
				"[class]": "colorClass"
			},
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	propDecorators: {
		color: [{
			type: Input,
			args: ["clrColor"]
		}],
		type: [{
			type: Input,
			args: ["clrType"]
		}]
	}
});
export { ClrBadge, ClrBadgeColors };

//# sourceMappingURL=clr-angular-emphasis-badge.mjs.map