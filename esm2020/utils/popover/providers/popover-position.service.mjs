/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { ClrAxis } from '../enums/axis.enum';
import { align, flipSides, flipSidesAndNudgeContent, nudgeContent, testVisibility } from '../position-operators';
import * as i0 from "@angular/core";
import * as i1 from "./popover-events.service";
export class ClrPopoverPositionService {
    constructor(eventService, platformId) {
        this.eventService = eventService;
        this.platformId = platformId;
        this._shouldRealign = new Subject();
        this.shouldRealign = this._shouldRealign.asObservable();
    }
    realign() {
        this._shouldRealign.next();
    }
    alignContent(content) {
        if (!isPlatformBrowser(this.platformId)) {
            // Only position when in a browser.
            // Default to the browser origin and prevent getBoundingClientRect from running.
            return {
                xOffset: 0,
                yOffset: 0,
            };
        }
        this.currentAnchorCoords = this.eventService.anchorButtonRef.nativeElement.getBoundingClientRect();
        this.currentContentCoords = content.getBoundingClientRect();
        this.contentOffsets = align(this.position, this.currentAnchorCoords, this.currentContentCoords);
        const visibilityViolations = testVisibility(this.contentOffsets, this.currentContentCoords);
        /**
         * Calculate the sum of viewport errors. This calculation is used below with the provided Axis in the given
         * ClrPopoverPosition. Its worth putting the ClrViewportViolation enum values here:
         *
         *   BOTTOM = 0,
         *   LEFT = 1,
         *   RIGHT = 2,
         *   TOP = 3,
         *
         *   So, this.visibilityViolations.length tells us how many sides of the viewport that the popover content was
         *   clipped on. We can only help when the content has an issue on one or two sides.
         *   errorSum is calculated to determine _how_ to change the position. Looking at both the axis and the number
         *   of violations I can use the errorSum to determine how to transform the position (on the fly) and adjust
         *   where it can be improved.
         *
         *   Note, more than 3 viewport violations and there isn't anything we can do to help. Also when there are two
         *   violations, we can't help if the violations are TOP+BOTTOM || LEFT+RIGHT => There is no transformation we
         *   can make to the position that will help.
         *
         *   Some examples:
         *   There is only one error and Primary axis is VERTICAL
         *   - this.handleVerticalAxisOneViolation has a switch that will use the error sum to apply the correct
         *   transform to the position based on the reduction of visibilityViolations.
         *
         *   There are two errors and Primary axis is HORIZONTAL
         *   - handleHorizontalAxisTwoViolations has a switch that uses the error sum to apply both transforms needed to
         *   improve the content position based on the reduction of visibilityViolations.
         */
        const errorSum = visibilityViolations.reduce((count, current) => {
            return count + current;
        }, 0);
        if (visibilityViolations.length === 1 && this.position.axis === ClrAxis.VERTICAL) {
            // When primary axis is VERTICAL and there is one viewport violation
            this.handleVerticalAxisOneViolation(errorSum);
        }
        else if (visibilityViolations.length === 1 && this.position.axis === ClrAxis.HORIZONTAL) {
            // When primary axis is HORIZONTAL and there is one viewport violation
            this.handleHorizontalAxisOneViolation(errorSum);
        }
        else if (visibilityViolations.length === 2 && this.position.axis === ClrAxis.VERTICAL) {
            // When primary axis is VERTICAL and there are two viewport violations
            this.handleVerticalAxisTwoViolations(errorSum);
        }
        else if (visibilityViolations.length === 2 && this.position.axis === ClrAxis.HORIZONTAL) {
            // When primary axis is HORIZONTAL and there are two viewport violations
            this.handleHorizontalAxisTwoViolations(errorSum);
        }
        /**
         * Adjusts popover position based on scroll value by adding the negative 'top' value of currentContentCoords to yOffset for proper alignment.
         * - The negative value means that the 'top' of the content is scrolled out of view at the top of the viewport.
         */
        if (this.currentContentCoords.top < 0) {
            this.contentOffsets.yOffset += Math.abs(this.currentContentCoords.top);
        }
        /**
         * This detects the condition where the popover is flipped because it would violate the bottom of the viewport, but flipping it results in the
         * popover rendering above the top of the body (y coordinate outside the body). In that event, it should be rendered within the body
         * as much as possible, so this logic sets the top of popover to render touching the top of the body.
         */
        if (this.contentOffsets.yOffset + this.currentAnchorCoords.y < 0) {
            this.contentOffsets.yOffset = 0 - this.currentContentCoords.top;
        }
        return this.contentOffsets;
    }
    handleVerticalAxisOneViolation(errorSum) {
        switch (errorSum) {
            case 0:
            case 3: {
                // BOTTOM(0) or TOP(3) are primary violations and we can just flip sides
                this.contentOffsets = align(flipSides(this.position), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            case 1: {
                // LEFT(1) is secondary and needs to nudge content right
                this.contentOffsets = align(this.position, this.currentAnchorCoords, this.currentContentCoords);
                /**
                 * Even with the nudge we still have a problem. We need to check if the content is going to be clipped
                 */
                if (this.contentOffsets.xOffset < 0) {
                    this.contentOffsets.xOffset = 10;
                }
                break;
            }
            case 2: {
                // RIGHT(2) is secondary and  needs to nudge content left
                this.contentOffsets = align(nudgeContent(this.position, true), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            default: {
                break;
            }
        }
    }
    handleVerticalAxisTwoViolations(errorSum) {
        switch (errorSum) {
            // We know there are two violations. We can use the errorSum to determine which combination of sides were
            // violated and handle appropriately.
            case 5: {
                // TOP(3)+RIGHT(2) is case 5. We need to flip sides and nudge the content to the left
                const flipAndNudgeLeft = flipSidesAndNudgeContent(flipSides, nudgeContent, true);
                this.contentOffsets = align(flipAndNudgeLeft(this.position), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            case 4: {
                //TOP(3)+LEFT(1) is case 4, we need to flip sides and nudge content to the right
                const flipAndNudgeRight = flipSidesAndNudgeContent(flipSides, nudgeContent, false);
                this.contentOffsets = align(flipAndNudgeRight(this.position), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            case 3: {
                // TOP(3)+BOTTOM(0) || left(1)+RIGHT(2) is case 3. There is nothing we can do position wise to improve the
                // placement for this content.
                break;
            }
            case 2: {
                // BOTTOM(0)+RIGHT(2) is case 2. We need to flip sides and nudge the content to the left
                const flipAndNudgeLeft = flipSidesAndNudgeContent(flipSides, nudgeContent, true);
                this.contentOffsets = align(flipAndNudgeLeft(this.position), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            case 1: {
                // BOTTOM(0)+LEFT(1) is case 1. We need to flip sides and nudge to the right
                const flipAndNudgeRight = flipSidesAndNudgeContent(flipSides, nudgeContent, false);
                this.contentOffsets = align(flipAndNudgeRight(this.position), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            default: {
                break;
            }
        }
    }
    handleHorizontalAxisOneViolation(errorSum) {
        switch (errorSum) {
            case 1:
            case 2: {
                // LEFT(1) and RIGHT(2) are primary violations so we can flip sides
                this.contentOffsets = align(flipSides(this.position), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            case 0: {
                // BOTTOM(0) is a secondary violation and we need to nudge content up
                this.contentOffsets = align(nudgeContent(this.position, true), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            case 3: {
                // TOP(3) is a secondary violation and we need to nudge content down
                this.contentOffsets = align(nudgeContent(this.position), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            default: {
                break;
            }
        }
    }
    handleHorizontalAxisTwoViolations(errorSum) {
        switch (errorSum) {
            case 5:
            case 4: {
                // TOP(3)+LEFT(1) is case 4.
                // TOP(3)+RIGHT(2) is case 5.
                // In both of these cases we need to flip sides and nudge content down
                const flipAndNudgeDown = flipSidesAndNudgeContent(flipSides, nudgeContent, false);
                this.contentOffsets = align(flipAndNudgeDown(this.position), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            case 3: {
                // TOP(3)+BOTTOM(0) || left(1)+RIGHT(2) is case 3. There is nothing we can do position wise to improve the
                // placement for this content.
                break;
            }
            case 2:
            case 1: {
                // BOTTOM(0)+RIGHT(2) is case 2.
                // BOTTOM(0)+LEFT(1) is case 1.
                // In both cases we  need to flip sides and nudge content up
                const flipAndNudgeUp = flipSidesAndNudgeContent(flipSides, nudgeContent, true);
                this.contentOffsets = align(flipAndNudgeUp(this.position), this.currentAnchorCoords, this.currentContentCoords);
                break;
            }
            default: {
                break;
            }
        }
    }
}
ClrPopoverPositionService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverPositionService, deps: [{ token: i1.ClrPopoverEventsService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
ClrPopoverPositionService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverPositionService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverPositionService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.ClrPopoverEventsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1wb3NpdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci1wb3NpdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hFLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBSTdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLHdCQUF3QixFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBSWpILE1BQU0sT0FBTyx5QkFBeUI7SUFTcEMsWUFBb0IsWUFBcUMsRUFBOEIsVUFBZTtRQUFsRixpQkFBWSxHQUFaLFlBQVksQ0FBeUI7UUFBOEIsZUFBVSxHQUFWLFVBQVUsQ0FBSztRQUY5RixtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFHM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzFELENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsWUFBWSxDQUFDLE9BQW9CO1FBQy9CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdkMsbUNBQW1DO1lBQ25DLGdGQUFnRjtZQUNoRixPQUFPO2dCQUNMLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9B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Q0FBQyxDQUFDO2dCQUNOLDBHQUEwRztnQkFDMUcsOEJBQThCO2dCQUM5QixNQUFNO2FBQ1A7WUFDRCxLQUFLLENBQUMsQ0FBQztZQUNQLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ04sZ0NBQWdDO2dCQUNoQywrQkFBK0I7Z0JBQy9CLDREQUE0RDtnQkFDNUQsTUFBTSxjQUFjLEdBQUcsd0JBQXdCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDL0UsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBQ2hILE1BQU07YUFDUDtZQUNELE9BQU8sQ0FBQyxDQUFDO2dCQUNQLE1BQU07YUFDUDtTQUNGO0lBQ0gsQ0FBQzs7c0hBM1BVLHlCQUF5Qix5REFTK0IsV0FBVzswSEFUbkUseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBRHJDLFVBQVU7OzBCQVVtRCxNQUFNOzJCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyQXhpcyB9IGZyb20gJy4uL2VudW1zL2F4aXMuZW51bSc7XG5pbXBvcnQgeyBDbHJWaWV3cG9ydFZpb2xhdGlvbiB9IGZyb20gJy4uL2VudW1zL3ZpZXdwb3J0LXZpb2xhdGlvbi5lbnVtJztcbmltcG9ydCB7IENsclBvcG92ZXJDb250ZW50T2Zmc2V0IH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9wb3BvdmVyLWNvbnRlbnQtb2Zmc2V0LmludGVyZmFjZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyUG9zaXRpb24gfSBmcm9tICcuLi9pbnRlcmZhY2VzL3BvcG92ZXItcG9zaXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IGFsaWduLCBmbGlwU2lkZXMsIGZsaXBTaWRlc0FuZE51ZGdlQ29udGVudCwgbnVkZ2VDb250ZW50LCB0ZXN0VmlzaWJpbGl0eSB9IGZyb20gJy4uL3Bvc2l0aW9uLW9wZXJhdG9ycyc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyRXZlbnRzU2VydmljZSB9IGZyb20gJy4vcG9wb3Zlci1ldmVudHMuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDbHJQb3BvdmVyUG9zaXRpb25TZXJ2aWNlIHtcbiAgcG9zaXRpb246IENsclBvcG92ZXJQb3NpdGlvbjtcbiAgc2hvdWxkUmVhbGlnbjogT2JzZXJ2YWJsZTx2b2lkPjtcblxuICBwcml2YXRlIGN1cnJlbnRBbmNob3JDb29yZHM6IENsaWVudFJlY3Q7XG4gIHByaXZhdGUgY3VycmVudENvbnRlbnRDb29yZHM6IENsaWVudFJlY3Q7XG4gIHByaXZhdGUgY29udGVudE9mZnNldHM6IENsclBvcG92ZXJDb250ZW50T2Zmc2V0O1xuICBwcml2YXRlIF9zaG91bGRSZWFsaWduID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGV2ZW50U2VydmljZTogQ2xyUG9wb3ZlckV2ZW50c1NlcnZpY2UsIEBJbmplY3QoUExBVEZPUk1fSUQpIHB1YmxpYyBwbGF0Zm9ybUlkOiBhbnkpIHtcbiAgICB0aGlzLnNob3VsZFJlYWxpZ24gPSB0aGlzLl9zaG91bGRSZWFsaWduLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgcmVhbGlnbigpIHtcbiAgICB0aGlzLl9zaG91bGRSZWFsaWduLm5leHQoKTtcbiAgfVxuXG4gIGFsaWduQ29udGVudChjb250ZW50OiBIVE1MRWxlbWVudCk6IENsclBvcG92ZXJDb250ZW50T2Zmc2V0IHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIC8vIE9ubHkgcG9zaXRpb24gd2hlbiBpbiBhIGJyb3dzZXIuXG4gICAgICAvLyBEZWZhdWx0IHRvIHRoZSBicm93c2VyIG9yaWdpbiBhbmQgcHJldmVudCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBydW5uaW5nLlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeE9mZnNldDogMCxcbiAgICAgICAgeU9mZnNldDogMCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50QW5jaG9yQ29vcmRzID0gdGhpcy5ldmVudFNlcnZpY2UuYW5jaG9yQnV0dG9uUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdGhpcy5jdXJyZW50Q29udGVudENvb3JkcyA9IGNvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdGhpcy5jb250ZW50T2Zmc2V0cyA9IGFsaWduKHRoaXMucG9zaXRpb24sIHRoaXMuY3VycmVudEFuY2hvckNvb3JkcywgdGhpcy5jdXJyZW50Q29udGVudENvb3Jkcyk7XG5cbiAgICBjb25zdCB2aXNpYmlsaXR5VmlvbGF0aW9uczogQ2xyVmlld3BvcnRWaW9sYXRpb25bXSA9IHRlc3RWaXNpYmlsaXR5KHRoaXMuY29udGVudE9mZnNldHMsIHRoaXMuY3VycmVudENvbnRlbnRDb29yZHMpO1xuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZSB0aGUgc3VtIG9mIHZpZXdwb3J0IGVycm9ycy4gVGhpcyBjYWxjdWxhdGlvbiBpcyB1c2VkIGJlbG93IHdpdGggdGhlIHByb3ZpZGVkIEF4aXMgaW4gdGhlIGdpdmVuXG4gICAgICogQ2xyUG9wb3ZlclBvc2l0aW9uLiBJdHMgd29ydGggcHV0dGluZyB0aGUgQ2xyVmlld3BvcnRWaW9sYXRpb24gZW51bSB2YWx1ZXMgaGVyZTpcbiAgICAgKlxuICAgICAqICAgQk9UVE9NID0gMCxcbiAgICAgKiAgIExFRlQgPSAxLFxuICAgICAqICAgUklHSFQgPSAyLFxuICAgICAqICAgVE9QID0gMyxcbiAgICAgKlxuICAgICAqICAgU28sIHRoaXMudmlzaWJpbGl0eVZpb2xhdGlvbnMubGVuZ3RoIHRlbGxzIHVzIGhvdyBtYW55IHNpZGVzIG9mIHRoZSB2aWV3cG9ydCB0aGF0IHRoZSBwb3BvdmVyIGNvbnRlbnQgd2FzXG4gICAgICogICBjbGlwcGVkIG9uLiBXZSBjYW4gb25seSBoZWxwIHdoZW4gdGhlIGNvbnRlbnQgaGFzIGFuIGlzc3VlIG9uIG9uZSBvciB0d28gc2lkZXMuXG4gICAgICogICBlcnJvclN1bSBpcyBjYWxjdWxhdGVkIHRvIGRldGVybWluZSBfaG93XyB0byBjaGFuZ2UgdGhlIHBvc2l0aW9uLiBMb29raW5nIGF0IGJvdGggdGhlIGF4aXMgYW5kIHRoZSBudW1iZXJcbiAgICAgKiAgIG9mIHZpb2xhdGlvbnMgSSBjYW4gdXNlIHRoZSBlcnJvclN1bSB0byBkZXRlcm1pbmUgaG93IHRvIHRyYW5zZm9ybSB0aGUgcG9zaXRpb24gKG9uIHRoZSBmbHkpIGFuZCBhZGp1c3RcbiAgICAgKiAgIHdoZXJlIGl0IGNhbiBiZSBpbXByb3ZlZC5cbiAgICAgKlxuICAgICAqICAgTm90ZSwgbW9yZSB0aGFuIDMgdmlld3BvcnQgdmlvbGF0aW9ucyBhbmQgdGhlcmUgaXNuJ3QgYW55dGhpbmcgd2UgY2FuIGRvIHRvIGhlbHAuIEFsc28gd2hlbiB0aGVyZSBhcmUgdHdvXG4gICAgICogICB2aW9sYXRpb25zLCB3ZSBjYW4ndCBoZWxwIGlmIHRoZSB2aW9sYXRpb25zIGFyZSBUT1ArQk9UVE9NIHx8IExFRlQrUklHSFQgPT4gVGhlcmUgaXMgbm8gdHJhbnNmb3JtYXRpb24gd2VcbiAgICAgKiAgIGNhbiBtYWtlIHRvIHRoZSBwb3NpdGlvbiB0aGF0IHdpbGwgaGVscC5cbiAgICAgKlxuICAgICAqICAgU29tZSBleGFtcGxlczpcbiAgICAgKiAgIFRoZXJlIGlzIG9ubHkgb25lIGVycm9yIGFuZCBQcmltYXJ5IGF4aXMgaXMgVkVSVElDQUxcbiAgICAgKiAgIC0gdGhpcy5oYW5kbGVWZXJ0aWNhbEF4aXNPbmVWaW9sYXRpb24gaGFzIGEgc3dpdGNoIHRoYXQgd2lsbCB1c2UgdGhlIGVycm9yIHN1bSB0byBhcHBseSB0aGUgY29ycmVjdFxuICAgICAqICAgdHJhbnNmb3JtIHRvIHRoZSBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgcmVkdWN0aW9uIG9mIHZpc2liaWxpdHlWaW9sYXRpb25zLlxuICAgICAqXG4gICAgICogICBUaGVyZSBhcmUgdHdvIGVycm9ycyBhbmQgUHJpbWFyeSBheGlzIGlzIEhPUklaT05UQUxcbiAgICAgKiAgIC0gaGFuZGxlSG9yaXpvbnRhbEF4aXNUd29WaW9sYXRpb25zIGhhcyBhIHN3aXRjaCB0aGF0IHVzZXMgdGhlIGVycm9yIHN1bSB0byBhcHBseSBib3RoIHRyYW5zZm9ybXMgbmVlZGVkIHRvXG4gICAgICogICBpbXByb3ZlIHRoZSBjb250ZW50IHBvc2l0aW9uIGJhc2VkIG9uIHRoZSByZWR1Y3Rpb24gb2YgdmlzaWJpbGl0eVZpb2xhdGlvbnMuXG4gICAgICovXG5cbiAgICBjb25zdCBlcnJvclN1bSA9IHZpc2liaWxpdHlWaW9sYXRpb25zLnJlZHVjZSgoY291bnQsIGN1cnJlbnQpID0+IHtcbiAgICAgIHJldHVybiBjb3VudCArIGN1cnJlbnQ7XG4gICAgfSwgMCk7XG5cbiAgICBpZiAodmlzaWJpbGl0eVZpb2xhdGlvbnMubGVuZ3RoID09PSAxICYmIHRoaXMucG9zaXRpb24uYXhpcyA9PT0gQ2xyQXhpcy5WRVJUSUNBTCkge1xuICAgICAgLy8gV2hlbiBwcmltYXJ5IGF4aXMgaXMgVkVSVElDQUwgYW5kIHRoZXJlIGlzIG9uZSB2aWV3cG9ydCB2aW9sYXRpb25cbiAgICAgIHRoaXMuaGFuZGxlVmVydGljYWxBeGlzT25lVmlvbGF0aW9uKGVycm9yU3VtKTtcbiAgICB9IGVsc2UgaWYgKHZpc2liaWxpdHlWaW9sYXRpb25zLmxlbmd0aCA9PT0gMSAmJiB0aGlzLnBvc2l0aW9uLmF4aXMgPT09IENsckF4aXMuSE9SSVpPTlRBTCkge1xuICAgICAgLy8gV2hlbiBwcmltYXJ5IGF4aXMgaXMgSE9SSVpPTlRBTCBhbmQgdGhlcmUgaXMgb25lIHZpZXdwb3J0IHZpb2xhdGlvblxuICAgICAgdGhpcy5oYW5kbGVIb3Jpem9udGFsQXhpc09uZVZpb2xhdGlvbihlcnJvclN1bSk7XG4gICAgfSBlbHNlIGlmICh2aXNpYmlsaXR5VmlvbGF0aW9ucy5sZW5ndGggPT09IDIgJiYgdGhpcy5wb3NpdGlvbi5heGlzID09PSBDbHJBeGlzLlZFUlRJQ0FMKSB7XG4gICAgICAvLyBXaGVuIHByaW1hcnkgYXhpcyBpcyBWRVJUSUNBTCBhbmQgdGhlcmUgYXJlIHR3byB2aWV3cG9ydCB2aW9sYXRpb25zXG4gICAgICB0aGlzLmhhbmRsZVZlcnRpY2FsQXhpc1R3b1Zpb2xhdGlvbnMoZXJyb3JTdW0pO1xuICAgIH0gZWxzZSBpZiAodmlzaWJpbGl0eVZpb2xhdGlvbnMubGVuZ3RoID09PSAyICYmIHRoaXMucG9zaXRpb24uYXhpcyA9PT0gQ2xyQXhpcy5IT1JJWk9OVEFMKSB7XG4gICAgICAvLyBXaGVuIHByaW1hcnkgYXhpcyBpcyBIT1JJWk9OVEFMIGFuZCB0aGVyZSBhcmUgdHdvIHZpZXdwb3J0IHZpb2xhdGlvbnNcbiAgICAgIHRoaXMuaGFuZGxlSG9yaXpvbnRhbEF4aXNUd29WaW9sYXRpb25zKGVycm9yU3VtKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGp1c3RzIHBvcG92ZXIgcG9zaXRpb24gYmFzZWQgb24gc2Nyb2xsIHZhbHVlIGJ5IGFkZGluZyB0aGUgbmVnYXRpdmUgJ3RvcCcgdmFsdWUgb2YgY3VycmVudENvbnRlbnRDb29yZHMgdG8geU9mZnNldCBmb3IgcHJvcGVyIGFsaWdubWVudC5cbiAgICAgKiAtIFRoZSBuZWdhdGl2ZSB2YWx1ZSBtZWFucyB0aGF0IHRoZSAndG9wJyBvZiB0aGUgY29udGVudCBpcyBzY3JvbGxlZCBvdXQgb2YgdmlldyBhdCB0aGUgdG9wIG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5jdXJyZW50Q29udGVudENvb3Jkcy50b3AgPCAwKSB7XG4gICAgICB0aGlzLmNvbnRlbnRPZmZzZXRzLnlPZmZzZXQgKz0gTWF0aC5hYnModGhpcy5jdXJyZW50Q29udGVudENvb3Jkcy50b3ApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgZGV0ZWN0cyB0aGUgY29uZGl0aW9uIHdoZXJlIHRoZSBwb3BvdmVyIGlzIGZsaXBwZWQgYmVjYXVzZSBpdCB3b3VsZCB2aW9sYXRlIHRoZSBib3R0b20gb2YgdGhlIHZpZXdwb3J0LCBidXQgZmxpcHBpbmcgaXQgcmVzdWx0cyBpbiB0aGVcbiAgICAgKiBwb3BvdmVyIHJlbmRlcmluZyBhYm92ZSB0aGUgdG9wIG9mIHRoZSBib2R5ICh5IGNvb3JkaW5hdGUgb3V0c2lkZSB0aGUgYm9keSkuIEluIHRoYXQgZXZlbnQsIGl0IHNob3VsZCBiZSByZW5kZXJlZCB3aXRoaW4gdGhlIGJvZHlcbiAgICAgKiBhcyBtdWNoIGFzIHBvc3NpYmxlLCBzbyB0aGlzIGxvZ2ljIHNldHMgdGhlIHRvcCBvZiBwb3BvdmVyIHRvIHJlbmRlciB0b3VjaGluZyB0aGUgdG9wIG9mIHRoZSBib2R5LlxuICAgICAqL1xuICAgIGlmICh0aGlzLmNvbnRlbnRPZmZzZXRzLnlPZmZzZXQgKyB0aGlzLmN1cnJlbnRBbmNob3JDb29yZHMueSA8IDApIHtcbiAgICAgIHRoaXMuY29udGVudE9mZnNldHMueU9mZnNldCA9IDAgLSB0aGlzLmN1cnJlbnRDb250ZW50Q29vcmRzLnRvcDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb250ZW50T2Zmc2V0cztcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlVmVydGljYWxBeGlzT25lVmlvbGF0aW9uKGVycm9yU3VtOiBudW1iZXIpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKGVycm9yU3VtKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICBjYXNlIDM6IHtcbiAgICAgICAgLy8gQk9UVE9NKDApIG9yIFRPUCgzKSBhcmUgcHJpbWFyeSB2aW9sYXRpb25zIGFuZCB3ZSBjYW4ganVzdCBmbGlwIHNpZGVzXG4gICAgICAgIHRoaXMuY29udGVudE9mZnNldHMgPSBhbGlnbihmbGlwU2lkZXModGhpcy5wb3NpdGlvbiksIHRoaXMuY3VycmVudEFuY2hvckNvb3JkcywgdGhpcy5jdXJyZW50Q29udGVudENvb3Jkcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAxOiB7XG4gICAgICAgIC8vIExFRlQoMSkgaXMgc2Vjb25kYXJ5IGFuZCBuZWVkcyB0byBudWRnZSBjb250ZW50IHJpZ2h0XG4gICAgICAgIHRoaXMuY29udGVudE9mZnNldHMgPSBhbGlnbih0aGlzLnBvc2l0aW9uLCB0aGlzLmN1cnJlbnRBbmNob3JDb29yZHMsIHRoaXMuY3VycmVudENvbnRlbnRDb29yZHMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFdmVuIHdpdGggdGhlIG51ZGdlIHdlIHN0aWxsIGhhdmUgYSBwcm9ibGVtLiBXZSBuZWVkIHRvIGNoZWNrIGlmIHRoZSBjb250ZW50IGlzIGdvaW5nIHRvIGJlIGNsaXBwZWRcbiAgICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRPZmZzZXRzLnhPZmZzZXQgPCAwKSB7XG4gICAgICAgICAgdGhpcy5jb250ZW50T2Zmc2V0cy54T2Zmc2V0ID0gMTA7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgMjoge1xuICAgICAgICAvLyBSSUdIVCgyKSBpcyBzZWNvbmRhcnkgYW5kICBuZWVkcyB0byBudWRnZSBjb250ZW50IGxlZnRcbiAgICAgICAgdGhpcy5jb250ZW50T2Zmc2V0cyA9IGFsaWduKFxuICAgICAgICAgIG51ZGdlQ29udGVudCh0aGlzLnBvc2l0aW9uLCB0cnVlKSxcbiAgICAgICAgICB0aGlzLmN1cnJlbnRBbmNob3JDb29yZHMsXG4gICAgICAgICAgdGhpcy5jdXJyZW50Q29udGVudENvb3Jkc1xuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVWZXJ0aWNhbEF4aXNUd29WaW9sYXRpb25zKGVycm9yU3VtOiBudW1iZXIpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKGVycm9yU3VtKSB7XG4gICAgICAvLyBXZSBrbm93IHRoZXJlIGFyZSB0d28gdmlvbGF0aW9ucy4gV2UgY2FuIHVzZSB0aGUgZXJyb3JTdW0gdG8gZGV0ZXJtaW5lIHdoaWNoIGNvbWJpbmF0aW9uIG9mIHNpZGVzIHdlcmVcbiAgICAgIC8vIHZpb2xhdGVkIGFuZCBoYW5kbGUgYXBwcm9wcmlhdGVseS5cbiAgICAgIGNhc2UgNToge1xuICAgICAgICAvLyBUT1AoMykrUklHSFQoMikgaXMgY2FzZSA1LiBXZSBuZWVkIHRvIGZsaXAgc2lkZXMgYW5kIG51ZGdlIHRoZSBjb250ZW50IHRvIHRoZSBsZWZ0XG4gICAgICAgIGNvbnN0IGZsaXBBbmROdWRnZUxlZnQgPSBmbGlwU2lkZXNBbmROdWRnZUNvbnRlbnQoZmxpcFNpZGVzLCBudWRnZUNvbnRlbnQsIHRydWUpO1xuICAgICAgICB0aGlzLmNvbnRlbnRPZmZzZXRzID0gYWxpZ24oXG4gICAgICAgICAgZmxpcEFuZE51ZGdlTGVmdCh0aGlzLnBvc2l0aW9uKSxcbiAgICAgICAgICB0aGlzLmN1cnJlbnRBbmNob3JDb29yZHMsXG4gICAgICAgICAgdGhpcy5jdXJyZW50Q29udGVudENvb3Jkc1xuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgNDoge1xuICAgICAgICAvL1RPUCgzKStMRUZUKDEpIGlzIGNhc2UgNCwgd2UgbmVlZCB0byBmbGlwIHNpZGVzIGFuZCBudWRnZSBjb250ZW50IHRvIHRoZSByaWdodFxuICAgICAgICBjb25zdCBmbGlwQW5kTnVkZ2VSaWdodCA9IGZsaXBTaWRlc0FuZE51ZGdlQ29udGVudChmbGlwU2lkZXMsIG51ZGdlQ29udGVudCwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNvbnRlbnRPZmZzZXRzID0gYWxpZ24oXG4gICAgICAgICAgZmxpcEFuZE51ZGdlUmlnaHQodGhpcy5wb3NpdGlvbiksXG4gICAgICAgICAgdGhpcy5jdXJyZW50QW5jaG9yQ29vcmRzLFxuICAgICAgICAgIHRoaXMuY3VycmVudENvbnRlbnRDb29yZHNcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDM6IHtcbiAgICAgICAgLy8gVE9QKDMpK0JPVFRPTSgwKSB8fCBsZWZ0KDEpK1JJR0hUKDIpIGlzIGNhc2UgMy4gVGhlcmUgaXMgbm90aGluZyB3ZSBjYW4gZG8gcG9zaXRpb24gd2lzZSB0byBpbXByb3ZlIHRoZVxuICAgICAgICAvLyBwbGFjZW1lbnQgZm9yIHRoaXMgY29udGVudC5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDI6IHtcbiAgICAgICAgLy8gQk9UVE9NKDApK1JJR0hUKDIpIGlzIGNhc2UgMi4gV2UgbmVlZCB0byBmbGlwIHNpZGVzIGFuZCBudWRnZSB0aGUgY29udGVudCB0byB0aGUgbGVmdFxuICAgICAgICBjb25zdCBmbGlwQW5kTnVkZ2VMZWZ0ID0gZmxpcFNpZGVzQW5kTnVkZ2VDb250ZW50KGZsaXBTaWRlcywgbnVkZ2VDb250ZW50LCB0cnVlKTtcbiAgICAgICAgdGhpcy5jb250ZW50T2Zmc2V0cyA9IGFsaWduKFxuICAgICAgICAgIGZsaXBBbmROdWRnZUxlZnQodGhpcy5wb3NpdGlvbiksXG4gICAgICAgICAgdGhpcy5jdXJyZW50QW5jaG9yQ29vcmRzLFxuICAgICAgICAgIHRoaXMuY3VycmVudENvbnRlbnRDb29yZHNcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDE6IHtcbiAgICAgICAgLy8gQk9UVE9NKDApK0xFRlQoMSkgaXMgY2FzZSAxLiBXZSBuZWVkIHRvIGZsaXAgc2lkZXMgYW5kIG51ZGdlIHRvIHRoZSByaWdodFxuICAgICAgICBjb25zdCBmbGlwQW5kTnVkZ2VSaWdodCA9IGZsaXBTaWRlc0FuZE51ZGdlQ29udGVudChmbGlwU2lkZXMsIG51ZGdlQ29udGVudCwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNvbnRlbnRPZmZzZXRzID0gYWxpZ24oXG4gICAgICAgICAgZmxpcEFuZE51ZGdlUmlnaHQodGhpcy5wb3NpdGlvbiksXG4gICAgICAgICAgdGhpcy5jdXJyZW50QW5jaG9yQ29vcmRzLFxuICAgICAgICAgIHRoaXMuY3VycmVudENvbnRlbnRDb29yZHNcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlSG9yaXpvbnRhbEF4aXNPbmVWaW9sYXRpb24oZXJyb3JTdW06IG51bWJlcik6IHZvaWQge1xuICAgIHN3aXRjaCAoZXJyb3JTdW0pIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgIGNhc2UgMjoge1xuICAgICAgICAvLyBMRUZUKDEpIGFuZCBSSUdIVCgyKSBhcmUgcHJpbWFyeSB2aW9sYXRpb25zIHNvIHdlIGNhbiBmbGlwIHNpZGVzXG4gICAgICAgIHRoaXMuY29udGVudE9mZnNldHMgPSBhbGlnbihmbGlwU2lkZXModGhpcy5wb3NpdGlvbiksIHRoaXMuY3VycmVudEFuY2hvckNvb3JkcywgdGhpcy5jdXJyZW50Q29udGVudENvb3Jkcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAwOiB7XG4gICAgICAgIC8vIEJPVFRPTSgwKSBpcyBhIHNlY29uZGFyeSB2aW9sYXRpb24gYW5kIHdlIG5lZWQgdG8gbnVkZ2UgY29udGVudCB1cFxuICAgICAgICB0aGlzLmNvbnRlbnRPZmZzZXRzID0gYWxpZ24oXG4gICAgICAgICAgbnVkZ2VDb250ZW50KHRoaXMucG9zaXRpb24sIHRydWUpLFxuICAgICAgICAgIHRoaXMuY3VycmVudEFuY2hvckNvb3JkcyxcbiAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZW50Q29vcmRzXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAzOiB7XG4gICAgICAgIC8vIFRPUCgzKSBpcyBhIHNlY29uZGFyeSB2aW9sYXRpb24gYW5kIHdlIG5lZWQgdG8gbnVkZ2UgY29udGVudCBkb3duXG4gICAgICAgIHRoaXMuY29udGVudE9mZnNldHMgPSBhbGlnbihudWRnZUNvbnRlbnQodGhpcy5wb3NpdGlvbiksIHRoaXMuY3VycmVudEFuY2hvckNvb3JkcywgdGhpcy5jdXJyZW50Q29udGVudENvb3Jkcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUhvcml6b250YWxBeGlzVHdvVmlvbGF0aW9ucyhlcnJvclN1bTogbnVtYmVyKTogdm9pZCB7XG4gICAgc3dpdGNoIChlcnJvclN1bSkge1xuICAgICAgY2FzZSA1OlxuICAgICAgY2FzZSA0OiB7XG4gICAgICAgIC8vIFRPUCgzKStMRUZUKDEpIGlzIGNhc2UgNC5cbiAgICAgICAgLy8gVE9QKDMpK1JJR0hUKDIpIGlzIGNhc2UgNS5cbiAgICAgICAgLy8gSW4gYm90aCBvZiB0aGVzZSBjYXNlcyB3ZSBuZWVkIHRvIGZsaXAgc2lkZXMgYW5kIG51ZGdlIGNvbnRlbnQgZG93blxuICAgICAgICBjb25zdCBmbGlwQW5kTnVkZ2VEb3duID0gZmxpcFNpZGVzQW5kTnVkZ2VDb250ZW50KGZsaXBTaWRlcywgbnVkZ2VDb250ZW50LCBmYWxzZSk7XG4gICAgICAgIHRoaXMuY29udGVudE9mZnNldHMgPSBhbGlnbihcbiAgICAgICAgICBmbGlwQW5kTnVkZ2VEb3duKHRoaXMucG9zaXRpb24pLFxuICAgICAgICAgIHRoaXMuY3VycmVudEFuY2hvckNvb3JkcyxcbiAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZW50Q29vcmRzXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAzOiB7XG4gICAgICAgIC8vIFRPUCgzKStCT1RUT00oMCkgfHwgbGVmdCgxKStSSUdIVCgyKSBpcyBjYXNlIDMuIFRoZXJlIGlzIG5vdGhpbmcgd2UgY2FuIGRvIHBvc2l0aW9uIHdpc2UgdG8gaW1wcm92ZSB0aGVcbiAgICAgICAgLy8gcGxhY2VtZW50IGZvciB0aGlzIGNvbnRlbnQuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAyOlxuICAgICAgY2FzZSAxOiB7XG4gICAgICAgIC8vIEJPVFRPTSgwKStSSUdIVCgyKSBpcyBjYXNlIDIuXG4gICAgICAgIC8vIEJPVFRPTSgwKStMRUZUKDEpIGlzIGNhc2UgMS5cbiAgICAgICAgLy8gSW4gYm90aCBjYXNlcyB3ZSAgbmVlZCB0byBmbGlwIHNpZGVzIGFuZCBudWRnZSBjb250ZW50IHVwXG4gICAgICAgIGNvbnN0IGZsaXBBbmROdWRnZVVwID0gZmxpcFNpZGVzQW5kTnVkZ2VDb250ZW50KGZsaXBTaWRlcywgbnVkZ2VDb250ZW50LCB0cnVlKTtcbiAgICAgICAgdGhpcy5jb250ZW50T2Zmc2V0cyA9IGFsaWduKGZsaXBBbmROdWRnZVVwKHRoaXMucG9zaXRpb24pLCB0aGlzLmN1cnJlbnRBbmNob3JDb29yZHMsIHRoaXMuY3VycmVudENvbnRlbnRDb29yZHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=