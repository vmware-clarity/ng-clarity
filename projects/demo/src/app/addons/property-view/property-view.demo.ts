/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AppfxPropertyViewModule,
  PropertyViewBuilder,
  PropertyViewCategoryBuilder,
  PropertyViewModel,
  PropertyViewSectionBuilder,
} from '@clr/addons/property-view';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'clr-property-view-demo',
  standalone: true,
  imports: [CommonModule, AppfxPropertyViewModule, ClarityModule, FormsModule],
  templateUrl: './property-view.demo.html',
})
export class PropertyViewDemo implements OnInit {
  interactiveData: PropertyViewModel;
  collapsedSection = false;
  renderTitleAsHtml = false;

  private readonly propertyViewBuilder = new PropertyViewBuilder();
  private lionSection: PropertyViewSectionBuilder;
  private newSectionId = 0;
  private newCategoryId = 0;

  ngOnInit(): void {
    this.initModel();
  }

  addSection(): void {
    let animalsCategoryBuilder: PropertyViewCategoryBuilder | null = this.propertyViewBuilder.getCategory('animals');
    if (!animalsCategoryBuilder) {
      animalsCategoryBuilder = this.propertyViewBuilder.category('animals').title('Animals');
    }
    animalsCategoryBuilder
      .section(this.newSectionId.toString())
      .title('New Section')
      .info('There is no information about the new section.');
    this.newSectionId++;
    this.interactiveData = this.propertyViewBuilder.build();
  }

  addCategory(): void {
    const newCategoryBuilder = this.propertyViewBuilder.category(this.newCategoryId.toString()).title('New Category');
    newCategoryBuilder
      .section(this.newSectionId.toString())
      .title('New Section')
      .info('There is no information about the new section.');
    this.newSectionId++;
    this.newCategoryId++;
    this.interactiveData = this.propertyViewBuilder.build();
  }

  addProperty(): void {
    this.lionSection.property('New Property', 'New Value');
    this.interactiveData = this.propertyViewBuilder.build();
  }

  addPlainMessage(): void {
    this.lionSection.messageBuilder().text('<strong>There is the new message.</strong>');
    this.interactiveData = this.propertyViewBuilder.build();
  }

  addHtmlRenderedMessage(): void {
    this.lionSection.messageBuilder().text('<strong>There is the new message.</strong>').renderAsHtml(true);
    this.interactiveData = this.propertyViewBuilder.build();
  }

  showSectionActionBar(): void {
    if (this.lionSection.getActions().length) {
      return;
    }
    this.lionSection.action({
      title: 'first-action',
      isEnabled: true,
      clickHandler: () => alert('This is the first action'),
    });
    this.lionSection.action({
      title: 'second-action',
      isEnabled: true,
      clickHandler: () => alert('This is the second choice action'),
    });
    this.interactiveData = this.propertyViewBuilder.build();
  }

  renderSectionTitleAsHtml(): void {
    this.lionSection.renderAsHtml(this.renderTitleAsHtml);
    this.interactiveData = this.propertyViewBuilder.build();
  }

  collapseSection(): void {
    this.lionSection.collapseContent(this.collapsedSection);
    this.interactiveData = this.propertyViewBuilder.build();
  }

  private initModel(): void {
    const animalsCategoryBuilder = this.propertyViewBuilder.category('animals').title('Animals');

    animalsCategoryBuilder
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

    animalsCategoryBuilder
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

    const fishCategoryBuilder = this.propertyViewBuilder.category('fishes').title('Fishes');
    fishCategoryBuilder
      .section('shark')
      .title('Shark')
      .property('Type', 'Predator')
      .property('Color', 'Grey')
      .property('Characteristics', ['Ferocious', 'Strong']);

    this.lionSection = animalsCategoryBuilder.section('lion');
    this.lionSection.title('<span>Lion</span>');
    this.interactiveData = this.propertyViewBuilder.build();
  }
}
