import { InjectionToken } from '@angular/core';
export declare const TABS_ID: InjectionToken<number>;
export declare function tokenFactory(): string;
export declare const TABS_ID_PROVIDER: {
    provide: InjectionToken<number>;
    useFactory: typeof tokenFactory;
};
