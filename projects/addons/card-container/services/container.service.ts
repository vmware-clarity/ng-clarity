/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EmbeddedViewRef, Injectable, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { cardDefaults } from '../appfx-card-container-constants';
import { AppfxCardInternal, AppfxCardSettings } from '../appfx-card-container.interface';
import { PersistenceService } from './persistence.service';

/**
 * Keep track of the cards in the container with their properties like order, hidden etc.
 * Takes care of updating store with the card preferences.
 */
@Injectable()
export class ContainerService {
  private cardContainer: ViewContainerRef;
  private containerCards: AppfxCardInternal[] = [];

  constructor(private persistenceService: PersistenceService) {}

  /**
   * Initialize container service by adding list of cards and persistence service instance.
   */
  initialize(cardContainer: ViewContainerRef, cards: AppfxCardInternal[]) {
    this.cardContainer = cardContainer;
    // add unique cards
    cards.forEach((card: AppfxCardInternal) => this.addCard(card));
  }

  /**
   * Fetches card order, hidden properties from the persistence service and apply it to card.
   * Filters hidden card, sorts cards according to order and remove duplicate order cards.
   */
  getCardsWithOrder(): Observable<AppfxCardInternal[]> {
    return this.persistenceService.retrieve().pipe(
      // set card oder and hidden user preferences from store
      map((cardSettings: AppfxCardSettings[]) => this.applySettingsToCards(cardSettings)),
      // do not insert hidden cards
      map((cardsWithSettings: AppfxCardInternal[]) => this.filterHiddenCards(cardsWithSettings)),
      // sort cards in order to insert into container
      map((visibleCards: AppfxCardInternal[]) => this.sortCardsByOrder(visibleCards)),
      // remove duplicate order
      map((sortedCards: AppfxCardInternal[]) => this.normalizeCardOrder(sortedCards))
    );
  }

  /**
   * Fetches card order, hidden properties from the persistence service and apply it to card.
   * if card is hidden before filters it accordingly so that container will not insert it.
   */
  getCardWithOrder(card: AppfxCardInternal): Observable<AppfxCardInternal> {
    return this.persistenceService
      .retrieve()
      .pipe(map((cardSettings: AppfxCardSettings[]) => this.applyCardSettings(card, cardSettings)));
  }

  /**
   * Toggles card hidden property and save updated settings in store.
   */
  toggleCardVisibility(cardId: string): AppfxCardInternal | undefined {
    this.containerCards = this.containerCards.map((containerCard: AppfxCardInternal) => {
      if (containerCard.id === cardId) {
        containerCard.hidden = !containerCard.hidden;
      }
      return containerCard;
    });
    return this.getCardById(cardId);
  }

  /**
   * Moves the card from Drag Index to Drop Index
   * by detaching card from view at drag Index and inserting it into Drop Index.
   *
   * Updates the order of the remaining cards once done.
   */
  moveCard(fromIndex: number, toIndex: number): void {
    // drag and drop on the same card position
    if (fromIndex === toIndex) {
      return;
    }
    // right to left
    toIndex = fromIndex < toIndex ? toIndex : toIndex + 1;

    const cardView = this.cardContainer.get(fromIndex) as EmbeddedViewRef<void>;
    if (cardView) {
      this.cardContainer.detach(fromIndex);
      this.cardContainer.insert(cardView, toIndex);
      this.updateCardsOrder();
    }
  }

  /**
   * Removes card form the list of container cards.
   */
  removeCard(cardId: string): void {
    this.containerCards = this.containerCards.filter((card: AppfxCardInternal) => card.id !== cardId);
  }

  /**
   * Update Card properties once inserted into container.
   * View and order gets updated once card is available into container.
   */
  updateCard(card: AppfxCardInternal): void {
    this.containerCards = this.containerCards.map((containerCard: AppfxCardInternal) => {
      return containerCard.id === card.id ? { ...containerCard, ...card } : containerCard;
    });
  }

  /**
   * Returns all cards inside container including hidden cards.
   */
  getContainerCards(): AppfxCardInternal[] {
    return [...this.containerCards];
  }

  /**
   * Returns number of visible cards in the container.
   */
  getVisibleCardsCount(): number {
    return this.filterHiddenCards(this.containerCards).length;
  }

  /**
   * Update the order on the cards after shuffling occurs new order is as per the index of cards in the view.
   */
  updateCardsOrder(): void {
    this.containerCards = this.containerCards.map((card: AppfxCardInternal) => {
      if (!card.hidden && card.view) {
        const order = this.cardContainer.indexOf(card.view);
        if (card.order !== order) {
          card.order = order;
        }
      }
      return card;
    });
    this.persistenceService.save(this.containerCards);
  }

  /**
   * Returns container ViewRef
   */
  getCardContainer(): ViewContainerRef {
    return this.cardContainer;
  }

  /**
   * Provides card by id if available
   */
  getCardById(cardId: string): AppfxCardInternal | undefined {
    return this.containerCards.find((containerCard: AppfxCardInternal) => containerCard.id === cardId);
  }

  /**
   * provides order of the card in the container
   */
  getCardOrder(cardId: string): number {
    return this.getCardById(cardId)?.order ?? cardDefaults.order;
  }

  /**
   * Adds card to the container list of cards of the container service.
   * Container cards contains all the available cards within container visible as well as hidden.
   */
  addCard(card: AppfxCardInternal): void {
    if (this.getCardById(card.id)) {
      throw new Error(`Card with id '${card.id}' already exist`);
    }
    this.containerCards = [...this.containerCards, card];
  }

  /**
   * Updates each of the card settings properties like order, hidden.
   */
  private applySettingsToCards(cardSettings: AppfxCardSettings[]): AppfxCardInternal[] {
    return this.containerCards.map((card: AppfxCardInternal) => this.applyCardSettings(card, cardSettings));
  }

  /**
   * Updates card settings properties like order, hidden.
   * If none available in the persistence store cardDefaults are used.
   */
  private applyCardSettings(card: AppfxCardInternal, cardSettings: AppfxCardSettings[]): AppfxCardInternal {
    const cardSetting = cardSettings.find((setting: AppfxCardSettings) => setting.id === card.id);
    card.order = cardSetting?.order ?? cardDefaults.order;
    card.hidden = cardSetting?.hidden ?? cardDefaults.hidden;
    return card;
  }

  /**
   * Remove hidden cards
   */
  private filterHiddenCards(cards: AppfxCardInternal[]): AppfxCardInternal[] {
    return cards.filter((card: AppfxCardInternal) => !card.hidden);
  }

  /**
   * Sorts cards in ascending order
   */
  private sortCardsByOrder(cards: AppfxCardInternal[]): AppfxCardInternal[] {
    return cards.sort((a: AppfxCardInternal, b: AppfxCardInternal): number => {
      return a.order !== undefined && b.order !== undefined ? a.order - b.order : 0;
    });
  }

  /**
   * Update order to remove duplicates.
   * [0,1,1,2,3,3] -> [0,1,2,3,4,5]
   */
  private normalizeCardOrder(cards: AppfxCardInternal[]): AppfxCardInternal[] {
    return cards.map((card: AppfxCardInternal, idx: number) => {
      card.order = idx;
      return card;
    });
  }
}
