import { OnDestroy, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
export declare class ClrAriaCurrentLink implements OnInit, OnDestroy {
    private rla;
    ariaCurrent: string | undefined;
    private subscription;
    constructor(rla: RouterLinkActive);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
