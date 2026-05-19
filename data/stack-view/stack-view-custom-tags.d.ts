import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ClrStackViewCustomTags {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewCustomTags, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStackViewCustomTags, "clr-stack-content", never, {}, {}, never, never, false, never>;
}
export declare class ClrStackViewLabel implements OnInit {
    private _generatedId;
    private _id;
    get id(): string;
    set id(val: string);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewLabel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackViewLabel, "clr-stack-label", never, { "id": "id"; }, {}, never, ["*"], false, never>;
}
