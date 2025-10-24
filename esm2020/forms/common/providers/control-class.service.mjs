/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable, Optional } from '@angular/core';
import { CONTROL_STATE } from '../if-control-state/if-control-state.service';
import * as i0 from "@angular/core";
import * as i1 from "./layout.service";
const CLASS_ERROR = 'clr-error';
const CLASS_SUCCESS = 'clr-success';
export class ControlClassService {
    constructor(layoutService) {
        this.layoutService = layoutService;
        this.className = '';
    }
    controlClass(state = CONTROL_STATE.NONE, grid = false, additional = '') {
        const controlClasses = [this.className, additional];
        switch (state) {
            case CONTROL_STATE.VALID:
                controlClasses.push(CLASS_SUCCESS);
                break;
            case CONTROL_STATE.INVALID:
                controlClasses.push(CLASS_ERROR);
                break;
        }
        if (grid && this.layoutService && this.className.indexOf('clr-col') === -1) {
            controlClasses.push(`clr-col-md-${this.layoutService.maxLabelSize - this.layoutService.labelSize} clr-col-12`);
        }
        return controlClasses.join(' ').trim();
    }
    // We want to remove the column classes from the input up to the container
    initControlClass(renderer, element) {
        if (element && element.className) {
            this.className = element.className;
            const klasses = element.className.split(' ');
            klasses.forEach(klass => {
                if (klass.startsWith('clr-col')) {
                    renderer.removeClass(element, klass);
                }
            });
        }
    }
}
ControlClassService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ControlClassService, deps: [{ token: i1.LayoutService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ControlClassService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ControlClassService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ControlClassService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC1jbGFzcy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWNsYXNzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUVoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sOENBQThDLENBQUM7OztBQUc3RSxNQUFNLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDaEMsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBR3BDLE1BQU0sT0FBTyxtQkFBbUI7SUFHOUIsWUFBZ0MsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFGNUQsY0FBUyxHQUFHLEVBQUUsQ0FBQztJQUVnRCxDQUFDO0lBRWhFLFlBQVksQ0FBQyxRQUF1QixhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxLQUFLLEVBQUUsVUFBVSxHQUFHLEVBQUU7UUFDbkYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRXBELFFBQVEsS0FBSyxFQUFFO1lBQ2IsS0FBSyxhQUFhLENBQUMsS0FBSztnQkFDdEIsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDbkMsTUFBTTtZQUNSLEtBQUssYUFBYSxDQUFDLE9BQU87Z0JBQ3hCLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU07U0FDVDtRQUVELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDMUUsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxhQUFhLENBQUMsQ0FBQztTQUNoSDtRQUNELE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsMEVBQTBFO0lBQzFFLGdCQUFnQixDQUFDLFFBQW1CLEVBQUUsT0FBb0I7UUFDeEQsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbkMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDdEIsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUMvQixRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDdEM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7Z0hBbENVLG1CQUFtQjtvSEFBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFVBQVU7OzBCQUlJLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ09OVFJPTF9TVEFURSB9IGZyb20gJy4uL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuL2xheW91dC5zZXJ2aWNlJztcblxuY29uc3QgQ0xBU1NfRVJST1IgPSAnY2xyLWVycm9yJztcbmNvbnN0IENMQVNTX1NVQ0NFU1MgPSAnY2xyLXN1Y2Nlc3MnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29udHJvbENsYXNzU2VydmljZSB7XG4gIGNsYXNzTmFtZSA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIHByaXZhdGUgbGF5b3V0U2VydmljZTogTGF5b3V0U2VydmljZSkge31cblxuICBjb250cm9sQ2xhc3Moc3RhdGU6IENPTlRST0xfU1RBVEUgPSBDT05UUk9MX1NUQVRFLk5PTkUsIGdyaWQgPSBmYWxzZSwgYWRkaXRpb25hbCA9ICcnKSB7XG4gICAgY29uc3QgY29udHJvbENsYXNzZXMgPSBbdGhpcy5jbGFzc05hbWUsIGFkZGl0aW9uYWxdO1xuXG4gICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgY2FzZSBDT05UUk9MX1NUQVRFLlZBTElEOlxuICAgICAgICBjb250cm9sQ2xhc3Nlcy5wdXNoKENMQVNTX1NVQ0NFU1MpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ09OVFJPTF9TVEFURS5JTlZBTElEOlxuICAgICAgICBjb250cm9sQ2xhc3Nlcy5wdXNoKENMQVNTX0VSUk9SKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGdyaWQgJiYgdGhpcy5sYXlvdXRTZXJ2aWNlICYmIHRoaXMuY2xhc3NOYW1lLmluZGV4T2YoJ2Nsci1jb2wnKSA9PT0gLTEpIHtcbiAgICAgIGNvbnRyb2xDbGFzc2VzLnB1c2goYGNsci1jb2wtbWQtJHt0aGlzLmxheW91dFNlcnZpY2UubWF4TGFiZWxTaXplIC0gdGhpcy5sYXlvdXRTZXJ2aWNlLmxhYmVsU2l6ZX0gY2xyLWNvbC0xMmApO1xuICAgIH1cbiAgICByZXR1cm4gY29udHJvbENsYXNzZXMuam9pbignICcpLnRyaW0oKTtcbiAgfVxuXG4gIC8vIFdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBjb2x1bW4gY2xhc3NlcyBmcm9tIHRoZSBpbnB1dCB1cCB0byB0aGUgY29udGFpbmVyXG4gIGluaXRDb250cm9sQ2xhc3MocmVuZGVyZXI6IFJlbmRlcmVyMiwgZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LmNsYXNzTmFtZSkge1xuICAgICAgdGhpcy5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZTtcbiAgICAgIGNvbnN0IGtsYXNzZXMgPSBlbGVtZW50LmNsYXNzTmFtZS5zcGxpdCgnICcpO1xuICAgICAga2xhc3Nlcy5mb3JFYWNoKGtsYXNzID0+IHtcbiAgICAgICAgaWYgKGtsYXNzLnN0YXJ0c1dpdGgoJ2Nsci1jb2wnKSkge1xuICAgICAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQsIGtsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=