import { AnimationEvent } from '@angular/animations';
import { BaseExpandableAnimation } from './base-expandable-animation';
export declare class ClrExpandableAnimation extends BaseExpandableAnimation {
    clrExpandTrigger: boolean;
    get expandAnimation(): {
        value: boolean;
        params: {
            startHeight: number;
        };
    };
    animationStart(event: AnimationEvent): void;
    animationDone(event: AnimationEvent): void;
}
