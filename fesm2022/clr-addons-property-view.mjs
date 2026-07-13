import * as i0 from '@angular/core';
import { Injectable, Input, Component, HostBinding, Optional, EventEmitter, Output, ViewChildren, SkipSelf, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2$1 from '@clr/angular/popover/dropdown';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';
import * as i3$1 from '@clr/angular/popover/common';
import * as i4 from '@clr/angular/icon';
import { ClarityIcons, angleIcon } from '@clr/angular/icon';
import * as i2 from '@clr/addons/a11y';
import { ZoomLevel } from '@clr/addons/a11y';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var PropertyViewModelType;
(function (PropertyViewModelType) {
    PropertyViewModelType["Message"] = "Message";
    PropertyViewModelType["PropertyValue"] = "PropertyValue";
    PropertyViewModelType["PropertyKey"] = "PropertyKey";
    PropertyViewModelType["Property"] = "Property";
    PropertyViewModelType["Section"] = "Section";
    PropertyViewModelType["Category"] = "Category";
    PropertyViewModelType["PropertyValueComponent"] = "PropertyValueComponent";
})(PropertyViewModelType || (PropertyViewModelType = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/* eslint-disable @typescript-eslint/parameter-properties */
class PropertyViewMessageBuilder {
    #text;
    #icon;
    #renderAsHtml;
    constructor(parent) {
        this.parent = parent;
        this.#text = null;
        this.#icon = null;
        this.#renderAsHtml = false;
    }
    text(value) {
        this.#text = value;
        return this;
    }
    icon(value) {
        this.#icon = value;
        return this;
    }
    renderAsHtml(value) {
        this.#renderAsHtml = value;
        return this;
    }
    build() {
        return {
            type: PropertyViewModelType.Message,
            text: this.#text,
            icon: this.#icon,
            renderAsHtml: this.#renderAsHtml,
        };
    }
    clone(parentClone) {
        const result = new PropertyViewMessageBuilder(parentClone);
        result.#text = this.#text;
        result.#icon = this.#icon;
        result.#renderAsHtml = this.#renderAsHtml;
        return result;
    }
    exit() {
        return this.parent;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/* eslint-disable @typescript-eslint/parameter-properties */
class PropertyViewPropertyKeyBuilder {
    #text;
    #icon;
    constructor(parent) {
        this.parent = parent;
        this.#text = null;
        this.#icon = null;
    }
    text(value) {
        this.#text = value;
        return this;
    }
    icon(value) {
        this.#icon = value;
        return this;
    }
    build() {
        return {
            type: PropertyViewModelType.PropertyKey,
            text: this.#text,
            icon: this.#icon,
        };
    }
    clone(parentClone) {
        const result = new PropertyViewPropertyKeyBuilder(parentClone);
        result.#text = this.#text;
        result.#icon = this.#icon;
        return result;
    }
    exit() {
        return this.parent;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/* eslint-disable @typescript-eslint/parameter-properties */
class PropertyViewPropertyValueBuilder {
    #text;
    #icon;
    #link;
    constructor(parent) {
        this.parent = parent;
        this.#text = null;
        this.#icon = null;
        this.#link = null;
    }
    text(value) {
        this.#text = value !== null ? value.toString() : null;
        return this;
    }
    icon(value) {
        this.#icon = value;
        return this;
    }
    link(value) {
        this.#link = value;
        return this;
    }
    getLink() {
        return this.#link;
    }
    build() {
        return {
            type: PropertyViewModelType.PropertyValue,
            text: this.#text,
            icon: this.#icon,
            link: this.#link,
        };
    }
    clone(parentClone) {
        const result = new PropertyViewPropertyValueBuilder(parentClone);
        result.#text = this.#text;
        result.#icon = this.#icon;
        // This field value is not cloned as it might contain external types.
        result.#link = this.#link;
        return result;
    }
    exit() {
        return this.parent;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewPropertyValueComponentBuilder {
    constructor(parent) {
        this.parent = parent;
        this.componentType = null;
        this.componentModel = null;
    }
    build() {
        return {
            type: PropertyViewModelType.PropertyValueComponent,
            componentType: this.componentType,
            componentModel: this.componentModel,
        };
    }
    component(componentType) {
        this.componentType = componentType;
        return this;
    }
    model(componentModel) {
        this.componentModel = componentModel;
        return this;
    }
    clone(parentClone) {
        const result = new PropertyViewPropertyValueComponentBuilder(parentClone);
        result.componentType = this.componentType;
        result.componentModel = this.componentModel;
        return result;
    }
    exit() {
        return this.parent;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/* eslint-disable @typescript-eslint/parameter-properties */
class PropertyViewPropertyBuilder {
    #keyBuilder;
    #valueBuilders;
    constructor(parent) {
        this.parent = parent;
        this.#keyBuilder = new PropertyViewPropertyKeyBuilder(this);
        this.#valueBuilders = [];
    }
    keyBuilder() {
        return this.#keyBuilder;
    }
    getValueBuilders() {
        return this.#valueBuilders.concat();
    }
    valueBuilder() {
        const result = new PropertyViewPropertyValueBuilder(this);
        this.#valueBuilders.push(result);
        return result;
    }
    valueComponentBuilder() {
        const result = new PropertyViewPropertyValueComponentBuilder(this);
        this.#valueBuilders.push(result);
        return result;
    }
    build() {
        return {
            type: PropertyViewModelType.Property,
            key: this.keyBuilder().build(),
            content: this.getValueBuilders().map(builder => builder.build()),
        };
    }
    clone(parentClone) {
        const result = new PropertyViewPropertyBuilder(parentClone);
        result.#keyBuilder = this.keyBuilder().clone(result);
        result.#valueBuilders = this.getValueBuilders().map(builder => builder.clone(result));
        return result;
    }
    exit() {
        return this.parent;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/* eslint-disable @typescript-eslint/parameter-properties */
class PropertyViewSectionBuilder {
    static #infoIconClass = 'vx-icon-info_normal';
    static #warningIconClass = 'vx-icon-warn';
    static #errorIconClass = 'vx-icon-error';
    #renderAsHtml;
    #collapseContent;
    #title;
    #titleIcon;
    #actions;
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.#renderAsHtml = false;
        this.#collapseContent = false;
        this.#title = null;
        this.#titleIcon = null;
        this.#actions = [];
        this.contentBuilders = [];
    }
    getId() {
        return this.id;
    }
    renderAsHtml(value) {
        this.#renderAsHtml = value;
        return this;
    }
    collapseContent(value) {
        this.#collapseContent = value;
        return this;
    }
    title(value) {
        this.#title = value;
        return this;
    }
    titleIcon(value) {
        this.#titleIcon = value;
        return this;
    }
    action(value) {
        if (value) {
            this.#actions.push(value);
        }
        return this;
    }
    getActions() {
        return this.#actions.concat();
    }
    propertyBuilder() {
        const result = new PropertyViewPropertyBuilder(this);
        this.contentBuilders.push(result);
        return result;
    }
    property(key, values) {
        let valuesArray;
        if (values === null || values === undefined) {
            valuesArray = [];
        }
        else if (values instanceof Array) {
            valuesArray = values;
        }
        else {
            valuesArray = [values];
        }
        const propertyBuilder = this.propertyBuilder();
        propertyBuilder.keyBuilder().text(key);
        valuesArray.forEach(value => propertyBuilder.valueBuilder().text(value));
        return this;
    }
    messageBuilder() {
        const result = new PropertyViewMessageBuilder(this);
        this.contentBuilders.push(result);
        return result;
    }
    message(text, icon) {
        const messageBuilder = this.messageBuilder();
        messageBuilder.text(text);
        if (icon) {
            messageBuilder.icon(icon);
        }
        return this;
    }
    info(text) {
        return this.message(text, PropertyViewSectionBuilder.#infoIconClass);
    }
    warning(text) {
        return this.message(text, PropertyViewSectionBuilder.#warningIconClass);
    }
    error(text) {
        return this.message(text, PropertyViewSectionBuilder.#errorIconClass);
    }
    getContentBuilders() {
        return this.contentBuilders.concat();
    }
    build() {
        return {
            type: PropertyViewModelType.Section,
            id: this.id,
            renderAsHtml: this.#renderAsHtml,
            collapseContent: this.#collapseContent,
            title: this.#title,
            titleIcon: this.#titleIcon,
            actions: this.getActions().concat(),
            content: this.getContentBuilders().map(builder => builder.build()),
        };
    }
    clone(parentClone) {
        const result = new PropertyViewSectionBuilder(parentClone, this.id);
        result.#renderAsHtml = this.#renderAsHtml;
        result.#collapseContent = this.#collapseContent;
        result.#title = this.#title;
        result.#titleIcon = this.#titleIcon;
        // This field value is not cloned as it might contain external types.
        result.#actions = this.getActions().concat();
        result.contentBuilders = this.getContentBuilders().map(builder => builder.clone(result));
        return result;
    }
    exit() {
        return this.parent;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/* eslint-disable @typescript-eslint/parameter-properties */
class PropertyViewCategoryBuilder {
    #title;
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.#title = null;
        this.contentBuilders = [];
    }
    getId() {
        return this.id;
    }
    title(value) {
        this.#title = value;
        return this;
    }
    getAllSections() {
        return this.contentBuilders.concat();
    }
    getSection(id) {
        const matchingSections = this.getAllSections().filter(section => section.getId() === id);
        if (matchingSections.length === 1) {
            return matchingSections[0];
        }
        return null;
    }
    section(id) {
        let sectionBuilder = this.getSection(id);
        if (sectionBuilder === null) {
            sectionBuilder = new PropertyViewSectionBuilder(this, id);
            this.contentBuilders.push(sectionBuilder);
        }
        return sectionBuilder;
    }
    cloneAndAddBuilder(builder) {
        if (this.getSection(builder.getId()) !== null) {
            throw new Error(`Section '${builder.getId()}' already exists.`);
        }
        builder = builder.clone(this);
        this.contentBuilders.push(builder);
        return this;
    }
    cloneAndAddBuilders(builders) {
        builders.forEach(builder => this.cloneAndAddBuilder(builder));
        return this;
    }
    build() {
        return {
            type: PropertyViewModelType.Category,
            id: this.id,
            title: this.#title,
            content: this.getAllSections().map(builder => builder.build()),
        };
    }
    clone(parentClone) {
        const result = new PropertyViewCategoryBuilder(parentClone, this.id);
        result.#title = this.#title;
        result.contentBuilders = this.getAllSections().map(builder => builder.clone(result));
        return result;
    }
    exit() {
        return this.parent;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewBuilder {
    static #allCategoryId = 'all';
    #categoryBuilders;
    constructor() {
        this.#categoryBuilders = [];
    }
    getAllCategories() {
        return this.#categoryBuilders.concat();
    }
    getCategory(id) {
        const matchingBuilder = this.getAllCategories().filter(s => s.getId() === id);
        if (matchingBuilder.length === 1) {
            return matchingBuilder[0];
        }
        return null;
    }
    getSection(categoryId, sectionId) {
        const category = this.getCategory(categoryId);
        if (category === null) {
            return null;
        }
        return category.getSection(sectionId);
    }
    category(id, insertionIndex) {
        let categoryBuilder = this.getCategory(id);
        if (categoryBuilder === null) {
            categoryBuilder = new PropertyViewCategoryBuilder(this, id);
            this.#categoryBuilders.push(categoryBuilder);
        }
        const removalIndex = this.#categoryBuilders.findIndex(b => b.getId() === id);
        this.#categoryBuilders.splice(removalIndex, 1);
        if (insertionIndex === undefined) {
            insertionIndex = removalIndex;
        }
        else if (isNaN(insertionIndex) ||
            !isFinite(insertionIndex) ||
            insertionIndex !== parseInt(insertionIndex.toString(), 10) ||
            insertionIndex < 0 ||
            this.#categoryBuilders.length < insertionIndex) {
            throw new Error(`Invalid insertion index ${insertionIndex}.` +
                ` Insertion index must be an integer in the range` +
                ` [0, ${this.#categoryBuilders.length}].`);
        }
        else {
            // no action
        }
        this.#categoryBuilders.splice(insertionIndex, 0, categoryBuilder);
        return categoryBuilder;
    }
    generateAllCategory(categoryTitle) {
        if (this.getCategory(PropertyViewBuilder.#allCategoryId)) {
            throw new Error(`Category '${PropertyViewBuilder.#allCategoryId}' already exists.`);
        }
        return this.category(PropertyViewBuilder.#allCategoryId, 0)
            .title(categoryTitle)
            .cloneAndAddBuilders(this.getAllCategories()
            .map(category => category.getAllSections())
            // Array.flat()
            .reduce((previous, current) => previous.concat(current)));
    }
    build() {
        return {
            categories: this.getAllCategories().map(builder => builder.build()),
        };
    }
    clone() {
        const result = new PropertyViewBuilder();
        result.#categoryBuilders = this.getAllCategories().map(builder => builder.clone(result));
        return result;
    }
    exit() {
        return null;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewConfigProvider {
    constructor() {
        this.configSubject = new BehaviorSubject(undefined);
    }
    getConfig() {
        return this.config;
    }
    config$() {
        return this.configSubject.asObservable();
    }
    setConfig(value) {
        this.config = value;
        this.configSubject.next(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewConfigProvider, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewConfigProvider }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewConfigProvider, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewSectionsExpandedStateManager {
    constructor() {
        this.categoriesSectionsExpandedStateData = {};
    }
    getSectionExpandedState(categoryId, sectionId) {
        if (!(categoryId in this.categoriesSectionsExpandedStateData)) {
            throw new Error(`Unknown category ID: ${categoryId}`);
        }
        if (!(sectionId in this.categoriesSectionsExpandedStateData[categoryId])) {
            throw new Error(`Unknown section ID: ${sectionId}`);
        }
        const sectionExpandedState = this.categoriesSectionsExpandedStateData[categoryId][sectionId];
        if (typeof sectionExpandedState.user === 'boolean') {
            return sectionExpandedState.user;
        }
        return sectionExpandedState.data;
    }
    setSectionExpandedUserState(categoryId, sectionId, expandedUserState) {
        if (!(categoryId in this.categoriesSectionsExpandedStateData)) {
            throw new Error(`Unknown category ID: ${categoryId}`);
        }
        if (!(sectionId in this.categoriesSectionsExpandedStateData[categoryId])) {
            throw new Error(`Unknown section ID: ${sectionId}`);
        }
        this.categoriesSectionsExpandedStateData[categoryId][sectionId].user = expandedUserState;
    }
    update(categories) {
        const categoriesById = {};
        for (const category of categories) {
            categoriesById[category.id] = category;
        }
        this.removeOldCategories(categoriesById);
        this.createNewCategories(categoriesById);
        // Update categories' sections
        for (const categoryId of Object.keys(categoriesById)) {
            this.updateCategorySections(categoryId, categoriesById);
        }
    }
    removeOldCategories(categoriesById) {
        for (const categoryId of Object.keys(this.categoriesSectionsExpandedStateData)) {
            if (!(categoryId in categoriesById)) {
                delete this.categoriesSectionsExpandedStateData[categoryId];
            }
        }
    }
    createNewCategories(categoriesById) {
        for (const categoryId of Object.keys(categoriesById)) {
            if (!(categoryId in this.categoriesSectionsExpandedStateData)) {
                this.categoriesSectionsExpandedStateData[categoryId] = {};
            }
        }
    }
    updateCategorySections(categoryId, categoriesById) {
        const sectionsById = {};
        for (const section of categoriesById[categoryId].content) {
            sectionsById[section.id] = section;
        }
        const sectionsExpandedState = this.categoriesSectionsExpandedStateData[categoryId];
        // Remove sections
        for (const sectionId of Object.keys(sectionsExpandedState)) {
            if (!(sectionId in sectionsById)) {
                delete sectionsExpandedState[sectionId];
            }
        }
        // Update sections
        for (const sectionId of Object.keys(sectionsExpandedState)) {
            sectionsExpandedState[sectionId].data = !sectionsById[sectionId].collapseContent;
        }
        // Create sections
        for (const sectionId of Object.keys(sectionsById)) {
            if (!(sectionId in sectionsExpandedState)) {
                sectionsExpandedState[sectionId] = {
                    user: undefined,
                    data: !sectionsById[sectionId].collapseContent,
                };
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewSectionsExpandedStateManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewSectionsExpandedStateManager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewSectionsExpandedStateManager, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * User-visible strings used in the 'appfx-property-view' library.
 * Fields are read-only to avoid accidentally modifying the values and affecting all
 * components in the application.
 *
 * Strings are in English only. If you need to provide localized strings:
 * - extend this class
 * - override all fields with localized values
 * - provide instance in the module where you use PropertyViewModule
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: PropertyViewStrings, useClass: LocalizedPropertyViewStrings },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
class PropertyViewStrings {
    constructor() {
        /**
         * Toggle button aria-label.
         */
        this.toggle = 'Toggle {0} section';
        /**
         * Actions drop-down label.
         */
        this.actions = 'Actions';
        /**
         * Aria label describing number of section items in a property view
         */
        this.categoryListItemsAreaLabel = '{0} items grouped in {1} sections.';
        /**
         * Aria label describing number section items in a property view when one item
         */
        this.categoryListItemAreaLabel = '{0} items grouped in 1 section.';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewStrings, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewStrings }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewStrings, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewMessageComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewMessageComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: PropertyViewMessageComponent, isStandalone: false, selector: "[appfx-property-view-message]", inputs: { data: "data" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<td colspan=\"2\" class=\"pv-message-container left\" role=\"presentation\">\n  <span class=\"pv-message-content\">\n    <span *ngIf=\"data.icon\" class=\"pv-message-icon\" [attr.aria-hidden]=\"true\" [ngClass]=\"data.icon\"></span>\n    <span\n      *ngIf=\"!data.renderAsHtml\"\n      class=\"pv-message-text\"\n      [attr.aria-label]=\"data.text\"\n      [innerText]=\"data.text\"\n    ></span>\n    <span\n      *ngIf=\"data.renderAsHtml\"\n      class=\"pv-message-text\"\n      [attr.aria-label]=\"data.text\"\n      [innerHtml]=\"data.text\"\n    ></span>\n  </span>\n</td>\n", styles: [":host.indented .pv-message-container{padding-left:.96rem}:host.collapsed{visibility:hidden}:host.collapsed .pv-message-container{padding-top:0;padding-bottom:0}:host.collapsed .pv-message-container .pv-message-content{display:block;height:0;overflow:hidden}:host .pv-message-container{padding-left:0;padding-right:0;line-height:inherit}:host .pv-message-container .pv-message-content{display:inline-block}:host .pv-message-container .pv-message-content .pv-message-icon{display:inline-block;margin:0;vertical-align:middle}:host .pv-message-container .pv-message-content .pv-message-text{vertical-align:middle}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewMessageComponent, decorators: [{
            type: Component,
            args: [{ selector: '[appfx-property-view-message]', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<td colspan=\"2\" class=\"pv-message-container left\" role=\"presentation\">\n  <span class=\"pv-message-content\">\n    <span *ngIf=\"data.icon\" class=\"pv-message-icon\" [attr.aria-hidden]=\"true\" [ngClass]=\"data.icon\"></span>\n    <span\n      *ngIf=\"!data.renderAsHtml\"\n      class=\"pv-message-text\"\n      [attr.aria-label]=\"data.text\"\n      [innerText]=\"data.text\"\n    ></span>\n    <span\n      *ngIf=\"data.renderAsHtml\"\n      class=\"pv-message-text\"\n      [attr.aria-label]=\"data.text\"\n      [innerHtml]=\"data.text\"\n    ></span>\n  </span>\n</td>\n", styles: [":host.indented .pv-message-container{padding-left:.96rem}:host.collapsed{visibility:hidden}:host.collapsed .pv-message-container{padding-top:0;padding-bottom:0}:host.collapsed .pv-message-container .pv-message-content{display:block;height:0;overflow:hidden}:host .pv-message-container{padding-left:0;padding-right:0;line-height:inherit}:host .pv-message-container .pv-message-content{display:inline-block}:host .pv-message-container .pv-message-content .pv-message-icon{display:inline-block;margin:0;vertical-align:middle}:host .pv-message-container .pv-message-content .pv-message-text{vertical-align:middle}\n"] }]
        }], propDecorators: { data: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Component used to dynamically render
 * a given component passed as a property of the PropertyViewPropertyComponentValueModel
 */
class PropertyViewPropertyValueContainerComponent {
    #pageComponent;
    constructor(componentFactoryResolver, cdRef, viewContainer) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.cdRef = cdRef;
        this.viewContainer = viewContainer;
    }
    ngOnInit() {
        this.createComponent();
    }
    ngOnChanges(changes) {
        if (changes.componentType && !changes.componentType.firstChange) {
            this.createComponent();
        }
        else if (changes.componentModel && !changes.componentModel.firstChange) {
            if (this.#pageComponent) {
                this.#pageComponent.model = this.componentModel;
                this.cdRef.detectChanges();
            }
        }
        else {
            // no action
        }
    }
    ngOnDestroy() {
        this.clear();
    }
    createComponent() {
        this.clear();
        if (!this.componentType) {
            return;
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentType);
        const componentRef = this.viewContainer.createComponent(componentFactory);
        this.#pageComponent = componentRef.instance;
        this.#pageComponent.model = this.componentModel;
        this.cdRef.detectChanges();
    }
    clear() {
        this.viewContainer.clear();
        this.#pageComponent = undefined;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewPropertyValueContainerComponent, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ChangeDetectorRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: PropertyViewPropertyValueContainerComponent, isStandalone: false, selector: "appfx-property-view-property-value-component", inputs: { componentType: "componentType", componentModel: "componentModel" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewPropertyValueContainerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-property-view-property-value-component',
                    standalone: false,
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i0.ComponentFactoryResolver }, { type: i0.ChangeDetectorRef }, { type: i0.ViewContainerRef }], propDecorators: { componentType: [{
                type: Input
            }], componentModel: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewPropertyComponent {
    constructor(propertyViewConfigProvider, zoomLevelService) {
        this.propertyViewConfigProvider = propertyViewConfigProvider;
        this.zoomLevelService = zoomLevelService;
        this.PropertyViewModelType = PropertyViewModelType;
        this.is4xZoomed = false;
    }
    ngOnChanges(changes) {
        if (changes.data) {
            this.propertyValueModelContent = this.data?.content.filter(value => value.type === PropertyViewModelType.PropertyValue);
            this.propertyValueComponentModelContent = this.data?.content.filter(value => value.type === PropertyViewModelType.PropertyValueComponent);
        }
    }
    handleLinkClick(link) {
        link.clickHandler();
    }
    getValueTrackingId(index) {
        return index;
    }
    ngOnInit() {
        this.zoomLevelSubscription = this.zoomLevelService?.onChange.subscribe((level) => (this.is4xZoomed = level === ZoomLevel.x4));
    }
    ngOnDestroy() {
        this.zoomLevelSubscription?.unsubscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewPropertyComponent, deps: [{ token: PropertyViewConfigProvider }, { token: i2.ZoomLevelService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: PropertyViewPropertyComponent, isStandalone: false, selector: "[appfx-property-view-property]", inputs: { data: "data" }, host: { properties: { "class.zoom4x": "this.is4xZoomed" } }, usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<td class=\"pv-property-key-container left\" role=\"presentation\">\n  <span\n    class=\"pv-property-key-content\"\n    [style.width.rem]=\"!is4xZoomed ? propertyViewConfigProvider.getConfig()?.propertyKeyWidthInRem : undefined\"\n  >\n    <span *ngIf=\"data.key.icon\" class=\"pv-property-key-icon\" [ngClass]=\"data.key.icon\"></span>\n    <span class=\"pv-property-key-text\" [attr.aria-label]=\"data.key.text\" [innerText]=\"data.key.text\"></span>\n  </span>\n</td>\n<td class=\"pv-property-values-container left\" role=\"presentation\">\n  <span *ngIf=\"data.content.length > 0\" class=\"pv-property-values-content\">\n    <span *ngFor=\"let value of propertyValueModelContent; trackBy: getValueTrackingId\" class=\"pv-property-value\">\n      <span *ngIf=\"value.icon\" class=\"pv-property-value-icon\" [ngClass]=\"value.icon\"></span>\n      <a\n        *ngIf=\"value.link\"\n        class=\"pv-property-value-link\"\n        href=\"javascript:void(0)\"\n        [innerText]=\"value.text\"\n        (click)=\"handleLinkClick(value.link)\"\n      ></a>\n      <span\n        *ngIf=\"!value.link\"\n        class=\"pv-property-value-text\"\n        [attr.aria-label]=\"value.text\"\n        [innerText]=\"value.text\"\n      ></span>\n    </span>\n    <span\n      *ngFor=\"let value of propertyValueComponentModelContent; trackBy: getValueTrackingId\"\n      class=\"pv-property-value\"\n    >\n      <appfx-property-view-property-value-component\n        [componentType]=\"value.componentType\"\n        [componentModel]=\"value.componentModel\"\n      >\n      </appfx-property-view-property-value-component>\n    </span>\n  </span>\n</td>\n", styles: [":host.indented .pv-property-key-container{padding-left:.96rem}:host.collapsed{visibility:hidden}:host.collapsed .pv-property-key-container,:host.collapsed .pv-property-values-container{padding-top:0;padding-bottom:0}:host.collapsed .pv-property-key-container .pv-property-key-content,:host.collapsed .pv-property-key-container .pv-property-values-content,:host.collapsed .pv-property-values-container .pv-property-key-content,:host.collapsed .pv-property-values-container .pv-property-values-content{display:block;height:0;overflow:hidden}:host .pv-property-key-container,:host .pv-property-values-container{padding-top:.4rem!important;padding-bottom:.2rem!important;padding-left:0;padding-right:0;line-height:inherit}:host .pv-property-key-container{font-weight:500;padding-right:.96rem}:host .pv-property-key-container .pv-property-key-content{display:inline-block;width:7.2rem;overflow-wrap:break-word}:host .pv-property-key-container .pv-property-key-content .pv-property-key-icon{display:inline-block;margin:0;vertical-align:middle}:host .pv-property-key-container .pv-property-key-content .pv-property-key-text{white-space:pre-wrap;vertical-align:middle}:host .pv-property-values-container{padding-left:.96rem}:host .pv-property-values-container .pv-property-values-content{min-width:7.2rem;display:inline-block;width:100%;box-sizing:border-box}:host .pv-property-values-container .pv-property-values-content .pv-property-value{width:100%;display:inline-block}:host .pv-property-values-container .pv-property-values-content .pv-property-value:not(:first-child){padding-top:.24rem}:host .pv-property-values-container .pv-property-values-content .pv-property-value .pv-property-value-icon{display:inline-block;margin:0;vertical-align:middle}:host .pv-property-values-container .pv-property-values-content .pv-property-value .pv-property-value-link{vertical-align:middle}:host .pv-property-values-container .pv-property-values-content .pv-property-value .pv-property-value-text{white-space:pre-wrap;vertical-align:middle}:host.zoom4x:not(.indented) .pv-property-values-container{padding-left:0}:host.zoom4x .pv-property-key-container{padding-right:0}:host.zoom4x .pv-property-key-container,:host.zoom4x .pv-property-values-container{display:block;width:100%}:host.zoom4x .pv-property-key-container .pv-property-key-content{width:100%}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: PropertyViewPropertyValueContainerComponent, selector: "appfx-property-view-property-value-component", inputs: ["componentType", "componentModel"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewPropertyComponent, decorators: [{
            type: Component,
            args: [{ selector: '[appfx-property-view-property]', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<td class=\"pv-property-key-container left\" role=\"presentation\">\n  <span\n    class=\"pv-property-key-content\"\n    [style.width.rem]=\"!is4xZoomed ? propertyViewConfigProvider.getConfig()?.propertyKeyWidthInRem : undefined\"\n  >\n    <span *ngIf=\"data.key.icon\" class=\"pv-property-key-icon\" [ngClass]=\"data.key.icon\"></span>\n    <span class=\"pv-property-key-text\" [attr.aria-label]=\"data.key.text\" [innerText]=\"data.key.text\"></span>\n  </span>\n</td>\n<td class=\"pv-property-values-container left\" role=\"presentation\">\n  <span *ngIf=\"data.content.length > 0\" class=\"pv-property-values-content\">\n    <span *ngFor=\"let value of propertyValueModelContent; trackBy: getValueTrackingId\" class=\"pv-property-value\">\n      <span *ngIf=\"value.icon\" class=\"pv-property-value-icon\" [ngClass]=\"value.icon\"></span>\n      <a\n        *ngIf=\"value.link\"\n        class=\"pv-property-value-link\"\n        href=\"javascript:void(0)\"\n        [innerText]=\"value.text\"\n        (click)=\"handleLinkClick(value.link)\"\n      ></a>\n      <span\n        *ngIf=\"!value.link\"\n        class=\"pv-property-value-text\"\n        [attr.aria-label]=\"value.text\"\n        [innerText]=\"value.text\"\n      ></span>\n    </span>\n    <span\n      *ngFor=\"let value of propertyValueComponentModelContent; trackBy: getValueTrackingId\"\n      class=\"pv-property-value\"\n    >\n      <appfx-property-view-property-value-component\n        [componentType]=\"value.componentType\"\n        [componentModel]=\"value.componentModel\"\n      >\n      </appfx-property-view-property-value-component>\n    </span>\n  </span>\n</td>\n", styles: [":host.indented .pv-property-key-container{padding-left:.96rem}:host.collapsed{visibility:hidden}:host.collapsed .pv-property-key-container,:host.collapsed .pv-property-values-container{padding-top:0;padding-bottom:0}:host.collapsed .pv-property-key-container .pv-property-key-content,:host.collapsed .pv-property-key-container .pv-property-values-content,:host.collapsed .pv-property-values-container .pv-property-key-content,:host.collapsed .pv-property-values-container .pv-property-values-content{display:block;height:0;overflow:hidden}:host .pv-property-key-container,:host .pv-property-values-container{padding-top:.4rem!important;padding-bottom:.2rem!important;padding-left:0;padding-right:0;line-height:inherit}:host .pv-property-key-container{font-weight:500;padding-right:.96rem}:host .pv-property-key-container .pv-property-key-content{display:inline-block;width:7.2rem;overflow-wrap:break-word}:host .pv-property-key-container .pv-property-key-content .pv-property-key-icon{display:inline-block;margin:0;vertical-align:middle}:host .pv-property-key-container .pv-property-key-content .pv-property-key-text{white-space:pre-wrap;vertical-align:middle}:host .pv-property-values-container{padding-left:.96rem}:host .pv-property-values-container .pv-property-values-content{min-width:7.2rem;display:inline-block;width:100%;box-sizing:border-box}:host .pv-property-values-container .pv-property-values-content .pv-property-value{width:100%;display:inline-block}:host .pv-property-values-container .pv-property-values-content .pv-property-value:not(:first-child){padding-top:.24rem}:host .pv-property-values-container .pv-property-values-content .pv-property-value .pv-property-value-icon{display:inline-block;margin:0;vertical-align:middle}:host .pv-property-values-container .pv-property-values-content .pv-property-value .pv-property-value-link{vertical-align:middle}:host .pv-property-values-container .pv-property-values-content .pv-property-value .pv-property-value-text{white-space:pre-wrap;vertical-align:middle}:host.zoom4x:not(.indented) .pv-property-values-container{padding-left:0}:host.zoom4x .pv-property-key-container{padding-right:0}:host.zoom4x .pv-property-key-container,:host.zoom4x .pv-property-values-container{display:block;width:100%}:host.zoom4x .pv-property-key-container .pv-property-key-content{width:100%}\n"] }]
        }], ctorParameters: () => [{ type: PropertyViewConfigProvider }, { type: i2.ZoomLevelService, decorators: [{
                    type: Optional
                }] }], propDecorators: { data: [{
                type: Input
            }], is4xZoomed: [{
                type: HostBinding,
                args: ['class.zoom4x']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewSectionComponent {
    constructor(propertyViewStrings) {
        this.propertyViewStrings = propertyViewStrings;
        this.PropertyViewModelType = PropertyViewModelType;
        this.expandedChange = new EventEmitter();
    }
    toggleExpandedState() {
        this.expandedChange.emit(!this.expanded);
    }
    handleActionClick(action) {
        if (!action.isEnabled) {
            return;
        }
        action.clickHandler();
    }
    getContentTrackingId(index) {
        return index;
    }
    getSectionTitleToggleButtonAriaLabel() {
        return this.getFormattedLabel(this.propertyViewStrings.toggle);
    }
    /**
     * Returns unique formatted label if title is not null,
     * otherwise sets static label without any placeholder
     */
    getFormattedLabel(label) {
        return label.replace('{0} ', this.data.title ? this.data.title + ' ' : '');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewSectionComponent, deps: [{ token: PropertyViewStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: PropertyViewSectionComponent, isStandalone: false, selector: "[appfx-property-view-section]", inputs: { data: "data", expanded: "expanded", componentId: "componentId" }, outputs: { expandedChange: "expandedChange" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<tr *ngIf=\"data.title\" class=\"pv-section-title-container\" role=\"listitem\">\n  <th colspan=\"2\" class=\"pv-section-title-content left\" role=\"presentation\" scope=\"colgroup\">\n    <button\n      class=\"pv-section-title-expand-button\"\n      [attr.aria-expanded]=\"expanded\"\n      [attr.aria-controls]=\"componentId\"\n      [attr.aria-label]=\"getSectionTitleToggleButtonAriaLabel()\"\n      (click)=\"toggleExpandedState()\"\n    >\n      <cds-icon shape=\"angle\" aria-hidden=\"true\" [direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n    </button>\n    <span *ngIf=\"data.titleIcon\" class=\"pv-section-title-icon\" aria-hidden=\"true\" [ngClass]=\"data.titleIcon\"></span>\n    <span\n      *ngIf=\"!data.renderAsHtml\"\n      class=\"pv-section-title-text\"\n      role=\"heading\"\n      aria-level=\"3\"\n      [innerText]=\"data.title\"\n    ></span>\n    <span\n      *ngIf=\"data.renderAsHtml\"\n      class=\"pv-section-title-text\"\n      role=\"heading\"\n      aria-level=\"3\"\n      [innerHtml]=\"data.title\"\n    ></span>\n    <clr-dropdown *ngIf=\"data.actions.length > 0\" class=\"pv-section-actions-dropdown\">\n      <button type=\"button\" class=\"btn btn-link\" clrDropdownTrigger>\n        {{ propertyViewStrings.actions }}\n        <cds-icon shape=\"angle\" direction=\"down\" aria-hidden=\"true\"></cds-icon>\n      </button>\n      <clr-dropdown-menu *clrIfOpen>\n        <div\n          *ngFor=\"let action of data.actions\"\n          clrDropdownItem\n          [innerText]=\"action.title\"\n          [clrDisabled]=\"!action.isEnabled\"\n          (click)=\"handleActionClick(action)\"\n        ></div>\n      </clr-dropdown-menu>\n    </clr-dropdown>\n  </th>\n</tr>\n<ng-container *ngFor=\"let item of data.content; trackBy: getContentTrackingId\">\n  <tr\n    *ngIf=\"item.type === PropertyViewModelType.Message\"\n    appfx-property-view-message\n    [data]=\"item\"\n    role=\"listitem\"\n    [ngClass]=\"{ indented: !!data.title, collapsed: !expanded && !!data.title }\"\n  ></tr>\n  <tr\n    *ngIf=\"item.type === PropertyViewModelType.Property\"\n    appfx-property-view-property\n    [data]=\"item\"\n    role=\"listitem\"\n    [ngClass]=\"{ indented: !!data.title, collapsed: !expanded && !!data.title }\"\n  ></tr>\n</ng-container>\n", styles: [":host .pv-section-title-container .pv-section-title-content{padding-left:0;padding-right:0;border:0 solid transparent;line-height:inherit;font-size:.65rem;background-color:unset}:host .pv-section-title-container .pv-section-title-content .pv-section-title-expand-button{padding:0;border:0;background-color:transparent;cursor:pointer;vertical-align:middle;color:unset}:host .pv-section-title-container .pv-section-title-content .pv-section-title-icon{margin:0;vertical-align:middle}:host .pv-section-title-container .pv-section-title-content .pv-section-title-text{vertical-align:middle}:host .pv-section-title-container .pv-section-title-content .pv-section-actions-dropdown{display:inline-block;vertical-align:middle}:host .pv-section-title-container .pv-section-title-content .pv-section-actions-dropdown [clrDropdownTrigger]{height:auto;font-size:inherit;line-height:inherit}:host .pv-section-title-container .pv-section-title-content .pv-section-actions-dropdown cds-icon{top:2px}\n"], dependencies: [{ kind: "component", type: i2$1.ClrDropdown, selector: "clr-dropdown", inputs: ["clrCloseMenuOnItemClick"] }, { kind: "component", type: i2$1.ClrDropdownMenu, selector: "clr-dropdown-menu", inputs: ["clrPosition"] }, { kind: "directive", type: i2$1.ClrDropdownTrigger, selector: "[clrDropdownTrigger],[clrDropdownToggle]" }, { kind: "directive", type: i2$1.ClrDropdownItem, selector: "[clrDropdownItem]", inputs: ["clrDisabled", "id"] }, { kind: "directive", type: i3$1.ClrIfOpen, selector: "[clrIfOpen]", inputs: ["clrIfOpen"], outputs: ["clrIfOpenChange"] }, { kind: "component", type: i4.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: PropertyViewMessageComponent, selector: "[appfx-property-view-message]", inputs: ["data"] }, { kind: "component", type: PropertyViewPropertyComponent, selector: "[appfx-property-view-property]", inputs: ["data"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewSectionComponent, decorators: [{
            type: Component,
            args: [{ selector: '[appfx-property-view-section]', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<tr *ngIf=\"data.title\" class=\"pv-section-title-container\" role=\"listitem\">\n  <th colspan=\"2\" class=\"pv-section-title-content left\" role=\"presentation\" scope=\"colgroup\">\n    <button\n      class=\"pv-section-title-expand-button\"\n      [attr.aria-expanded]=\"expanded\"\n      [attr.aria-controls]=\"componentId\"\n      [attr.aria-label]=\"getSectionTitleToggleButtonAriaLabel()\"\n      (click)=\"toggleExpandedState()\"\n    >\n      <cds-icon shape=\"angle\" aria-hidden=\"true\" [direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n    </button>\n    <span *ngIf=\"data.titleIcon\" class=\"pv-section-title-icon\" aria-hidden=\"true\" [ngClass]=\"data.titleIcon\"></span>\n    <span\n      *ngIf=\"!data.renderAsHtml\"\n      class=\"pv-section-title-text\"\n      role=\"heading\"\n      aria-level=\"3\"\n      [innerText]=\"data.title\"\n    ></span>\n    <span\n      *ngIf=\"data.renderAsHtml\"\n      class=\"pv-section-title-text\"\n      role=\"heading\"\n      aria-level=\"3\"\n      [innerHtml]=\"data.title\"\n    ></span>\n    <clr-dropdown *ngIf=\"data.actions.length > 0\" class=\"pv-section-actions-dropdown\">\n      <button type=\"button\" class=\"btn btn-link\" clrDropdownTrigger>\n        {{ propertyViewStrings.actions }}\n        <cds-icon shape=\"angle\" direction=\"down\" aria-hidden=\"true\"></cds-icon>\n      </button>\n      <clr-dropdown-menu *clrIfOpen>\n        <div\n          *ngFor=\"let action of data.actions\"\n          clrDropdownItem\n          [innerText]=\"action.title\"\n          [clrDisabled]=\"!action.isEnabled\"\n          (click)=\"handleActionClick(action)\"\n        ></div>\n      </clr-dropdown-menu>\n    </clr-dropdown>\n  </th>\n</tr>\n<ng-container *ngFor=\"let item of data.content; trackBy: getContentTrackingId\">\n  <tr\n    *ngIf=\"item.type === PropertyViewModelType.Message\"\n    appfx-property-view-message\n    [data]=\"item\"\n    role=\"listitem\"\n    [ngClass]=\"{ indented: !!data.title, collapsed: !expanded && !!data.title }\"\n  ></tr>\n  <tr\n    *ngIf=\"item.type === PropertyViewModelType.Property\"\n    appfx-property-view-property\n    [data]=\"item\"\n    role=\"listitem\"\n    [ngClass]=\"{ indented: !!data.title, collapsed: !expanded && !!data.title }\"\n  ></tr>\n</ng-container>\n", styles: [":host .pv-section-title-container .pv-section-title-content{padding-left:0;padding-right:0;border:0 solid transparent;line-height:inherit;font-size:.65rem;background-color:unset}:host .pv-section-title-container .pv-section-title-content .pv-section-title-expand-button{padding:0;border:0;background-color:transparent;cursor:pointer;vertical-align:middle;color:unset}:host .pv-section-title-container .pv-section-title-content .pv-section-title-icon{margin:0;vertical-align:middle}:host .pv-section-title-container .pv-section-title-content .pv-section-title-text{vertical-align:middle}:host .pv-section-title-container .pv-section-title-content .pv-section-actions-dropdown{display:inline-block;vertical-align:middle}:host .pv-section-title-container .pv-section-title-content .pv-section-actions-dropdown [clrDropdownTrigger]{height:auto;font-size:inherit;line-height:inherit}:host .pv-section-title-container .pv-section-title-content .pv-section-actions-dropdown cds-icon{top:2px}\n"] }]
        }], ctorParameters: () => [{ type: PropertyViewStrings }], propDecorators: { data: [{
                type: Input
            }], expanded: [{
                type: Input
            }], componentId: [{
                type: Input
            }], expandedChange: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewCategoryComponent {
    constructor(expandedStateManager, propertyViewStrings) {
        this.expandedStateManager = expandedStateManager;
        this.propertyViewStrings = propertyViewStrings;
        this.PropertyViewModelType = PropertyViewModelType;
    }
    getSectionExpandedState(sectionId) {
        return this.expandedStateManager.getSectionExpandedState(this.data.id, sectionId);
    }
    onSectionExpandedStateChange(sectionId, expandedUserState) {
        this.expandedStateManager.setSectionExpandedUserState(this.data.id, sectionId, expandedUserState);
    }
    getSectionTrackingId(index, data) {
        return data.id;
    }
    getSectionComponentId(section) {
        return `${this.componentId}-section-${section.id}-component`;
    }
    getSectionComponentAriaLabelId(section) {
        if (section.title) {
            return `${this.getSectionComponentId(section)}-aria-label`;
        }
        return undefined;
    }
    getCategoryListItemsAreaLabel() {
        let propertiesCount = 0;
        this.data.content.forEach((section) => {
            propertiesCount += section.content.length;
        });
        return this.data.content.length > 1
            ? this.propertyViewStrings.categoryListItemsAreaLabel
                .replace('{0}', propertiesCount.toString())
                .replace('{1}', this.data.content.length.toString())
            : this.propertyViewStrings.categoryListItemAreaLabel.replace('{0}', propertiesCount.toString());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewCategoryComponent, deps: [{ token: PropertyViewSectionsExpandedStateManager }, { token: PropertyViewStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: PropertyViewCategoryComponent, isStandalone: false, selector: "appfx-property-view-category", inputs: { data: "data", componentId: "componentId" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<table\n  *ngIf=\"data.content.length > 0\"\n  class=\"pv-sections-table table table-compact table-noborder\"\n  role=\"presentation\"\n  tabindex=\"0\"\n  [attr.aria-label]=\"getCategoryListItemsAreaLabel()\"\n>\n  <ng-container *ngFor=\"let section of data.content; first as first; trackBy: getSectionTrackingId\">\n    <tbody class=\"section-spacer\" *ngIf=\"!first\" aria-hidden=\"true\">\n      <tr>\n        <th scope=\"colgroup\"></th>\n      </tr>\n    </tbody>\n    <!-- Due to bug in NVDA we need to put the labelling element next to\n      the labelled element. In some cases NVDA does not announce\n      the labelled element text when the labelling element is a child\n      of the labelled element.-->\n    <tbody\n      *ngIf=\"section.type === PropertyViewModelType.Section && section.title\"\n      class=\"pv-section-visually-hidden\"\n      [attr.id]=\"getSectionComponentAriaLabelId(section)\"\n    >\n      <tr>\n        <th *ngIf=\"!section.renderAsHtml\" [innerText]=\"section.title\" scope=\"colgroup\"></th>\n        <th *ngIf=\"section.renderAsHtml\" [innerHTML]=\"section.title\" scope=\"colgroup\"></th>\n      </tr>\n    </tbody>\n    <tbody\n      *ngIf=\"section.type === PropertyViewModelType.Section\"\n      appfx-property-view-section\n      role=\"list\"\n      [attr.aria-labelledby]=\"getSectionComponentAriaLabelId(section)\"\n      [attr.id]=\"getSectionComponentId(section)\"\n      [componentId]=\"getSectionComponentId(section)\"\n      [data]=\"section\"\n      [expanded]=\"getSectionExpandedState(section.id)\"\n      (expandedChange)=\"onSectionExpandedStateChange(section.id, $event)\"\n    ></tbody>\n  </ng-container>\n</table>\n", styles: [":host{display:block;width:100%;height:100%;overflow:auto;padding:.6rem;line-height:14px;box-sizing:border-box}:host .pv-sections-table{width:auto;margin:0;box-sizing:border-box;border-collapse:separate}:host .pv-sections-table .section-spacer,:host .pv-sections-table [appfx-property-view-section]{border:0 solid transparent}:host .pv-sections-table .section-spacer th{padding-top:.6rem;padding-bottom:0;background-color:unset}:host .pv-sections-table .pv-section-visually-hidden{display:none}\n"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: PropertyViewSectionComponent, selector: "[appfx-property-view-section]", inputs: ["data", "expanded", "componentId"], outputs: ["expandedChange"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewCategoryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-property-view-category', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<table\n  *ngIf=\"data.content.length > 0\"\n  class=\"pv-sections-table table table-compact table-noborder\"\n  role=\"presentation\"\n  tabindex=\"0\"\n  [attr.aria-label]=\"getCategoryListItemsAreaLabel()\"\n>\n  <ng-container *ngFor=\"let section of data.content; first as first; trackBy: getSectionTrackingId\">\n    <tbody class=\"section-spacer\" *ngIf=\"!first\" aria-hidden=\"true\">\n      <tr>\n        <th scope=\"colgroup\"></th>\n      </tr>\n    </tbody>\n    <!-- Due to bug in NVDA we need to put the labelling element next to\n      the labelled element. In some cases NVDA does not announce\n      the labelled element text when the labelling element is a child\n      of the labelled element.-->\n    <tbody\n      *ngIf=\"section.type === PropertyViewModelType.Section && section.title\"\n      class=\"pv-section-visually-hidden\"\n      [attr.id]=\"getSectionComponentAriaLabelId(section)\"\n    >\n      <tr>\n        <th *ngIf=\"!section.renderAsHtml\" [innerText]=\"section.title\" scope=\"colgroup\"></th>\n        <th *ngIf=\"section.renderAsHtml\" [innerHTML]=\"section.title\" scope=\"colgroup\"></th>\n      </tr>\n    </tbody>\n    <tbody\n      *ngIf=\"section.type === PropertyViewModelType.Section\"\n      appfx-property-view-section\n      role=\"list\"\n      [attr.aria-labelledby]=\"getSectionComponentAriaLabelId(section)\"\n      [attr.id]=\"getSectionComponentId(section)\"\n      [componentId]=\"getSectionComponentId(section)\"\n      [data]=\"section\"\n      [expanded]=\"getSectionExpandedState(section.id)\"\n      (expandedChange)=\"onSectionExpandedStateChange(section.id, $event)\"\n    ></tbody>\n  </ng-container>\n</table>\n", styles: [":host{display:block;width:100%;height:100%;overflow:auto;padding:.6rem;line-height:14px;box-sizing:border-box}:host .pv-sections-table{width:auto;margin:0;box-sizing:border-box;border-collapse:separate}:host .pv-sections-table .section-spacer,:host .pv-sections-table [appfx-property-view-section]{border:0 solid transparent}:host .pv-sections-table .section-spacer th{padding-top:.6rem;padding-bottom:0;background-color:unset}:host .pv-sections-table .pv-section-visually-hidden{display:none}\n"] }]
        }], ctorParameters: () => [{ type: PropertyViewSectionsExpandedStateManager }, { type: PropertyViewStrings }], propDecorators: { data: [{
                type: Input
            }], componentId: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewComponent {
    static { this.idCounter = 0; }
    constructor(expandedStateManager, propertyViewConfigProvider) {
        this.expandedStateManager = expandedStateManager;
        this.propertyViewConfigProvider = propertyViewConfigProvider;
        this.basedId = 'appfx-property-view-' + PropertyViewComponent.idCounter++;
    }
    set config(value) {
        this.propertyViewConfigProvider.setConfig(value);
    }
    ngDoCheck() {
        this.expandedStateManager.update(this.data ? this.data.categories : []);
        this.validateAndUpdateSelectedCategory();
        this.validateAndUpdateFocusedCategory();
    }
    selectCategory(category) {
        this.selectedCategoryId = category.id;
        this.focusedCategoryId = this.selectedCategoryId;
    }
    isCategorySelected(category) {
        return category.id === this.selectedCategoryId;
    }
    isCategoryFocused(category) {
        return category.id === this.focusedCategoryId;
    }
    getCategoryTabId(category) {
        return `${this.basedId}-category-${category.id}-tab`;
    }
    getCategoryPanelId(category) {
        return `${this.basedId}-category-${category.id}-panel`;
    }
    getCategoryComponentId(category) {
        return `${this.basedId}-category-${category.id}-component`;
    }
    getCategoryTrackingId(index, data) {
        return data.id;
    }
    onTabListKeydown(event) {
        if (!this.data || this.data.categories.length === 0 || this.focusedCategoryId === undefined) {
            return;
        }
        const focusedCategoryIndex = this.data.categories.findIndex(category => category.id === this.focusedCategoryId);
        if (focusedCategoryIndex === -1) {
            return;
        }
        let newFocusedCategoryIndex = focusedCategoryIndex;
        if (event.key === 'ArrowLeft' || event.key === 'Left') {
            if (newFocusedCategoryIndex === 0) {
                newFocusedCategoryIndex = this.data.categories.length - 1;
            }
            else {
                newFocusedCategoryIndex--;
            }
        }
        else if (event.key === 'ArrowRight' || event.key === 'Right') {
            if (newFocusedCategoryIndex === this.data.categories.length - 1) {
                newFocusedCategoryIndex = 0;
            }
            else {
                newFocusedCategoryIndex++;
            }
        }
        else {
            // no action
        }
        this.focusedCategoryId = this.data.categories[newFocusedCategoryIndex].id;
        if (newFocusedCategoryIndex !== focusedCategoryIndex) {
            const categoryTabButtons = this.categoryTabButtonsList.toArray();
            const focusedCategoryTabButton = categoryTabButtons[newFocusedCategoryIndex].nativeElement;
            focusedCategoryTabButton.focus();
        }
    }
    validateAndUpdateSelectedCategory() {
        if (!this.data || this.data.categories.length === 0) {
            this.selectedCategoryId = undefined;
            return;
        }
        const isSelectedCategoryValid = this.data.categories.some(category => category.id === this.selectedCategoryId);
        if (!isSelectedCategoryValid) {
            this.selectedCategoryId = this.data.categories[0].id;
        }
    }
    validateAndUpdateFocusedCategory() {
        if (!this.data || this.data.categories.length === 0) {
            this.focusedCategoryId = undefined;
            return;
        }
        const isFocusedCategoryValid = this.data.categories.some(category => category.id === this.focusedCategoryId);
        if (!isFocusedCategoryValid) {
            this.focusedCategoryId = this.selectedCategoryId;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewComponent, deps: [{ token: PropertyViewSectionsExpandedStateManager }, { token: PropertyViewConfigProvider }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: PropertyViewComponent, isStandalone: false, selector: "appfx-property-view", inputs: { data: "data", config: "config" }, providers: [PropertyViewConfigProvider, PropertyViewSectionsExpandedStateManager], viewQueries: [{ propertyName: "categoryTabButtonsList", predicate: ["categoryTabButton"], descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<ng-container *ngIf=\"data && data.categories && data.categories.length > 1\">\n  <ul class=\"nav\" role=\"tablist\" (keydown)=\"onTabListKeydown($event)\">\n    <li *ngFor=\"let category of data?.categories\" class=\"nav-item\" role=\"presentation\">\n      <button\n        type=\"button\"\n        class=\"btn btn-link nav-link\"\n        role=\"tab\"\n        #categoryTabButton\n        [attr.id]=\"getCategoryTabId(category)\"\n        [attr.tabindex]=\"isCategoryFocused(category) ? 0 : -1\"\n        [attr.aria-selected]=\"isCategorySelected(category)\"\n        [attr.aria-controls]=\"getCategoryPanelId(category)\"\n        [ngClass]=\"{ active: isCategorySelected(category) }\"\n        [innerText]=\"category.title\"\n        (click)=\"selectCategory(category)\"\n      ></button>\n    </li>\n  </ul>\n  <ng-container *ngFor=\"let category of data?.categories; trackBy: getCategoryTrackingId\">\n    <div\n      *ngIf=\"category.id === selectedCategoryId\"\n      class=\"pv-category-container\"\n      role=\"tabpanel\"\n      [attr.id]=\"getCategoryPanelId(category)\"\n      [attr.aria-labelledby]=\"getCategoryTabId(category)\"\n      [attr.aria-expanded]=\"isCategorySelected(category)\"\n      [attr.aria-hidden]=\"isCategorySelected(category) ? undefined : true\"\n    >\n      <appfx-property-view-category\n        role=\"presentation\"\n        tabindex=\"-1\"\n        [componentId]=\"getCategoryComponentId(category)\"\n        [data]=\"category\"\n      >\n      </appfx-property-view-category>\n    </div>\n  </ng-container>\n</ng-container>\n<div *ngIf=\"data && data.categories && data.categories.length === 1\" class=\"pv-category-container\" role=\"presentation\">\n  <appfx-property-view-category\n    role=\"presentation\"\n    tabindex=\"-1\"\n    [componentId]=\"getCategoryComponentId(data.categories[0])\"\n    [data]=\"data.categories[0]\"\n  >\n  </appfx-property-view-category>\n</div>\n", styles: [":host{display:flex;flex-direction:column;width:100%;height:100%}:host .nav{flex:0 0 auto}:host .pv-category-container{flex:1 1 auto;width:100%;height:100%;overflow:auto}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: PropertyViewCategoryComponent, selector: "appfx-property-view-category", inputs: ["data", "componentId"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-property-view', standalone: false, providers: [PropertyViewConfigProvider, PropertyViewSectionsExpandedStateManager], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<ng-container *ngIf=\"data && data.categories && data.categories.length > 1\">\n  <ul class=\"nav\" role=\"tablist\" (keydown)=\"onTabListKeydown($event)\">\n    <li *ngFor=\"let category of data?.categories\" class=\"nav-item\" role=\"presentation\">\n      <button\n        type=\"button\"\n        class=\"btn btn-link nav-link\"\n        role=\"tab\"\n        #categoryTabButton\n        [attr.id]=\"getCategoryTabId(category)\"\n        [attr.tabindex]=\"isCategoryFocused(category) ? 0 : -1\"\n        [attr.aria-selected]=\"isCategorySelected(category)\"\n        [attr.aria-controls]=\"getCategoryPanelId(category)\"\n        [ngClass]=\"{ active: isCategorySelected(category) }\"\n        [innerText]=\"category.title\"\n        (click)=\"selectCategory(category)\"\n      ></button>\n    </li>\n  </ul>\n  <ng-container *ngFor=\"let category of data?.categories; trackBy: getCategoryTrackingId\">\n    <div\n      *ngIf=\"category.id === selectedCategoryId\"\n      class=\"pv-category-container\"\n      role=\"tabpanel\"\n      [attr.id]=\"getCategoryPanelId(category)\"\n      [attr.aria-labelledby]=\"getCategoryTabId(category)\"\n      [attr.aria-expanded]=\"isCategorySelected(category)\"\n      [attr.aria-hidden]=\"isCategorySelected(category) ? undefined : true\"\n    >\n      <appfx-property-view-category\n        role=\"presentation\"\n        tabindex=\"-1\"\n        [componentId]=\"getCategoryComponentId(category)\"\n        [data]=\"category\"\n      >\n      </appfx-property-view-category>\n    </div>\n  </ng-container>\n</ng-container>\n<div *ngIf=\"data && data.categories && data.categories.length === 1\" class=\"pv-category-container\" role=\"presentation\">\n  <appfx-property-view-category\n    role=\"presentation\"\n    tabindex=\"-1\"\n    [componentId]=\"getCategoryComponentId(data.categories[0])\"\n    [data]=\"data.categories[0]\"\n  >\n  </appfx-property-view-category>\n</div>\n", styles: [":host{display:flex;flex-direction:column;width:100%;height:100%}:host .nav{flex:0 0 auto}:host .pv-category-container{flex:1 1 auto;width:100%;height:100%;overflow:auto}\n"] }]
        }], ctorParameters: () => [{ type: PropertyViewSectionsExpandedStateManager }, { type: PropertyViewConfigProvider }], propDecorators: { data: [{
                type: Input
            }], categoryTabButtonsList: [{
                type: ViewChildren,
                args: ['categoryTabButton']
            }], config: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PropertyViewService {
    createPropertyViewBuilder() {
        return new PropertyViewBuilder();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PropertyViewService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function pvStringsServiceFactory(existing) {
    return existing || new PropertyViewStrings();
}
class AppfxPropertyViewModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxPropertyViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxPropertyViewModule, declarations: [PropertyViewCategoryComponent,
            PropertyViewComponent,
            PropertyViewMessageComponent,
            PropertyViewPropertyComponent,
            PropertyViewPropertyValueContainerComponent,
            PropertyViewSectionComponent], imports: [ClrDropdownModule, CommonModule], exports: [PropertyViewComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxPropertyViewModule, providers: [
            PropertyViewService,
            {
                // This pattern allows the importer of this module to specify its own PropertyViewStrings.
                provide: PropertyViewStrings,
                useFactory: pvStringsServiceFactory,
                deps: [[new Optional(), new SkipSelf(), PropertyViewStrings]],
            },
        ], imports: [ClrDropdownModule, CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxPropertyViewModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ClrDropdownModule, CommonModule],
                    declarations: [
                        PropertyViewCategoryComponent,
                        PropertyViewComponent,
                        PropertyViewMessageComponent,
                        PropertyViewPropertyComponent,
                        PropertyViewPropertyValueContainerComponent,
                        PropertyViewSectionComponent,
                    ],
                    providers: [
                        PropertyViewService,
                        {
                            // This pattern allows the importer of this module to specify its own PropertyViewStrings.
                            provide: PropertyViewStrings,
                            useFactory: pvStringsServiceFactory,
                            deps: [[new Optional(), new SkipSelf(), PropertyViewStrings]],
                        },
                    ],
                    exports: [PropertyViewComponent],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppfxPropertyViewModule, PropertyViewBuilder, PropertyViewCategoryBuilder, PropertyViewComponent, PropertyViewMessageBuilder, PropertyViewModelType, AppfxPropertyViewModule as PropertyViewModule, PropertyViewPropertyBuilder, PropertyViewPropertyKeyBuilder, PropertyViewPropertyValueBuilder, PropertyViewPropertyValueComponentBuilder, PropertyViewSectionBuilder, PropertyViewService, PropertyViewStrings };
//# sourceMappingURL=clr-addons-property-view.mjs.map
