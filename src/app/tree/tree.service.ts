import { EventEmitter, Injectable } from '@angular/core';
import { Page } from '../models/dataModels';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  branchClickEmitter = new EventEmitter<string>();
  pageSelectedEmitter = new EventEmitter<Page>();

  constructor() {}

  addBranchClickEvent() {
    return this.branchClickEmitter;
  }

  onClick(branchName: string) {
    this.branchClickEmitter.emit(branchName);
  }

  addPageSelectedEvent() {
    return this.pageSelectedEmitter;
  }

  onPageSelected(pageData: Page) {
    this.pageSelectedEmitter.emit(pageData);
  }
}
