/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { animate, style, transition, trigger } from '@angular/animations';
import { defaultAnimationTiming } from '../../utils/animations/constants';
export const panelAnimation = [
    trigger('skipInitialRender', [transition(':enter', [])]),
    trigger('toggle', [
        transition('void => *', [
            style({ display: 'block', height: 0 }),
            animate(defaultAnimationTiming, style({ height: '*' })),
        ]),
    ]),
];
export const stepAnimation = [
    trigger('skipInitialRender', [transition(':enter', [])]),
    trigger('toggle', [
        transition('void => *', [
            style({ display: 'block', height: 0 }),
            animate(defaultAnimationTiming, style({ height: '*' })),
        ]),
        transition('* => void', [
            style({ display: 'block' }),
            animate(defaultAnimationTiming, style({ height: 0, display: 'none' })),
        ]),
    ]),
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvYWNjb3JkaW9uL3V0aWxzL2FuaW1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUUxRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUUxRSxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUc7SUFDNUIsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sQ0FBQyxRQUFRLEVBQUU7UUFDaEIsVUFBVSxDQUFDLFdBQVcsRUFBRTtZQUN0QixLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN0QyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDeEQsQ0FBQztLQUNILENBQUM7Q0FDSCxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHO0lBQzNCLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4RCxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ2hCLFVBQVUsQ0FBQyxXQUFXLEVBQUU7WUFDdEIsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDdEMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ3hELENBQUM7UUFDRixVQUFVLENBQUMsV0FBVyxFQUFFO1lBQ3RCLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQztZQUMzQixPQUFPLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN2RSxDQUFDO0tBQ0gsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGFuaW1hdGUsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbmltcG9ydCB7IGRlZmF1bHRBbmltYXRpb25UaW1pbmcgfSBmcm9tICcuLi8uLi91dGlscy9hbmltYXRpb25zL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBjb25zdCBwYW5lbEFuaW1hdGlvbiA9IFtcbiAgdHJpZ2dlcignc2tpcEluaXRpYWxSZW5kZXInLCBbdHJhbnNpdGlvbignOmVudGVyJywgW10pXSksXG4gIHRyaWdnZXIoJ3RvZ2dsZScsIFtcbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBbXG4gICAgICBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycsIGhlaWdodDogMCB9KSxcbiAgICAgIGFuaW1hdGUoZGVmYXVsdEFuaW1hdGlvblRpbWluZywgc3R5bGUoeyBoZWlnaHQ6ICcqJyB9KSksXG4gICAgXSksXG4gIF0pLFxuXTtcblxuZXhwb3J0IGNvbnN0IHN0ZXBBbmltYXRpb24gPSBbXG4gIHRyaWdnZXIoJ3NraXBJbml0aWFsUmVuZGVyJywgW3RyYW5zaXRpb24oJzplbnRlcicsIFtdKV0pLFxuICB0cmlnZ2VyKCd0b2dnbGUnLCBbXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgW1xuICAgICAgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snLCBoZWlnaHQ6IDAgfSksXG4gICAgICBhbmltYXRlKGRlZmF1bHRBbmltYXRpb25UaW1pbmcsIHN0eWxlKHsgaGVpZ2h0OiAnKicgfSkpLFxuICAgIF0pLFxuICAgIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIFtcbiAgICAgIHN0eWxlKHsgZGlzcGxheTogJ2Jsb2NrJyB9KSxcbiAgICAgIGFuaW1hdGUoZGVmYXVsdEFuaW1hdGlvblRpbWluZywgc3R5bGUoeyBoZWlnaHQ6IDAsIGRpc3BsYXk6ICdub25lJyB9KSksXG4gICAgXSksXG4gIF0pLFxuXTtcbiJdfQ==