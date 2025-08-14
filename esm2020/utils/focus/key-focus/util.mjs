/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { IEKeys, Keys } from '../../enums/keys.enum';
export function normalizeKey(key) {
    if (key === Keys.ArrowUp || key === IEKeys.ArrowUp) {
        return Keys.ArrowUp;
    }
    else if (key === Keys.ArrowDown || key === IEKeys.ArrowDown) {
        return Keys.ArrowDown;
    }
    else if (key === Keys.ArrowRight || key === IEKeys.ArrowRight) {
        return Keys.ArrowRight;
    }
    else if (key === Keys.ArrowLeft || key === IEKeys.ArrowLeft) {
        return Keys.ArrowLeft;
    }
    else if (key === Keys.Space || key === IEKeys.Space) {
        return Keys.Space;
    }
    else if (key === Keys.Escape || key === IEKeys.Escape) {
        return Keys.Escape;
    }
    else {
        return key;
    }
}
export function preventArrowKeyScroll(event) {
    const key = normalizeKey(event.key);
    if (key === Keys.ArrowUp || key === Keys.ArrowDown || key === Keys.ArrowLeft || key === Keys.ArrowRight) {
        // prevent element container scroll
        // MDN references this is really the only way to prevent native browser interactions
        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
        event.preventDefault();
    }
}
export function isKeyEitherLetterOrNumber(event) {
    const char = event.key;
    // Only letter characters differ when they switch between lowercase and uppercase, whether it's an English or non-English letter.
    return char.toLowerCase() !== char.toUpperCase() || (char >= '0' && char <= '9');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2ZvY3VzL2tleS1mb2N1cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUVyRCxNQUFNLFVBQVUsWUFBWSxDQUFDLEdBQVc7SUFDdEMsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLE9BQU8sSUFBSSxHQUFHLEtBQUssTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNsRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7U0FBTSxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsS0FBSyxNQUFNLENBQUMsU0FBUyxFQUFFO1FBQzdELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUN2QjtTQUFNLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxVQUFVLElBQUksR0FBRyxLQUFLLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDL0QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0tBQ3hCO1NBQU0sSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLFNBQVMsSUFBSSxHQUFHLEtBQUssTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUM3RCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7S0FDdkI7U0FBTSxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ3JELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjtTQUFNLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDdkQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCO1NBQU07UUFDTCxPQUFPLEdBQUcsQ0FBQztLQUNaO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxLQUFvQjtJQUN4RCxNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXBDLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxPQUFPLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxTQUFTLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxTQUFTLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDdkcsbUNBQW1DO1FBQ25DLG9GQUFvRjtRQUNwRixtR0FBbUc7UUFDbkcsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSx5QkFBeUIsQ0FBQyxLQUFvQjtJQUM1RCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3ZCLGlJQUFpSTtJQUNqSSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNuRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJRUtleXMsIEtleXMgfSBmcm9tICcuLi8uLi9lbnVtcy9rZXlzLmVudW0nO1xuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplS2V5KGtleTogc3RyaW5nKSB7XG4gIGlmIChrZXkgPT09IEtleXMuQXJyb3dVcCB8fCBrZXkgPT09IElFS2V5cy5BcnJvd1VwKSB7XG4gICAgcmV0dXJuIEtleXMuQXJyb3dVcDtcbiAgfSBlbHNlIGlmIChrZXkgPT09IEtleXMuQXJyb3dEb3duIHx8IGtleSA9PT0gSUVLZXlzLkFycm93RG93bikge1xuICAgIHJldHVybiBLZXlzLkFycm93RG93bjtcbiAgfSBlbHNlIGlmIChrZXkgPT09IEtleXMuQXJyb3dSaWdodCB8fCBrZXkgPT09IElFS2V5cy5BcnJvd1JpZ2h0KSB7XG4gICAgcmV0dXJuIEtleXMuQXJyb3dSaWdodDtcbiAgfSBlbHNlIGlmIChrZXkgPT09IEtleXMuQXJyb3dMZWZ0IHx8IGtleSA9PT0gSUVLZXlzLkFycm93TGVmdCkge1xuICAgIHJldHVybiBLZXlzLkFycm93TGVmdDtcbiAgfSBlbHNlIGlmIChrZXkgPT09IEtleXMuU3BhY2UgfHwga2V5ID09PSBJRUtleXMuU3BhY2UpIHtcbiAgICByZXR1cm4gS2V5cy5TcGFjZTtcbiAgfSBlbHNlIGlmIChrZXkgPT09IEtleXMuRXNjYXBlIHx8IGtleSA9PT0gSUVLZXlzLkVzY2FwZSkge1xuICAgIHJldHVybiBLZXlzLkVzY2FwZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ga2V5O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmV2ZW50QXJyb3dLZXlTY3JvbGwoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgY29uc3Qga2V5ID0gbm9ybWFsaXplS2V5KGV2ZW50LmtleSk7XG5cbiAgaWYgKGtleSA9PT0gS2V5cy5BcnJvd1VwIHx8IGtleSA9PT0gS2V5cy5BcnJvd0Rvd24gfHwga2V5ID09PSBLZXlzLkFycm93TGVmdCB8fCBrZXkgPT09IEtleXMuQXJyb3dSaWdodCkge1xuICAgIC8vIHByZXZlbnQgZWxlbWVudCBjb250YWluZXIgc2Nyb2xsXG4gICAgLy8gTUROIHJlZmVyZW5jZXMgdGhpcyBpcyByZWFsbHkgdGhlIG9ubHkgd2F5IHRvIHByZXZlbnQgbmF0aXZlIGJyb3dzZXIgaW50ZXJhY3Rpb25zXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQWNjZXNzaWJpbGl0eS9LZXlib2FyZC1uYXZpZ2FibGVfSmF2YVNjcmlwdF93aWRnZXRzXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNLZXlFaXRoZXJMZXR0ZXJPck51bWJlcihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICBjb25zdCBjaGFyID0gZXZlbnQua2V5O1xuICAvLyBPbmx5IGxldHRlciBjaGFyYWN0ZXJzIGRpZmZlciB3aGVuIHRoZXkgc3dpdGNoIGJldHdlZW4gbG93ZXJjYXNlIGFuZCB1cHBlcmNhc2UsIHdoZXRoZXIgaXQncyBhbiBFbmdsaXNoIG9yIG5vbi1FbmdsaXNoIGxldHRlci5cbiAgcmV0dXJuIGNoYXIudG9Mb3dlckNhc2UoKSAhPT0gY2hhci50b1VwcGVyQ2FzZSgpIHx8IChjaGFyID49ICcwJyAmJiBjaGFyIDw9ICc5Jyk7XG59XG4iXX0=