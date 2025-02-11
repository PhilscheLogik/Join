import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {

  selectedItem = 0; // Signal für den aktiven Menüpunkt

  setSelectedItem(index: number) {
    this.selectedItem = index;
  }

  constructor() { }
}
