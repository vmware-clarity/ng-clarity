import { Type } from "@clr/angular/emphasis/common";
import * as i0 from "@angular/core";
export declare enum ClrBadgeColors {
  None = "",
  Info = "info",
  Warning = "warning",
  Danger = "danger",
  Success = "success",
  Gray = "gray",
  Blue = "blue",
  LightBlue = "light-blue",
  Orange = "orange",
  Purple = "purple"
}
export declare class ClrBadge {
  color: ClrBadgeColors | string;
  type: Type | string;
  get isOutlined(): boolean;
  get colorClass(): string;
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrBadge, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ClrBadge, "clr-badge", never, {
    "color": {
      "alias": "clrColor";
      "required": false;
    };
    "type": {
      "alias": "clrType";
      "required": false;
    };
  }, {}, never, ["*"], true, never>;
}