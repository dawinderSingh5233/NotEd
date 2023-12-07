import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  hideSidebar: boolean = false;
  @Output() onLogout = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.hideSidebar = !this.hideSidebar;
  }

  onLogoutBtnClick() {
    this.onLogout.emit();
  }
}
