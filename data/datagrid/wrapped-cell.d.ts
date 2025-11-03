import { AfterViewInit, EmbeddedViewRef, OnDestroy, TemplateRef } from '@angular/core';
export declare class WrappedCell implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    cellView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
