import { AfterViewInit, EmbeddedViewRef, OnDestroy, TemplateRef } from '@angular/core';
export declare class WrappedColumn implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    columnView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
