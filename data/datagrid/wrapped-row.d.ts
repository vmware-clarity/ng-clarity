import { AfterViewInit, EmbeddedViewRef, OnDestroy, TemplateRef } from '@angular/core';
export declare class WrappedRow implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    rowView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
