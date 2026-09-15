/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClrTabLink } from '@clr/angular/layout/tabs';

import { RenderAsButtonDirective } from './render-as-button.directive';

describe('RenderAsButtonDirective', () => {
  let directive: RenderAsButtonDirective;
  let mockElementRef: ElementRef;
  let mockRenderer: Renderer2;
  let mockClrTabLink: ClrTabLink;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: Renderer2, useValue: { addClass: () => {}, removeClass: () => {} } },
        { provide: ClrTabLink, useValue: { inOverflow: false } },
        RenderAsButtonDirective,
      ],
    });

    mockElementRef = TestBed.inject(ElementRef);
    mockRenderer = TestBed.inject(Renderer2);
    mockClrTabLink = TestBed.inject(ClrTabLink);
    directive = new RenderAsButtonDirective(mockClrTabLink, mockRenderer, mockElementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should toggle classes based on renderAsButton value', () => {
    const testElement = mockElementRef.nativeElement;
    spyOn(mockRenderer, 'addClass');
    spyOn(mockRenderer, 'removeClass');

    directive.renderAsButton = true;
    directive.ngOnChanges();
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(testElement, 'nav-link');
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(testElement, 'btn-link');

    directive.renderAsButton = false;
    directive.ngOnChanges();
    expect(mockRenderer.addClass).toHaveBeenCalledWith(testElement, 'nav-link');
    expect(mockRenderer.addClass).toHaveBeenCalledWith(testElement, 'btn-link');
  });

  it('should not modify classes if in overflow', () => {
    spyOn(mockRenderer, 'addClass');
    spyOn(mockRenderer, 'removeClass');

    mockClrTabLink.inOverflow = true;

    directive.renderAsButton = true;
    directive.ngOnChanges();
    expect(mockRenderer.addClass).not.toHaveBeenCalled();
    expect(mockRenderer.removeClass).not.toHaveBeenCalled();
  });

  it('should handle the case when the element is not found', () => {
    const mockInvalidElementRef = new ElementRef(null);
    const directiveWithInvalidRef = new RenderAsButtonDirective(mockClrTabLink, mockRenderer, mockInvalidElementRef);

    spyOn(console, 'error');
    directiveWithInvalidRef.ngOnChanges();
    expect(console.error).toHaveBeenCalledWith('RenderAsButtonDirective: Unable to find the element');
  });

  it('should not modify classes if renderAsButton value does not change', () => {
    spyOn(mockRenderer, 'addClass');
    spyOn(mockRenderer, 'removeClass');

    directive.renderAsButton = false;
    directive.ngOnChanges(); // First call to set initial state
    directive.ngOnChanges(); // Second call without changing renderAsButton value

    expect(mockRenderer.removeClass).not.toHaveBeenCalled();
  });
});
