/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
export function isBooleanAttributeSet(value) {
    // for null just return false no need to check anything
    if (value === null) {
        return false;
    }
    if (typeof value === 'string') {
        // Empty string is valid, 'true' as string is also valid
        return value.length >= 0;
    }
    // Boolean value will be read as it is, everything else is false
    return typeof value === 'boolean' ? value : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtYm9vbGVhbi1hdHRyaWJ1dGUtc2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvY29tcG9uZW50L2lzLWJvb2xlYW4tYXR0cmlidXRlLXNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxLQUF1QjtJQUMzRCx1REFBdUQ7SUFDdkQsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1FBQ2xCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUM3Qix3REFBd0Q7UUFDeEQsT0FBTyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztLQUMxQjtJQUNELGdFQUFnRTtJQUNoRSxPQUFPLE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDcEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm9vbGVhbkF0dHJpYnV0ZVNldCh2YWx1ZTogc3RyaW5nIHwgYm9vbGVhbik6IGJvb2xlYW4ge1xuICAvLyBmb3IgbnVsbCBqdXN0IHJldHVybiBmYWxzZSBubyBuZWVkIHRvIGNoZWNrIGFueXRoaW5nXG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIC8vIEVtcHR5IHN0cmluZyBpcyB2YWxpZCwgJ3RydWUnIGFzIHN0cmluZyBpcyBhbHNvIHZhbGlkXG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSAwO1xuICB9XG4gIC8vIEJvb2xlYW4gdmFsdWUgd2lsbCBiZSByZWFkIGFzIGl0IGlzLCBldmVyeXRoaW5nIGVsc2UgaXMgZmFsc2VcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nID8gdmFsdWUgOiBmYWxzZTtcbn1cbiJdfQ==