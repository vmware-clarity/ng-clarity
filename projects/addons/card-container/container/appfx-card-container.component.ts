/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  DoCheck,
  EmbeddedViewRef,
  Input,
  IterableChangeRecord,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { filter, map, take, tap } from 'rxjs/operators';

import { AppfxCardInternal, AppfxContainerPersistenceStore } from '../appfx-card-container.interface';
import { AppfxCardComponent } from '../card/appfx-card.component';
import { A11yService } from '../services/a11y.service';
import { ContainerService } from '../services/container.service';
import { DragDropService } from '../services/dnd.service';
import { LayoutService } from '../services/layout.service';
import { PersistenceService } from '../services/persistence.service';
import { AppfxCardContainerStore } from '../utils/appfx-card-container-store';

/**
 * Appfx Card Container
 *
 * Provides container for cards with below functionalities
 * - Dynamic card insertion and removal
 * - Show/Hide cards through settings menu
 * - Drag an Drop Cards to change order
 * - Keyboard a11y events handling
 * - Card order and hidden property persistence
 *
 *  @Usages
 *  <appfx-card-container
 *     [containerId]="example-container"
 *     [cards]="container cards"
 *     [persistenceStore]="AppfxContainerPersistenceStore"> // optional if none provided local storage is used
 *  </<appfx-card-container>
 */
@Component({
  selector: 'appfx-card-container',
  standalone: false,
  templateUrl: 'appfx-card-container.component.html',
  styleUrls: ['appfx-card-container.component.scss'],
  providers: [A11yService, ContainerService, DragDropService, LayoutService, PersistenceService],
})
export class AppfxCardContainerComponent implements OnInit, DoCheck {
  @Input() containerId: string;

  @Input() cards: AppfxCardInternal[] = [];

  @Input() persistenceStore?: AppfxContainerPersistenceStore;

  @Input() showCardContainerSettings: boolean = true;

  @Input() dragDropEnabled: boolean = true;

  containerCards: AppfxCardInternal[] = [];

  @ViewChild('cardContainer', { read: ViewContainerRef, static: true }) private cardContainer: ViewContainerRef;

  private readonly differ: IterableDiffer<AppfxCardInternal>;

  constructor(
    private containerService: ContainerService,
    private persistenceService: PersistenceService,
    private iterableDiffers: IterableDiffers
  ) {
    // iterable differ to track added/removed cards
    this.differ = iterableDiffers.find(this.cards).create(this.trackByFn);
  }

  ngOnInit(): void {
    if (!this.containerId) {
      throw new Error('Missing Input property - containerId');
    }
    this.initialize();
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.cards);
    if (changes) {
      // insert card into container
      changes.forEachAddedItem((record: IterableChangeRecord<AppfxCardInternal>) => this.addDynamicCard(record.item));
      // remove card from container
      changes.forEachRemovedItem((record: IterableChangeRecord<AppfxCardInternal>) =>
        this.removeCardFromContainer(record.item)
      );
    }
  }

  onToggleCardVisibility(cardId: string): void {
    const card = this.containerService.toggleCardVisibility(cardId);
    // if card is no more inside container
    if (!card) {
      return;
    }
    // remove card from container view but not from available list of cards
    if (card.hidden) {
      this.removeCardFromContainer(card, true);
      this.containerService.updateCardsOrder();
      this.updateContainerCards();
      return;
    }
    // get card order, hidden property from store then update hidden to false and insert card into container
    this.containerService
      .getCardWithOrder(card)
      .pipe(
        take(1),
        map((cardWithOrder: AppfxCardInternal) => ({
          ...cardWithOrder,
          hidden: false,
        })),
        tap((cardWithOrder: AppfxCardInternal) => {
          this.insertCardToContainer(cardWithOrder);
          this.containerService.updateCardsOrder();
          this.updateContainerCards();
        })
      )
      .subscribe();
  }

  private initialize(): void {
    // initialize persistence store service with provided or local store
    this.persistenceService.initialize(
      this.persistenceStore || new AppfxCardContainerStore().getLocalStore(this.containerId)
    );

    // initialize container service
    this.containerService.initialize(this.cardContainer, this.cards);

    // get cards with order from store and accordingly insert into container
    this.containerService
      .getCardsWithOrder()
      .pipe(
        take(1),
        tap((cards: AppfxCardInternal[]) => {
          cards.forEach((card: AppfxCardInternal) => this.insertCardToContainer(card));
          this.containerService.updateCardsOrder();
          this.updateContainerCards();
        })
      )
      .subscribe();
  }

  private addDynamicCard(card: AppfxCardInternal): void {
    if (this.containerService.getCardById(card.id)) {
      return;
    }
    this.containerService.addCard(card); // add card to the list of container cards
    this.updateContainerCards(); // update container list cards

    // get order, hidden property from store and accordingly insert card into container
    this.containerService
      .getCardWithOrder(card)
      .pipe(
        take(1),
        filter((cardWithOrder: AppfxCardInternal) => !cardWithOrder.hidden),
        tap((cardWithOrder: AppfxCardInternal) => {
          this.insertCardToContainer(cardWithOrder);
          this.containerService.updateCardsOrder();
        })
      )
      .subscribe();
  }

  private insertCardToContainer(card: AppfxCardInternal): void {
    const containerCard = this.containerService.getCardById(card.id);
    if (containerCard) {
      // check if card is currently in ViewContainer angular returns -1 if card is not inside container
      const index = this.cardContainer.indexOf(containerCard.view);
      if (index !== -1) {
        console.warn('Container Card already visualized, id = ' + card.id);
        return;
      }
    }
    const numCards = this.cardContainer.length;
    // if order of card is out of current container cards insert card in end
    card.order = card.order < 0 || card.order > numCards ? numCards : card.order;
    const cr = this.cardContainer.createComponent(AppfxCardComponent, { index: card.order });
    cr.instance.card = card; // set input properties
    cr.instance.dropGroup = this.containerId; // card drag and drop should happen inside this container only
    cr.instance.dragDropEnabled = this.dragDropEnabled;
    // set view to retrieve order of card from view to use later
    card.view = this.cardContainer.get(card.order) as EmbeddedViewRef<void>;
    this.containerService.updateCard(card);
  }

  private removeCardFromContainer(card: AppfxCardInternal, hideOnly: boolean = false): void {
    const containerCard = this.containerService.getCardById(card.id);
    if (!containerCard) {
      return;
    }

    // check if card is currently in ViewContainer angular returns -1 if card is not inside container
    const index = this.cardContainer.indexOf(containerCard.view);
    if (index !== -1) {
      this.cardContainer.remove(index);
    }

    // remove from list of available cards if its not hidden or card view is not available
    if (!hideOnly || !containerCard.view) {
      this.containerService.removeCard(containerCard.id);
      this.updateContainerCards();
    }
  }

  private updateContainerCards() {
    this.containerCards = [...this.containerService.getContainerCards()];
  }

  private trackByFn(index: number, item: AppfxCardInternal): string {
    return item.id;
  }
}
