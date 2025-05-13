/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { animate, style, transition } from '@angular/animations';
import { defaultAnimationTiming } from '../constants';
export function fadeSlide(direction) {
    let transform = null;
    if (direction === 'up') {
        transform = 'translate(0, 25%)';
    }
    else if (direction === 'down') {
        transform = 'translate(0, -25%)';
    }
    else if (direction === 'left') {
        transform = 'translate(25%, 0)';
    }
    else if (direction === 'right') {
        transform = 'translate(-25%, 0)';
    }
    else {
        throw new Error('Unknown direction ' + direction + ' for slide animation.');
    }
    return [
        transition('void => *', [style({ opacity: 0, transform: transform }), animate(defaultAnimationTiming)]),
        transition('* => void', [animate(defaultAnimationTiming, style({ opacity: 0, transform: transform }))]),
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFkZS1zbGlkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2FuaW1hdGlvbnMvZmFkZS1zbGlkZS9mYWRlLXNsaWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLE9BQU8sRUFBcUIsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXBGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV0RCxNQUFNLFVBQVUsU0FBUyxDQUFDLFNBQWlCO0lBQ3pDLElBQUksU0FBUyxHQUFXLElBQUksQ0FBQztJQUM3QixJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7UUFDdEIsU0FBUyxHQUFHLG1CQUFtQixDQUFDO0tBQ2pDO1NBQU0sSUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFO1FBQy9CLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztLQUNsQztTQUFNLElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTtRQUMvQixTQUFTLEdBQUcsbUJBQW1CLENBQUM7S0FDakM7U0FBTSxJQUFJLFNBQVMsS0FBSyxPQUFPLEVBQUU7UUFDaEMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0tBQ2xDO1NBQU07UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixHQUFHLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQyxDQUFDO0tBQzdFO0lBQ0QsT0FBTztRQUNMLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDdkcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4RyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgYW5pbWF0ZSwgQW5pbWF0aW9uTWV0YWRhdGEsIHN0eWxlLCB0cmFuc2l0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbmltcG9ydCB7IGRlZmF1bHRBbmltYXRpb25UaW1pbmcgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZmFkZVNsaWRlKGRpcmVjdGlvbjogc3RyaW5nKTogQW5pbWF0aW9uTWV0YWRhdGFbXSB7XG4gIGxldCB0cmFuc2Zvcm06IHN0cmluZyA9IG51bGw7XG4gIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcbiAgICB0cmFuc2Zvcm0gPSAndHJhbnNsYXRlKDAsIDI1JSknO1xuICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XG4gICAgdHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgwLCAtMjUlKSc7XG4gIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcbiAgICB0cmFuc2Zvcm0gPSAndHJhbnNsYXRlKDI1JSwgMCknO1xuICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgIHRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLTI1JSwgMCknO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBkaXJlY3Rpb24gJyArIGRpcmVjdGlvbiArICcgZm9yIHNsaWRlIGFuaW1hdGlvbi4nKTtcbiAgfVxuICByZXR1cm4gW1xuICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gKicsIFtzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogdHJhbnNmb3JtIH0pLCBhbmltYXRlKGRlZmF1bHRBbmltYXRpb25UaW1pbmcpXSksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgW2FuaW1hdGUoZGVmYXVsdEFuaW1hdGlvblRpbWluZywgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06IHRyYW5zZm9ybSB9KSldKSxcbiAgXTtcbn1cbiJdfQ==