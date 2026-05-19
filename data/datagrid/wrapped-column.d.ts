import { AfterViewInit, EmbeddedViewRef, OnDestroy, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class WrappedColumn implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    columnView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedColumn, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WrappedColumn, "dg-wrapped-column", never, {}, {}, never, ["*"], false, never>;
}
