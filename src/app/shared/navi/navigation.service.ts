import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {

  selectedItem = 1; // Signal für den aktiven Menüpunkt
  predecessor = 0;


  setSelectedItem(index: number) {
    this.predecessor = this.selectedItem
    this.selectedItem = index;
  }

  getSelectedItem(){
    return this.predecessor;
  }


  constructor() { }
}
