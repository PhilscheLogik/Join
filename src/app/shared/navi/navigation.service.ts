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

  setSelectedItem(index: number) {
    this.predecessor = this.selectedItem;
    this.selectedItem = index;
  }

  getSelectedItem() {
    return this.predecessor;
  }

  constructor() {}
}
