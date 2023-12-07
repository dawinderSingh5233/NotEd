import { Component, OnInit } from '@angular/core';
import { TreeService } from '../tree/tree.service';
import { UtilsService } from '../utils.service';
import { Page } from '../models/dataModels';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isPageSelected: boolean = false;
  isLoading: boolean = false;
  pageData!: Page;

  constructor(
    private treeService: TreeService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.treeService
      .addPageSelectedEvent()
      .subscribe(async (pageData: Page) => {
        this.isPageSelected = true;
        this.isLoading = true;
        await this.utilsService.timeout(2000);
        this.isLoading = false;
        this.pageData = pageData;
      });
  }
}
