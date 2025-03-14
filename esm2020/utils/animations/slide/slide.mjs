/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { animate, style, transition } from '@angular/animations';
import { defaultAnimationTiming } from '../constants';
export function slide(direction) {
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
        transition('void => *', [style({ transform: transform }), animate(defaultAnimationTiming)]),
        transition('* => void', [animate(defaultAnimationTiming, style({ transform: transform }))]),
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9hbmltYXRpb25zL3NsaWRlL3NsaWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLE9BQU8sRUFBcUIsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXBGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV0RCxNQUFNLFVBQVUsS0FBSyxDQUFDLFNBQWlCO0lBQ3JDLElBQUksU0FBUyxHQUFXLElBQUksQ0FBQztJQUM3QixJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7UUFDdEIsU0FBUyxHQUFHLG1CQUFtQixDQUFDO0tBQ2pDO1NBQU0sSUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFO1FBQy9CLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztLQUNsQztTQUFNLElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTtRQUMvQixTQUFTLEdBQUcsbUJBQW1CLENBQUM7S0FDakM7U0FBTSxJQUFJLFNBQVMsS0FBSyxPQUFPLEVBQUU7UUFDaEMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO0tBQ2xDO1NBQU07UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixHQUFHLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQyxDQUFDO0tBQzdFO0lBQ0QsT0FBTztRQUNMLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1FBQzNGLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBhbmltYXRlLCBBbmltYXRpb25NZXRhZGF0YSwgc3R5bGUsIHRyYW5zaXRpb24gfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuaW1wb3J0IHsgZGVmYXVsdEFuaW1hdGlvblRpbWluZyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzbGlkZShkaXJlY3Rpb246IHN0cmluZyk6IEFuaW1hdGlvbk1ldGFkYXRhW10ge1xuICBsZXQgdHJhbnNmb3JtOiBzdHJpbmcgPSBudWxsO1xuICBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XG4gICAgdHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgwLCAyNSUpJztcbiAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xuICAgIHRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoMCwgLTI1JSknO1xuICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgdHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgyNSUsIDApJztcbiAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICB0cmFuc2Zvcm0gPSAndHJhbnNsYXRlKC0yNSUsIDApJztcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZGlyZWN0aW9uICcgKyBkaXJlY3Rpb24gKyAnIGZvciBzbGlkZSBhbmltYXRpb24uJyk7XG4gIH1cbiAgcmV0dXJuIFtcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBbc3R5bGUoeyB0cmFuc2Zvcm06IHRyYW5zZm9ybSB9KSwgYW5pbWF0ZShkZWZhdWx0QW5pbWF0aW9uVGltaW5nKV0pLFxuICAgIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIFthbmltYXRlKGRlZmF1bHRBbmltYXRpb25UaW1pbmcsIHN0eWxlKHsgdHJhbnNmb3JtOiB0cmFuc2Zvcm0gfSkpXSksXG4gIF07XG59XG4iXX0=