import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastData } from '../models/dataModels';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private showNewToast = new Subject<ToastData>();

  constructor() {}

  createNewToast(status: 'Success' | 'Error' | 'Info', message: string) {
    this.showNewToast.next({ status, message });
  }

  getToast() {
    return this.showNewToast;
  }
}
