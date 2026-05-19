/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ClrAlignment } from './enums/alignment.enum';
import { ClrViewportViolation } from './enums/viewport-violation.enum';
export const flipSides = position => {
    return {
        ...position,
        side: -1 * position.side,
    };
};
// This could be used in more advanced positioning algorithms.
// flipAxisFlipSideAndNudgeContent(flipAxis, flipSide, nudge, nudgeForward?): ClrTransform {...}
// I would like to keep it for now.
export const flipAxis = position => {
    return {
        ...position,
        axis: position.axis === 0 ? 1 : 0,
    };
};
export const nudgeContent = (position, forward) => {
    const nextAlignment = position.content + (forward ? 0.5 : -0.5);
    if (nextAlignment < 0 || nextAlignment > 1) {
        return position;
    }
    else {
        return {
            ...position,
            content: nextAlignment,
        };
    }
};
export function flipSidesAndNudgeContent(flip, nudge, nudgeBack) {
    return (position) => nudge(flip(position), nudgeBack);
}
export function align(position, anchor, content) {
    let xDiff = anchor.left;
    let yDiff = anchor.top;
    // When ClrAxis is VERTICAL BEFORE = left, AFTER = right
    // When ClrAxis is HORIZONTAL BEFORE is top, AFTER is bottom
    switch (position.axis + position.side) {
        case -1: {
            // ClrAxis.VERTICAL + ClrSide.BEFORE
            xDiff += alignHorizontal(position, anchor, content);
            yDiff -= content.height; // pull content up to the top of the anchor
            break;
        }
        case 1: {
            // ClrAxis.VERTICAL + ClrSide.AFTER
            xDiff += alignHorizontal(position, anchor, content);
            yDiff += anchor.height; // push the content down to below the anchor
            break;
        }
        case 0: {
            // ClrAxis.HORIZONTAL + ClrSide.BEFORE
            xDiff -= content.width; // pull the content left of the anchor
            yDiff += alignVertical(position, anchor, content);
            break;
        }
        case 2: {
            // ClrAxis.HORIZONTAL + ClrSide.AFTER
            xDiff += anchor.width; // push the content right of of the anchor
            yDiff += alignVertical(position, anchor, content);
            break;
        }
        default: {
            break;
        }
    }
    return { xOffset: xDiff, yOffset: yDiff };
}
function alignHorizontal(position, anchor, content) {
    let horizontalOffset = 0;
    // horizontal offset for the anchor position
    switch (position.anchor /*calculate for the anchor alignment*/) {
        case ClrAlignment.START: {
            // nothing to calculate here
            break;
        }
        case ClrAlignment.CENTER: {
            horizontalOffset += anchor.width / 2; // push content over 1/2 anchor width
            break;
        }
        case ClrAlignment.END: {
            horizontalOffset += anchor.width; //  push content over width of the anchor
            break;
        }
        default: {
            break;
        }
    }
    // horizontal offsets for anchor alignment
    switch (position.content // calculate for the content alignment
    ) {
        case ClrAlignment.START: {
            // Nothing to calculate here
            break;
        }
        case ClrAlignment.CENTER: {
            horizontalOffset -= content.width / 2; // pull content left by a value of 1/2 content width
            break;
        }
        case ClrAlignment.END: {
            // subtract the width of currentContent from horizontalOffset to pull it back
            horizontalOffset -= content.width;
            break;
        }
        default: {
            break;
        }
    }
    return horizontalOffset;
}
function alignVertical(position, anchor, content) {
    // y axis offsets for anchor alignment
    let verticalOffset = 0;
    // Calculate y offset for anchor position
    switch (position.anchor) {
        case ClrAlignment.START: {
            // nothing to calculate here
            break;
        }
        case ClrAlignment.CENTER: {
            verticalOffset += anchor.height / 2; // push content down to the middle of the anchor rect
            break;
        }
        case ClrAlignment.END: {
            verticalOffset += anchor.height; // push content down to the bottom of the anchor
            break;
        }
        default: {
            break;
        }
    }
    // Calculate y offsets for content alignment
    switch (position.content) {
        case ClrAlignment.START: {
            // aligned to the top of the content rect
            break;
        }
        case ClrAlignment.CENTER: {
            verticalOffset -= content.height / 2; // pull content back up to the middle of the content rect
            break;
        }
        case ClrAlignment.END: {
            verticalOffset -= content.height; // pull content back up to the bottom of the content rect
            break;
        }
        default: {
            break;
        }
    }
    return verticalOffset;
}
export function testVisibility(offset, content) {
    const violations = [];
    const mockCoords = {
        bottom: offset.yOffset + content.height,
        left: offset.xOffset,
        right: offset.xOffset + content.width,
        top: offset.yOffset,
    };
    if (!(mockCoords.top >= 0)) {
        violations.push(ClrViewportViolation.TOP);
    }
    if (!(mockCoords.left >= 0)) {
        violations.push(ClrViewportViolation.LEFT);
    }
    if (!(mockCoords.bottom <= (window.innerHeight || document.documentElement.clientHeight))) {
        violations.push(ClrViewportViolation.BOTTOM);
    }
    if (!(mockCoords.right <= (window.innerWidth || document.documentElement.clientWidth))) {
        violations.push(ClrViewportViolation.RIGHT);
    }
    return violations;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb24tb3BlcmF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvcG9wb3Zlci9wb3NpdGlvbi1vcGVyYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFRdkUsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFpQixRQUFRLENBQUMsRUFBRTtJQUNoRCxPQUFPO1FBQ0wsR0FBRyxRQUFRO1FBQ1gsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJO0tBQ3pCLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRiw4REFBOEQ7QUFDOUQsZ0dBQWdHO0FBQ2hHLG1DQUFtQztBQUNuQyxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQWlCLFFBQVEsQ0FBQyxFQUFFO0lBQy9DLE9BQU87UUFDTCxHQUFHLFFBQVE7UUFDWCxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFpQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUM5RCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEUsSUFBSSxhQUFhLEdBQUcsQ0FBQyxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUU7UUFDMUMsT0FBTyxRQUFRLENBQUM7S0FDakI7U0FBTTtRQUNMLE9BQU87WUFDTCxHQUFH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QyxVQUFVLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFO1FBQ3RGLFVBQVUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0M7SUFFRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDbHJBbGlnbm1lbnQgfSBmcm9tICcuL2VudW1zL2FsaWdubWVudC5lbnVtJztcbmltcG9ydCB7IENsclZpZXdwb3J0VmlvbGF0aW9uIH0gZnJvbSAnLi9lbnVtcy92aWV3cG9ydC12aW9sYXRpb24uZW51bSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyQ29udGVudE9mZnNldCB9IGZyb20gJy4vaW50ZXJmYWNlcy9wb3BvdmVyLWNvbnRlbnQtb2Zmc2V0LmludGVyZmFjZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyUG9zaXRpb24gfSBmcm9tICcuL2ludGVyZmFjZXMvcG9wb3Zlci1wb3NpdGlvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ2xyVmlzaWJpbGl0eUNvb3JkcyB9IGZyb20gJy4vaW50ZXJmYWNlcy92aXNpYmlsaXR5LWNvb3Jkcy5pbnRlcmZhY2UnO1xuXG4vLyBQdXQgdGhlIGZvcndhcmQgYXJnIGhlcmUgYnV0IGl0IGlzIG9ubHkgbmVlZGVkIHdoZW4gbnVkZ2luZyBjb250ZW50IG9yIGFuY2hvcnMuXG5leHBvcnQgdHlwZSBDbHJUcmFuc2Zvcm0gPSAocG9zaXRpb246IENsclBvcG92ZXJQb3NpdGlvbiwgYmFjaz86IGJvb2xlYW4pID0+IENsclBvcG92ZXJQb3NpdGlvbjtcblxuZXhwb3J0IGNvbnN0IGZsaXBTaWRlczogQ2xyVHJhbnNmb3JtID0gcG9zaXRpb24gPT4ge1xuICByZXR1cm4ge1xuICAgIC4uLnBvc2l0aW9uLFxuICAgIHNpZGU6IC0xICogcG9zaXRpb24uc2lkZSxcbiAgfTtcbn07XG5cbi8vIFRoaXMgY291bGQgYmUgdXNlZCBpbiBtb3JlIGFkdmFuY2VkIHBvc2l0aW9uaW5nIGFsZ29yaXRobXMuXG4vLyBmbGlwQXhpc0ZsaXBTaWRlQW5kTnVkZ2VDb250ZW50KGZsaXBBeGlzLCBmbGlwU2lkZSwgbnVkZ2UsIG51ZGdlRm9yd2FyZD8pOiBDbHJUcmFuc2Zvcm0gey4uLn1cbi8vIEkgd291bGQgbGlrZSB0byBrZWVwIGl0IGZvciBub3cuXG5leHBvcnQgY29uc3QgZmxpcEF4aXM6IENsclRyYW5zZm9ybSA9IHBvc2l0aW9uID0+IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5wb3NpdGlvbixcbiAgICBheGlzOiBwb3NpdGlvbi5heGlzID09PSAwID8gMSA6IDAsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgbnVkZ2VDb250ZW50OiBDbHJUcmFuc2Zvcm0gPSAocG9zaXRpb24sIGZvcndhcmQpID0+IHtcbiAgY29uc3QgbmV4dEFsaWdubWVudCA9IHBvc2l0aW9uLmNvbnRlbnQgKyAoZm9yd2FyZCA/IDAuNSA6IC0wLjUpO1xuICBpZiAobmV4dEFsaWdubWVudCA8IDAgfHwgbmV4dEFsaWdubWVudCA+IDEpIHtcbiAgICByZXR1cm4gcG9zaXRpb247XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnBvc2l0aW9uLFxuICAgICAgY29udGVudDogbmV4dEFsaWdubWVudCxcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZmxpcFNpZGVzQW5kTnVkZ2VDb250ZW50KGZsaXA6IENsclRyYW5zZm9ybSwgbnVkZ2U6IENsclRyYW5zZm9ybSwgbnVkZ2VCYWNrPzogYm9vbGVhbik6IENsclRyYW5zZm9ybSB7XG4gIHJldHVybiAocG9zaXRpb246IENsclBvcG92ZXJQb3NpdGlvbik6IENsclBvcG92ZXJQb3NpdGlvbiA9PiBudWRnZShmbGlwKHBvc2l0aW9uKSwgbnVkZ2VCYWNrKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsaWduKHBvc2l0aW9uOiBDbHJQb3BvdmVyUG9zaXRpb24sIGFuY2hvcjogQ2xpZW50UmVjdCwgY29udGVudDogQ2xpZW50UmVjdCk6IENsclBvcG92ZXJDb250ZW50T2Zmc2V0IHtcbiAgbGV0IHhEaWZmID0gYW5jaG9yLmxlZnQ7XG4gIGxldCB5RGlmZiA9IGFuY2hvci50b3A7XG5cbiAgLy8gV2hlbiBDbHJBeGlzIGlzIFZFUlRJQ0FMIEJFRk9SRSA9IGxlZnQsIEFGVEVSID0gcmlnaHRcbiAgLy8gV2hlbiBDbHJBeGlzIGlzIEhPUklaT05UQUwgQkVGT1JFIGlzIHRvcCwgQUZURVIgaXMgYm90dG9tXG4gIHN3aXRjaCAocG9zaXRpb24uYXhpcyArIHBvc2l0aW9uLnNpZGUpIHtcbiAgICBjYXNlIC0xOiB7XG4gICAgICAvLyBDbHJBeGlzLlZFUlRJQ0FMICsgQ2xyU2lkZS5CRUZPUkVcbiAgICAgIHhEaWZmICs9IGFsaWduSG9yaXpvbnRhbChwb3NpdGlvbiwgYW5jaG9yLCBjb250ZW50KTtcbiAgICAgIHlEaWZmIC09IGNvbnRlbnQuaGVpZ2h0OyAvLyBwdWxsIGNvbnRlbnQgdXAgdG8gdGhlIHRvcCBvZiB0aGUgYW5jaG9yXG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAxOiB7XG4gICAgICAvLyBDbHJBeGlzLlZFUlRJQ0FMICsgQ2xyU2lkZS5BRlRFUlxuICAgICAgeERpZmYgKz0gYWxpZ25Ib3Jpem9udGFsKHBvc2l0aW9uLCBhbmNob3IsIGNvbnRlbnQpO1xuICAgICAgeURpZmYgKz0gYW5jaG9yLmhlaWdodDsgLy8gcHVzaCB0aGUgY29udGVudCBkb3duIHRvIGJlbG93IHRoZSBhbmNob3JcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIDA6IHtcbiAgICAgIC8vIENsckF4aXMuSE9SSVpPTlRBTCArIENsclNpZGUuQkVGT1JFXG4gICAgICB4RGlmZiAtPSBjb250ZW50LndpZHRoOyAvLyBwdWxsIHRoZSBjb250ZW50IGxlZnQgb2YgdGhlIGFuY2hvclxuICAgICAgeURpZmYgKz0gYWxpZ25WZXJ0aWNhbChwb3NpdGlvbiwgYW5jaG9yLCBjb250ZW50KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIDI6IHtcbiAgICAgIC8vIENsckF4aXMuSE9SSVpPTlRBTCArIENsclNpZGUuQUZURVJcbiAgICAgIHhEaWZmICs9IGFuY2hvci53aWR0aDsgLy8gcHVzaCB0aGUgY29udGVudCByaWdodCBvZiBvZiB0aGUgYW5jaG9yXG4gICAgICB5RGlmZiArPSBhbGlnblZlcnRpY2FsKHBvc2l0aW9uLCBhbmNob3IsIGNvbnRlbnQpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyB4T2Zmc2V0OiB4RGlmZiwgeU9mZnNldDogeURpZmYgfTtcbn1cblxuZnVuY3Rpb24gYWxpZ25Ib3Jpem9udGFsKHBvc2l0aW9uOiBDbHJQb3BvdmVyUG9zaXRpb24sIGFuY2hvcjogQ2xpZW50UmVjdCwgY29udGVudDogQ2xpZW50UmVjdCk6IG51bWJlciB7XG4gIGxldCBob3Jpem9udGFsT2Zmc2V0ID0gMDtcbiAgLy8gaG9yaXpvbnRhbCBvZmZzZXQgZm9yIHRoZSBhbmNob3IgcG9zaXRpb25cbiAgc3dpdGNoIChwb3NpdGlvbi5hbmNob3IgLypjYWxjdWxhdGUgZm9yIHRoZSBhbmNob3IgYWxpZ25tZW50Ki8pIHtcbiAgICBjYXNlIENsckFsaWdubWVudC5TVEFSVDoge1xuICAgICAgLy8gbm90aGluZyB0byBjYWxjdWxhdGUgaGVyZVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2xyQWxpZ25tZW50LkNFTlRFUjoge1xuICAgICAgaG9yaXpvbnRhbE9mZnNldCArPSBhbmNob3Iud2lkdGggLyAyOyAvLyBwdXNoIGNvbnRlbnQgb3ZlciAxLzIgYW5jaG9yIHdpZHRoXG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDbHJBbGlnbm1lbnQuRU5EOiB7XG4gICAgICBob3Jpem9udGFsT2Zmc2V0ICs9IGFuY2hvci53aWR0aDsgLy8gIHB1c2ggY29udGVudCBvdmVyIHdpZHRoIG9mIHRoZSBhbmNob3JcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBob3Jpem9udGFsIG9mZnNldHMgZm9yIGFuY2hvciBhbGlnbm1lbnRcbiAgc3dpdGNoIChcbiAgICBwb3NpdGlvbi5jb250ZW50IC8vIGNhbGN1bGF0ZSBmb3IgdGhlIGNvbnRlbnQgYWxpZ25tZW50XG4gICkge1xuICAgIGNhc2UgQ2xyQWxpZ25tZW50LlNUQVJUOiB7XG4gICAgICAvLyBOb3RoaW5nIHRvIGNhbGN1bGF0ZSBoZXJlXG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDbHJBbGlnbm1lbnQuQ0VOVEVSOiB7XG4gICAgICBob3Jpem9udGFsT2Zmc2V0IC09IGNvbnRlbnQud2lkdGggLyAyOyAvLyBwdWxsIGNvbnRlbnQgbGVmdCBieSBhIHZhbHVlIG9mIDEvMiBjb250ZW50IHdpZHRoXG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDbHJBbGlnbm1lbnQuRU5EOiB7XG4gICAgICAvLyBzdWJ0cmFjdCB0aGUgd2lkdGggb2YgY3VycmVudENvbnRlbnQgZnJvbSBob3Jpem9udGFsT2Zmc2V0IHRvIHB1bGwgaXQgYmFja1xuICAgICAgaG9yaXpvbnRhbE9mZnNldCAtPSBjb250ZW50LndpZHRoO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBob3Jpem9udGFsT2Zmc2V0O1xufVxuXG5mdW5jdGlvbiBhbGlnblZlcnRpY2FsKHBvc2l0aW9uOiBDbHJQb3BvdmVyUG9zaXRpb24sIGFuY2hvcjogQ2xpZW50UmVjdCwgY29udGVudDogQ2xpZW50UmVjdCk6IG51bWJlciB7XG4gIC8vIHkgYXhpcyBvZmZzZXRzIGZvciBhbmNob3IgYWxpZ25tZW50XG4gIGxldCB2ZXJ0aWNhbE9mZnNldCA9IDA7XG5cbiAgLy8gQ2FsY3VsYXRlIHkgb2Zmc2V0IGZvciBhbmNob3IgcG9zaXRpb25cbiAgc3dpdGNoIChwb3NpdGlvbi5hbmNob3IpIHtcbiAgICBjYXNlIENsckFsaWdubWVudC5TVEFSVDoge1xuICAgICAgLy8gbm90aGluZyB0byBjYWxjdWxhdGUgaGVyZVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgQ2xyQWxpZ25tZW50LkNFTlRFUjoge1xuICAgICAgdmVydGljYWxPZmZzZXQgKz0gYW5jaG9yLmhlaWdodCAvIDI7IC8vIHB1c2ggY29udGVudCBkb3duIHRvIHRoZSBtaWRkbGUgb2YgdGhlIGFuY2hvciByZWN0XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDbHJBbGlnbm1lbnQuRU5EOiB7XG4gICAgICB2ZXJ0aWNhbE9mZnNldCArPSBhbmNob3IuaGVpZ2h0OyAvLyBwdXNoIGNvbnRlbnQgZG93biB0byB0aGUgYm90dG9tIG9mIHRoZSBhbmNob3JcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBDYWxjdWxhdGUgeSBvZmZzZXRzIGZvciBjb250ZW50IGFsaWdubWVudFxuICBzd2l0Y2ggKHBvc2l0aW9uLmNvbnRlbnQpIHtcbiAgICBjYXNlIENsckFsaWdubWVudC5TVEFSVDoge1xuICAgICAgLy8gYWxpZ25lZCB0byB0aGUgdG9wIG9mIHRoZSBjb250ZW50IHJlY3RcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIENsckFsaWdubWVudC5DRU5URVI6IHtcbiAgICAgIHZlcnRpY2FsT2Zmc2V0IC09IGNvbnRlbnQuaGVpZ2h0IC8gMjsgLy8gcHVsbCBjb250ZW50IGJhY2sgdXAgdG8gdGhlIG1pZGRsZSBvZiB0aGUgY29udGVudCByZWN0XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBDbHJBbGlnbm1lbnQuRU5EOiB7XG4gICAgICB2ZXJ0aWNhbE9mZnNldCAtPSBjb250ZW50LmhlaWdodDsgLy8gcHVsbCBjb250ZW50IGJhY2sgdXAgdG8gdGhlIGJvdHRvbSBvZiB0aGUgY29udGVudCByZWN0XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB2ZXJ0aWNhbE9mZnNldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RWaXNpYmlsaXR5KG9mZnNldDogQ2xyUG9wb3ZlckNvbnRlbnRPZmZzZXQsIGNvbnRlbnQ6IENsaWVudFJlY3QpOiBDbHJWaWV3cG9ydFZpb2xhdGlvbltdIHtcbiAgY29uc3QgdmlvbGF0aW9uczogQ2xyVmlld3BvcnRWaW9sYXRpb25bXSA9IFtdO1xuICBjb25zdCBtb2NrQ29vcmRzOiBDbHJWaXNpYmlsaXR5Q29vcmRzID0ge1xuICAgIGJvdHRvbTogb2Zmc2V0LnlPZmZzZXQgKyBjb250ZW50LmhlaWdodCxcbiAgICBsZWZ0OiBvZmZzZXQueE9mZnNldCxcbiAgICByaWdodDogb2Zmc2V0LnhPZmZzZXQgKyBjb250ZW50LndpZHRoLFxuICAgIHRvcDogb2Zmc2V0LnlPZmZzZXQsXG4gIH07XG5cbiAgaWYgKCEobW9ja0Nvb3Jkcy50b3AgPj0gMCkpIHtcbiAgICB2aW9sYXRpb25zLnB1c2goQ2xyVmlld3BvcnRWaW9sYXRpb24uVE9QKTtcbiAgfVxuICBpZiAoIShtb2NrQ29vcmRzLmxlZnQgPj0gMCkpIHtcbiAgICB2aW9sYXRpb25zLnB1c2goQ2xyVmlld3BvcnRWaW9sYXRpb24uTEVGVCk7XG4gIH1cbiAgaWYgKCEobW9ja0Nvb3Jkcy5ib3R0b20gPD0gKHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSkpIHtcbiAgICB2aW9sYXRpb25zLnB1c2goQ2xyVmlld3BvcnRWaW9sYXRpb24uQk9UVE9NKTtcbiAgfVxuICBpZiAoIShtb2NrQ29vcmRzLnJpZ2h0IDw9ICh3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpKSkge1xuICAgIHZpb2xhdGlvbnMucHVzaChDbHJWaWV3cG9ydFZpb2xhdGlvbi5SSUdIVCk7XG4gIH1cblxuICByZXR1cm4gdmlvbGF0aW9ucztcbn1cbiJdfQ==