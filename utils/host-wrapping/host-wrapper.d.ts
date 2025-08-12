import { InjectionToken, Injector, Type, ViewContainerRef } from '@angular/core';
/**
 * HostWrapper must be called in OnInit to ensure that the Views are ready. If its called in a constructor the view is
 * still undefined.
 * TODO - make sure these comment annotations do not break ng-packgr.
 */
export declare class HostWrapper<W> implements Injector {
    private injector;
    constructor(containerType: Type<W>, vcr: ViewContainerRef, index?: number);
    get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T;
}
