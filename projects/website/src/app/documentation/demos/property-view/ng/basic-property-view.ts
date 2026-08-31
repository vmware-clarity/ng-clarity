/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { AppfxPropertyViewModule, PropertyViewBuilder, PropertyViewModel } from '@clr/addons/property-view';

@Component({
  selector: 'clr-basic-property-view-demo',
  standalone: true,
  imports: [AppfxPropertyViewModule],
  templateUrl: 'basic-property-view.html',
})
export class BasicPropertyViewDemoComponent implements OnInit {
  data: PropertyViewModel;

  ngOnInit(): void {
    const builder = new PropertyViewBuilder();

    const animalsBuilder = builder.category('animals').title('Animals');
    animalsBuilder
      .section('lion')
      .title('Lion')
      .property('Type', 'Mammal')
      .property('Color', 'Yellow')
      .property('Characteristics', ['Ferocious', 'Strong'])
      .propertyBuilder()
      .keyBuilder()
      .text('Wikipedia')
      .exit()
      .valueBuilder()
      .text('Lion')
      .link({ clickHandler: () => window.open('https://en.wikipedia.org/wiki/Lion', '_blank', 'noopener') })
      .exit()
      .exit();

    animalsBuilder
      .section('penguin')
      .title('Penguin')
      .property('Type', 'Bird')
      .property('Color', ['Black', 'White'])
      .propertyBuilder()
      .keyBuilder()
      .text('Characteristics')
      .exit()
      .valueBuilder()
      .text('Fast swimmer')
      .exit()
      .valueBuilder()
      .text('Eats fish')
      .exit()
      .exit();

    const fishBuilder = builder.category('fishes').title('Fishes');
    fishBuilder
      .section('shark')
      .title('Shark')
      .property('Type', 'Predator')
      .property('Color', 'Grey')
      .property('Characteristics', ['Ferocious', 'Strong']);

    this.data = builder.build();
  }
}
