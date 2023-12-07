import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastData } from '../models/dataModels';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit {
  @Input('toastData') toastData!: ToastData;
  @Output('close') closeEvt = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  closeBtn() {
    this.closeEvt.emit();
  }
}
