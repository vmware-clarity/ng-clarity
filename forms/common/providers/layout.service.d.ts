import * as i0 from "@angular/core";
export declare enum ClrFormLayout {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",
    COMPACT = "compact"
}
export declare class LayoutService {
    readonly minLabelSize = 1;
    readonly maxLabelSize = 12;
    layout: ClrFormLayout | string;
    private layoutValues;
    private _labelSize;
    get labelSize(): number;
    set labelSize(size: number);
    get layoutClass(): string;
    isVertical(): boolean;
    isHorizontal(): boolean;
    isCompact(): boolean;
    isValid(layout: string): boolean;
    labelSizeIsValid(labelSize: number): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<LayoutService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LayoutService>;
}
