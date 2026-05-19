import { AfterViewInit, EmbeddedViewRef, OnDestroy, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class WrappedCell implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    cellView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedCell, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WrappedCell, "dg-wrapped-cell", never, {}, {}, never, ["*"], false, never>;
}
