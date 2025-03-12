import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  selectedItem = 0; // Signal für den aktiven Menüpunkt
  predecessor = 0;
  isSignUpVisible = true;
  isLoginVisible = false;
  isContentVisible = true;
  isAnimationSummarydone = false;

  constructor() {}

  /**
   * Setzt den aktuell ausgewählten Menüpunkt und speichert den vorherigen Menüpunkt.
   * @param {number} index - Der Index des neuen Menüpunktes.
   */
  setSelectedItem(index: number): void {
    this.predecessor = this.selectedItem;
    this.selectedItem = index;
  }

  /**
   * Gibt den vorherigen Menüpunkt zurück.
   * @returns {number} Der Index des vorherigen Menüpunktes.
   */
  getSelectedItem(): number {
    return this.predecessor;
  }

  /**
   * Wird nach dem Abschluss der Animation aufgerufen.
   * Setzt `isAnimationSummarydone` auf `true`.
   */
  onAnimationEnd(): void {
    this.isAnimationSummarydone = true;
    // console.log('Animation abgeschlossen!');
  }
}
