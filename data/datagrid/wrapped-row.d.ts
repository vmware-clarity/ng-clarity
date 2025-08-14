import { AfterViewInit, EmbeddedViewRef, OnDestroy, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class WrappedRow implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    rowView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WrappedRow, "dg-wrapped-row", never, {}, {}, never, ["*"], false, never>;
}
